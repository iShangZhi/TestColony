import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { PrdModule } from './modules/prd/prd.module';
import { TestSuiteModule } from './modules/test-suite/test-suite.module';
import { TestCaseModule } from './modules/test-case/test-case.module';
import { TestRunModule } from './modules/test-run/test-run.module';
import { AgentModule } from './modules/agent/agent.module';
import { SkillModule } from './modules/skill/skill.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { InteractionModule } from './modules/interaction/interaction.module';
import { AgentFrameworkModule } from './agent-framework/agent-framework.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ProjectModule,
    PrdModule,
    TestSuiteModule,
    TestCaseModule,
    TestRunModule,
    AgentModule,
    SkillModule,
    ExecutionModule,
    InteractionModule,
    AgentFrameworkModule,
    RealtimeModule,
  ],
})
export class AppModule {}
