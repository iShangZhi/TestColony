export type HookEvent =
  | 'PreToolUse'
  | 'PostToolUse'
  | 'SessionStart'
  | 'SessionEnd'
  | 'UserPromptSubmit'
  | 'Stop';

export interface HookContext {
  event: HookEvent;
  sessionId: string;
  agentName: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: string;
  userMessage?: string;
  timestamp: Date;
}

export interface HookResult {
  allowed: boolean;
  modifiedInput?: Record<string, unknown>;
  message?: string;
}
