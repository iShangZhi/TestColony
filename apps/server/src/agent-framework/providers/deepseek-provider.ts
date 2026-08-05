import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessage, LLMResponse } from '../types/session.types';
import { ILLMProvider, LLMProvider } from './llm-provider.interface';

/**
 * DeepSeekProvider - Integrates with DeepSeek API using OpenAI-compatible endpoint.
 * Supports: chat completions, streaming, function/tool calling, JSON mode.
 */
@Injectable()
export class DeepSeekProvider implements ILLMProvider {
  private readonly logger = new Logger(DeepSeekProvider.name);
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get('DEEPSEEK_API_KEY', ''),
      baseURL: this.configService.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1'),
    });
  }

  async chat(messages: ChatMessage[], config: LLMProvider.Config): Promise<LLMResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: config.model,
        messages: messages.map(this.mapMessage),
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        tools: config.tools?.length ? config.tools.map(this.mapTool) : undefined,
      });

      const choice = response.choices[0];
      const message = choice?.message;

      return {
        content: message?.content || null,
        toolCalls: message?.tool_calls?.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })) || null,
        finishReason: (choice?.finish_reason as LLMResponse['finishReason']) || 'stop',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      this.logger.error(`DeepSeek API error: ${error.message}`);
      throw error;
    }
  }

  async chatStream(
    messages: ChatMessage[],
    config: LLMProvider.Config,
    callbacks: LLMProvider.StreamCallbacks,
  ): Promise<LLMResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        model: config.model,
        messages: messages.map(this.mapMessage),
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        tools: config.tools?.length ? config.tools.map(this.mapTool) : undefined,
        stream: true,
      });

      let fullContent = '';
      const toolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map();
      let finishReason: LLMResponse['finishReason'] = 'stop';

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        if (delta?.content) {
          fullContent += delta.content;
          callbacks.onToken?.(delta.content);
        }

        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            const index = tc.index;
            if (!toolCalls.has(index)) {
              toolCalls.set(index, {
                id: tc.id || `tool_${index}`,
                name: tc.function?.name || '',
                arguments: '',
              });
            }
            const existing = toolCalls.get(index)!;
            if (tc.id) existing.id = tc.id;
            if (tc.function?.name) existing.name = tc.function.name;
            if (tc.function?.arguments) existing.arguments += tc.function.arguments;
          }
        }

        if (chunk.choices[0]?.finish_reason) {
          finishReason = chunk.choices[0].finish_reason as LLMResponse['finishReason'];
        }
      }

      // Emit collected tool calls
      for (const tc of toolCalls.values()) {
        callbacks.onToolCall?.(tc);
      }

      const response: LLMResponse = {
        content: fullContent || null,
        toolCalls: toolCalls.size > 0
          ? Array.from(toolCalls.values()).map((tc) => ({
              id: tc.id,
              type: 'function' as const,
              function: { name: tc.name, arguments: tc.arguments },
            }))
          : null,
        finishReason,
      };

      callbacks.onComplete?.(response);
      return response;
    } catch (error: any) {
      this.logger.error(`DeepSeek stream error: ${error.message}`);
      callbacks.onError?.(error);
      throw error;
    }
  }

  countTokens(messages: ChatMessage[]): number {
    // Rough estimate: ~4 chars per token
    const totalChars = messages.reduce(
      (sum, m) => sum + (m.content?.length || 0) + JSON.stringify(m.tool_calls || {}).length,
      0,
    );
    return Math.ceil(totalChars / 4);
  }

  private mapMessage(msg: ChatMessage): OpenAI.Chat.ChatCompletionMessageParam {
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        content: msg.content || '',
        tool_call_id: msg.tool_call_id || '',
      };
    }
    if (msg.role === 'assistant' && msg.tool_calls) {
      return {
        role: 'assistant',
        content: msg.content,
        tool_calls: msg.tool_calls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      };
    }
    return {
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content || '',
    };
  }

  private mapTool(tool: LLMProvider.ToolDefinition): OpenAI.Chat.ChatCompletionTool {
    return {
      type: 'function',
      function: {
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters as Record<string, unknown>,
      },
    };
  }
}
