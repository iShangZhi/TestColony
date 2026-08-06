'use client';

import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';

export function TopNav() {
  const { theme, toggle } = useThemeStore();

  return (
    <header className="h-14 bg-white dark:bg-app-nav border-b border-gray-200 dark:border-surface-border flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text" placeholder="搜索项目、用例、Agent..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-app-input border border-gray-200 dark:border-surface-border rounded-lg text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={toggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-surface-DEFAULT/70 transition-all"
          title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-surface-DEFAULT/70 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 ring-1 ring-white dark:ring-white dark:ring-white dark:ring-[#0d1320]" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-surface-border mx-2" />

        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-DEFAULT/70 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">L</div>
          <span className="text-sm text-gray-700 dark:text-slate-300">李尚志</span>
          <ChevronDown size={13} className="text-gray-400 dark:text-slate-500" />
        </button>
      </div>
    </header>
  );
}
