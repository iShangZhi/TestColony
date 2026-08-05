import { create } from 'zustand';

interface TestCaseResult {
  testCaseId: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'error' | 'running' | 'pending';
  durationMs?: number;
  errorMessage?: string;
}

interface ExecutionState {
  runId: string | null;
  status: 'idle' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  phase: 'setup' | 'unit_tests' | 'integration' | 'e2e' | 'reporting' | null;
  totalCases: number;
  completedCases: number;
  passedCases: number;
  failedCases: number;
  skippedCases: number;
  errorCases: number;
  results: TestCaseResult[];
  logs: string[];
  agentActivities: Array<{ name: string; status: string; detail: string }>;

  setRunId: (id: string) => void;
  setStatus: (status: ExecutionState['status']) => void;
  setPhase: (phase: ExecutionState['phase']) => void;
  updateProgress: (data: { completed: number; total: number; passed: number; failed: number }) => void;
  addResult: (result: TestCaseResult) => void;
  addLog: (log: string) => void;
  updateAgentActivity: (activities: ExecutionState['agentActivities']) => void;
  reset: () => void;
}

const initialState = {
  runId: null,
  status: 'idle' as const,
  phase: null,
  totalCases: 0,
  completedCases: 0,
  passedCases: 0,
  failedCases: 0,
  skippedCases: 0,
  errorCases: 0,
  results: [],
  logs: [],
  agentActivities: [],
};

export const useExecutionStore = create<ExecutionState>((set) => ({
  ...initialState,

  setRunId: (id) => set({ runId: id }),
  setStatus: (status) => set({ status }),
  setPhase: (phase) => set({ phase }),
  updateProgress: (data) =>
    set((state) => ({
      completedCases: data.completed,
      totalCases: data.total,
      passedCases: data.passed,
      failedCases: data.failed,
      status: data.completed >= data.total ? 'completed' : 'running',
    })),
  addResult: (result) =>
    set((state) => ({
      results: [...state.results.filter((r) => r.testCaseId !== result.testCaseId), result],
    })),
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),
  updateAgentActivity: (activities) => set({ agentActivities: activities }),
  reset: () => set(initialState),
}));
