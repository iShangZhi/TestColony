import { Module } from '@nestjs/common';
import { TestSuiteController } from './test-suite.controller';
import { TestSuiteService } from './test-suite.service';

@Module({
  controllers: [TestSuiteController],
  providers: [TestSuiteService],
  exports: [TestSuiteService],
})
export class TestSuiteModule {}
