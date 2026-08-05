import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Execution Orchestrator - Coordinates the full test execution workflow:
 * 1. Load test cases
 * 2. Create Agent B session
 * 3. Track execution progress
 * 4. Collect results
 * 5. Generate reports
 */
@Injectable()
export class ExecutionOrchestratorService {
  private readonly logger = new Logger(ExecutionOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async startTestRun(
    projectId: string,
    userId: string,
    options: { suiteIds: string[]; parallel?: boolean; maxWorkers?: number; environment?: string },
  ) {
    this.logger.log(`Starting test run for project ${projectId}, suites: ${options.suiteIds.join(',')}`);

    // Create test run record
    const testRun = await this.prisma.testRun.create({
      data: {
        projectId,
        triggerType: 'ai_agent',
        status: 'pending',
        triggeredBy: userId,
        name: `Run ${new Date().toISOString()}`,
      },
    });

    // Emit event for real-time updates
    this.eventEmitter.emit('execution:started', {
      runId: testRun.id,
      projectId,
      options,
    });

    return { runId: testRun.id, status: 'pending', wsChannel: `run:${testRun.id}` };
  }

  async cancelTestRun(runId: string) {
    this.logger.log(`Cancelling test run ${runId}`);
    await this.prisma.testRun.update({
      where: { id: runId },
      data: { status: 'cancelled', completedAt: new Date() },
    });
    this.eventEmitter.emit('execution:cancelled', { runId });
  }

  async updateProgress(runId: string, progress: { completed: number; total: number; passed: number; failed: number }) {
    await this.prisma.testRun.update({
      where: { id: runId },
      data: {
        passedCases: progress.passed,
        failedCases: progress.failed,
      },
    });
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
  }
}
