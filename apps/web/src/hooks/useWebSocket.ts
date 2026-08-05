'use client';

import { useEffect, useRef } from 'react';
import { getSocketClient } from '@/lib/socket-client';
import { useExecutionStore } from '@/stores/execution-store';
import { useInteractionStore } from '@/stores/interaction-store';
import type { Socket } from 'socket.io-client';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = getSocketClient();
    socketRef.current = socket;

    return () => {
      // Don't disconnect on unmount - socket is a singleton
    };
  }, []);

  return socketRef.current;
}

export function useExecutionWebSocket(runId: string | null) {
  useEffect(() => {
    if (!runId) return;
    const socket = getSocketClient();

    socket.emit('run:join', { runId });

    const handlePhase = (data: any) => useExecutionStore.getState().setPhase(data.phase);
    const handleProgress = (data: any) => useExecutionStore.getState().updateProgress(data);
    const handleCaseStart = (data: any) => {
      useExecutionStore.getState().addResult({
        testCaseId: data.testCaseId,
        title: data.title,
        status: 'running',
      });
    };
    const handleCaseResult = (data: any) => {
      useExecutionStore.getState().addResult({
        testCaseId: data.testCaseId,
        title: data.title || '',
        status: data.status,
        durationMs: data.durationMs,
        errorMessage: data.error,
      });
    };
    const handleCompleted = () => useExecutionStore.getState().setStatus('completed');
    const handleCancelled = () => useExecutionStore.getState().setStatus('cancelled');
    const handleLog = (data: any) => {
      if (data.token) useExecutionStore.getState().addLog(data.token);
    };

    socket.on('run:phase', handlePhase);
    socket.on('run:progress', handleProgress);
    socket.on('run:case_start', handleCaseStart);
    socket.on('run:case_result', handleCaseResult);
    socket.on('run:completed', handleCompleted);
    socket.on('run:cancelled', handleCancelled);
    socket.on('session:token', handleLog);

    return () => {
      socket.emit('run:leave', { runId });
      socket.off('run:phase', handlePhase);
      socket.off('run:progress', handleProgress);
      socket.off('run:case_start', handleCaseStart);
      socket.off('run:case_result', handleCaseResult);
      socket.off('run:completed', handleCompleted);
      socket.off('run:cancelled', handleCancelled);
      socket.off('session:token', handleLog);
    };
  }, [runId]);
}

export function useInteractionWebSocket() {
  useEffect(() => {
    const socket = getSocketClient();

    const handleInteractionRequired = (data: any) => {
      useInteractionStore.getState().addInteraction({
        interactionId: data.interactionId,
        sessionId: data.sessionId,
        type: data.type,
        title: data.title,
        message: data.message,
        options: data.options || [],
        timeout: data.timeout,
        createdAt: new Date(),
      });
    };

    const handleInteractionResponded = (data: any) => {
      useInteractionStore.getState().removeInteraction(data.interactionId);
    };

    const handleInteractionCancelled = (data: any) => {
      useInteractionStore.getState().removeInteraction(data.interactionId);
    };

    socket.on('interaction:required', handleInteractionRequired);
    socket.on('interaction:responded', handleInteractionResponded);
    socket.on('interaction:cancelled', handleInteractionCancelled);

    return () => {
      socket.off('interaction:required', handleInteractionRequired);
      socket.off('interaction:responded', handleInteractionResponded);
      socket.off('interaction:cancelled', handleInteractionCancelled);
    };
  }, []);
}
