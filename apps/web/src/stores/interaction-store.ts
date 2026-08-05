import { create } from 'zustand';

interface Interaction {
  interactionId: string;
  sessionId: string;
  type: 'confirmation' | 'clarification' | 'approval' | 'input';
  title: string;
  message: string;
  options: Array<{ label: string; value: string; description?: string }>;
  timeout: number; // seconds
  createdAt: Date;
}

interface InteractionState {
  interactions: Interaction[];
  showDialog: boolean;
  currentInteraction: Interaction | null;

  addInteraction: (interaction: Interaction) => void;
  removeInteraction: (interactionId: string) => void;
  setCurrentInteraction: (interaction: Interaction | null) => void;
  setShowDialog: (show: boolean) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  interactions: [],
  showDialog: false,
  currentInteraction: null,

  addInteraction: (interaction) =>
    set((state) => ({
      interactions: [...state.interactions, interaction],
      currentInteraction: state.currentInteraction || interaction,
      showDialog: true,
    })),
  removeInteraction: (interactionId) =>
    set((state) => {
      const remaining = state.interactions.filter((i) => i.interactionId !== interactionId);
      return {
        interactions: remaining,
        currentInteraction: state.currentInteraction?.interactionId === interactionId
          ? remaining[0] || null
          : state.currentInteraction,
        showDialog: remaining.length > 0,
      };
    }),
  setCurrentInteraction: (interaction) => set({ currentInteraction: interaction }),
  setShowDialog: (show) => set({ showDialog: show }),
}));
