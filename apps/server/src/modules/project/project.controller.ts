import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Public - list all active projects (no auth required)
  @Get()
  async list(@Query('page') page = 1, @Query('pageSize') pageSize = 20) {
    return this.projectService.listPublic(+page, +pageSize);
  }

  // Public - view single project
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.projectService.getById(id);
  }

  // Auth required below
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Req() req: any, @Body() dto: any) {
    return this.projectService.create(req.user.sub, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async archive(@Param('id') id: string) {
    return this.projectService.archive(id);
  }
}
