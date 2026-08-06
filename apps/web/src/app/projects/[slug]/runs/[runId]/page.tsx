'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Play, Square, CheckCircle2, XCircle, SkipForward, AlertCircle,
  Clock, ArrowLeft, Bot, Terminal, GanttChart,
} from 'lucide-react';
import { useExecutionWebSocket } from '@/hooks/useWebSocket';
import { useExecutionStore } from '@/stores/execution-store';

export default function ExecutionMonitorPage() {
  const params = useParams();
  const runId = params.runId as string;
  const store = useExecutionStore();

  // Connect to WebSocket for real-time updates
  useExecutionWebSocket(runId);

  const phases = [
    { name: 'SETUP', status: store.status === 'running' || store.status === 'completed' ? 'passed' : 'pending' as const, time: store.status !== 'idle' ? '完成' : '--' },
    { name: 'UNIT TESTS', status: (store.phase === 'unit_tests' || store.phase === 'integration' || store.phase === 'e2e' || store.status === 'completed') ? (store.phase === 'unit_tests' ? 'running' as const : 'passed' as const) : 'pending' as const, progress: store.phase === 'unit_tests' ? `${Math.round(store.completedCases / Math.max(store.totalCases, 1) * 100)}%` : undefined, time: store.phase === 'unit_tests' ? '执行中' : store.status === 'completed' ? '完成' : '--', current: store.phase === 'unit_tests' },
    { name: 'INTEGRATION', status: (store.phase === 'integration' || store.phase === 'e2e' || store.status === 'completed') ? (store.phase === 'integration' ? 'running' as const : 'passed' as const) : 'pending' as const, progress: store.phase === 'integration' ? '40%' : undefined, time: store.phase === 'integration' ? '执行中' : '--', current: store.phase === 'integration' },
    { name: 'E2E TESTS', status: store.phase === 'e2e' ? 'running' as const : store.status === 'completed' ? 'passed' as const : 'pending' as const, time: '--', current: store.phase === 'e2e' },
    { name: 'REPORTING', status: store.status === 'completed' ? 'passed' as const : 'pending' as const, time: store.status === 'completed' ? '完成' : '--' },
  ];

  const logs = store.logs.length > 0
    ? store.logs.slice(-20)
    : [
        'ⓘ 等待执行开始...',
        '  访问 POST /api/v1/projects/:id/runs 启动测试',
        '  或点击项目页面的「执行测试」按钮',
      ];

  const progress = store.totalCases > 0 ? Math.round(store.completedCases / store.totalCases * 100) : 0;
  const total = store.totalCases || 150;

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href=".." className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={14} /> 返回
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${
              store.status === 'running' ? 'bg-emerald-400 animate-pulse shadow-emerald-400/50' :
              store.status === 'completed' ? 'bg-emerald-400' :
              store.status === 'failed' ? 'bg-red-400' : 'bg-slate-500'
            }`} />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Agent B 执行: {runId.substring(0, 8)}</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock size={11} />
                {store.status === 'running' ? `执行中 · ${store.completedCases}/${store.totalCases}` :
                 store.status === 'completed' ? `已完成 · ${store.passedCases}/${store.totalCases} 通过` :
                 store.status === 'idle' ? '等待开始' : store.status}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {store.status === 'running' && (
            <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-sm font-medium border border-slate-700 transition-all">
              <Square size={14} /> 暂停
            </button>
          )}
          <button className="flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/20 transition-all">
            <Square size={14} /> 取消执行
          </button>
        </div>
      </div>

      {/* Main Monitor Grid */}
      <div className="grid grid-cols-3 gap-4" style={{ minHeight: 'calc(100vh - 320px)' }}>
        {/* DAG Panel */}
        <div className="col-span-1 bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-surface-border/70 flex items-center gap-2">
            <GanttChart size={15} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">执行流程</h3>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {phases.map((phase, i) => (
              <div key={phase.name}>
                {i > 0 && (
                  <div className={`w-px h-3 ml-4 ${phase.status === 'passed' ? 'bg-emerald-500/40' : phase.status === 'running' ? 'bg-blue-400/40' : 'bg-slate-700'}`} />
                )}
                <div className={`agent-node flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  phase.current
                    ? 'border-blue-400/50 bg-blue-500/5 shadow-lg shadow-blue-500/10'
                    : phase.status === 'passed'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : phase.status === 'running'
                        ? 'border-blue-400/30 bg-blue-500/5'
                        : ''
                }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      phase.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                      phase.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-surface-card/70 text-slate-500'
                    }`}>
                      {phase.status === 'passed' ? '✓' : phase.status === 'pending' ? '○' : `${i + 1}`}
                    </span>
                    <span className={`text-sm font-medium ${
                      phase.status === 'passed' ? 'text-emerald-300' :
                      phase.status === 'running' ? 'text-white' :
                      'text-slate-500'
                    }`}>{phase.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {phase.progress && (
                      <div className="w-16 bg-surface-card/70 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all" style={{ width: phase.progress }} />
                      </div>
                    )}
                    <span className="text-xs text-slate-500 font-mono w-12 text-right">{phase.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Log */}
        <div className="col-span-2 bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-surface-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">实时日志</h3>
            </div>
            {store.status === 'running' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Streaming
              </span>
            )}
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-app-input">
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed text-slate-400">
                {log}
              </div>
            ))}
            {store.status === 'running' && <div className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5" />}
          </div>
        </div>
      </div>

      {/* Progress Bar + Stats */}
      <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-surface-card/70 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: `${progress}%` }}>
              {store.status === 'running' && <div className="h-full w-full bg-white/20 animate-pulse rounded-full" />}
            </div>
          </div>
          <span className="text-sm font-bold text-white font-mono">{progress}%</span>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: '通过', value: store.passedCases, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: '失败', value: store.failedCases, icon: XCircle, color: 'text-red-400' },
            { label: '跳过', value: store.skippedCases, icon: SkipForward, color: 'text-amber-400' },
            { label: '错误', value: store.errorCases, icon: AlertCircle, color: 'text-red-400' },
            { label: '总计', value: total, icon: Play, color: 'text-slate-400' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-2">
                <Icon size={15} className={stat.color} />
                <span className="text-xs text-slate-400">{stat.label}</span>
                <span className="text-sm font-bold text-white font-mono">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Activity */}
      <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Bot size={15} className="text-slate-400" />
          Agent B 执行状态
        </h3>
        <div className="text-sm text-slate-400">
          {store.status === 'running' && <>正在执行测试用例... {store.completedCases}/{store.totalCases} 完成</>}
          {store.status === 'completed' && <>执行完成 · {store.passedCases} 通过 / {store.failedCases} 失败</>}
          {store.status === 'idle' && <>等待触发测试执行</>}
          {store.status === 'failed' && <>执行出错</>}
        </div>
      </div>
    </div>
  );
}
