import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestCaseService } from './test-case.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { ConversationManager } from '../../agent-framework/core/conversation-manager';
import { ContextManager } from '../../agent-framework/core/context-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Test Cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TestCaseController {
  constructor(
    private readonly testCaseService: TestCaseService,
    private readonly prisma: PrismaService,
    private readonly conversationManager: ConversationManager,
    private readonly contextManager: ContextManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Suite-scoped CRUD
  @Get('projects/:projectId/suites/:suiteId/cases')
  async list(@Param('suiteId') suiteId: string) {
    return this.testCaseService.list(suiteId);
  }

  @Post('projects/:projectId/suites/:suiteId/cases')
  async create(@Param('suiteId') suiteId: string, @Req() req: any, @Body() dto: any) {
    return this.testCaseService.create(suiteId, req.user.sub, dto);
  }

  @Get('projects/:projectId/suites/:suiteId/cases/:caseId')
  async get(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string) {
    return this.testCaseService.getById(suiteId, caseId);
  }

  @Patch('projects/:projectId/suites/:suiteId/cases/:caseId')
  async update(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string, @Body() dto: any) {
    return this.testCaseService.update(suiteId, caseId, dto);
  }

  @Delete('projects/:projectId/suites/:suiteId/cases/:caseId')
  async delete(@Param('suiteId') suiteId: string, @Param('caseId') caseId: string) {
    return this.testCaseService.delete(suiteId, caseId);
  }

  // AI Test Case Generation (Main Agent A)
  @Post('projects/:projectId/cases/generate')
  async generate(
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() dto: { prdIds: string[]; options?: any },
  ) {
    // Load PRDs
    const prds = await this.prisma.prd.findMany({
      where: { id: { in: dto.prdIds }, projectId },
    });
    if (!prds.length) throw new Error('No PRDs found');

    // Create session
    const sessionId = `gen_${Date.now()}`;
    const prdContent = prds.map(p => `# ${p.title}\n\n${p.content}`).join('\n\n---\n\n');

    const systemPrompt = `You are a senior QA engineer. Generate comprehensive test cases from the following PRD(s).
For each requirement, create test cases with: title, description, preconditions, test steps, expected result, priority (P0-P3), category, and tags.
Output as a JSON array of test case objects.`;

    // Create agent session
    const context = await this.contextManager.buildContext(projectId, {
      frontmatter: { name: 'test-case-generator', description: '', model: 'deepseek-chat', temperature: 0.3, max_tokens: 8192, tools: [], skills: [] },
      systemPrompt,
      rawContent: '',
      filePath: '',
    }, { prdIds: dto.prdIds });

    await this.conversationManager.createSession(sessionId, systemPrompt, {
      model: 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 8192,
    }, context);

    this.eventEmitter.emit('session:status', { sessionId, status: 'initializing' });

    // Start generation in background (non-blocking)
    const task = `${prdContent}\n\nGenerate test cases based on the above PRD(s). Return valid JSON array.`;
    this.conversationManager.sendMessage(sessionId, task)
      .then(async (result) => {
        try {
          // Try to parse JSON from result
          const jsonMatch = result.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const cases = JSON.parse(jsonMatch[0]);
            // Create a default suite if needed
            let suite = await this.prisma.testSuite.findFirst({ where: { projectId, name: 'AI Generated' } });
            if (!suite) {
              suite = await this.prisma.testSuite.create({ data: { projectId, name: 'AI Generated', sortOrder: 999 } });
            }
            // Insert generated test cases
            for (const tc of cases.slice(0, 50)) {
              await this.prisma.testCase.create({
                data: {
                  testSuiteId: suite.id,
                  prdId: dto.prdIds[0],
                  title: tc.title || 'Untitled',
                  description: tc.description || '',
                  preconditions: tc.preconditions || '',
                  testSteps: tc.test_steps || tc.testSteps || [],
                  expectedResult: tc.expected_result || tc.expectedResult || '',
                  priority: tc.priority || 'P2',
                  category: tc.category || 'functional',
                  tags: tc.tags || [],
                  source: 'ai_generated',
                  createdBy: req.user.sub,
                },
              });
            }
            this.eventEmitter.emit('session:completed', { sessionId, summary: `Generated ${cases.length} test cases` });
          }
        } catch (e: any) {
          this.eventEmitter.emit('session:error', { sessionId, error: e.message });
        }
      })
      .catch((e) => {
        this.eventEmitter.emit('session:error', { sessionId, error: e.message });
      });

    return {
      sessionId,
      status: 'initializing',
      estimatedDuration: '1-3 minutes',
      wsChannel: `session:${sessionId}`,
    };
  }
}
