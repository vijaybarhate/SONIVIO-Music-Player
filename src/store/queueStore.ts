import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { QueueItem, Track } from '../types';

const generateQueueId = () => `q_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

interface QueueState {
  queue: QueueItem[];
  queueIndex: number;
  currentQueueItem: QueueItem | null;

  // Actions
  setQueue: (newQueue: QueueItem[], index: number) => void;
  playFromQueue: (uniqueId: string) => Track | null;
  playNext: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (uniqueId: string) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  moveToIndex: (index: number) => QueueItem | null;
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      queueIndex: -1,
      currentQueueItem: null,

      setQueue: (newQueue, index) => {
        const activeItem = newQueue[index] || null;
        set({
          queue: newQueue,
          queueIndex: index,
          currentQueueItem: activeItem,
        });
      },

      playFromQueue: (uniqueId) => {
        const { queue } = get();
        const index = queue.findIndex((item) => item.id === uniqueId);
        if (index !== -1) {
          const item = queue[index];
          set({
            queueIndex: index,
            currentQueueItem: item,
          });
          return item.track;
        }
        return null;
      },

      playNext: (track) => {
        const { queue, queueIndex } = get();
        const newItem: QueueItem = { id: generateQueueId(), track };
        const newQueue = [...queue];
        const insertIndex = queueIndex + 1;
        newQueue.splice(insertIndex, 0, newItem);
        
        set({ 
          queue: newQueue,
          // If queue was empty, set this as current
          ...(queue.length === 0 ? { queueIndex: 0, currentQueueItem: newItem } : {})
        });
      },

      addToQueue: (track) => {
        const newItem: QueueItem = { id: generateQueueId(), track };
        set((state) => {
          const newQueue = [...state.queue, newItem];
          return {
            queue: newQueue,
            // If queue was empty, set this as current
            ...(state.queue.length === 0 ? { queueIndex: 0, currentQueueItem: newItem } : {})
          };
        });
      },

      removeFromQueue: (uniqueId) => set((state) => {
        const newQueue = state.queue.filter((item) => item.id !== uniqueId);
        const removedIndex = state.queue.findIndex((item) => item.id === uniqueId);
        
        let newIndex = state.queueIndex;
        if (removedIndex < state.queueIndex) {
          newIndex -= 1;
        } else if (removedIndex === state.queueIndex) {
          newIndex = Math.min(newIndex, newQueue.length - 1);
        }

        const currentQueueItem = newQueue[newIndex] || null;

        return {
          queue: newQueue,
          queueIndex: newIndex,
          currentQueueItem,
        };
      }),

      clearQueue: () => set({
        queue: [],
        queueIndex: -1,
        currentQueueItem: null,
      }),

      reorderQueue: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.queue);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        let newIndex = state.queueIndex;
        if (startIndex === state.queueIndex) {
          newIndex = endIndex;
        } else if (startIndex < state.queueIndex && endIndex >= state.queueIndex) {
          newIndex--;
        } else if (startIndex > state.queueIndex && endIndex <= state.queueIndex) {
          newIndex++;
        }
        
        return {
          queue: result,
          queueIndex: newIndex,
          currentQueueItem: result[newIndex] || null,
        };
      }),

      moveToIndex: (index) => {
        const { queue } = get();
        if (index >= 0 && index < queue.length) {
          const item = queue[index];
          set({
            queueIndex: index,
            currentQueueItem: item,
          });
          return item;
        }
        return null;
      }
    }),
    {
      name: 'sonivio-queue-storage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
