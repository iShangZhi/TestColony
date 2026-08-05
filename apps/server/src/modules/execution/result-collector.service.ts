import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResultCollectorService {
  private readonly logger = new Logger(ResultCollectorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async collectResult(
    runId: string,
    testCaseId: string,
    result: { status: string; durationMs: number; errorMessage?: string; logs?: string; screenshots?: string[] },
  ) {
    return this.prisma.testResult.create({
      data: {
        testRunId: runId,
        testCaseId,
        status: result.status,
        durationMs: result.durationMs,
        errorMessage: result.errorMessage,
        logs: result.logs,
        screenshots: result.screenshots || [],
        executedAt: new Date(),
      },
    });
  }

  async getResultsForRun(runId: string) {
    return this.prisma.testResult.findMany({
      where: { testRunId: runId },
      include: { testCase: { select: { title: true, priority: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
