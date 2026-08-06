'use client';

import { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, HelpCircle, Bot } from 'lucide-react';
import { useInteractionStore } from '@/stores/interaction-store';
import { api } from '@/lib/api-client';

export function InteractionDialog() {
  const { showDialog, currentInteraction, removeInteraction, setShowDialog } = useInteractionStore();
  const [response, setResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (currentInteraction) {
      setTimeLeft(currentInteraction.timeout);
      setResponse('');
      setSelectedOption(null);
    }
  }, [currentInteraction]);

  // Countdown timer
  useEffect(() => {
    if (!showDialog || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showDialog, timeLeft]);

  if (!showDialog || !currentInteraction) return null;

  const handleSubmit = async () => {
    const value = selectedOption || response;
    if (!value) return;
    try {
      // Use any project ID since interactions are session-scoped
      await api.respondToInteraction('any', currentInteraction.interactionId, value);
    } catch {}
    removeInteraction(currentInteraction.interactionId);
  };

  const handleSkip = async () => {
    try {
      await api.skipInteraction('any', currentInteraction.interactionId);
    } catch {}
    removeInteraction(currentInteraction.interactionId);
  };

  const handleDismiss = () => {
    setShowDialog(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Dialog */}
      <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              currentInteraction.type === 'confirmation' ? 'bg-amber-500/20' :
              currentInteraction.type === 'approval' ? 'bg-violet-500/20' :
              'bg-blue-500/20'
            }`}>
              {currentInteraction.type === 'confirmation' ? (
                <HelpCircle size={16} className="text-amber-400" />
              ) : currentInteraction.type === 'approval' ? (
                <AlertTriangle size={16} className="text-violet-400" />
              ) : (
                <Bot size={16} className="text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Agent 需要您的确认</h3>
              <p className="text-[10px] text-slate-500">
                {currentInteraction.priority === 'critical' ? '关键决策' :
                 currentInteraction.priority === 'high' ? '高优先级' : '需要输入'}
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="bg-surface-card/50 rounded-lg p-4 border border-surface-border/70 mb-4">
            <div className="text-sm text-slate-200 leading-relaxed">
              {currentInteraction.message}
            </div>
          </div>

          {/* Options */}
          {currentInteraction.options && currentInteraction.options.length > 0 && (
            <div className="space-y-2 mb-4">
              {currentInteraction.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedOption(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    selectedOption === opt.value
                      ? 'bg-violet-500/10 border-violet-500/50 text-violet-300'
                      : 'bg-surface-card/40 border-surface-border/70 text-slate-300 hover:border-slate-600/50'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  {opt.description && (
                    <div className="text-xs text-slate-500 mt-0.5">{opt.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Custom Input */}
          <div>
            <textarea
              value={response}
              onChange={(e) => { setResponse(e.target.value); setSelectedOption(null); }}
              placeholder="输入自定义回复..."
              rows={2}
              className="w-full px-3 py-2 bg-surface-card/50 border border-surface-border/70 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-surface-border/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} />
            <span>自动超时 {minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md transition-colors"
            >
              跳过 · 让 AI 决定
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedOption && !response}
              className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
            >
              提交确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
