import { Injectable } from '@nestjs/common';
import { SessionContext } from '../types/session.types';
import { ParsedAgentDefinition } from '../types/agent.types';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * ContextManager - Handles context injection into agent system prompts.
 * Gathers relevant data (PRD content, test cases, project settings) and
 * injects them into the agent's context before session creation.
 */
@Injectable()
export class ContextManager {
  constructor(private readonly prisma: PrismaService) {}

  async buildContext(
    projectId: string,
    agent: ParsedAgentDefinition,
    options?: { prdIds?: string[]; testCaseIds?: string[] },
  ): Promise<SessionContext> {
    const context: SessionContext = {
      projectId,
      injectedContext: {},
    };

    // Load project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true, description: true, settings: true },
    });
    if (project) {
      context.injectedContext.projectName = project.name;
      context.injectedContext.projectDescription = project.description;
    }

    // Load PRDs if specified
    if (options?.prdIds && options.prdIds.length > 0) {
      const prds = await this.prisma.prd.findMany({
        where: { id: { in: options.prdIds }, projectId },
      });
      if (prds.length > 0) {
        context.prdContent = prds.map((p) => `# ${p.title}\n\n${p.content}`).join('\n\n---\n\n');
        context.injectedContext.prdTitles = prds.map((p) => p.title);
      }
    }

    // Load test cases if specified
    if (options?.testCaseIds && options.testCaseIds.length > 0) {
      const testCases = await this.prisma.testCase.findMany({
        where: { id: { in: options.testCaseIds } },
        select: { id: true, title: true, testSteps: true, expectedResult: true, priority: true },
      });
      context.testCases = testCases;
    }

    return context;
  }

  buildSystemPrompt(agent: ParsedAgentDefinition, context: SessionContext): string {
    let prompt = agent.systemPrompt;

    // Inject context
    if (context.prdContent) {
      prompt += `\n\n## Current PRD Content\n${context.prdContent}`;
    }

    if (context.testCases && context.testCases.length > 0) {
      prompt += `\n\n## Test Cases to Execute\n${JSON.stringify(context.testCases, null, 2)}`;
    }

    prompt += `\n\n## Project Context\n${JSON.stringify(context.injectedContext, null, 2)}`;

    return prompt;
  }
}
