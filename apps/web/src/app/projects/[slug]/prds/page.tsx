'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  FileText, Plus, Upload, ArrowLeft, ChevronRight, Eye, Trash2, Zap,
  Clock, CheckCircle2, FileWarning,
} from 'lucide-react';
import { api } from '@/lib/api-client';

export default function PrdsPage({ params }: { params: { slug: string } }) {
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: prds = [], isLoading } = useQuery({
    queryKey: ['prds', params.slug],
    queryFn: async () => {
      try {
        // Get project ID from slug - use the dashboard data
        const projResp = await api.getProjects(1, 100);
        const project = projResp.data?.find((p: any) => p.slug === params.slug);
        if (!project) return [];
        return api.getPrds(project.id);
      } catch { return []; }
    },
  });

  const createPrd = useMutation({
    mutationFn: async () => {
      const projResp = await api.getProjects(1, 100);
      const project = projResp.data?.find((p: any) => p.slug === params.slug);
      if (!project) throw new Error('Project not found');
      return api.createPrd(project.id, { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prds'] });
      setShowNew(false);
      setTitle('');
      setContent('');
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href=".." className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> 返回
          </Link>
          <ChevronRight size={14} className="text-slate-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">PRD 文档</h1>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all"
        >
          <Plus size={15} /> 新建 PRD
        </button>
      </div>

      {/* New PRD Form */}
      {showNew && (
        <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-6 space-y-4">
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="PRD 标题..."
            className="w-full px-4 py-2.5 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
          />
          <textarea
            value={content} onChange={e => setContent(e.target.value)}
            placeholder="编写 PRD 内容 (支持 Markdown)..."
            rows={12}
            className="w-full px-4 py-2.5 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 font-mono resize-y"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">支持 Markdown 格式</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">取消</button>
              <button
                onClick={() => createPrd.mutate()}
                disabled={!title || !content || createPrd.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Upload size={14} /> {createPrd.isPending ? '创建中...' : '创建 PRD'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRD List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-sm">加载中...</div>
        ) : prds.length === 0 ? (
          <div className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-12 text-center">
            <FileText size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-1">还没有 PRD 文档</p>
            <p className="text-slate-600 text-xs">点击「新建 PRD」创建第一个需求文档</p>
          </div>
        ) : (
          prds.map((prd: any) => (
            <div key={prd.id} className="bg-surface-DEFAULT/80 rounded-xl border border-surface-border/70 p-5 hover:border-slate-600/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    prd.status === 'ready' ? 'bg-emerald-500/20' :
                    prd.status === 'analyzing' ? 'bg-amber-500/20' : 'bg-surface-card/70'
                  }`}>
                    <FileText size={16} className={
                      prd.status === 'ready' ? 'text-emerald-400' :
                      prd.status === 'analyzing' ? 'text-amber-400' : 'text-slate-400'
                    } />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{prd.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>v{prd.version}</span>
                      <span>·</span>
                      <span className={`flex items-center gap-1 ${
                        prd.status === 'ready' ? 'text-emerald-400' :
                        prd.status === 'analyzing' ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {prd.status === 'ready' ? <CheckCircle2 size={10} /> :
                         prd.status === 'analyzing' ? <Clock size={10} /> :
                         <FileWarning size={10} />}
                        {prd.status === 'ready' ? '已就绪' :
                         prd.status === 'analyzing' ? '分析中' : '草稿'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-md text-slate-400 hover:text-violet-400 hover:bg-slate-700 transition-colors">
                    <Zap size={14} />
                  </button>
                  <button className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 ml-12">{prd.content?.substring(0, 200)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
