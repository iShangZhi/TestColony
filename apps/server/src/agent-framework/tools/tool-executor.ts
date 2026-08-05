import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistry } from './tool-registry';

/**
 * ToolExecutor - Executes tool calls from the LLM.
 * Validates inputs, calls the appropriate handler, and returns results.
 */
@Injectable()
export class ToolExecutor {
  private readonly logger = new Logger(ToolExecutor.name);

  constructor(private readonly toolRegistry: ToolRegistry) {}

  async execute(toolName: string, params: Record<string, unknown>): Promise<unknown> {
    const tool = this.toolRegistry.get(toolName);
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    this.logger.log(`Executing tool: ${toolName}`);
    const startTime = Date.now();

    try {
      const result = await tool.handler(params);
      const duration = Date.now() - startTime;
      this.logger.log(`Tool ${toolName} completed in ${duration}ms`);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error(`Tool ${toolName} failed in ${duration}ms: ${error.message}`);
      throw error;
    }
  }
}
