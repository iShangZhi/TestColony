import { Injectable, Logger } from '@nestjs/common';
import { DeepSeekProvider } from '../../agent-framework/providers/deepseek-provider';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FailureAnalyzerService {
  private readonly logger = new Logger(FailureAnalyzerService.name);

  constructor(
    private readonly llm: DeepSeekProvider,
    private readonly prisma: PrismaService,
  ) {}

  async analyze(testResultId: string): Promise<string> {
    const result = await this.prisma.testResult.findUnique({
      where: { id: testResultId },
      include: { testCase: true },
    });
    if (!result || result.status === 'passed') return '';

    const messages: any[] = [
      { role: 'system', content: `You are a senior QA engineer analyzing a test failure. Provide:
1. Root cause analysis (1-2 sentences)
2. Likely fix category (code bug | test data | environment | flaky test)
3. Suggested fix (1-2 sentences)
Keep response under 150 words.` },
      { role: 'user', content: `Analyze this test failure:
Test: ${result.testCase.title}
Error: ${result.errorMessage || 'Unknown error'}
Stack: ${(result.stackTrace || '').substring(0, 500)}
Duration: ${result.durationMs}ms
Retry: ${result.retryCount}`},
    ];

    try {
      const response = await this.llm.chat(messages, {
        model: 'deepseek-chat',
        temperature: 0.1,
        maxTokens: 300,
      });

      const analysis = response.content || 'Unable to analyze this failure automatically.';

      // Save to DB
      await this.prisma.testResult.update({
        where: { id: testResultId },
        data: { aiAnalysis: analysis },
      });

      return analysis;
    } catch (e: any) {
      this.logger.warn(`AI analysis failed: ${e.message}`);
      return 'AI analysis unavailable (API key not configured)';
    }
  }

  async analyzeRun(runId: string) {
    const results = await this.prisma.testResult.findMany({
      where: { testRunId: runId, status: 'failed' },
      include: { testCase: true },
    });

    for (const r of results) {
      await this.analyze(r.id);
    }
    return { analyzed: results.length };
  }
}
