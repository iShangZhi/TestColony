import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionPool } from '../core/session-pool';
import { ILLMProvider, LLMProvider } from './llm-provider.interface';
import { ChatMessage, LLMResponse } from '../types/session.types';

/**
 * ClaudeCliProvider - Manages Claude Code CLI processes via PTY.
 * Each agent is a separate Claude Code session with custom CLAUDE.md.
 * Used as an alternative/fallback execution mode.
 *
 * NOTE: This is a placeholder implementation. Full PTY integration with
 * node-pty will be implemented in Phase 2.
 */
@Injectable()
export class ClaudeCliProvider implements ILLMProvider {
  private readonly logger = new Logger(ClaudeCliProvider.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sessionPool: SessionPool,
  ) {}

  async chat(messages: ChatMessage[], config: LLMProvider.Config): Promise<LLMResponse> {
    this.logger.warn('ClaudeCliProvider.chat() is a placeholder');
    return {
      content: 'Claude CLI mode not yet implemented. Please use DeepSeek API mode.',
      toolCalls: null,
      finishReason: 'stop',
    };
  }

  async chatStream(
    messages: ChatMessage[],
    config: LLMProvider.Config,
    callbacks: LLMProvider.StreamCallbacks,
  ): Promise<LLMResponse> {
    this.logger.warn('ClaudeCliProvider.chatStream() is a placeholder');
    callbacks.onToken?.('[Claude CLI mode placeholder - use DeepSeek API mode]');
    const response: LLMResponse = {
      content: 'Claude CLI mode not yet implemented. Please use DeepSeek API mode.',
      toolCalls: null,
      finishReason: 'stop',
    };
    callbacks.onComplete?.(response);
    return response;
  }

  countTokens(messages: ChatMessage[]): number {
    return Math.ceil(
      messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) / 4,
    );
  }
}
