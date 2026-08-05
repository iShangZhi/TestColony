'use client';

import { FolderOpen, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const projects = [
  { id: '1', slug: 'shop-api', name: 'Shop API', description: '电商平台后端 API 测试', prds: 3, cases: 142, runs: 28, status: 'active' },
  { id: '2', slug: 'user-portal', name: 'User Portal', description: '用户管理门户网站', prds: 2, cases: 87, runs: 15, status: 'active' },
  { id: '3', slug: 'payment-svc', name: 'Payment Service', description: '支付服务微服务', prds: 1, cases: 56, runs: 10, status: 'active' },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">项目</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="bg-surface-card rounded-lg p-5 border border-surface-border hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <FolderOpen size={20} className="text-primary-light" />
              </div>
              <ArrowRight size={16} className="text-text-muted group-hover:text-primary-light transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">{project.name}</h3>
            <p className="text-sm text-text-muted mb-4">{project.description}</p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>{project.prds} PRDs</span>
              <span>{project.cases} 用例</span>
              <span>{project.runs} 次执行</span>
            </div>
          </Link>
        ))}

        {/* New Project Card */}
        <button className="bg-surface-card rounded-lg p-5 border-2 border-dashed border-surface-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[180px] text-text-muted hover:text-primary-light">
          <Plus size={32} className="mb-2" />
          <span className="text-sm font-medium">创建新项目</span>
        </button>
      </div>
    </div>
  );
}
