// ============================================================
// Test Case & Test Suite Types
// ============================================================

export interface TestSuite {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
  children?: TestSuite[];
  createdAt: string;
  updatedAt: string;
}

export interface TestStep {
  step: number;
  action: string;
  expected: string;
}

export type TestCasePriority = 'P0' | 'P1' | 'P2' | 'P3';
export type TestCaseStatus = 'draft' | 'review' | 'approved' | 'deprecated';
export type AutomationStatus = 'manual' | 'automated' | 'in_progress';
export type TestCaseSource = 'manual' | 'ai_generated' | 'imported';

export interface TestCase {
  id: string;
  testSuiteId: string;
  prdId?: string;
  externalId?: string;
  title: string;
  description?: string;
  preconditions?: string;
  testSteps: TestStep[];
  expectedResult?: string;
  priority: TestCasePriority;
  category?: string;
  tags: string[];
  automationStatus: AutomationStatus;
  status: TestCaseStatus;
  source: TestCaseSource;
  metadata?: Record<string, unknown>;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseCreateInput {
  title: string;
  description?: string;
  preconditions?: string;
  testSteps: TestStep[];
  expectedResult?: string;
  priority?: TestCasePriority;
  category?: string;
  tags?: string[];
}

// ============================================================
// Test Run & Result Types
// ============================================================

export type TestRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type TestRunTrigger = 'manual' | 'scheduled' | 'ci_cd' | 'ai_agent';

export interface TestRun {
  id: string;
  projectId: string;
  testSuiteId?: string;
  name?: string;
  triggerType: TestRunTrigger;
  status: TestRunStatus;
  startedAt?: string;
  completedAt?: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  skippedCases: number;
  errorCases: number;
  durationMs?: number;
  reportPath?: string;
  triggeredBy?: string;
  agentSessionId?: string;
  createdAt: string;
}

export type TestResultStatus = 'passed' | 'failed' | 'skipped' | 'error';

export interface TestResult {
  id: string;
  testRunId: string;
  testCaseId: string;
  status: TestResultStatus;
  durationMs?: number;
  errorMessage?: string;
  stackTrace?: string;
  screenshots?: string[];
  logs?: string;
  aiAnalysis?: string;
  retryCount: number;
  executedAt?: string;
  createdAt: string;
}

// ============================================================
// PRD Types
// ============================================================

export type PrdStatus = 'draft' | 'analyzing' | 'ready' | 'archived';

export interface Prd {
  id: string;
  projectId: string;
  title: string;
  version: string;
  content: string;
  filePath?: string;
  parsedRequirements?: ParsedRequirement[];
  status: PrdStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedRequirement {
  id: string;
  category: 'functional' | 'non-functional' | 'ui' | 'performance' | 'security';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  inputs: string[];
  outputs: string[];
  constraints: string[];
  ambiguities: string[];
  relatedRequirements: string[];
  suggestedTestAreas: string[];
}

// ============================================================
// User Interaction (HITL) Types
// ============================================================

export type InteractionType = 'confirmation' | 'clarification' | 'approval' | 'input';
export type InteractionPriority = 'low' | 'normal' | 'high' | 'critical';
export type InteractionStatus = 'pending' | 'responded' | 'timeout' | 'cancelled';

export interface UserInteraction {
  id: string;
  sessionId: string;
  type: InteractionType;
  priority: InteractionPriority;
  title: string;
  message: string;
  contextData?: Record<string, unknown>;
  options?: InteractionOption[];
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  status: InteractionStatus;
  timeoutAt?: string;
  createdAt: string;
}

export interface InteractionOption {
  label: string;
  value: string;
  description?: string;
}

// ============================================================
// Common / Pagination
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, unknown>;
}
