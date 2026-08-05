import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateProjectRequest, UpdateProjectRequest } from '@testcolony/shared-types';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, page = 1, pageSize = 20) {
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          status: { not: 'deleted' },
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        include: { owner: { select: { id: true, displayName: true, email: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({
        where: {
          status: { not: 'deleted' },
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async create(userId: string, dto: CreateProjectRequest) {
    return this.prisma.project.create({
      data: {
        ...dto,
        ownerId: userId,
        members: { create: { userId, role: 'owner' } },
      },
    });
  }

  async getById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, displayName: true, email: true } },
        _count: { select: { prds: true, testSuites: true, testRuns: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectRequest) {
    await this.getById(id);
    return this.prisma.project.update({ where: { id }, data: dto as any });
  }

  async archive(id: string) {
    await this.getById(id);
    return this.prisma.project.update({ where: { id }, data: { status: 'archived' } });
  }
}
