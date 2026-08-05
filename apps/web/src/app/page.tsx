'use client';

import { BarChart3, FolderOpen, Play, CheckCircle2, Bot, Activity } from 'lucide-react';

const stats = [
  { label: '项目总数', value: '12', icon: FolderOpen, color: 'text-primary-light' },
  { label: '活跃 Run', value: '3', icon: Play, color: 'text-status-running' },
  { label: '通过率 (7天)', value: '94.2%', icon: CheckCircle2, color: 'text-status-passed' },
  { label: 'Agent 会话', value: '8', icon: Bot, color: 'text-primary-light' },
];

const activities = [
  { time: '2 分钟前', text: 'Test run completed - 142/150 passed', type: 'run' },
  { time: '5 分钟前', text: 'Agent A generated 38 test cases', type: 'agent' },
  { time: '1 小时前', text: 'PRD "Checkout v2" analyzed', type: 'prd' },
  { time: '3 小时前', text: 'Project "Shop API" created', type: 'project' },
];

const activeSessions = [
  { name: 'test-executor', status: 'running', detail: 'Running E2E tests (45%)' },
  { name: 'test-generator', status: 'waiting', detail: 'Waiting for user input' },
  { name: 'prd-analyzer', status: 'idle', detail: 'Idle' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">仪表盘</h2>
        <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
          + 新建项目
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface-card rounded-lg p-4 border border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm">{stat.label}</span>
                <Icon size={20} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="col-span-2 bg-surface-card rounded-lg p-6 border border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary-light" />
            测试执行趋势
          </h3>
          <div className="h-64 flex items-center justify-center text-text-muted text-sm">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-30" />
              <p>趋势图将在首次测试执行后显示</p>
              <p className="mt-1">运行测试以查看通过率趋势</p>
            </div>
          </div>
        </div>

        {/* Active Agent Sessions */}
        <div className="bg-surface-card rounded-lg p-6 border border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Bot size={20} className="text-primary-light" />
            活跃 Agent 会话
          </h3>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.name} className="flex items-center gap-3 p-2 rounded-md">
                <span
                  className={`w-2 h-2 rounded-full ${
                    session.status === 'running'
                      ? 'bg-status-running'
                      : session.status === 'waiting'
                        ? 'bg-status-skipped'
                        : 'bg-status-pending'
                  }`}
                />
                <div>
                  <div className="text-sm font-medium text-text-primary">{session.name}</div>
                  <div className="text-xs text-text-muted">{session.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface-card rounded-lg p-6 border border-surface-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Activity size={20} className="text-primary-light" />
          最近活动
        </h3>
        <div className="space-y-3">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-text-muted w-20 flex-shrink-0">{activity.time}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light flex-shrink-0" />
              <span className="text-text-secondary">{activity.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
