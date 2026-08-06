import { Controller, Get, Post, Param, Body, Res, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestRunService } from './test-run.service';
import { ExecutionOrchestratorService } from '../execution/execution-orchestrator.service';
import { FailureAnalyzerService } from '../execution/failure-analyzer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Test Runs')
@Controller('projects/:projectId/runs')
export class TestRunController {
  constructor(
    private readonly testRunService: TestRunService,
    private readonly executionOrchestrator: ExecutionOrchestratorService,
    private readonly failureAnalyzer: FailureAnalyzerService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    return this.testRunService.list(projectId, +page, +pageSize);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async start(@Param('projectId') projectId: string, @Req() req: any, @Body() dto: { suiteIds?: string[]; options?: any }) {
    return this.executionOrchestrator.startTestRun(projectId, req.user.sub, { suiteIds: dto.suiteIds || [], ...(dto.options || {}) });
  }

  @Get(':runId')
  async get(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    return this.testRunService.getById(projectId, runId);
  }

  @Post(':runId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancel(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    await this.executionOrchestrator.cancelTestRun(runId);
    return this.testRunService.cancel(projectId, runId);
  }

  // AI Failure Analysis
  @Post(':runId/analyze')
  async analyzeFailures(@Param('runId') runId: string) {
    return this.failureAnalyzer.analyzeRun(runId);
  }

  // Export
  @Get(':runId/export/:format')
  async export(
    @Param('projectId') projectId: string,
    @Param('runId') runId: string,
    @Param('format') format: string,
    @Res() res: any,
  ) {
    const run = await this.testRunService.getById(projectId, runId);
    const results = run.results || [];

    switch (format) {
      case 'junit':
        res.set('Content-Type', 'application/xml');
        res.send(this.toJUnit(run, results));
        break;
      case 'csv':
        res.set('Content-Type', 'text/csv');
        res.set('Content-Disposition', `attachment; filename=test-run-${runId}.csv`);
        res.send(this.toCSV(results));
        break;
      default:
        res.json({ run, results });
    }
  }

  // Coverage report
  @Get(':runId/coverage')
  async coverage(@Param('projectId') projectId: string) {
    const prds = await this.prisma.prd.findMany({
      where: { projectId },
      include: { testCases: { select: { id: true, title: true, priority: true } } },
    });
    const totalRequirements = prds.reduce((sum, p) => {
      const reqs = (p.parsedRequirements as any[]) || [];
      return sum + reqs.length;
    }, 0);
    const coveredRequirements = prds.reduce((sum, p) => {
      return sum + (p.testCases.length > 0 ? ((p.parsedRequirements as any[]) || []).length : 0);
    }, 0);
    const coverage = totalRequirements > 0 ? Math.round((coveredRequirements / totalRequirements) * 100) : 0;

    return { prds: prds.map(p => ({ title: p.title, requirements: ((p.parsedRequirements as any[]) || []).length, testCases: p.testCases.length, covered: p.testCases.length > 0 })), totalRequirements, coveredRequirements, coverage };
  }

  private toJUnit(run: any, results: any[]): string {
    const failures = results.filter((r: any) => r.status === 'failed').length;
    const skipped = results.filter((r: any) => r.status === 'skipped').length;
    const total = results.length;
    const passed = total - failures - skipped;
    const duration = run.durationMs ? (run.durationMs / 1000).toFixed(3) : '0';

    const testcases = results.map((r: any) => {
      const tc = r.testCase || {};
      let xml = `    <testcase name="${this.escapeXml(tc.title || r.id)}" classname="TestColony" time="${((r.durationMs || 0) / 1000).toFixed(3)}"`;
      if (r.status === 'failed') {
        xml += `>\n      <failure message="${this.escapeXml(r.errorMessage || '')}">${this.escapeXml(r.stackTrace || '')}</failure>\n    </testcase>`;
      } else if (r.status === 'skipped') {
        xml += `>\n      <skipped/>\n    </testcase>`;
      } else {
        xml += ` />`;
      }
      return xml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="TestColony Run ${run.id}" tests="${total}" failures="${failures}" errors="0" skipped="${skipped}" time="${duration}">
${testcases}
</testsuite>`;
  }

  private toCSV(results: any[]): string {
    const header = 'Title,Status,Duration(ms),Error\n';
    const rows = results.map((r: any) => {
      const tc = r.testCase || {};
      return `"${(tc.title || '').replace(/"/g, '""')}","${r.status}",${r.durationMs || 0},"${(r.errorMessage || '').replace(/"/g, '""')}"`;
    }).join('\n');
    return header + rows;
  }

  private escapeXml(s: string): string {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
