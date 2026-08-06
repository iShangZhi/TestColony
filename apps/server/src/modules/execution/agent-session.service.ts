import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConversationManager } from '../../agent-framework/core/conversation-manager';
import { ContextManager } from '../../agent-framework/core/context-manager';
import { SubAgentManager } from '../../agent-framework/core/sub-agent-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LLMProvider } from '../../agent-framework/providers/llm-provider.interface';

/**
 * AgentSessionService - Orchestrates the full agent lifecycle:
 * Creates DB sessions, manages conversation, streams events to WebSocket,
 * saves results back to DB, and handles sub-agent spawning.
 */
@Injectable()
export class AgentSessionService {
  private readonly logger = new Logger(AgentSessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly conversationManager: ConversationManager,
    private readonly contextManager: ContextManager,
    private readonly subAgentManager: SubAgentManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createAndRunSession(params: {
    projectId: string;
    agentType: 'main_agent_a' | 'main_agent_b' | 'sub_agent';
    agentName: string;
    systemPrompt: string;
    task: string;
    model?: string;
    context?: Record<string, unknown>;
    parentSessionId?: string;
  }): Promise<{ sessionId: string; result: string }> {
    // Create DB record
    const dbSession = await this.prisma.agentSession.create({
      data: {
        projectId: params.projectId,
        agentType: params.agentType,
        name: params.agentName,
        model: params.model || 'deepseek-chat',
        status: 'initializing',
        parentSessionId: params.parentSessionId,
      },
    });

    const sessionId = dbSession.id;

    // Emit status
    this.eventEmitter.emit('session:status', { sessionId, status: 'initializing' });

    // Create in-memory conversation
    const llmConfig: LLMProvider.Config = {
      model: params.model || 'deepseek-chat',
      temperature: 0.3,
      maxTokens: 8192,
    };

    await this.conversationManager.createSession(
      sessionId,
      params.systemPrompt,
      llmConfig,
      { projectId: params.projectId, injectedContext: params.context || {} },
    );

    // Update status to thinking
    await this.prisma.agentSession.update({
      where: { id: sessionId },
      data: { status: 'thinking', startedAt: new Date() },
    });
    this.eventEmitter.emit('session:status', { sessionId, status: 'thinking' });
    this.eventEmitter.emit('session:phase', { sessionId, phase: 'executing', description: `Agent ${params.agentName} started` });

    try {
      // Execute the main task
      const result = await this.conversationManager.sendMessage(sessionId, params.task);

      // Mark completed
      await this.prisma.agentSession.update({
        where: { id: sessionId },
        data: { status: 'completed', completedAt: new Date(), summary: result.substring(0, 500) },
      });
      this.eventEmitter.emit('session:completed', { sessionId, summary: result.substring(0, 500) });

      return { sessionId, result };
    } catch (error: any) {
      this.logger.error(`Session ${sessionId} failed: ${error.message}`);
      await this.prisma.agentSession.update({
        where: { id: sessionId },
        data: { status: 'error', errorMessage: error.message, completedAt: new Date() },
      });
      this.eventEmitter.emit('session:error', { sessionId, error: error.message });
      throw error;
    }
  }

  async spawnSubAgent(params: {
    projectId: string;
    parentSessionId: string;
    agentName: string;
    task: string;
    systemPrompt: string;
  }): Promise<{ sessionId: string; summary: string }> {
    const result = await this.createAndRunSession({
      projectId: params.projectId,
      agentType: 'sub_agent',
      agentName: params.agentName,
      systemPrompt: params.systemPrompt,
      task: params.task,
      parentSessionId: params.parentSessionId,
    });

    this.eventEmitter.emit('subagent:completed', {
      parentSessionId: params.parentSessionId,
      subSessionId: result.sessionId,
      summary: result.result.substring(0, 300),
    });

    return { sessionId: result.sessionId, summary: result.result };
  }
}
