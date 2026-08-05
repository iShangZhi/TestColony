'use client';

export function StatusBar() {
  return (
    <footer className="h-7 bg-surface border-t border-surface-border flex items-center justify-between px-4 text-xs text-text-muted flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-status-passed" />
          Connected
        </span>
        <span>API: v0.1.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span>DeepSeek Chat</span>
        <span>|</span>
        <span>Session: idle</span>
      </div>
    </footer>
  );
}
