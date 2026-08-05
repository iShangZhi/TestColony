import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.skillDefinition.findMany({
      where: { projectId, status: 'active' },
    });
  }

  async getByName(projectId: string, name: string) {
    const skill = await this.prisma.skillDefinition.findFirst({
      where: { projectId, name },
    });
    if (!skill) throw new NotFoundException('Skill definition not found');
    return skill;
  }

  async create(projectId: string, dto: any) {
    return this.prisma.skillDefinition.create({ data: { ...dto, projectId } });
  }

  async update(projectId: string, name: string, dto: any) {
    await this.getByName(projectId, name);
    return this.prisma.skillDefinition.updateMany({ where: { projectId, name }, data: dto });
  }

  async delete(projectId: string, name: string) {
    await this.getByName(projectId, name);
    return this.prisma.skillDefinition.updateMany({
      where: { projectId, name },
      data: { status: 'inactive' },
    });
  }
}
