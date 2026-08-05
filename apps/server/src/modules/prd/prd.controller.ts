import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PrdService } from './prd.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('PRDs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/prds')
export class PrdController {
  constructor(private readonly prdService: PrdService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.prdService.list(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Req() req: any, @Body() dto: any) {
    return this.prdService.create(projectId, req.user.sub, dto);
  }

  @Get(':prdId')
  async get(@Param('projectId') projectId: string, @Param('prdId') prdId: string) {
    return this.prdService.getById(projectId, prdId);
  }

  @Patch(':prdId')
  async update(@Param('projectId') projectId: string, @Param('prdId') prdId: string, @Body() dto: any) {
    return this.prdService.update(projectId, prdId, dto);
  }

  @Delete(':prdId')
  async delete(@Param('projectId') projectId: string, @Param('prdId') prdId: string) {
    return this.prdService.delete(projectId, prdId);
  }
}
