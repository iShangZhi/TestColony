'use client';

import { Search, Bell, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-14 bg-surface border-b border-surface-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <h1 className="text-lg font-bold text-text-primary">TestColony</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索项目、用例、Agent..."
            className="w-64 pl-9 pr-3 py-1.5 bg-surface-dark border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <button className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-card transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" />
        </button>

        <button className="flex items-center gap-2 p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-card transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center">
            <User size={14} className="text-primary-light" />
          </div>
        </button>
      </div>
    </header>
  );
}
