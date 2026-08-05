// ============================================================
// Agent Definition Types
// ============================================================

export interface AgentDefinition {
  name: string;
  description: string;
  model: string;
  temperature: number;
  max_tokens: number;
  tools: string[];
  skills: string[];
  hooks?: AgentHooks;
  subagents?: SubAgentConfig;
  memory?: 'none' | 'session' | 'project';
  disable_model_invocation?: boolean;
  context_window?: number;
  system_prompt: string; // The markdown body
}

export interface AgentHooks {
  PreToolUse?: HookConfig[];
  PostToolUse?: HookConfig[];
  SessionStart?: HookConfig[];
  SessionEnd?: HookConfig[];
  UserPromptSubmit?: HookConfig[];
  Stop?: HookConfig[];
}

export interface HookConfig {
  command: string;
  timeout?: number;
}

export interface SubAgentConfig {
  max_depth: number;
  max_parallel: number;
}

export interface SkillDefinition {
  name: string;
  description: string;
  tools?: string[];
  context: 'inline' | 'fork';
  disable_model_invocation?: boolean;
  body: string; // The markdown body
}

// ============================================================
// Agent Session Types
// ============================================================

export type AgentSessionStatus =
  | 'initializing'
  | 'thinking'
  | 'tool_executing'
  | 'waiting_user'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface AgentSession {
  id: string;
  projectId: string;
  agentDefinitionId?: string;
  parentSessionId?: string;
  name: string;
  agentType: 'main_agent_a' | 'main_agent_b' | 'sub_agent';
  status: AgentSessionStatus;
  model: string;
  tokenCount: number;
  maxTokens: number;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
  toolName?: string;
  tokenCount?: number;
  sequenceNum: number;
  createdAt: string;
}

export interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface SubAgentResult {
  summary: string;
  sessionId: string;
}

// ============================================================
// Inter-Agent Communication
// ============================================================

export interface AgentCommunicationMessage {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'notification' | 'status';
  payload: {
    action?: string;
    data?: unknown;
    error?: string;
  };
  timestamp: string;
  correlationId?: string;
}
