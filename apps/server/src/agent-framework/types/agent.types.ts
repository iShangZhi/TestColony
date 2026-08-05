export interface AgentFrontmatter {
  name: string;
  description: string;
  model: string;
  temperature: number;
  max_tokens: number;
  tools: string[];
  skills: string[];
  hooks?: AgentHookConfig;
  subagents?: SubAgentConfig;
  memory?: 'none' | 'session' | 'project';
  disable_model_invocation?: boolean;
  context_window?: number;
}

export interface AgentHookConfig {
  PreToolUse?: HookDefinition[];
  PostToolUse?: HookDefinition[];
  SessionStart?: HookDefinition[];
  SessionEnd?: HookDefinition[];
  UserPromptSubmit?: HookDefinition[];
  Stop?: HookDefinition[];
}

export interface HookDefinition {
  command: string;
  timeout?: number;
}

export interface SubAgentConfig {
  max_depth: number;
  max_parallel: number;
}

export interface ParsedAgentDefinition {
  frontmatter: AgentFrontmatter;
  systemPrompt: string;
  rawContent: string;
  filePath: string;
}
