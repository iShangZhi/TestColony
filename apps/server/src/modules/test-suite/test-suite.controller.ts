import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestSuiteService } from './test-suite.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Test Suites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/suites')
export class TestSuiteController {
  constructor(private readonly testSuiteService: TestSuiteService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.testSuiteService.list(projectId);
  }

  @Get('tree')
  async tree(@Param('projectId') projectId: string) {
    return this.testSuiteService.tree(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Req() req: any, @Body() dto: any) {
    return this.testSuiteService.create(projectId, dto);
  }

  @Get(':suiteId')
  async get(@Param('projectId') projectId: string, @Param('suiteId') suiteId: string) {
    return this.testSuiteService.getById(projectId, suiteId);
  }

  @Patch(':suiteId')
  async update(@Param('projectId') projectId: string, @Param('suiteId') suiteId: string, @Body() dto: any) {
    return this.testSuiteService.update(projectId, suiteId, dto);
  }

  @Delete(':suiteId')
  async delete(@Param('projectId') projectId: string, @Param('suiteId') suiteId: string) {
    return this.testSuiteService.delete(projectId, suiteId);
  }

  @Patch('reorder')
  async reorder(@Param('projectId') projectId: string, @Body() dto: { items: { id: string; sortOrder: number }[] }) {
    return this.testSuiteService.reorder(projectId, dto.items);
  }
}
