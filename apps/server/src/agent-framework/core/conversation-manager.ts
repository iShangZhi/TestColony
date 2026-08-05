import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessage, SessionContext, SessionStatus } from '../types/session.types';
import { DeepSeekProvider } from '../providers/deepseek-provider';
import { ToolExecutor } from '../tools/tool-executor';
import { LLMProvider } from '../providers/llm-provider.interface';

/**
 * ConversationManager - The heart of the agent system.
 * Manages the agent conversation loop: receive messages → call LLM → handle tool calls → loop.
 */
@Injectable()
export class ConversationManager {
  private readonly logger = new Logger(ConversationManager.name);
  private sessions = new Map<string, {
    messages: ChatMessage[];
    status: SessionStatus;
    config: LLMProvider.Config;
    context: SessionContext;
    tokenCount: number;
    maxTokens: number;
  }>();

  constructor(
    private readonly llmProvider: DeepSeekProvider,
    private readonly toolExecutor: ToolExecutor,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createSession(
    sessionId: string,
    systemPrompt: string,
    config: LLMProvider.Config,
    context: SessionContext,
  ) {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    this.sessions.set(sessionId, {
      messages,
      status: 'idle',
      config,
      context,
      tokenCount: 0,
      maxTokens: config.maxTokens || 128000,
    });

    this.logger.log(`Created session: ${sessionId}`);
  }

  async sendMessage(sessionId: string, content: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    // Add user message
    session.messages.push({ role: 'user', content });
    session.status = 'thinking';

    this.eventEmitter.emit('session:status', { sessionId, status: 'thinking' });

    // Main conversation loop
    let finalResponse = '';

    while (session.status === 'thinking') {
      const response = await this.llmProvider.chatStream(
        session.messages,
        session.config,
        {
          onToken: (token) => {
            this.eventEmitter.emit('session:token', { sessionId, token });
          },
          onToolCall: (toolCall) => {
            this.eventEmitter.emit('session:tool_start', {
              sessionId,
              toolName: toolCall.name,
              input: toolCall.arguments,
            });
          },
          onComplete: (resp) => {
            session.tokenCount += resp.usage?.totalTokens || 0;
          },
          onError: (error) => {
            this.logger.error(`Session ${sessionId} error: ${error.message}`);
            session.status = 'error';
          },
        },
      );

      // Add assistant response
      session.messages.push({
        role: 'assistant',
        content: response.content,
        tool_calls: response.toolCalls || undefined,
      });

      // Handle tool calls
      if (response.toolCalls && response.toolCalls.length > 0) {
        session.status = 'tool_executing';

        for (const toolCall of response.toolCalls) {
          try {
            const result = await this.toolExecutor.execute(
              toolCall.function.name,
              JSON.parse(toolCall.function.arguments),
            );

            session.messages.push({
              role: 'tool',
              content: typeof result === 'string' ? result : JSON.stringify(result),
              tool_call_id: toolCall.id,
            });

            this.eventEmitter.emit('session:tool_end', {
              sessionId,
              toolName: toolCall.function.name,
              output: result,
            });
          } catch (error: any) {
            session.messages.push({
              role: 'tool',
              content: `Error: ${error.message}`,
              tool_call_id: toolCall.id,
            });

            this.eventEmitter.emit('session:tool_error', {
              sessionId,
              toolName: toolCall.function.name,
              error: error.message,
            });
          }
        }

        session.status = 'thinking'; // Continue loop
      } else {
        // No tool calls - done
        finalResponse = response.content || '';
        session.status = 'idle';
        break;
      }

      // Check context window
      if (session.tokenCount > session.maxTokens * 0.8) {
        this.logger.warn(`Session ${sessionId} approaching context limit`);
        await this.compactContext(sessionId);
      }
    }

    this.eventEmitter.emit('session:status', { sessionId, status: session.status });

    return finalResponse;
  }

  async waitForUserInput(sessionId: string, prompt: string, timeoutSeconds = 300) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = 'waiting_user';
    this.eventEmitter.emit('session:interrupted', { sessionId, reason: prompt });

    // Return interaction ID for tracking
    return { sessionId, prompt, timeoutSeconds };
  }

  async resumeAfterUserInput(sessionId: string, userResponse: string) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.status = 'thinking';
    session.messages.push({
      role: 'user',
      content: `[User Response]: ${userResponse}`,
    });

    // Continue the conversation loop
    return this.sendMessage(sessionId, userResponse);
  }

  async compactContext(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Keep system prompt + last N messages, summarize middle
    const systemMsg = session.messages[0];
    const recentMsgs = session.messages.slice(-20);

    const summary = await this.llmProvider.chat(
      [
        systemMsg!,
        ...session.messages.slice(1, -20),
        { role: 'user', content: 'Please summarize the above conversation concisely.' },
      ],
      { ...session.config, temperature: 0.1 },
    );

    session.messages = [
      systemMsg!,
      { role: 'user', content: `[Context Summary]: ${summary.content}` },
      ...recentMsgs,
    ];

    this.logger.log(`Compacted context for session ${sessionId}`);
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  removeSession(sessionId: string) {
    this.sessions.delete(sessionId);
    this.logger.log(`Removed session: ${sessionId}`);
  }
}
