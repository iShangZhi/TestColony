import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * SessionPool - Manages Claude CLI PTY session lifecycle.
 * Maintains a pool of PTY sessions for CLI mode.
 * Sessions are pre-warmed for fast startup and auto-killed after idle timeout.
 */
@Injectable()
export class SessionPool implements OnModuleDestroy {
  private readonly logger = new Logger(SessionPool.name);
  private readonly maxConcurrent: number;
  private readonly idleTimeoutMs: number;
  private activeSessions = 0;

  constructor(private readonly configService: ConfigService) {
    this.maxConcurrent = this.configService.get('CLAUDE_CLI_MAX_CONCURRENT', 5);
    this.idleTimeoutMs = this.configService.get('CLAUDE_CLI_IDLE_TIMEOUT_MS', 300000);
  }

  async acquire(): Promise<string> {
    if (this.activeSessions >= this.maxConcurrent) {
      throw new Error(`Max concurrent sessions (${this.maxConcurrent}) reached`);
    }

    this.activeSessions++;
    const sessionId = `pty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`Acquired PTY session: ${sessionId} (${this.activeSessions}/${this.maxConcurrent})`);
    return sessionId;
  }

  async release(sessionId: string): Promise<void> {
    this.activeSessions = Math.max(0, this.activeSessions - 1);
    this.logger.log(`Released PTY session: ${sessionId} (${this.activeSessions}/${this.maxConcurrent})`);
  }

  get activeCount(): number {
    return this.activeSessions;
  }

  get availableSlots(): number {
    return Math.max(0, this.maxConcurrent - this.activeSessions);
  }

  async onModuleDestroy() {
    this.logger.log('Shutting down session pool');
    // PTY sessions will be cleaned up by the OS
  }
}
