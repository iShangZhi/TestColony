// ============================================================
// API Request/Response Types
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'admin' | 'member' | 'viewer';
}

// ============================================================
// Project API
// ============================================================

export interface CreateProjectRequest {
  name: string;
  slug: string;
  description?: string;
  repositoryUrl?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  repositoryUrl?: string;
  settings?: Record<string, unknown>;
}

// ============================================================
// PRD API
// ============================================================

export interface CreatePrdRequest {
  title: string;
  content: string;
  version?: string;
}

export interface AnalyzePrdRequest {
  prdIds: string[];
  options?: {
    depth?: 'quick' | 'standard' | 'comprehensive';
    focusAreas?: string[];
  };
}

// ============================================================
// Test Case Generation API
// ============================================================

export interface GenerateTestCasesRequest {
  prdIds: string[];
  agent?: string; // default: 'test-case-generator'
  options?: {
    maxCasesPerRequirement?: number;
    priorities?: string[];
    categories?: string[];
    style?: 'comprehensive' | 'happy-path-only' | 'edge-case-focused';
  };
}

export interface GenerateTestCasesResponse {
  sessionId: string;
  status: string;
  estimatedDuration: string;
  wsChannel: string;
}

// ============================================================
// Test Execution API
// ============================================================

export interface StartTestRunRequest {
  suiteIds: string[];
  agent?: string; // default: 'test-executor'
  options?: {
    parallel?: boolean;
    maxWorkers?: number;
    retryFailed?: boolean;
    maxRetries?: number;
    environment?: string;
    timeoutMinutes?: number;
  };
}

export interface StartTestRunResponse {
  runId: string;
  status: string;
  wsChannel: string;
}

// ============================================================
// Agent & Skill API
// ============================================================

export interface CreateAgentRequest {
  name: string;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  skills: string[];
  systemPrompt: string;
}

export interface CreateSkillRequest {
  name: string;
  description: string;
  body: string;
  tools?: string[];
  context?: 'inline' | 'fork';
}

// ============================================================
// HITL Interaction API
// ============================================================

export interface RespondToInteractionRequest {
  response: string;
}

// ============================================================
// Export Types
// ============================================================

export type ExportFormat = 'json' | 'csv' | 'junit_xml';
