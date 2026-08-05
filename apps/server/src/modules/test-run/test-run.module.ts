import { Module } from '@nestjs/common';
import { TestRunController } from './test-run.controller';
import { TestRunService } from './test-run.service';

@Module({
  controllers: [TestRunController],
  providers: [TestRunService],
  exports: [TestRunService],
})
export class TestRunModule {}
