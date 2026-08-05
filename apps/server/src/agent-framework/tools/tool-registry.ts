import { Injectable, Logger } from '@nestjs/common';
import { LLMProvider } from '../providers/llm-provider.interface';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

/**
 * ToolRegistry - Central registry for all agent tools.
 * Tools are defined here and can be enabled/disabled per agent via the agent definition.
 */
@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
    this.logger.log(`Registered tool: ${tool.name}`);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  getByNames(names: string[]): ToolDefinition[] {
    return names.map((n) => this.tools.get(n)).filter(Boolean) as ToolDefinition[];
  }

  getAll(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  toLLMTools(toolNames: string[]): LLMProvider.ToolDefinition[] {
    return this.getByNames(toolNames).map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }
}
