import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.agentService.list(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() dto: any) {
    return this.agentService.create(projectId, dto);
  }

  @Get(':name')
  async get(@Param('projectId') projectId: string, @Param('name') name: string) {
    return this.agentService.getByName(projectId, name);
  }

  @Patch(':name')
  async update(@Param('projectId') projectId: string, @Param('name') name: string, @Body() dto: any) {
    return this.agentService.update(projectId, name, dto);
  }

  @Delete(':name')
  async delete(@Param('projectId') projectId: string, @Param('name') name: string) {
    return this.agentService.delete(projectId, name);
  }
}
