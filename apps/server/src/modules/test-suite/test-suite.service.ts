import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestSuiteService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.testSuite.findMany({
      where: { projectId },
      include: { _count: { select: { testCases: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async tree(projectId: string) {
    const suites = await this.prisma.testSuite.findMany({
      where: { projectId, parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { testCases: true } },
            children: true,
          },
        },
        _count: { select: { testCases: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return suites;
  }

  async create(projectId: string, dto: any) {
    return this.prisma.testSuite.create({
      data: { ...dto, projectId },
    });
  }

  async getById(projectId: string, suiteId: string) {
    const suite = await this.prisma.testSuite.findFirst({
      where: { id: suiteId, projectId },
      include: { _count: { select: { testCases: true } }, children: true },
    });
    if (!suite) throw new NotFoundException('Test suite not found');
    return suite;
  }

  async update(projectId: string, suiteId: string, dto: any) {
    await this.getById(projectId, suiteId);
    return this.prisma.testSuite.update({ where: { id: suiteId }, data: dto });
  }

  async delete(projectId: string, suiteId: string) {
    await this.getById(projectId, suiteId);
    return this.prisma.testSuite.delete({ where: { id: suiteId } });
  }

  async reorder(projectId: string, items: { id: string; sortOrder: number }[]) {
    for (const item of items) {
      await this.prisma.testSuite.updateMany({
        where: { id: item.id, projectId },
        data: { sortOrder: item.sortOrder },
      });
    }
  }
}
