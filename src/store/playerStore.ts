import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerState, QueueItem, RepeatMode } from '../types';

// Helper for generating unique queue item IDs
const generateQueueId = () => `q_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Playback State
      currentTrack: null,
      currentQueueItem: null,
      queue: [],
      queueIndex: -1,
      isPlaying: false,
      isMuted: false,
      volume: 70,
      progress: 0,
      duration: 0,
      shuffle: false,
      repeatMode: 'none',
      isExpanded: false,
      lastPlayedPosition: 0,

      // Library State
      likedSongs: [],
      recentlyPlayed: [],
      playlists: [],
      searchHistory: [],
      listeningHistory: [],

      // UI State
      toasts: [],

      // Actions
      play: (track, context) => {
        const { recentlyPlayed, listeningHistory } = get();
        
        if (track) {
          // Update recently played
          const filteredRecent = recentlyPlayed.filter(t => t.id !== track.id);
          const newRecent = [track, ...filteredRecent].slice(0, 50);

          // Update listening history
          const newHistory = [track, ...listeningHistory].slice(0, 100);

          if (context) {
            // Context provided (e.g. from Home, Search, Playlist)
            // Transform context tracks into QueueItems
            const newQueue: QueueItem[] = context.map(t => ({
              id: generateQueueId(),
              track: t
            }));

            // Find index of the track in the new queue
            const index = newQueue.findIndex((item) => item.track.id === track.id);
            const activeIndex = index !== -1 ? index : 0;
            const activeItem = newQueue[activeIndex];

            set({
              queue: newQueue,
              currentTrack: track,
              currentQueueItem: activeItem,
              queueIndex: activeIndex,
              isPlaying: true,
              recentlyPlayed: newRecent,
              listeningHistory: newHistory,
              progress: 0
            });
          } else {
            // No context, just play the track
            const { queue, queueIndex } = get();
            
            // Check if it's already in the queue near the current index
            const existingIndex = queue.findIndex(item => item.track.id === track.id);
            
            if (existingIndex !== -1) {
              set({
                currentTrack: track,
                currentQueueItem: queue[existingIndex],
                queueIndex: existingIndex,
                isPlaying: true,
                recentlyPlayed: newRecent,
                listeningHistory: newHistory,
                progress: 0
              });
            } else {
              // Add to queue after current index
              const newItem: QueueItem = { id: generateQueueId(), track };
              const newQueue = [...queue];
              const insertIndex = queueIndex + 1;
              newQueue.splice(insertIndex, 0, newItem);

              set({
                queue: newQueue,
                currentTrack: track,
                currentQueueItem: newItem,
                queueIndex: insertIndex,
                isPlaying: true,
                recentlyPlayed: newRecent,
                listeningHistory: newHistory,
                progress: 0
              });
            }
          }
        } else {
          // No track provided, toggle play
          const { currentTrack } = get();
          if (currentTrack) {
            set({ isPlaying: true });
          }
        }
      },

      playFromQueue: (uniqueId) => {
        const { queue } = get();
        const index = queue.findIndex(item => item.id === uniqueId);
        if (index !== -1) {
          const item = queue[index];
          set({
            currentTrack: item.track,
            currentQueueItem: item,
            queueIndex: index,
            isPlaying: true,
            progress: 0
          });
        }
      },

      playNext: (track) => {
        const { queue, queueIndex } = get();
        const newItem: QueueItem = { id: generateQueueId(), track };
        const newQueue = [...queue];
        const insertIndex = queueIndex + 1;
        newQueue.splice(insertIndex, 0, newItem);
        set({ queue: newQueue });
      },

      pause: () => set({ isPlaying: false }),
      
      resume: () => {
        if (get().currentTrack) {
          set({ isPlaying: true });
        }
      },

      next: () => {
        const { queue, queueIndex, repeatMode, shuffle, recentlyPlayed } = get();
        if (queue.length === 0) return;

        if (repeatMode === 'one' && get().isPlaying) {
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

        const nextItem = queue[nextIndex];
        const track = nextItem.track;
        const filteredRecent = recentlyPlayed.filter(t => t.id !== track.id);
        const newRecent = [track, ...filteredRecent].slice(0, 50);

        set({ 
          queueIndex: nextIndex, 
          currentTrack: track,
          currentQueueItem: nextItem,
          isPlaying: true,
          progress: 0,
          recentlyPlayed: newRecent
        });
      },

      previous: () => {
        const { queue, queueIndex, progress } = get();
        if (queue.length === 0) return;

        if (progress > 3) {
          set({ progress: 0 });
          return;
        }

        let prevIndex = queueIndex - 1;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1;
        }

        const prevItem = queue[prevIndex];
        set({ 
          queueIndex: prevIndex, 
          currentTrack: prevItem.track,
          currentQueueItem: prevItem,
          isPlaying: true,
          progress: 0
        });
      },

      seek: (time) => set({ progress: time, lastPlayedPosition: time }),
      
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      setRepeatMode: (mode: RepeatMode) => set({ repeatMode: mode }),

      addToQueue: (track) => {
        const newItem: QueueItem = { id: generateQueueId(), track };
        set((state) => ({ queue: [...state.queue, newItem] }));
      },

      removeFromQueue: (uniqueId) => set((state) => {
        const newQueue = state.queue.filter((item) => item.id !== uniqueId);
        const removedIndex = state.queue.findIndex(item => item.id === uniqueId);
        
        let newIndex = state.queueIndex;
        if (removedIndex < state.queueIndex) {
          newIndex -= 1;
        } else if (removedIndex === state.queueIndex) {
          // If we removed the current track, we should probably stop or play next
          // For now just keep the index valid
          newIndex = Math.min(newIndex, newQueue.length - 1);
        }

        return { 
          queue: newQueue,
          queueIndex: newIndex
        };
      }),

      clearQueue: () => set({ queue: [], queueIndex: -1, currentTrack: null, currentQueueItem: null, isPlaying: false }),

      setProgress: (progress) => set({ progress }),
      
      setDuration: (duration) => set({ duration }),

      toggleLike: (track) => set((state) => {
        const isLiked = state.likedSongs.some((t) => t.id === track.id);
        if (isLiked) {
          return { likedSongs: state.likedSongs.filter((t) => t.id !== track.id) };
        }
        return { likedSongs: [track, ...state.likedSongs] };
      }),

      setExpanded: (expanded) => set({ isExpanded: expanded }),

      // UI Actions
      showToast: (message, type = 'info', undoAction) => {
        const id = Math.random().toString(36).substring(2, 11);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, undoAction }]
        }));

        // Auto remove
        setTimeout(() => {
          get().removeToast(id);
        }, 3000);
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),

      // Library Actions
      createPlaylist: (name) => set((state) => ({
        playlists: [
          ...state.playlists,
          {
            id: `pl_${Math.random().toString(36).substring(2, 11)}`,
            name,
            tracks: [],
            createdAt: new Date().toISOString()
          }
        ]
      })),

      deletePlaylist: (id) => set((state) => ({
        playlists: state.playlists.filter(p => p.id !== id)
      })),

      addTrackToPlaylist: (playlistId, track) => set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId 
            ? { ...p, tracks: [...p.tracks.filter(t => t.id !== track.id), track] }
            : p
        )
      })),

      removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId 
            ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
            : p
        )
      })),

      addToSearchHistory: (query) => set((state) => ({
        searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10)
      })),

      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'sonivio-player-storage-v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from initial unversioned state if needed
          return {
            ...persistedState,
            playlists: [],
            searchHistory: [],
            listeningHistory: [],
            queue: [], // Force clear queue to avoid type mismatches with QueueItem
            queueIndex: -1,
            currentQueueItem: null
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
        isMuted: state.isMuted,
        likedSongs: state.likedSongs,
        recentlyPlayed: state.recentlyPlayed,
        playlists: state.playlists,
        searchHistory: state.searchHistory,
        listeningHistory: state.listeningHistory,
        currentTrack: state.currentTrack,
        queue: state.queue,
        queueIndex: state.queueIndex,
        lastPlayedPosition: state.progress,
      }),
    }
  )
);
