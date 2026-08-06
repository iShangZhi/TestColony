import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgentSessionService } from './agent-session.service';
import { TestRunnerService } from './test-runner.service';
import { ResultCollectorService } from './result-collector.service';

@Injectable()
export class ExecutionOrchestratorService {
  private readonly logger = new Logger(ExecutionOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly agentSession: AgentSessionService,
    private readonly testRunner: TestRunnerService,
    private readonly resultCollector: ResultCollectorService,
  ) {}

  async startTestRun(
    projectId: string,
    userId: string,
    options: { suiteIds: string[]; parallel?: boolean; maxWorkers?: number; environment?: string },
  ) {
    const suiteIds = options.suiteIds || [];
    this.logger.log(`Starting test run for project ${projectId}, suites: ${suiteIds.join(',')}`);

    // Load test cases
    const testCases = await this.prisma.testCase.findMany({
      where: suiteIds.length > 0
        ? { testSuiteId: { in: suiteIds } }
        : { testSuite: { projectId } },
      take: 100,
    });

    const totalCases = testCases.length;

    // Create test run record
    const testRun = await this.prisma.testRun.create({
      data: {
        projectId,
        triggerType: 'ai_agent',
        status: 'running',
        triggeredBy: userId,
        name: `Agent B Run ${new Date().toLocaleString('zh-CN')}`,
        totalCases,
        startedAt: new Date(),
      },
    });

    const runId = testRun.id;

    // Emit real-time events
    this.eventEmitter.emit('execution:started', { runId, projectId, totalCases });
    this.eventEmitter.emit('run:started', { runId, totalCases });

    // Run tests asynchronously (non-blocking)
    this.executeTests(runId, projectId, testCases).catch(err => {
      this.logger.error(`Test run ${runId} failed: ${err.message}`);
      this.eventEmitter.emit('execution:error', { runId, error: err.message });
    });

    return {
      runId,
      status: 'running',
      totalCases,
      wsChannel: `run:${runId}`,
    };
  }

  private async executeTests(runId: string, projectId: string, testCases: any[]) {
    const startTime = Date.now();
    let passed = 0, failed = 0, skipped = 0, errors = 0;
    const total = testCases.length;

    try {
      // Phase: setup
      this.eventEmitter.emit('run:phase', { runId, phase: 'setup' });
      await this.updateRunStatus(runId, 'running');

      // Phase: run tests
      this.eventEmitter.emit('run:phase', { runId, phase: 'unit_tests' });

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        this.eventEmitter.emit('run:case_start', { runId, testCaseId: tc.id, title: tc.title });

        try {
          const result = await this.testRunner.executeTest(tc);
          const testResult = await this.resultCollector.collectResult(runId, tc.id, result);

          if (result.status === 'passed') passed++;
          else if (result.status === 'failed') failed++;
          else if (result.status === 'skipped') skipped++;
          else errors++;

          this.eventEmitter.emit('run:case_result', {
            runId, testCaseId: tc.id, title: tc.title,
            status: result.status, durationMs: result.durationMs,
            error: result.errorMessage,
          });

          this.eventEmitter.emit('run:progress', {
            runId, completed: i + 1, total, passed, failed,
          });
        } catch (e: any) {
          errors++;
          this.eventEmitter.emit('run:case_result', {
            runId, testCaseId: tc.id, title: tc.title,
            status: 'error', error: e.message,
          });
        }
      }

      // Phase: reporting
      this.eventEmitter.emit('run:phase', { runId, phase: 'reporting' });

      const durationMs = Date.now() - startTime;
      await this.completeRun(runId, { totalCases: total, passedCases: passed, failedCases: failed, skippedCases: skipped, errorCases: errors, durationMs });
    } catch (e: any) {
      this.logger.error(`Run ${runId} error: ${e.message}`);
      await this.prisma.testRun.update({
        where: { id: runId },
        data: { status: 'failed', completedAt: new Date(), errorCases: errors },
      });
    }
  }

  async cancelTestRun(runId: string) {
    await this.prisma.testRun.update({
      where: { id: runId },
      data: { status: 'cancelled', completedAt: new Date() },
    });
    this.eventEmitter.emit('execution:cancelled', { runId });
    this.eventEmitter.emit('run:cancelled', { runId });
  }

  private async updateRunStatus(runId: string, status: string) {
    await this.prisma.testRun.update({ where: { id: runId }, data: { status } });
  }

  async completeRun(runId: string, summary: { totalCases: number; passedCases: number; failedCases: number; skippedCases: number; errorCases: number; durationMs: number }) {
    await this.prisma.testRun.update({
      where: { id: runId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        ...summary,
      },
    });
    this.eventEmitter.emit('execution:completed', { runId, summary });
    this.eventEmitter.emit('run:completed', {
      runId,
      summary: `${summary.passedCases}/${summary.totalCases} passed`,
      reportUrl: `/api/v1/projects/any/runs/${runId}`,
    });
  }
}
