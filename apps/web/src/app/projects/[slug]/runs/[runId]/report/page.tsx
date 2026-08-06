'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Download, CheckCircle2, XCircle, SkipForward, AlertCircle,
  Clock, Zap, TrendingUp, FileText, Share2, Bot,
} from 'lucide-react';

export default function TestReportPage() {
  const params = useParams();
  const slug = params.slug as string;
  const runId = params.runId as string;

  const { data: run } = useQuery({
    queryKey: ['run', runId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/projects/any/runs/${runId}`);
      return res.json();
    },
    refetchInterval: 5000,
  });

  if (!run) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const results = run.results || [];
  const passed = results.filter((r: any) => r.status === 'passed').length;
  const failed = results.filter((r: any) => r.status === 'failed').length;
  const skipped = results.filter((r: any) => r.status === 'skipped').length;
  const errors = results.filter((r: any) => r.status === 'error').length;
  const total = results.length || run.totalCases;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href=".." className="text-sm text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 flex items-center gap-1">
            <ArrowLeft size={14} /> 返回
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{run.name || 'Test Report'}</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            run.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
            run.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            {run.status === 'completed' ? '已完成' : run.status === 'running' ? '执行中' : run.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Share2 size={14} /> 分享
          </button>
          <a href={`/api/v1/projects/any/runs/${runId}/export/junit`} download className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors">
            <Download size={14} /> JUnit XML
          </a>
          <a href={`/api/v1/projects/any/runs/${runId}/export/csv`} download className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Download size={14} /> CSV
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: '总计', value: total, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: '通过', value: passed, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: '失败', value: failed, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
          { label: '跳过', value: skipped, icon: SkipForward, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: '通过率', value: `${passRate}%`, icon: TrendingUp, color: passRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400', bg: passRate >= 90 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 dark:border-slate-700/50`}>
              <div className="flex items-center gap-2 mb-2"><Icon size={16} className={s.color} /><span className="text-xs text-gray-500 dark:text-slate-400">{s.label}</span></div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-4">
        <div className="h-4 rounded-full overflow-hidden flex">
          {passed > 0 && <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(passed / total) * 100}%` }} />}
          {failed > 0 && <div className="bg-red-400 h-full transition-all" style={{ width: `${(failed / total) * 100}%` }} />}
          {skipped > 0 && <div className="bg-amber-400 h-full transition-all" style={{ width: `${(skipped / total) * 100}%` }} />}
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 通过 {passed}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> 失败 {failed}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 跳过 {skipped}</span>
        </div>
      </div>

      {/* Duration + Meta */}
      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><Clock size={14} /> 总耗时: {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : 'N/A'}</span>
        <span>触发: {run.triggerType === 'ai_agent' ? 'AI Agent B' : run.triggerType}</span>
        <span>开始: {run.startedAt ? new Date(run.startedAt).toLocaleString('zh-CN') : 'N/A'}</span>
      </div>

      {/* Failed Tests with AI Analysis */}
      {failed > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bot size={18} className="text-violet-500" /> 失败用例分析
          </h3>
          <div className="space-y-3">
            {results.filter((r: any) => r.status === 'failed').slice(0, 10).map((r: any) => (
              <div key={r.id} className="bg-white dark:bg-slate-800/80 rounded-xl border border-red-200 dark:border-red-500/20 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{r.testCase?.title || 'Unknown test'}</h4>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono">{r.errorMessage || 'No error message'}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{r.durationMs}ms</span>
                </div>
                {r.aiAnalysis ? (
                  <div className="bg-violet-50 dark:bg-violet-500/5 rounded-lg p-3 border border-violet-100 dark:border-violet-500/10">
                    <div className="text-xs font-medium text-violet-700 dark:text-violet-300 mb-1 flex items-center gap-1">
                      <Bot size={12} /> AI 分析
                    </div>
                    <p className="text-xs text-violet-600 dark:text-violet-400 leading-relaxed">{r.aiAnalysis}</p>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      await fetch(`/api/v1/projects/any/runs/${r.testRunId}/analyze`, { method: 'POST' });
                      window.location.reload();
                    }}
                    className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
                  >
                    <Zap size={12} /> AI 分析失败原因
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Results Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">全部结果 ({total})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/30">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 dark:text-slate-400">用例</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 dark:text-slate-400">状态</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 dark:text-slate-400">耗时</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 dark:text-slate-400">错误</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/30">
              {results.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/10">
                  <td className="px-4 py-2.5 text-gray-800 dark:text-slate-200 font-medium">{r.testCase?.title || r.id}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      r.status === 'passed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      r.status === 'failed' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                    }`}>
                      {r.status === 'passed' ? <CheckCircle2 size={10} /> : r.status === 'failed' ? <XCircle size={10} /> : <SkipForward size={10} />}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400 font-mono text-xs">{r.durationMs}ms</td>
                  <td className="px-4 py-2.5 text-xs text-red-600 dark:text-red-400 max-w-xs truncate">{r.errorMessage || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
