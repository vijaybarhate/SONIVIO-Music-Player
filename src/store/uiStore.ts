import { create } from 'zustand';
import type { Toast } from '../types';

interface UiState {
  toasts: Toast[];
  isQueueOpen: boolean;
  isKeyboardHelpOpen: boolean;
  isExpanded: boolean;
  theme: 'light' | 'dark';
  
  showToast: (message: string, type?: 'info' | 'success' | 'error', undoAction?: () => void) => void;
  removeToast: (id: string) => void;
  setQueueOpen: (isOpen: boolean) => void;
  setKeyboardHelpOpen: (isOpen: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  isQueueOpen: false,
  isKeyboardHelpOpen: false,
  isExpanded: false,
  theme: typeof window !== 'undefined'
    ? (localStorage.getItem('theme') as 'light' | 'dark') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : 'light',

  showToast: (message, type = 'info', undoAction) => {
    const id = Math.random().toString(36).substring(2, 11);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, undoAction }]
    }));

    // Auto remove toast in 3 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  setQueueOpen: (isOpen) => set({ isQueueOpen: isOpen }),
  setKeyboardHelpOpen: (isOpen) => set({ isKeyboardHelpOpen: isOpen }),
  setExpanded: (expanded) => set({ isExpanded: expanded }),
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: nextTheme });
  },
}));
