import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(@Req() req: any, @Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    return this.projectService.list(req.user.sub, +page, +pageSize);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: any) {
    return this.projectService.create(req.user.sub, dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.projectService.getById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  async archive(@Param('id') id: string) {
    return this.projectService.archive(id);
  }
}
