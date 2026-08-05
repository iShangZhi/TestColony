'use client';

import { useParams } from 'next/navigation';
import { Play, Square, CheckCircle2, XCircle, SkipForward, AlertCircle } from 'lucide-react';

export default function ExecutionMonitorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const runId = params.runId as string;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Run: {runId}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Started 2 min ago • Estimated 8 min remaining
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-status-skipped/20 text-status-skipped rounded-md text-sm font-medium">
            <Square size={14} /> 暂停
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-status-failed/20 text-status-failed rounded-md text-sm font-medium">
            <Square size={14} /> 取消
          </button>
        </div>
      </div>

      {/* Main Monitor Area */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-280px)]">
        {/* DAG Visualization */}
        <div className="col-span-1 bg-surface-card rounded-lg border border-surface-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">执行流程 DAG</h3>
          <div className="space-y-3">
            {[
              { name: 'SETUP', status: 'passed' },
              { name: 'UNIT TESTS', status: 'running', progress: '75%' },
              { name: 'INTEGRATION', status: 'running', progress: '40%' },
              { name: 'E2E TESTS', status: 'pending' },
              { name: 'REPORTING', status: 'pending' },
            ].map((phase) => (
              <div
                key={phase.name}
                className={`agent-node ${phase.status} flex items-center justify-between`}
              >
                <span className="text-text-primary font-medium text-sm">{phase.name}</span>
                <span className={`text-xs ${
                  phase.status === 'passed' ? 'text-status-passed' :
                  phase.status === 'running' ? 'text-status-running' :
                  'text-text-muted'
                }`}>
                  {phase.status === 'passed' ? '✔' : phase.progress || '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Log / Agent View */}
        <div className="col-span-2 bg-surface-card rounded-lg border border-surface-border flex flex-col">
          <div className="p-3 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">实时日志</h3>
            <span className="text-xs text-status-running flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-running animate-pulse" />
              Streaming
            </span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm text-text-secondary overflow-auto bg-[#0a0a0a]">
            <div className="space-y-1">
              <div className="text-status-running">$ agent test-executor</div>
              <div className="text-text-muted">Running suite: auth</div>
              <div className="text-status-passed">✓ login_success (120ms)</div>
              <div className="text-status-passed">✓ login_failure (95ms)</div>
              <div className="text-status-failed">✗ token_refresh</div>
              <div className="text-status-failed ml-4">Error: 401 Unauthorized - Token expired</div>
              <div className="text-status-running">⠋ Running password_reset...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar + Stats */}
      <div className="bg-surface-card rounded-lg border border-surface-border p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-surface-dark rounded-full h-2 overflow-hidden">
            <div className="bg-status-running h-full rounded-full transition-all" style={{ width: '45%' }} />
          </div>
          <span className="text-sm font-medium text-text-primary">45%</span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: '通过', value: 68, icon: CheckCircle2, color: 'text-status-passed' },
            { label: '失败', value: 5, icon: XCircle, color: 'text-status-failed' },
            { label: '跳过', value: 2, icon: SkipForward, color: 'text-status-skipped' },
            { label: '错误', value: 0, icon: AlertCircle, color: 'text-status-failed' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-2">
                <Icon size={16} className={stat.color} />
                <span className="text-sm text-text-secondary">{stat.label}</span>
                <span className="text-sm font-bold text-text-primary">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Activity Panel */}
      <div className="bg-surface-card rounded-lg border border-surface-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Agent 活动</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: 'Main Agent B', status: 'running', detail: 'Running integration tests...' },
            { name: 'Sub-Agent B1', status: 'running', detail: 'Unit tests 75% complete' },
            { name: 'Sub-Agent B2', status: 'waiting', detail: 'Waiting for test env...' },
          ].map((agent) => (
            <div key={agent.name} className="flex items-center gap-3 p-2 rounded-md bg-surface-dark">
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.status === 'running' ? 'bg-status-running animate-pulse' : 'bg-status-skipped'
                }`}
              />
              <div>
                <div className="text-sm font-medium text-text-primary">{agent.name}</div>
                <div className="text-xs text-text-muted">{agent.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
