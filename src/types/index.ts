export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
  likeCount?: string;
  source?: string;
}

export interface QueueItem {
  id: string; // Unique queue entry ID
  track: Track;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  createdAt: string;
  coverImage?: string;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
  undoAction?: () => void;
}

export type RepeatMode = 'none' | 'all' | 'one';

export interface CacheEntry {
  data: any;
  timestamp: number;
}

export interface PlayerState {
  // Playback State
  currentTrack: Track | null;
  currentQueueItem: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  isExpanded: boolean;
  lastPlayedPosition: number;
  
  // Library State
  likedSongs: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  searchHistory: string[];
  listeningHistory: Track[];
  
  // Cache State
  apiCache: Record<string, CacheEntry>;
  
  // UI State
  toasts: Toast[];
  isQueueOpen: boolean;
  isKeyboardHelpOpen: boolean;

  // Actions
  play: (track?: Track, context?: Track[]) => void;
  playFromQueue: (uniqueId: string) => void;
  playNext: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (uniqueId: string) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleLike: (track: Track) => void;
  setExpanded: (expanded: boolean) => void;
  setQueueOpen: (isOpen: boolean) => void;
  setKeyboardHelpOpen: (isOpen: boolean) => void;
  
  // UI Actions
  showToast: (message: string, type?: 'info' | 'success' | 'error', undo?: () => void) => void;
  removeToast: (id: string) => void;
  
  // Library Actions
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

