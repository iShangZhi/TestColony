import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.agentDefinition.findMany({
      where: { projectId, status: 'active' },
      include: { skills: { include: { skill: true } } },
    });
  }

  async getByName(projectId: string, name: string) {
    const agent = await this.prisma.agentDefinition.findFirst({
      where: { projectId, name },
      include: { skills: { include: { skill: true } } },
    });
    if (!agent) throw new NotFoundException('Agent definition not found');
    return agent;
  }

  async create(projectId: string, dto: any) {
    return this.prisma.agentDefinition.create({
      data: { ...dto, projectId },
    });
  }

  async update(projectId: string, name: string, dto: any) {
    await this.getByName(projectId, name);
    return this.prisma.agentDefinition.updateMany({
      where: { projectId, name },
      data: dto,
    });
  }

  async delete(projectId: string, name: string) {
    await this.getByName(projectId, name);
    return this.prisma.agentDefinition.updateMany({
      where: { projectId, name },
      data: { status: 'inactive' },
    });
  }
}
