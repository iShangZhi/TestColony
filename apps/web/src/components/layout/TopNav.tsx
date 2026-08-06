'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';

export function TopNav() {
  const { theme, toggle } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Avoid hydration mismatch: render same content on server and initial client
  const themeLabel = !mounted ? '' : (theme === 'dark' ? '浅色' : '深色');
  const ThemeIcon = !mounted ? Sun : (theme === 'dark' ? Sun : Moon);

  return (
    <header className="h-14 bg-white dark:bg-[#0d1320] border-b border-gray-200 dark:border-[#1a2540] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input type="text" placeholder="搜索项目、用例、Agent..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-[#0a0f1a] border border-gray-200 dark:border-[#1e2a45] rounded-lg text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 transition-all" />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={toggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 border border-gray-200 dark:border-slate-700 transition-all"
          title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
          <ThemeIcon size={15} />
          {mounted && <span className="hidden sm:inline">{themeLabel}</span>}
        </button>

        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 ring-1 ring-white dark:ring-[#0d1320]" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-[#1e2a45] mx-2" />

        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">L</div>
          <span className="text-sm text-gray-700 dark:text-slate-300">李尚志</span>
          <ChevronDown size={13} className="text-gray-400 dark:text-slate-500" />
        </div>
      </div>
    </header>
  );
}
