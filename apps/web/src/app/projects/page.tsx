'use client';

import Link from 'next/link';
import {
  FolderOpen, Plus, ArrowRight, FileText, TestTube, Play,
  MoreHorizontal, BarChart3, Clock,
} from 'lucide-react';

const projects = [
  {
    id: 'shop-api', name: 'Shop API', description: '电商平台后端服务 · API 自动化测试',
    prds: 3, cases: 142, runs: 28, passRate: '94.2%',
    updatedAt: '10 分钟前', status: 'active',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'user-portal', name: 'User Portal', description: '用户管理门户网站 · E2E 测试',
    prds: 2, cases: 87, runs: 15, passRate: '98.7%',
    updatedAt: '1 小时前', status: 'active',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'payment-svc', name: 'Payment Service', description: '支付服务微服务 · 集成测试',
    prds: 1, cases: 56, runs: 10, passRate: '89.1%',
    updatedAt: '3 小时前', status: 'active',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'notification-svc', name: 'Notification Service', description: '消息通知服务 · 单元测试',
    prds: 1, cases: 34, runs: 6, passRate: '100%',
    updatedAt: '昨天', status: 'active',
    color: 'from-amber-500 to-orange-600',
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">项目</h1>
          <p className="text-sm text-slate-400 mt-1">管理和创建测试项目</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 transition-all">
            <FolderOpen size={15} />
            导入项目
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
            <Plus size={15} />
            新建项目
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}>
                <FolderOpen size={20} className="text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {project.status === 'active' ? '活跃' : project.status}
                </span>
                <button className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{project.name}</h3>
            <p className="text-sm text-slate-400 mb-5">{project.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText size={12} /> {project.prds} PRDs
                </span>
                <span className="flex items-center gap-1">
                  <TestTube size={12} /> {project.cases} 用例
                </span>
                <span className="flex items-center gap-1">
                  <Play size={12} /> {project.runs} 次执行
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-mono font-semibold text-emerald-400">{project.passRate}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} />
                    {project.updatedAt}
                  </div>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </Link>
        ))}

        {/* New Project Card */}
        <button className="bg-slate-800/40 rounded-xl p-6 border-2 border-dashed border-slate-700/50 hover:border-violet-600/50 hover:bg-slate-800/60 transition-all flex flex-col items-center justify-center min-h-[200px] text-slate-500 hover:text-violet-400 group">
          <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-sm font-medium">创建新项目</span>
          <span className="text-xs text-slate-600 mt-1">开始一个新的测试项目</span>
        </button>
      </div>
    </div>
  );
}
