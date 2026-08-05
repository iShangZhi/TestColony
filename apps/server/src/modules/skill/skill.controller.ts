import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SkillService } from './skill.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.skillService.list(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() dto: any) {
    return this.skillService.create(projectId, dto);
  }

  @Get(':name')
  async get(@Param('projectId') projectId: string, @Param('name') name: string) {
    return this.skillService.getByName(projectId, name);
  }

  @Patch(':name')
  async update(@Param('projectId') projectId: string, @Param('name') name: string, @Body() dto: any) {
    return this.skillService.update(projectId, name, dto);
  }

  @Delete(':name')
  async delete(@Param('projectId') projectId: string, @Param('name') name: string) {
    return this.skillService.delete(projectId, name);
  }
}
