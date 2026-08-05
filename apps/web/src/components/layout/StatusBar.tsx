'use client';

import { Wifi, Cpu, HardDrive } from 'lucide-react';

export function StatusBar() {
  return (
    <footer className="h-7 bg-[#0d1320] border-t border-[#1a2540] flex items-center justify-between px-4 text-[11px] flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-slate-500">
          <Wifi size={11} className="text-emerald-400" />
          <span className="text-emerald-400">Connected</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <Cpu size={11} />
          <span>DeepSeek Chat</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <HardDrive size={11} />
          <span>PostgreSQL</span>
        </span>
      </div>
      <div className="flex items-center gap-4 text-slate-500">
        <span>API v0.1.0</span>
        <span className="text-slate-600">|</span>
        <span>Port 4000</span>
      </div>
    </footer>
  );
}
