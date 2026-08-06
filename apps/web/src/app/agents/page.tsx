'use client';

import { useState } from 'react';
import {
  Bot, Plus, Search, MoreHorizontal, Zap, Code, Cpu, Clock,
  Play, Pause, Settings, Trash2, Edit3, CheckCircle2,
} from 'lucide-react';

const agents = [
  {
    id: '1', name: 'test-case-generator', type: '主 Agent A',
    model: 'deepseek-chat', temperature: '0.3', maxTokens: '8192',
    skills: ['prd-analyzer', 'test-case-writer', 'boundary-value-analyzer'],
    tools: ['read_file', 'write_file', 'web_search', 'grep'],
    status: 'active', lastUsed: '10 分钟前', sessions: 47,
  },
  {
    id: '2', name: 'test-executor', type: '主 Agent B',
    model: 'deepseek-chat', temperature: '0.2', maxTokens: '8192',
    skills: ['test-executor', 'failure-analyzer'],
    tools: ['read_file', 'write_file', 'bash', 'grep'],
    status: 'active', lastUsed: '2 小时前', sessions: 28,
  },
  {
    id: '3', name: 'prd-analyzer', type: '子 Agent',
    model: 'deepseek-chat', temperature: '0.2', maxTokens: '4096',
    skills: ['prd-analyzer'],
    tools: ['read_file', 'grep'],
    status: 'idle', lastUsed: '1 天前', sessions: 156,
  },
  {
    id: '4', name: 'code-reviewer', type: '子 Agent',
    model: 'deepseek-reasoner', temperature: '0.1', maxTokens: '4096',
    skills: [],
    tools: ['read_file', 'grep', 'bash'],
    status: 'disabled', lastUsed: '从未', sessions: 0,
  },
];

export default function AgentsPage() {
  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(agents[0]!);

  const filtered = agents.filter(a =>
    !search || a.name.includes(search) || a.type.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent 管理</h1>
          <p className="text-sm text-slate-400 mt-1">管理和配置 AI Agent 定义</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
          <Plus size={15} /> 新建 Agent
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="col-span-1 bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-3 border-b border-slate-700/50">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text" placeholder="搜索 Agent..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-700/30 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-[calc(100vh-280px)] overflow-auto">
            {filtered.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-700/30 transition-colors ${
                  selectedAgent.id === agent.id ? 'bg-slate-700/40 border-l-2 border-l-violet-500' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    agent.status === 'active' ? 'bg-emerald-500/20' :
                    agent.status === 'idle' ? 'bg-slate-700/50' : 'bg-slate-700/30'
                  }`}>
                    <Bot size={13} className={
                      agent.status === 'active' ? 'text-emerald-400' :
                      agent.status === 'idle' ? 'text-slate-400' : 'text-slate-600'
                    } />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{agent.name}</span>
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    agent.status === 'active' ? 'bg-emerald-400' :
                    agent.status === 'idle' ? 'bg-slate-500' : 'bg-slate-700'
                  }`} />
                </div>
                <div className="text-xs text-slate-500 ml-9.5">{agent.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Detail */}
        <div className="col-span-2 bg-slate-800/60 rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                <p className="text-xs text-slate-400">{selectedAgent.type} · 模型: {selectedAgent.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg ${
                selectedAgent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                selectedAgent.status === 'idle' ? 'bg-slate-700/50 text-slate-400 border border-slate-700' :
                'bg-slate-700/30 text-slate-500 border border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedAgent.status === 'active' ? 'bg-emerald-400' :
                  selectedAgent.status === 'idle' ? 'bg-slate-500' : 'bg-slate-700'
                }`} />
                {selectedAgent.status === 'active' ? '活跃' : selectedAgent.status === 'idle' ? '空闲' : '禁用'}
              </span>
            </div>
          </div>

          {/* Config Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: '模型', value: selectedAgent.model, icon: Cpu },
              { label: 'Temperature', value: selectedAgent.temperature, icon: Code },
              { label: 'Max Tokens', value: selectedAgent.maxTokens, icon: Zap },
              { label: '会话数', value: String(selectedAgent.sessions), icon: Play },
              { label: '最后活跃', value: selectedAgent.lastUsed, icon: Clock },
              { label: 'Sub-Agent 深度', value: '3 层 / 5 并行', icon: Bot },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-slate-700/30 rounded-lg p-3 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <Icon size={11} /> {item.label}
                  </div>
                  <div className="text-sm font-medium text-slate-200">{item.value}</div>
                </div>
              );
            })}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">关联 Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedAgent.skills.length > 0 ? selectedAgent.skills.map(s => (
                <span key={s} className="px-2.5 py-1 bg-violet-500/10 text-violet-300 rounded-md text-xs border border-violet-500/20">
                  {s}
                </span>
              )) : <span className="text-xs text-slate-500">无</span>}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">可用工具</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedAgent.tools.map(t => (
                <span key={t} className="px-2.5 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-mono border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
