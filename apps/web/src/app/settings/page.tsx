'use client';

import { useState } from 'react';
import {
  Settings, User, Key, Database, Bell, Globe, Shield,
  Cpu, HardDrive, Save,
} from 'lucide-react';

const tabs = [
  { key: 'general', label: '通用', icon: Settings },
  { key: 'llm', label: 'LLM 配置', icon: Cpu },
  { key: 'database', label: '数据库', icon: Database },
  { key: 'auth', label: '认证安全', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="text-sm text-slate-400 mt-1">配置平台参数和 AI 模型连接</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-6 space-y-6">
        {activeTab === 'general' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">平台名称</label>
                <input type="text" defaultValue="TestColony" className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">默认语言</label>
                <select className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                  <option>中文 (简体)</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">最大并发 Agent 数</label>
                <input type="number" defaultValue={5} className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sub-Agent 最大嵌套深度</label>
                <input type="number" defaultValue={3} className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
            </div>
          </>
        )}

        {activeTab === 'llm' && (
          <>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-700/50 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> DeepSeek API 已配置
              </div>
              <p className="text-xs text-slate-500">模型: deepseek-chat · Base URL: https://api.deepseek.com/v1</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">API Key</label>
                <input type="password" defaultValue="sk-••••••••••••••••" className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Base URL</label>
                <input type="text" defaultValue="https://api.deepseek.com/v1" className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">默认模型</label>
                  <select className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                    <option>deepseek-chat</option>
                    <option>deepseek-reasoner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">推理模型</label>
                  <select className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                    <option>deepseek-reasoner</option>
                    <option>deepseek-chat</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="bg-emerald-500/5 rounded-lg p-4 border border-emerald-500/20 flex items-center gap-3">
              <HardDrive size={18} className="text-emerald-400" />
              <div>
                <div className="text-sm text-slate-200">PostgreSQL 16 — 已连接</div>
                <div className="text-xs text-slate-500">localhost:5432 · 数据库: testcolony · 13 张表</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Host</label>
                <input type="text" defaultValue="localhost" className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Port</label>
                <input type="number" defaultValue={5432} className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">JWT Secret</label>
              <input type="password" defaultValue="••••••••••••••••••••••••" className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-violet-500/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Token 过期时间</label>
                <select className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                  <option>15 分钟</option>
                  <option>30 分钟</option>
                  <option>1 小时</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Refresh Token 过期</label>
                <select className="w-full px-3 py-2 bg-slate-700/30 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-violet-500/50">
                  <option>7 天</option>
                  <option>14 天</option>
                  <option>30 天</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-700/50">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all">
            <Save size={15} /> 保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
