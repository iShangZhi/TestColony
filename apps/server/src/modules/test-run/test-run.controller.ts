import { Controller, Get, Post, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestRunService } from './test-run.service';
import { ExecutionOrchestratorService } from '../execution/execution-orchestrator.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Test Runs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/runs')
export class TestRunController {
  constructor(
    private readonly testRunService: TestRunService,
    private readonly executionOrchestrator: ExecutionOrchestratorService,
  ) {}

  @Get()
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.testRunService.list(projectId, +page, +pageSize);
  }

  // Start a test run (Main Agent B)
  @Post()
  async start(
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() dto: { suiteIds: string[]; agent?: string; options?: any },
  ) {
    const result = await this.executionOrchestrator.startTestRun(
      projectId,
      req.user.sub,
      dto.options || { suiteIds: dto.suiteIds },
    );
    return result;
  }

  @Get(':runId')
  async get(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    return this.testRunService.getById(projectId, runId);
  }

  @Post(':runId/cancel')
  async cancel(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    await this.executionOrchestrator.cancelTestRun(runId);
    return this.testRunService.cancel(projectId, runId);
  }
}
