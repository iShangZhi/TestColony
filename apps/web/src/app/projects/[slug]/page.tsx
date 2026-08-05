'use client';

import { useParams } from 'next/navigation';
import { FileText, TestTube, Play, BarChart3, Settings, Bot } from 'lucide-react';
import Link from 'next/link';

const tabs = [
  { key: 'overview', label: '概览', icon: BarChart3 },
  { key: 'prds', label: 'PRDs', icon: FileText },
  { key: 'cases', label: '测试用例', icon: TestTube },
  { key: 'agents', label: 'Agents', icon: Bot },
  { key: 'runs', label: '执行历史', icon: Play },
  { key: 'settings', label: '设置', icon: Settings },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/projects" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            ← 返回项目列表
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mt-1">{slug}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
            生成测试用例
          </button>
          <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm font-medium transition-colors">
            执行测试
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-surface-card rounded-lg p-1 border border-surface-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab.key === 'overview'
                  ? 'bg-primary/20 text-primary-light'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'PRDs', value: '3', sub: '2 analyzed' },
          { label: '测试用例', value: '142', sub: '85 automated' },
          { label: '测试执行', value: '28', sub: '94.2% pass rate' },
          { label: '活跃 Agents', value: '5', sub: '2 running' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-card rounded-lg p-4 border border-surface-border">
            <div className="text-sm text-text-secondary mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className="text-xs text-text-muted mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-card rounded-lg p-6 border border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Bot size={20} className="text-primary-light" />
            AI 测试用例生成
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            选择 PRD 文档，让 AI (主 Agent A) 自动生成全面的测试用例
          </p>
          <button className="px-4 py-2 bg-primary/20 text-primary-light rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors">
            开始生成 →
          </button>
        </div>

        <div className="bg-surface-card rounded-lg p-6 border border-surface-border">
          <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Play size={20} className="text-status-running" />
            自动化测试执行
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            选择测试套件，让 AI (主 Agent B) 自动执行测试并生成报告
          </p>
          <button className="px-4 py-2 bg-status-running/20 text-status-running rounded-lg text-sm font-medium hover:bg-status-running/30 transition-colors">
            开始执行 →
          </button>
        </div>
      </div>
    </div>
  );
}
