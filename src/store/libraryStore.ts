import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Track, Playlist, CacheEntry } from '../types';

interface LibraryState {
  likedSongs: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  searchHistory: string[];
  listeningHistory: Track[];
  apiCache: Record<string, CacheEntry>;

  // Actions
  toggleLike: (track: Track) => void;
  addToRecentlyPlayed: (track: Track) => void;
  addToListeningHistory: (track: Track) => void;
  createPlaylist: (name: string, description?: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Cache Actions
  setCache: (key: string, data: any) => void;
  getCache: (key: string) => any | null;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      recentlyPlayed: [],
      playlists: [],
      searchHistory: [],
      listeningHistory: [],
      apiCache: {},

      toggleLike: (track) => set((state) => {
        const isLiked = state.likedSongs.some((t) => t.id === track.id);
        if (isLiked) {
          return { likedSongs: state.likedSongs.filter((t) => t.id !== track.id) };
        }
        return { likedSongs: [track, ...state.likedSongs] };
      }),

      addToRecentlyPlayed: (track) => set((state) => {
        const filtered = state.recentlyPlayed.filter((t) => t.id !== track.id);
        return { recentlyPlayed: [track, ...filtered].slice(0, 50) };
      }),

      addToListeningHistory: (track) => set((state) => {
        const filtered = state.listeningHistory.filter((t) => t.id !== track.id);
        return { listeningHistory: [track, ...filtered].slice(0, 100) };
      }),

      createPlaylist: (name, description) => set((state) => ({
        playlists: [
          ...state.playlists,
          {
            id: `pl_${Math.random().toString(36).substring(2, 11)}`,
            name,
            description,
            tracks: [],
            createdAt: new Date().toISOString()
          }
        ]
      })),

      deletePlaylist: (id) => set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== id)
      })),

      addTrackToPlaylist: (playlistId, track) => set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === playlistId
            ? { ...p, tracks: [...p.tracks.filter((t) => t.id !== track.id), track] }
            : p
        )
      })),

      removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === playlistId
            ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
            : p
        )
      })),

      addToSearchHistory: (query) => set((state) => ({
        searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10)
      })),

      clearSearchHistory: () => set({ searchHistory: [] }),

      setCache: (key, data) => set((state) => ({
        apiCache: {
          ...state.apiCache,
          [key]: { data, timestamp: Date.now() }
        }
      })),

      getCache: (key) => {
        const { apiCache } = get();
        const entry = apiCache[key];
        const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
        if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
          return entry.data;
        }
        return null;
      }
    }),
    {
      name: 'sonivio-library-storage-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
