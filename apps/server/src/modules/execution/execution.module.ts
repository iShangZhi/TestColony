import { Module } from '@nestjs/common';
import { ExecutionOrchestratorService } from './execution-orchestrator.service';
import { TestRunnerService } from './test-runner.service';
import { ResultCollectorService } from './result-collector.service';
import { AgentSessionService } from './agent-session.service';
import { FailureAnalyzerService } from './failure-analyzer.service';

@Module({
  providers: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService, AgentSessionService, FailureAnalyzerService],
  exports: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService, AgentSessionService, FailureAnalyzerService],
})
export class ExecutionModule {}
