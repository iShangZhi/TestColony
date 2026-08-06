'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3, FileText, TestTube, Play, Settings, Bot,
  ChevronRight, ArrowLeft, Plus, Zap, TrendingUp,
  CheckCircle2, Clock, AlertCircle, Layers,
} from 'lucide-react';

const tabs = [
  { key: 'overview', label: '概览', icon: BarChart3 },
  { key: 'prds', label: 'PRDs', icon: FileText },
  { key: 'cases', label: '测试用例', icon: TestTube },
  { key: 'agents', label: 'Agents', icon: Bot },
  { key: 'runs', label: '执行历史', icon: Play },
];

const stats = [
  { label: 'PRDs', value: 3, sub: '2 已分析', icon: FileText, trend: '+1' },
  { label: '测试用例', value: 142, sub: '85 已自动化', icon: TestTube, trend: '+12' },
  { label: '测试执行', value: 28, sub: '94.2% 通过率', icon: Play, trend: '+3' },
  { label: '活跃 Agents', value: 5, sub: '2 运行中', icon: Bot, trend: '' },
];

const recentRuns = [
  { id: '1', name: 'Full Regression #42', date: '2 分钟前', status: 'completed', passRate: '94.7%', passed: 142, total: 150 },
  { id: '2', name: 'Smoke Tests #41', date: '1 小时前', status: 'completed', passRate: '100%', passed: 45, total: 45 },
  { id: '3', name: 'API Tests #40', date: '3 小时前', status: 'failed', passRate: '87.2%', passed: 68, total: 78 },
];

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={14} />
            项目
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Layers size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Shop API</h1>
              <p className="text-xs text-slate-400">电商平台后端服务 · 3 个 PRD · 142 个用例</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 transition-all">
            <Settings size={15} />
            设置
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
            <Zap size={15} />
            生成测试用例
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all">
            <Play size={15} />
            执行测试
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-surface-DEFAULT/70 rounded-xl p-1 border border-surface-border/70">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (<>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group bg-surface-DEFAULT/80 rounded-xl p-5 border border-surface-border/70 hover:border-slate-600/50 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-surface-card/70 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                  <Icon size={17} className="text-slate-300" />
                </div>
                {stat.trend && (
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Test Runs */}
        <div className="col-span-2 bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border/70 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Play size={16} className="text-slate-400" />
              最近执行记录
            </h3>
            <Link href="runs" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700/30">
            {recentRuns.map((run) => (
              <Link
                key={run.id}
                href={`runs/${run.id}`}
                className="flex items-center px-5 py-3.5 hover:bg-surface-card/50 transition-colors group"
              >
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    run.status === 'completed' ? 'bg-emerald-400' : 'bg-red-400'
                  }`} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{run.name}</div>
                    <div className="text-xs text-slate-500">{run.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-sm font-mono font-semibold ${
                      run.status === 'completed' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {run.passRate}
                    </div>
                    <div className="text-xs text-slate-500">{run.passed}/{run.total} 通过</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-surface-DEFAULT/80 rounded-xl p-5 border border-surface-border/70 hover:border-violet-700/30 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3 group-hover:bg-violet-500/30 transition-colors">
              <Bot size={17} className="text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">AI 生成用例</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              选择 PRD，让主 Agent A 自动分析并生成全覆盖的测试用例
            </p>
            <button className="w-full py-2.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 rounded-lg text-sm font-medium transition-colors border border-violet-600/20">
              开始生成 →
            </button>
          </div>

          <div className="bg-surface-DEFAULT/80 rounded-xl p-5 border border-surface-border/70 hover:border-emerald-700/30 transition-all group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3 group-hover:bg-emerald-500/30 transition-colors">
              <Play size={17} className="text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">执行自动化测试</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              让主 Agent B 编排多个子 Agent 并行执行测试并生成报告
            </p>
            <button className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-sm font-medium transition-colors border border-emerald-600/20">
              开始执行 →
            </button>
          </div>
        </div>
      </div>

      </>)}
      {/* Other tab placeholders with links */}
      {activeTab === 'prds' && (
        <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-12 text-center">
          <FileText size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-4">管理和创建 PRD 需求文档</p>
          <Link href="prds" className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-300 rounded-lg text-sm hover:bg-violet-600/30 transition-colors">
            进入 PRD 管理 →</Link>
        </div>
      )}
      {activeTab === 'cases' && (
        <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-12 text-center">
          <TestTube size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-1">142 个测试用例 · 85 已自动化</p>
          <p className="text-slate-600 text-xs">选择 PRD 后使用 AI 生成测试用例</p>
        </div>
      )}
      {activeTab === 'agents' && (
        <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-12 text-center">
          <Bot size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-1">5 个 Agent 配置</p>
          <p className="text-slate-600 text-xs">主 Agent A + 主 Agent B + 3 个子 Agent</p>
        </div>
      )}
      {activeTab === 'runs' && (
        <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-12 text-center">
          <Play size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-1">28 次执行记录</p>
          <p className="text-slate-600 text-xs">最近通过率: 94.2%</p>
        </div>
      )}
    </div>
  );
}
