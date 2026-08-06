import { Module } from '@nestjs/common';
import { ExecutionOrchestratorService } from './execution-orchestrator.service';
import { TestRunnerService } from './test-runner.service';
import { ResultCollectorService } from './result-collector.service';
import { AgentSessionService } from './agent-session.service';

@Module({
  providers: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService, AgentSessionService],
  exports: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService, AgentSessionService],
})
export class ExecutionModule {}
