'use client';

import { useState } from 'react';
import {
  Wrench, Plus, Search, Code, FileText, Link, GitBranch,
} from 'lucide-react';

const skills = [
  { id: '1', name: 'prd-analyzer', description: '分析 PRD 文档，提取功能需求、边界情况和测试场景', tools: ['read_file', 'grep'], context: 'inline', usedBy: ['test-case-generator', 'prd-analyzer'], sessions: 203 },
  { id: '2', name: 'test-case-writer', description: '将分析结果编写为标准格式的测试用例', tools: ['write_file'], context: 'inline', usedBy: ['test-case-generator'], sessions: 178 },
  { id: '3', name: 'boundary-value-analyzer', description: '对输入输出进行边界值分析和等价类划分', tools: [], context: 'inline', usedBy: ['test-case-generator'], sessions: 156 },
  { id: '4', name: 'test-executor', description: '执行自动化测试，集成 Jest、Playwright 等框架', tools: ['read_file', 'bash', 'write_file'], context: 'fork', usedBy: ['test-executor'], sessions: 89 },
  { id: '5', name: 'failure-analyzer', description: '分析测试失败原因，定位根因并建议修复方案', tools: ['read_file', 'grep'], context: 'inline', usedBy: ['test-executor'], sessions: 67 },
];

export default function SkillsPage() {
  const [search, setSearch] = useState('');

  const filtered = skills.filter(s =>
    !search || s.name.includes(search) || s.description.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skill 管理</h1>
          <p className="text-sm text-slate-400 mt-1">管理和配置可复用的 Agent 技能定义</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
          <Plus size={15} /> 新建 Skill
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text" placeholder="搜索 Skill..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
        />
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(skill => (
          <div key={skill.id} className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Wrench size={16} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">{skill.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                    {skill.context === 'inline' ? 'inline' : 'fork'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-600">{skill.sessions} 次调用</span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">{skill.description}</p>

            {/* Used By */}
            <div className="mb-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Link size={10} /> 被使用
              </div>
              <div className="flex flex-wrap gap-1">
                {skill.usedBy.map(a => (
                  <span key={a} className="px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded text-[10px] border border-violet-500/20">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            {skill.tools.length > 0 && (
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Code size={10} /> 工具
                </div>
                <div className="flex flex-wrap gap-1">
                  {skill.tools.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded text-[10px] font-mono border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
