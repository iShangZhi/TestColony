// ============================================================
// WebSocket Event Types
// ============================================================

// Client → Server Events
// ============================================================

export interface ClientEvents {
  'session:join': { sessionId: string };
  'session:leave': { sessionId: string };
  'run:join': { runId: string };
  'run:leave': { runId: string };
  'interaction:respond': { interactionId: string; response: string; userId: string };
  'interaction:skip': { interactionId: string };
  'agent:send_message': { sessionId: string; content: string };
}

// Server → Client Events
// ============================================================

// Agent Session Events
export interface SessionStatusEvent {
  sessionId: string;
  status: string;
  timestamp: string;
}

export interface SessionThinkingEvent {
  sessionId: string;
  thought: string;
}

export interface SessionTokenEvent {
  sessionId: string;
  token: string;
  sequence: number;
}

export interface ToolStartEvent {
  sessionId: string;
  toolName: string;
  input: Record<string, unknown>;
}

export interface ToolEndEvent {
  sessionId: string;
  toolName: string;
  output: string;
  durationMs: number;
}

export interface ToolErrorEvent {
  sessionId: string;
  toolName: string;
  error: string;
}

export interface SessionPhaseEvent {
  sessionId: string;
  phase: string;
  description: string;
}

export interface SessionCompletedEvent {
  sessionId: string;
  summary: string;
}

export interface SessionInterruptedEvent {
  sessionId: string;
  reason: string;
}

// Sub-Agent Events
export interface SubAgentStartedEvent {
  parentSessionId: string;
  subSessionId: string;
  agentName: string;
  task: string;
}

export interface SubAgentCompletedEvent {
  parentSessionId: string;
  subSessionId: string;
  summary: string;
}

export interface SubAgentErrorEvent {
  subSessionId: string;
  error: string;
}

// Test Execution Events
export interface RunStartedEvent {
  runId: string;
  totalCases: number;
}

export interface RunPhaseEvent {
  runId: string;
  phase: 'setup' | 'unit_tests' | 'integration' | 'e2e' | 'reporting';
}

export interface CaseStartEvent {
  runId: string;
  testCaseId: string;
  title: string;
}

export interface CaseResultEvent {
  runId: string;
  testCaseId: string;
  status: 'passed' | 'failed' | 'skipped' | 'error';
  durationMs: number;
  error?: string;
}

export interface RunProgressEvent {
  runId: string;
  completed: number;
  total: number;
  passed: number;
  failed: number;
}

export interface RunCompletedEvent {
  runId: string;
  summary: string;
  reportUrl: string;
}

export interface RunCancelledEvent {
  runId: string;
}

export interface RunErrorEvent {
  runId: string;
  error: string;
}

// Human-in-the-Loop Events
export interface InteractionRequiredEvent {
  interactionId: string;
  sessionId: string;
  type: string;
  title: string;
  message: string;
  options: Array<{ label: string; value: string; description?: string }>;
  timeout: number; // seconds
}

export interface InteractionRespondedEvent {
  interactionId: string;
  response: string;
}

export interface InteractionTimeoutEvent {
  interactionId: string;
}

export interface InteractionCancelledEvent {
  interactionId: string;
}

// System Events
export interface SystemNotificationEvent {
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error';
}

export interface ServerEvents {
  'session:status': SessionStatusEvent;
  'session:thinking': SessionThinkingEvent;
  'session:token': SessionTokenEvent;
  'session:tool_start': ToolStartEvent;
  'session:tool_end': ToolEndEvent;
  'session:tool_error': ToolErrorEvent;
  'session:phase': SessionPhaseEvent;
  'session:message': { sessionId: string; message: unknown };
  'session:error': { sessionId: string; error: string };
  'session:completed': SessionCompletedEvent;
  'session:interrupted': SessionInterruptedEvent;

  'subagent:started': SubAgentStartedEvent;
  'subagent:token': { subSessionId: string; token: string };
  'subagent:completed': SubAgentCompletedEvent;
  'subagent:error': SubAgentErrorEvent;

  'run:started': RunStartedEvent;
  'run:phase': RunPhaseEvent;
  'run:case_start': CaseStartEvent;
  'run:case_result': CaseResultEvent;
  'run:progress': RunProgressEvent;
  'run:completed': RunCompletedEvent;
  'run:cancelled': RunCancelledEvent;
  'run:error': RunErrorEvent;

  'interaction:required': InteractionRequiredEvent;
  'interaction:responded': InteractionRespondedEvent;
  'interaction:timeout': InteractionTimeoutEvent;
  'interaction:cancelled': InteractionCancelledEvent;

  'system:notification': SystemNotificationEvent;
  'system:heartbeat': { timestamp: string };
}
