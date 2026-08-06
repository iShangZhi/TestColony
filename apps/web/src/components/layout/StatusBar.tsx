'use client';
import { Wifi, Cpu, HardDrive } from 'lucide-react';

export function StatusBar() {
  return (
    <footer className="h-7 bg-white dark:bg-app-nav border-t border-gray-200 dark:border-surface-border flex items-center justify-between px-4 text-[11px] flex-shrink-0">
      <div className="flex items-center gap-4 text-gray-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5"><Wifi size={11} className="text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Connected</span></span>
        <span className="text-gray-300 dark:text-slate-600">|</span>
        <span className="flex items-center gap-1.5"><Cpu size={11} /><span>DeepSeek Chat</span></span>
        <span className="text-gray-300 dark:text-slate-600">|</span>
        <span className="flex items-center gap-1.5"><HardDrive size={11} /><span>PostgreSQL</span></span>
      </div>
      <div className="flex items-center gap-4 text-gray-400 dark:text-slate-500">
        <span>API v0.1.0</span><span className="text-gray-300 dark:text-slate-600">|</span><span>Port 4000</span>
      </div>
    </footer>
  );
}
