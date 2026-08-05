'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, FileText, TestTube, Bot, Wrench, Play, BarChart3, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: '仪表盘', icon: LayoutDashboard },
  { href: '/projects', label: '项目', icon: FolderOpen },
  { href: '/agents', label: 'Agent 管理', icon: Bot },
  { href: '/skills', label: 'Skill 管理', icon: Wrench },
  { href: '/settings', label: '设置', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-surface border-r border-surface-border flex-shrink-0 flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary-light'
                  : 'text-text-secondary hover:bg-surface-card hover:text-text-primary',
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-border">
        <div className="text-xs text-text-muted px-3 py-2">
          TestColony v0.1.0
        </div>
      </div>
    </aside>
  );
}
