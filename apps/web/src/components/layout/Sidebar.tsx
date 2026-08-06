'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, Bot, Wrench, Settings, ChevronRight, Zap } from 'lucide-react';

const mainNav = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/projects', label: '项目', icon: FolderOpen },
];
const platformNav = [
  { href: '/agents', label: 'Agent 管理', icon: Bot },
  { href: '/skills', label: 'Skill 管理', icon: Wrench },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="w-60 bg-white dark:bg-app-nav border-r border-gray-200 dark:border-surface-border flex-shrink-0 flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-gray-200 dark:border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">TestColony</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-6">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider px-2 mb-2 text-gray-400 dark:text-slate-500">主要</div>
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                    active
                      ? 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-surface-DEFAULT/70 border border-transparent'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-violet-600 dark:text-violet-400' : ''} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} className="text-violet-600 dark:text-violet-400" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider px-2 mb-2 text-gray-400 dark:text-slate-500">平台</div>
          <div className="space-y-0.5">
            {platformNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-surface-DEFAULT/70 border border-transparent'
                  }`}
                >
                  <Icon size={17} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider px-2 mb-2 text-gray-400 dark:text-slate-500">系统</div>
          <Link href="/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive('/settings')
                ? 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-surface-DEFAULT/70 border border-transparent'
            }`}
          >
            <Settings size={17} />
            <span>设置</span>
          </Link>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-surface-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-500 dark:text-slate-300">T</span>
          </div>
          <div>
            <div className="text-[10px] font-medium text-gray-600 dark:text-slate-400">TestColony</div>
            <div className="text-[9px] text-gray-400 dark:text-slate-600">v0.1.0 · DeepSeek</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
