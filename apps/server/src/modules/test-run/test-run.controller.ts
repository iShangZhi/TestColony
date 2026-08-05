import { Controller, Get, Post, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestRunService } from './test-run.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Test Runs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/runs')
export class TestRunController {
  constructor(private readonly testRunService: TestRunService) {}

  @Get()
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.testRunService.list(projectId, +page, +pageSize);
  }

  @Get(':runId')
  async get(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    return this.testRunService.getById(projectId, runId);
  }

  @Post(':runId/cancel')
  async cancel(@Param('projectId') projectId: string, @Param('runId') runId: string) {
    return this.testRunService.cancel(projectId, runId);
  }
}
