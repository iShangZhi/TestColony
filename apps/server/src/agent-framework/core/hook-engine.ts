import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { HookEvent, HookContext, HookResult } from '../types/hook.types';
import { HookDefinition, AgentHookConfig } from '../types/agent.types';

const execAsync = promisify(exec);

/**
 * HookEngine - Implements lifecycle hooks (PreToolUse, PostToolUse, etc.)
 * Inspired by Claude Code's hook system.
 * Hooks can be shell scripts, with future support for HTTP calls and LLM evaluations.
 */
@Injectable()
export class HookEngine {
  private readonly logger = new Logger(HookEngine.name);

  async executeHooks(
    event: HookEvent,
    context: HookContext,
    hookConfig?: AgentHookConfig,
  ): Promise<HookResult> {
    if (!hookConfig) return { allowed: true };

    const hooks = this.getHooksForEvent(event, hookConfig);
    if (!hooks || hooks.length === 0) return { allowed: true };

    let result: HookResult = { allowed: true };

    for (const hook of hooks) {
      try {
        const hookResult = await this.executeHook(hook, context);
        if (!hookResult.allowed) {
          result.allowed = false;
          result.message = hookResult.message;
          break;
        }
        if (hookResult.modifiedInput) {
          result.modifiedInput = { ...(result.modifiedInput || {}), ...hookResult.modifiedInput };
        }
      } catch (error: any) {
        this.logger.error(`Hook ${hook.command} failed: ${error.message}`);
        // By default, hook failure doesn't block execution
      }
    }

    return result;
  }

  private getHooksForEvent(event: HookEvent, config: AgentHookConfig): HookDefinition[] | undefined {
    switch (event) {
      case 'PreToolUse': return config.PreToolUse;
      case 'PostToolUse': return config.PostToolUse;
      case 'SessionStart': return config.SessionStart;
      case 'SessionEnd': return config.SessionEnd;
      case 'UserPromptSubmit': return config.UserPromptSubmit;
      case 'Stop': return config.Stop;
      default: return undefined;
    }
  }

  private async executeHook(hook: HookDefinition, context: HookContext): Promise<HookResult> {
    const timeout = hook.timeout || 30000; // default 30s
    const env = {
      ...process.env,
      HOOK_EVENT: context.event,
      HOOK_SESSION_ID: context.sessionId,
      HOOK_AGENT_NAME: context.agentName,
      HOOK_TOOL_NAME: context.toolName || '',
      HOOK_TOOL_INPUT: JSON.stringify(context.toolInput || {}),
    };

    try {
      const { stdout } = await execAsync(hook.command, {
        env,
        timeout,
        maxBuffer: 1024 * 1024, // 1MB
      });

      const output = stdout.trim();
      if (output) {
        try {
          return JSON.parse(output) as HookResult;
        } catch {
          // Non-JSON output = allowed
          return { allowed: true };
        }
      }

      return { allowed: true };
    } catch (error: any) {
      if (error.killed) {
        this.logger.warn(`Hook ${hook.command} timed out after ${timeout}ms`);
      }
      // Hook failure doesn't block by default
      return { allowed: true };
    }
  }
}
