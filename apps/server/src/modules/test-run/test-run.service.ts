import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestRunService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string, page = 1, pageSize = 20) {
    const [data, total] = await Promise.all([
      this.prisma.testRun.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.testRun.count({ where: { projectId } }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(projectId: string, runId: string) {
    const run = await this.prisma.testRun.findFirst({
      where: { id: runId, projectId },
      include: {
        results: {
          include: { testCase: { select: { id: true, title: true, priority: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!run) throw new NotFoundException('Test run not found');
    return run;
  }

  async cancel(projectId: string, runId: string) {
    await this.getById(projectId, runId);
    return this.prisma.testRun.update({
      where: { id: runId },
      data: { status: 'cancelled', completedAt: new Date() },
    });
  }
}
