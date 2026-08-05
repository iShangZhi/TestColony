'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-14 bg-[#0d1320] border-b border-[#1a2540] flex items-center justify-between px-5 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="搜索项目、用例、Agent... (⌘K)"
            className="w-full pl-9 pr-4 py-1.5 bg-[#0a0f1a] border border-[#1e2a45] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 ring-1 ring-[#0d1320]" />
        </button>

        <div className="w-px h-5 bg-[#1e2a45] mx-2" />

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            L
          </div>
          <span className="text-sm text-slate-300">李尚志</span>
          <ChevronDown size={13} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
