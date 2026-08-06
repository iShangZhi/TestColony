'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Save, Code, Plus, Trash2 } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface AgentEditorProps {
  initial?: {
    name: string;
    description: string;
    model: string;
    temperature: number;
    maxTokens: number;
    tools: string[];
    skills: string[];
    systemPrompt: string;
  };
  onSave: (data: any) => void;
  onClose: () => void;
}

export function AgentEditor({ initial, onSave, onClose }: AgentEditorProps) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [model, setModel] = useState(initial?.model || 'deepseek-chat');
  const [temperature, setTemperature] = useState(initial?.temperature || 0.3);
  const [maxTokens, setMaxTokens] = useState(initial?.maxTokens || 8192);
  const [toolInput, setToolInput] = useState('');
  const [tools, setTools] = useState<string[]>(initial?.tools || []);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initial?.skills || []);
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt || '# Agent System Prompt\n\n');

  const addTool = () => { if (toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(''); } };
  const removeTool = (t: string) => setTools(tools.filter(x => x !== t));
  const addSkill = () => { if (skillInput.trim()) { setSkills([...skills, skillInput.trim()]); setSkillInput(''); } };
  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));

  const handleSave = () => {
    onSave({ name, description, model, temperature, maxTokens, tools, skills, systemPrompt });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-3xl bg-slate-800 shadow-2xl border-l border-slate-700 overflow-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-surface-border/70 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{initial ? '编辑 Agent' : '新建 Agent'}</h2>
            <p className="text-xs text-slate-400">配置 Agent 的模型、工具和系统提示词</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
              <Save size={14} /> 保存
            </button>
            <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">名称 (kebab-case)</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="my-agent-name"
                className="w-full px-3 py-2 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">描述</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Agent 用途说明"
                className="w-full px-3 py-2 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">模型</label>
              <select value={model} onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                <option value="deepseek-chat">deepseek-chat</option>
                <option value="deepseek-reasoner">deepseek-reasoner</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Temperature</label>
                <input type="number" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} min={0} max={2} step={0.1}
                  className="w-full px-3 py-2 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Tokens</label>
                <input type="number" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-card/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">可用工具</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={toolInput} onChange={e => setToolInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTool()}
                placeholder="添加工具名..." className="flex-1 px-3 py-1.5 bg-surface-card/50 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
              <button onClick={addTool} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors"><Plus size={12} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tools.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-surface-card/70 text-slate-300 rounded text-xs font-mono border border-slate-700">
                  {t} <button onClick={() => removeTool(t)} className="text-slate-500 hover:text-red-400"><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">关联 Skills</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="添加 skill 名..." className="flex-1 px-3 py-1.5 bg-surface-card/50 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
              <button onClick={addSkill} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs transition-colors"><Plus size={12} /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 text-violet-300 rounded text-xs border border-violet-500/20">
                  {s} <button onClick={() => removeSkill(s)} className="text-violet-500 hover:text-red-400"><X size={10} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* System Prompt (Monaco Editor) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">System Prompt (Markdown)</label>
            <div className="border border-slate-700 rounded-lg overflow-hidden" style={{ height: 350 }}>
              <MonacoEditor
                language="markdown"
                theme="vs-dark"
                value={systemPrompt}
                onChange={v => setSystemPrompt(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
