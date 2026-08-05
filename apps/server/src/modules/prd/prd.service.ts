import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrdService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.prd.findMany({
      where: { projectId, status: { not: 'archived' } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(projectId: string, userId: string, dto: { title: string; content: string; version?: string }) {
    return this.prisma.prd.create({
      data: { ...dto, projectId, createdBy: userId },
    });
  }

  async getById(projectId: string, prdId: string) {
    const prd = await this.prisma.prd.findFirst({
      where: { id: prdId, projectId },
    });
    if (!prd) throw new NotFoundException('PRD not found');
    return prd;
  }

  async update(projectId: string, prdId: string, dto: any) {
    await this.getById(projectId, prdId);
    return this.prisma.prd.update({ where: { id: prdId }, data: dto });
  }

  async delete(projectId: string, prdId: string) {
    await this.getById(projectId, prdId);
    return this.prisma.prd.update({ where: { id: prdId }, data: { status: 'archived' } });
  }
}
