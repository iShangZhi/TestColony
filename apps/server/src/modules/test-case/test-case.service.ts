import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestCaseService {
  constructor(private readonly prisma: PrismaService) {}

  async list(suiteId: string) {
    return this.prisma.testCase.findMany({
      where: { testSuiteId: suiteId },
      orderBy: [{ priority: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  async create(suiteId: string, userId: string, dto: any) {
    return this.prisma.testCase.create({
      data: { ...dto, testSuiteId: suiteId, createdBy: userId },
    });
  }

  async getById(suiteId: string, caseId: string) {
    const tc = await this.prisma.testCase.findFirst({
      where: { id: caseId, testSuiteId: suiteId },
    });
    if (!tc) throw new NotFoundException('Test case not found');
    return tc;
  }

  async update(suiteId: string, caseId: string, dto: any) {
    await this.getById(suiteId, caseId);
    return this.prisma.testCase.update({ where: { id: caseId }, data: dto });
  }

  async delete(suiteId: string, caseId: string) {
    await this.getById(suiteId, caseId);
    return this.prisma.testCase.delete({ where: { id: caseId } });
  }
}
