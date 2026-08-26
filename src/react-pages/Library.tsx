import React, { useState, useRef, useMemo } from 'react';
import { 
  Play, 
  Heart, 
  History, 
  Plus, 
  Trash2, 
  ListMusic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { useUiStore } from '../store/uiStore';
import { useCurrentPath } from '../hooks/useCurrentPath';
import SongCard from '../components/cards/SongCard';
import { EmptyState } from '../components/common/FeedbackStates';
import BrandDialog from '../components/ui/BrandDialog';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

type LibraryTab = 'favorites' | 'playlists' | 'history';
type SortOption = 'recent' | 'title' | 'artist';

const Library: React.FC = () => {
  const currentPath = useCurrentPath();
  const [localTab, setLocalTab] = useState<LibraryTab>('favorites');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  
  const { play } = usePlayerStore();
  const { showToast } = useUiStore();
  const { 
    likedSongs, 
    playlists, 
    listeningHistory,
    createPlaylist,
    deletePlaylist
  } = useLibraryStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  // Sync tab with URL parameter ?tab=...
  const activeTab = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'playlists' || tab === 'history' || tab === 'favorites') {
        return tab as LibraryTab;
      }
    }
    return localTab;
  }, [currentPath, localTab]);

  const handleTabChange = (tabId: LibraryTab) => {
    setLocalTab(tabId);
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?tab=${tabId}`;
      window.history.pushState(null, '', newUrl);
    }
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim());
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setIsCreateModalOpen(false);
      showToast(`Playlist "${newPlaylistName}" created`, 'success');
    }
  };

  const confirmDelete = (id: string) => {
    deletePlaylist(id);
    setPlaylistToDelete(null);
    showToast("Playlist deleted", "info");
  };

  const sortedFavorites = useMemo(() => {
    const list = [...likedSongs];
    if (sortOption === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOption === 'artist') {
      return list.sort((a, b) => a.artist.localeCompare(b.artist));
    }
    return list;
  }, [likedSongs, sortOption]);

  // Virtualizer for History list
  const historyListRef = useRef<HTMLDivElement>(null);
  const virtualizer = useWindowVirtualizer({
    count: listeningHistory.length,
    estimateSize: () => 80,
    overscan: 10,
  });

  const handlePlaylistClick = (playlistId: string) => {
    window.location.href = `${import.meta.env.BASE_URL}playlist/${playlistId}`;
  };

  return (
    <div 
      className="pb-12 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-8 select-none">
        <div>
          <p className="eyebrow mb-2"><span className="text-ink/60 tabular-nums">02 /</span> Collection</p>
          <h1 className="text-display-lg text-ink">
            Your Library.
          </h1>
          <p className="text-body-sm font-sans text-body mt-1">All your saved music and history in one place.</p>
        </div>

        {activeTab === 'playlists' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-full bg-ink hover:bg-body text-canvas font-sans font-medium text-xs card-shadow-lvl3 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link"
          >
            <Plus size={14} />
            <span>Create Playlist</span>
          </button>
        )}
      </div>

      {/* Tabs — sliding pill */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-6 md:mb-8 pb-3 border-b border-hairline overflow-x-auto custom-scrollbar select-none">
        {[
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'playlists', label: 'Playlists', icon: ListMusic },
          { id: 'history', label: 'History', icon: History }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as LibraryTab)}
              className={`relative flex items-center gap-2 h-8 px-4 rounded-full font-sans text-xs transition-colors duration-200 flex-shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${
                active ? 'text-canvas font-medium' : 'text-body hover:text-ink border border-hairline hover:bg-canvas-soft'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="library-tab-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <tab.icon size={13} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <>
              {likedSongs.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-6 select-none">
                    <button 
                      onClick={() => play(sortedFavorites[0], sortedFavorites)}
                      className="flex items-center gap-2 text-xs font-sans font-medium text-ink hover:text-body transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-canvas shadow-sm">
                        <Play size={10} fill="currentColor" className="ml-0.5" />
                      </div>
                      <span>Play All</span>
                    </button>
                    
                    <div className="flex items-center gap-2 text-xs font-sans">
                      <span className="text-mute">Sort by:</span>
                      <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="bg-canvas border border-hairline rounded px-2.5 py-1 text-ink focus:outline-none focus:border-hairline-strong text-xs font-medium cursor-pointer"
                      >
                        <option value="recent">Recently Added</option>
                        <option value="title">Title</option>
                        <option value="artist">Artist</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                    {sortedFavorites.map((track) => (
                      <SongCard key={track.id} track={track} context={sortedFavorites} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState 
                  title="No favorites yet" 
                  message="Save songs you love by clicking the heart icon. They will appear here." 
                  icon={<Heart size={36} className="text-mute" />}
                />
              )}
            </>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <>
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {playlists.map((playlist) => (
                    <div 
                      key={playlist.id} 
                      className="group relative bg-canvas border border-hairline hover:border-hairline-strong transition-all p-5 rounded-lg flex flex-col justify-between aspect-[16/10] cursor-pointer card-shadow-lvl3 hover:card-shadow-lvl4 hover:-translate-y-0.5"
                      onClick={() => handlePlaylistClick(playlist.id)}
                    >
                      <div className="flex justify-between items-start">
                         <div className="w-10 h-10 rounded bg-canvas-soft-2 flex items-center justify-center border border-hairline flex-shrink-0">
                            {playlist.coverImage ? (
                              <img src={playlist.coverImage} alt="" className="w-full h-full object-cover rounded" />
                            ) : (
                              <ListMusic size={16} className="text-ink" />
                            )}
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setPlaylistToDelete(playlist.id); }}
                           className="p-1.5 text-mute hover:text-error transition-colors opacity-0 group-hover:opacity-100 hover:bg-canvas-soft rounded"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                      <div className="mt-4">
                         <h3 className="text-base font-sans font-semibold text-ink mb-1 group-hover:text-link transition-colors truncate">{playlist.name}</h3>
                         {playlist.description && (
                           <p className="text-xs font-sans text-mute mb-2 line-clamp-1">{playlist.description}</p>
                         )}
                         <span className="font-sans text-[11px] text-body bg-canvas-soft-2 px-2 py-0.5 rounded border border-hairline w-fit">
                           {playlist.tracks.length} {playlist.tracks.length === 1 ? 'Track' : 'Tracks'}
                         </span>
                      </div>
                      
                      {/* Delete Confirmation Overlay */}
                      <AnimatePresence>
                        {playlistToDelete === playlist.id && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 bg-canvas/95 backdrop-blur-sm rounded-lg p-5 flex flex-col justify-center gap-3 border border-error/20"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="font-sans font-medium text-xs text-center text-ink">Delete "{playlist.name}" permanently?</p>
                            <div className="flex gap-2">
<button 
                    onClick={() => confirmDelete(playlist.id)}
                    className="flex-1 h-8 bg-error hover:bg-error-deep text-canvas rounded-md font-sans text-xs font-medium transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => setPlaylistToDelete(null)}
                    className="flex-1 h-8 border border-hairline bg-canvas text-body hover:text-ink rounded-md font-sans text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No playlists created" 
                  message="Create custom playlists to organize your favorite tracks." 
                  icon={<ListMusic size={36} className="text-mute" />}
                  actionLabel="Create Playlist"
                  onAction={() => setIsCreateModalOpen(true)}
                />
              )}
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div ref={historyListRef}>
              {listeningHistory.length > 0 ? (
                <div 
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualItem) => {
                    const track = listeningHistory[virtualItem.index];
                    return (
                      <div
                        key={virtualItem.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        className="pb-2"
                      >
                        <SongCard track={track} context={listeningHistory} variant="horizontal" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState 
                  title="No listening history" 
                  message="Tracks you play will automatically appear here." 
                  icon={<History size={36} className="text-mute" />}
                />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Modal Dialog — Base UI Dialog (focus trap, aria-modal, Escape) */}
      <BrandDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create Playlist."
        description="A new tracklist, ready for your favorites."
      >
        <form onSubmit={handleCreatePlaylist} className="space-y-4">
          <div className="space-y-1">
            <label className="font-sans text-[10px] font-semibold text-mute uppercase tracking-wide">Playlist Name</label>
            <input
              autoFocus
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full h-9 bg-canvas border border-hairline rounded-md px-3 font-sans text-xs text-ink focus:border-ink outline-none transition-colors"
              placeholder="My awesome mix…"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-sans text-[10px] font-semibold text-mute uppercase tracking-wide">Description <span className="lowercase font-normal opacity-65">(optional)</span></label>
            <textarea
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              className="w-full bg-canvas border border-hairline rounded-md px-3 py-2 font-sans text-xs text-ink focus:border-ink outline-none transition-colors resize-none h-20"
              placeholder="A collection of the best tracks…"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={!newPlaylistName.trim()}
              className="flex-1 h-9 rounded-md bg-ink hover:bg-body text-canvas font-sans font-medium text-xs transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Create
            </button>
            <DialogCloseButton onClose={() => setIsCreateModalOpen(false)} />
          </div>
        </form>
      </BrandDialog>
    </div>
  );
};

const DialogCloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    type="button"
    onClick={onClose}
    className="flex-1 h-9 rounded-md border border-hairline bg-canvas hover:bg-canvas-soft text-body font-sans font-medium text-xs transition-colors cursor-pointer"
  >
    Cancel
  </button>
);

export default Library;
