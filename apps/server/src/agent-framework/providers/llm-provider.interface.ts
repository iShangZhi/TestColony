import { ChatMessage, LLMResponse } from '../types/session.types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LLMProvider {
  export interface Config {
    model: string;
    temperature: number;
    maxTokens: number;
    tools?: ToolDefinition[];
  }

  export interface ToolDefinition {
    type: 'function';
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  }

  export interface StreamCallbacks {
    onToken?: (token: string) => void;
    onToolCall?: (toolCall: { id: string; name: string; arguments: string }) => void;
    onComplete?: (response: LLMResponse) => void;
    onError?: (error: Error) => void;
  }
}

export interface ILLMProvider {
  chat(messages: ChatMessage[], config: LLMProvider.Config): Promise<LLMResponse>;
  chatStream(messages: ChatMessage[], config: LLMProvider.Config, callbacks: LLMProvider.StreamCallbacks): Promise<LLMResponse>;
  countTokens(messages: ChatMessage[]): number;
}
