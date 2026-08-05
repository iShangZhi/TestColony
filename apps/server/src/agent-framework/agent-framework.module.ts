import { Module, Global } from '@nestjs/common';
import { ConversationManager } from './core/conversation-manager';
import { ContextManager } from './core/context-manager';
import { HookEngine } from './core/hook-engine';
import { SubAgentManager } from './core/sub-agent-manager';
import { SessionPool } from './core/session-pool';
import { DeepSeekProvider } from './providers/deepseek-provider';
import { ClaudeCliProvider } from './providers/claude-cli-provider';
import { ToolRegistry } from './tools/tool-registry';
import { ToolExecutor } from './tools/tool-executor';

@Global()
@Module({
  providers: [
    ConversationManager,
    ContextManager,
    HookEngine,
    SubAgentManager,
    SessionPool,
    DeepSeekProvider,
    ClaudeCliProvider,
    ToolRegistry,
    ToolExecutor,
  ],
  exports: [
    ConversationManager,
    ContextManager,
    HookEngine,
    SubAgentManager,
    SessionPool,
    DeepSeekProvider,
    ClaudeCliProvider,
    ToolRegistry,
    ToolExecutor,
  ],
})
export class AgentFrameworkModule {}
