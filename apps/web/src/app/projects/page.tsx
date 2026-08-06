'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  FolderOpen, Plus, ArrowRight, FileText, TestTube, Play,
  MoreHorizontal, Clock, Search, X, AlertCircle, Trash2,
  Layers, CheckCircle2, ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api-client';

const colorVariants = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
];

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch projects from API
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(1, 100),
  });

  const projects = data?.data || [];
  const filtered = !search ? projects : projects.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  // Create mutation
  const createProject = useMutation({
    mutationFn: () => api.createProject({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowCreate(false); setName(''); setSlug(''); setDescription(''); setFormError('');
    },
    onError: (e: any) => setFormError(e.message),
  });

  // Delete mutation
  const deleteProject = useMutation({
    mutationFn: (id: string) => api.createProject({ name: '', slug: '' }), // placeholder, need real delete endpoint
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteTarget(null);
    },
  });

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">项目</h1>
          <p className="text-sm text-slate-400 mt-1">
            {projects.length > 0 ? `管理 ${projects.length} 个测试项目` : '创建你的第一个测试项目'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text" placeholder="搜索项目..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-48 pl-9 pr-3 py-2 bg-surface-DEFAULT/80 border border-surface-border/70 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all"
          >
            <Plus size={15} /> 新建项目
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-dashed border-gray-300 dark:border-slate-700/50 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Layers size={28} className="text-gray-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">还没有项目</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            创建你的第一个测试项目，上传 PRD 文档，让 AI Agent 帮你生成和执行测试用例
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all"
          >
            <Plus size={16} /> 创建项目
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-6 animate-pulse">
              <div className="w-10 h-10 bg-surface-card/70 rounded-xl mb-4" />
              <div className="w-2/3 h-4 bg-surface-card/70 rounded mb-2" />
              <div className="w-1/2 h-3 bg-surface-card/50 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Project Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project: any, i: number) => (
            <div key={project.id} className="group relative bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 hover:border-slate-600/50 hover:shadow-lg transition-all">
              <Link href={`/projects/${project.slug}`} className="block p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorVariants[i % colorVariants.length]} flex items-center justify-center shadow-lg`}>
                    <FolderOpen size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 活跃
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{project.name}</h3>
                <p className="text-sm text-slate-400 mb-5 line-clamp-1">{project.description || '暂无描述'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText size={12} /> {project._count?.prds || 0} PRDs</span>
                    <span className="flex items-center gap-1"><TestTube size={12} /> {project._count?.testSuites || 0} Suites</span>
                    <span className="flex items-center gap-1"><Play size={12} /> {project._count?.testRuns || 0} Runs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
              {/* Delete button */}
              <button
                onClick={(e) => { e.preventDefault(); setDeleteTarget(project.id); }}
                className="absolute top-3 right-3 p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Quick Create Card */}
          <button
            onClick={() => setShowCreate(true)}
            className="bg-surface-DEFAULT/60 rounded-xl border-2 border-dashed border-surface-border/70 hover:border-violet-600/50 hover:bg-surface-DEFAULT/80 transition-all flex flex-col items-center justify-center min-h-[180px] text-slate-500 hover:text-violet-400 group"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-card/70 flex items-center justify-center mb-3 group-hover:bg-violet-500/20 transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-sm font-medium">创建新项目</span>
            <span className="text-xs text-slate-600 mt-1">开始一个新的测试项目</span>
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-surface-border/70 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">新建项目</h2>
                <p className="text-xs text-slate-400 mt-0.5">填写项目基本信息开始测试</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  项目名称 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" value={name} onChange={e => handleNameChange(e.target.value)}
                  placeholder="例如: Shop API"
                  className="w-full px-3 py-2.5 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  标识符 (slug)
                </label>
                <input
                  type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  placeholder="shop-api"
                  className="w-full px-3 py-2.5 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
                />
                <p className="text-[10px] text-slate-600 mt-1">URL 中使用的唯一标识，留白自动生成</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">描述</label>
                <textarea
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="项目的简要描述..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => createProject.mutate()}
                  disabled={!name.trim() || createProject.isPending}
                  className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 transition-all"
                >
                  {createProject.isPending ? '创建中...' : '创建项目'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-sm mx-4 p-6 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">确认删除</h3>
            <p className="text-sm text-slate-400 mb-6">
              此操作不可撤销。项目及其关联的 PRD、用例、执行记录将被永久删除。
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => deleteProject.mutate(deleteTarget)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
