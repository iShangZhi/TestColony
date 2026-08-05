import { Module } from '@nestjs/common';
import { ExecutionOrchestratorService } from './execution-orchestrator.service';
import { TestRunnerService } from './test-runner.service';
import { ResultCollectorService } from './result-collector.service';

@Module({
  providers: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService],
  exports: [ExecutionOrchestratorService, TestRunnerService, ResultCollectorService],
})
export class ExecutionModule {}
