import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationManager } from './conversation-manager';
import { ContextManager } from './context-manager';
import { ParsedAgentDefinition } from '../types/agent.types';
import { SessionContext, LLMResponse } from '../types/session.types';
import { LLMProvider } from '../providers/llm-provider.interface';

/**
 * SubAgentManager - Spawns and manages sub-agent sessions.
 * Each sub-agent gets a clean context window.
 * Only summaries return to the parent.
 * Supports up to 5 levels of nesting (inspired by Claude Code).
 */
@Injectable()
export class SubAgentManager {
  private readonly logger = new Logger(SubAgentManager.name);
  private subSessions = new Map<string, {
    parentSessionId: string;
    agentName: string;
    depth: number;
    status: string;
  }>();

  constructor(
    private readonly conversationManager: ConversationManager,
    private readonly contextManager: ContextManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async spawn(
    parentSessionId: string,
    agent: ParsedAgentDefinition,
    task: string,
    context: SessionContext,
    depth = 0,
  ): Promise<{ summary: string; sessionId: string }> {
    const subSessionId = `${parentSessionId}_sub_${Date.now()}`;

    if (depth >= 5) {
      throw new Error('Maximum sub-agent nesting depth (5) exceeded');
    }

    this.subSessions.set(subSessionId, {
      parentSessionId,
      agentName: agent.frontmatter.name,
      depth,
      status: 'initializing',
    });

    // Build isolated context for sub-agent
    const systemPrompt = this.contextManager.buildSystemPrompt(agent, {
      ...context,
      injectedContext: {
        ...context.injectedContext,
        parentTask: task,
        parentSummary: 'Running as sub-agent of parent session',
      },
    });

    const config: LLMProvider.Config = {
      model: agent.frontmatter.model,
      temperature: agent.frontmatter.temperature,
      maxTokens: agent.frontmatter.max_tokens,
    };

    this.eventEmitter.emit('subagent:started', {
      parentSessionId,
      subSessionId,
      agentName: agent.frontmatter.name,
      task,
    });

    try {
      await this.conversationManager.createSession(subSessionId, systemPrompt, config, context);
      const result = await this.conversationManager.sendMessage(subSessionId, task);

      const summary = await this.summarizeResult(result, task);

      this.eventEmitter.emit('subagent:completed', {
        parentSessionId,
        subSessionId,
        summary,
      });

      this.subSessions.set(subSessionId, {
        ...this.subSessions.get(subSessionId)!,
        status: 'completed',
      });

      return { summary, sessionId: subSessionId };
    } catch (error: any) {
      this.logger.error(`Sub-agent ${subSessionId} failed: ${error.message}`);
      this.eventEmitter.emit('subagent:error', {
        subSessionId,
        error: error.message,
      });
      throw error;
    } finally {
      this.conversationManager.removeSession(subSessionId);
    }
  }

  private async summarizeResult(result: string, task: string): Promise<string> {
    // For now, truncate long results
    if (result.length <= 2000) return result;
    return result.substring(0, 2000) + `\n\n... (${result.length - 2000} more characters truncated)`;
  }

  getSubSessionInfo(subSessionId: string) {
    return this.subSessions.get(subSessionId);
  }
}
