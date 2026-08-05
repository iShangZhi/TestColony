import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestCaseService } from './test-case.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Test Cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/suites/:suiteId/cases')
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Get()
  async list(@Param('suiteId') suiteId: string) {
    return this.testCaseService.list(suiteId);
  }

  @Post()
  async create(@Param('suiteId') suiteId: string, @Req() req: any, @Body() dto: any) {
    return this.testCaseService.create(suiteId, req.user.sub, dto);
  }

  @Get(':caseId')
  async get(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string) {
    return this.testCaseService.getById(suiteId, caseId);
  }

  @Patch(':caseId')
  async update(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string, @Body() dto: any) {
    return this.testCaseService.update(suiteId, caseId, dto);
  }

  @Delete(':caseId')
  async delete(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string) {
    return this.testCaseService.delete(suiteId, caseId);
  }
}
