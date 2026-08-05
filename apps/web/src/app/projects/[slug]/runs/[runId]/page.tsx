'use client';

import Link from 'next/link';
import {
  Play, Square, CheckCircle2, XCircle, SkipForward, AlertCircle,
  Clock, ArrowLeft, Zap, Bot, Terminal, GanttChart,
} from 'lucide-react';

const phases = [
  { name: 'SETUP', status: 'passed', time: '12s' },
  { name: 'UNIT TESTS', status: 'running', progress: '75%', time: '2m 15s', current: true },
  { name: 'INTEGRATION', status: 'running', progress: '40%', time: '1m 08s' },
  { name: 'E2E TESTS', status: 'pending', time: '--' },
  { name: 'REPORTING', status: 'pending', time: '--' },
];

const recentLogs = [
  { type: 'info', text: '$ agent test-executor --suite auth,checkout,payment' },
  { type: 'info', text: 'Loading 150 test cases from suite "auth"...' },
  { type: 'success', text: '✓ login_success (120ms)' },
  { type: 'success', text: '✓ login_failure (95ms)' },
  { type: 'success', text: '✓ password_reset (210ms)' },
  { type: 'error', text: '✗ token_refresh — Error: 401 Unauthorized' },
  { type: 'error', text: '  Stack: at AuthService.refreshToken (auth.service.ts:45)' },
  { type: 'info', text: 'ⓘ Retrying token_refresh (attempt 1/2)...' },
  { type: 'running', text: '⠋ Running checkout_flow (3/12 steps)...' },
];

const agentActivities = [
  { name: 'Main Agent B', role: 'Orchestrator', status: 'running', detail: '编排 4 个子 Agent 并行执行', progress: 45 },
  { name: 'Sub-Agent B1', role: 'Unit Runner', status: 'running', detail: '单元测试 58/78 完成', progress: 75 },
  { name: 'Sub-Agent B2', role: 'Integration Runner', status: 'running', detail: '集成测试 18/45 完成', progress: 40 },
  { name: 'Sub-Agent B3', role: 'E2E Runner', status: 'waiting', detail: '等待测试环境就绪...', progress: 0 },
];

export default function ExecutionMonitorPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href=".." className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft size={14} />
            返回
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <div>
              <h1 className="text-lg font-bold text-white">Full Regression #42</h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock size={11} />
                已运行 3 分钟 · 预计剩余 5 分钟
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-sm font-medium border border-slate-700 transition-all">
            <Square size={14} /> 暂停
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/20 transition-all">
            <Square size={14} /> 取消执行
          </button>
        </div>
      </div>

      {/* Main Monitor Grid */}
      <div className="grid grid-cols-3 gap-4" style={{ minHeight: 'calc(100vh - 320px)' }}>
        {/* DAG Panel */}
        <div className="col-span-1 bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
            <GanttChart size={15} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">执行流程</h3>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {phases.map((phase, i) => (
              <div key={phase.name}>
                {i > 0 && (
                  <div className={`w-px h-3 ml-4 ${phase.status === 'passed' ? 'bg-emerald-500/40' : phase.status === 'running' ? 'bg-blue-400/40' : 'bg-slate-700'}`} />
                )}
                <div
                  className={`agent-node flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
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
                      'bg-slate-700/50 text-slate-500'
                    }`}>
                      {phase.status === 'passed' ? '✓' : phase.status === 'pending' ? '○' : `${i + 1}`}
                    </span>
                    <span className={`text-sm font-medium ${
                      phase.status === 'passed' ? 'text-emerald-300' :
                      phase.status === 'running' ? 'text-white' :
                      'text-slate-500'
                    }`}>
                      {phase.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {phase.status === 'running' && (
                      <div className="w-16 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all" style={{ width: phase.progress || '0%' }} />
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
        <div className="col-span-2 bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-white">实时日志</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Streaming
              </span>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-[#0a0d14]">
            {recentLogs.map((log, i) => (
              <div key={i} className={`leading-relaxed ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'error' ? 'text-red-400' :
                log.type === 'running' ? 'text-blue-400' :
                'text-slate-400'
              }`}>
                {log.text}
              </div>
            ))}
            <div className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      {/* Progress Bar + Stats */}
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700" style={{ width: '45%' }}>
              <div className="h-full w-full bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          <span className="text-sm font-bold text-white font-mono">45%</span>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: '通过', value: 68, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: '失败', value: 5, icon: XCircle, color: 'text-red-400' },
            { label: '跳过', value: 2, icon: SkipForward, color: 'text-amber-400' },
            { label: '错误', value: 0, icon: AlertCircle, color: 'text-red-400' },
            { label: '总计', value: 150, icon: Play, color: 'text-slate-400' },
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
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Bot size={15} className="text-slate-400" />
          Agent 活动
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {agentActivities.map((agent) => (
            <div
              key={agent.name}
              className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  agent.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                  agent.status === 'waiting' ? 'bg-amber-400' : 'bg-slate-500'
                }`} />
                <span className="text-xs font-medium text-slate-200 truncate">{agent.name}</span>
              </div>
              <div className="text-[10px] text-slate-500 mb-1.5">{agent.role}</div>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">{agent.detail}</p>
              {agent.progress > 0 && (
                <div className="w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      agent.status === 'running' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
