import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Track, RepeatMode } from '../types';
import { useQueueStore } from './queueStore';
import { useLibraryStore } from './libraryStore';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  lastPlayedPosition: number;

  // Actions
  play: (track?: Track, context?: Track[]) => void;
  playFromQueue: (uniqueId: string) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      isMuted: false,
      volume: 70,
      progress: 0,
      duration: 0,
      shuffle: false,
      repeatMode: 'none',
      lastPlayedPosition: 0,

      play: (track, context) => {
        const libraryStore = useLibraryStore.getState();
        const queueStore = useQueueStore.getState();

        if (track) {
          // Update library recently played and listening history
          libraryStore.addToRecentlyPlayed(track);
          libraryStore.addToListeningHistory(track);

          if (context) {
            // Transform context tracks into QueueItems
            const newQueue = context.map((t) => ({
              id: `q_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
              track: t,
            }));

            // Find index of the track in the new queue
            const index = newQueue.findIndex((item) => item.track.id === track.id);
            const activeIndex = index !== -1 ? index : 0;

            queueStore.setQueue(newQueue, activeIndex);
            set({
              currentTrack: track,
              isPlaying: true,
              progress: 0,
            });
          } else {
            // No context, check if it's already in the queue
            const existingIndex = queueStore.queue.findIndex((item) => item.track.id === track.id);

            if (existingIndex !== -1) {
              queueStore.moveToIndex(existingIndex);
              set({
                currentTrack: track,
                isPlaying: true,
                progress: 0,
              });
            } else {
              // Add to queue and play
              queueStore.playNext(track);
              set({
                currentTrack: track,
                isPlaying: true,
                progress: 0,
              });
            }
          }
        } else {
          // Play current track if paused
          const { currentTrack } = get();
          if (currentTrack) {
            set({ isPlaying: true });
          }
        }
      },

      playFromQueue: (uniqueId) => {
        const queueStore = useQueueStore.getState();
        const track = queueStore.playFromQueue(uniqueId);
        if (track) {
          const libraryStore = useLibraryStore.getState();
          libraryStore.addToRecentlyPlayed(track);
          libraryStore.addToListeningHistory(track);
          
          set({
            currentTrack: track,
            isPlaying: true,
            progress: 0,
          });
        }
      },

      pause: () => set({ isPlaying: false }),

      resume: () => {
        if (get().currentTrack) {
          set({ isPlaying: true });
        }
      },

      next: () => {
        const queueStore = useQueueStore.getState();
        const libraryStore = useLibraryStore.getState();
        const { queue, queueIndex } = queueStore;
        const { repeatMode, shuffle, isPlaying } = get();

        if (queue.length === 0) return;

        if (repeatMode === 'one' && isPlaying) {
          set({ progress: 0 });
          return;
        }

        let nextIndex = queueIndex + 1;

        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }

        if (nextIndex >= queue.length) {
          if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            set({ isPlaying: false, progress: 0 });
            return;
          }
        }

        const nextItem = queueStore.moveToIndex(nextIndex);
        if (nextItem) {
          libraryStore.addToRecentlyPlayed(nextItem.track);
          set({
            currentTrack: nextItem.track,
            isPlaying: true,
            progress: 0,
          });
        }
      },

      previous: () => {
        const queueStore = useQueueStore.getState();
        const { queue, queueIndex } = queueStore;
        const { progress } = get();

        if (queue.length === 0) return;

        if (progress > 3) {
          set({ progress: 0 });
          return;
        }

        let prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }

        const prevItem = queueStore.moveToIndex(prevIndex);
        if (prevItem) {
          set({
            currentTrack: prevItem.track,
            isPlaying: true,
            progress: 0,
          });
        }
      },

      seek: (time) => set({ progress: time, lastPlayedPosition: time }),
      
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      setRepeatMode: (mode) => set({ repeatMode: mode }),

      setProgress: (progress) => set({ progress }),
      
      setDuration: (duration) => set({ duration }),
    }),
    {
      name: 'sonivio-player-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
        isMuted: state.isMuted,
        currentTrack: state.currentTrack,
        lastPlayedPosition: state.progress,
      }),
    }
  )
);
