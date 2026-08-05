'use client';

import Link from 'next/link';
import {
  BarChart3, FolderOpen, Play, CheckCircle2, Bot, Activity,
  TrendingUp, ArrowRight, Clock, Zap, Layers, Plus,
} from 'lucide-react';

const stats = [
  { label: '项目总数', value: '12', icon: FolderOpen, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
  { label: '活跃运行', value: '3', icon: Play, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
  { label: '7日通过率', value: '94.2%', icon: CheckCircle2, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
  { label: 'Agent 会话', value: '8', icon: Bot, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
];

const activities = [
  { time: '2 分钟前', text: '全量回归 #42 完成 — 142/150 通过', type: 'run', status: 'success' },
  { time: '5 分钟前', text: 'Agent A 为 Shop API 生成了 38 个测试用例', type: 'agent', status: 'info' },
  { time: '1 小时前', text: 'PRD "Checkout v2" AI 分析完成', type: 'prd', status: 'info' },
  { time: '3 小时前', text: '项目 "Payment Service" 创建', type: 'project', status: 'default' },
  { time: '5 小时前', text: '集成测试 #40 发现 10 个失败用例', type: 'run', status: 'warning' },
  { time: '昨天', text: '用户 "李尚志" 注册了 TestColony', type: 'system', status: 'default' },
];

const activeAgents = [
  { name: 'test-executor', type: '主 Agent B', status: 'running', detail: '正在执行 E2E 测试 · 已完成 45%', time: '运行中 · 8 分钟' },
  { name: 'test-generator', type: '主 Agent A', status: 'waiting', detail: '等待用户确认性能 SLA 阈值', time: '等待中 · 3 分钟' },
  { name: 'prd-analyzer', type: '子 Agent', status: 'idle', detail: '上次分析: Checkout v2 PRD', time: '空闲 · 1 小时前' },
];

const recentProjects = [
  { name: 'Shop API', desc: '电商平台后端服务', cases: 142, runs: 28, passRate: '94.2%' },
  { name: 'User Portal', desc: '用户管理门户网站', cases: 87, runs: 15, passRate: '98.7%' },
  { name: 'Payment Svc', desc: '支付服务微服务', cases: 56, runs: 10, passRate: '89.1%' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">仪表盘</h1>
          <p className="text-sm text-slate-400 mt-1">TestColony 平台概览与关键指标</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 transition-all">
            <Clock size={15} />
            查看历史
          </button>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-violet-500/25 transition-all"
          >
            <Plus size={15} />
            新建项目
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group bg-slate-800/60 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center ${stat.shadow}`}>
                  <Icon size={18} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trend Chart Area */}
        <div className="col-span-2 space-y-6">
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-slate-400" />
                测试执行趋势
              </h3>
              <div className="flex items-center gap-2">
                {['7天', '30天', '90天'].map((range) => (
                  <button
                    key={range}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      range === '7天'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            {/* Simple chart visualization */}
            <div className="h-48 flex items-end gap-2">
              {[65, 78, 92, 88, 95, 94, 94.2].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-violet-600/60 to-violet-500/30 rounded-t-md transition-all hover:from-violet-500/80 hover:to-violet-400/50"
                    style={{ height: `${val}%` }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 通过
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> 失败
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 跳过
              </span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity size={16} className="text-slate-400" />
                最近活动
              </h3>
            </div>
            <div className="divide-y divide-slate-700/30">
              {activities.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-700/20 transition-colors">
                  <span className="text-xs text-slate-500 w-20 flex-shrink-0">{item.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item.status === 'success' ? 'bg-emerald-400' :
                    item.status === 'warning' ? 'bg-amber-400' :
                    item.status === 'info' ? 'bg-violet-400' : 'bg-slate-500'
                  }`} />
                  <span className="text-sm text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Agents */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Bot size={16} className="text-slate-400" />
                活跃 Agent
              </h3>
            </div>
            <div className="divide-y divide-slate-700/30">
              {activeAgents.map((agent) => (
                <div key={agent.name} className="px-5 py-3.5 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      agent.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                      agent.status === 'waiting' ? 'bg-amber-400' : 'bg-slate-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-200">{agent.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 flex-shrink-0">
                      {agent.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 ml-4.5">{agent.detail}</p>
                  <p className="text-[10px] text-slate-500 mt-1 ml-4.5">{agent.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">最近项目</h3>
              <Link href="/projects" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                查看全部 →
              </Link>
            </div>
            <div className="divide-y divide-slate-700/30">
              {recentProjects.map((proj) => (
                <Link
                  key={proj.name}
                  href={`/projects/${proj.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-700/20 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-200">{proj.name}</div>
                    <div className="text-xs text-slate-500">{proj.desc}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-mono font-semibold text-emerald-400">{proj.passRate}</div>
                      <div className="text-[10px] text-slate-500">{proj.cases} 用例</div>
                    </div>
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
