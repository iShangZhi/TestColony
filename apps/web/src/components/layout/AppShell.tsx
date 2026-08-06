'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { StatusBar } from './StatusBar';
import { InteractionDialog } from '../interaction/InteractionDialog';
import { useInteractionWebSocket } from '@/hooks/useWebSocket';

export function AppShell({ children }: { children: React.ReactNode }) {
  // Activate WebSocket connection for real-time agent interactions
  useInteractionWebSocket();

  return (
    <div className="h-screen flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <StatusBar />
      {/* Human-in-the-Loop dialog - shown when agent needs user input */}
      <InteractionDialog />
    </div>
  );
}
