export type SessionStatus =
  | 'idle'
  | 'thinking'
  | 'tool_executing'
  | 'waiting_user'
  | 'completed'
  | 'error';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface SessionContext {
  projectId: string;
  prdContent?: string;
  testCases?: unknown[];
  injectedContext: Record<string, unknown>;
}

export interface ToolResult {
  tool_call_id: string;
  role: 'tool';
  content: string;
}

export interface LLMResponse {
  content: string | null;
  toolCalls: ToolCall[] | null;
  finishReason: 'stop' | 'tool_calls' | 'length';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
