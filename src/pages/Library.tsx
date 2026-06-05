import React, { useState, useRef, useMemo } from 'react';
import { 
  Library as LibraryIcon, 
  Heart, 
  History, 
  Plus, 
  Trash2, 
  ListMusic
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import SongCard from '../components/cards/SongCard';
import { EmptyState } from '../components/common/FeedbackStates';
import { useNavigate } from 'react-router-dom';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

type LibraryTab = 'favorites' | 'playlists' | 'history';
type SortOption = 'recent' | 'title' | 'artist';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  
  const { 
    likedSongs, 
    playlists, 
    listeningHistory,
    createPlaylist,
    deletePlaylist,
    play,
    showToast
  } = usePlayerStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

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
    return list; // 'recent' is default, which is insertion order (reversed usually)
  }, [likedSongs, sortOption]);

  // Virtualizer for History list
  const historyListRef = useRef<HTMLDivElement>(null);
  const virtualizer = useWindowVirtualizer({
    count: listeningHistory.length,
    estimateSize: () => 80, // Height of horizontal SongCard + gap
    overscan: 10,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-12 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display italic tracking-tight text-text-primary mb-2">
            Your <span className="bg-clip-text text-transparent accent-gradient">Library</span>
          </h1>
          <p className="text-text-muted font-sans text-sm">All your saved music and history in one place.</p>
        </div>
        
        {activeTab === 'playlists' && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full accent-gradient text-white font-sans font-medium text-sm shadow-glow hover:scale-105 transition-transform w-fit"
          >
            <Plus size={18} />
            Create Playlist
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stroke overflow-x-auto custom-scrollbar">
        {[
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'playlists', label: 'Playlists', icon: ListMusic },
          { id: 'history', label: 'History', icon: History }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as LibraryTab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-sm transition-all duration-300 flex-shrink-0 ${
              activeTab === tab.id 
                ? 'bg-text-primary text-bg font-medium shadow-glow' 
                : 'bg-surface hover:bg-surface-elevated text-text-primary'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <>
              {likedSongs.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={() => play(sortedFavorites[0], sortedFavorites)}
                      className="flex items-center gap-2 text-sm font-sans font-medium text-accent-start hover:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center text-white">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                      Play All
                    </button>
                    
                    <div className="flex items-center gap-2 text-sm font-sans">
                      <span className="text-text-muted">Sort by:</span>
                      <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="bg-surface border border-stroke rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-accent-start"
                      >
                        <option value="recent">Recently Added</option>
                        <option value="title">Title</option>
                        <option value="artist">Artist</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {sortedFavorites.map((track) => (
                      <SongCard key={track.id} track={track} context={sortedFavorites} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState 
                  title="No favorites yet" 
                  message="Save songs you love by clicking the heart icon. They will appear here." 
                  icon={<Heart size={48} />}
                />
              )}
            </>
          )}

          {/* Playlists Tab */}
          {activeTab === 'playlists' && (
            <>
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <div 
                      key={playlist.id} 
                      className="group relative bg-surface hover:bg-surface-elevated transition-all p-6 rounded-3xl flex flex-col justify-between aspect-video cursor-pointer border border-stroke hover:border-accent-start/30 shadow-md hover:shadow-glow"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center border border-stroke">
                            {playlist.coverImage ? (
                              <img src={playlist.coverImage} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <LibraryIcon size={20} className="text-accent-start" />
                            )}
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setPlaylistToDelete(playlist.id); }}
                           className="p-2 text-text-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 bg-surface-elevated rounded-full"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                      <div className="mt-6">
                         <h3 className="text-xl font-sans font-bold text-text-primary mb-1 group-hover:text-accent-start transition-colors">{playlist.name}</h3>
                         {playlist.description && (
                           <p className="text-xs font-sans text-text-muted mb-2 line-clamp-1">{playlist.description}</p>
                         )}
                         <p className="font-sans text-xs text-text-muted font-medium bg-bg/50 w-fit px-2 py-1 rounded-md">{playlist.tracks.length} Tracks</p>
                      </div>
                      
                      {/* Delete Confirmation Overlay */}
                      <AnimatePresence>
                        {playlistToDelete === playlist.id && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 bg-surface/95 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-center gap-4 border border-red-500/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="font-sans font-medium text-center text-text-primary">Delete "{playlist.name}"?</p>
                            <div className="flex gap-3 mt-2">
                              <button 
                                onClick={() => confirmDelete(playlist.id)}
                                className="flex-1 bg-red-500 text-white rounded-full font-sans text-xs font-bold py-2.5 hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                              <button 
                                onClick={() => setPlaylistToDelete(null)}
                                className="flex-1 border border-stroke bg-surface text-text-primary rounded-full font-sans text-xs font-bold py-2.5 hover:bg-surface-elevated transition-colors"
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
                  icon={<ListMusic size={48} />}
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
                        className="pb-2" // Gap equivalent
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
                  icon={<History size={48} />}
                />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-full max-w-md glass rounded-3xl p-8 shadow-2xl border border-stroke"
            >
              <h2 className="text-2xl font-display italic tracking-tight text-text-primary mb-6">Create Playlist</h2>
              <form onSubmit={handleCreatePlaylist} className="space-y-5">
                <div className="space-y-2">
                   <label className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Playlist Name</label>
                   <input 
                     autoFocus
                     type="text"
                     value={newPlaylistName}
                     onChange={(e) => setNewPlaylistName(e.target.value)}
                     className="w-full bg-surface/50 border border-stroke rounded-xl px-4 py-3 font-sans text-text-primary focus:border-accent-start focus:ring-1 focus:ring-accent-start/50 outline-none transition-all"
                     placeholder="My awesome mix"
                     required
                   />
                </div>
                <div className="space-y-2">
                   <label className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider pl-1">Description <span className="lowercase opacity-50">(optional)</span></label>
                   <textarea 
                     value={newPlaylistDesc}
                     onChange={(e) => setNewPlaylistDesc(e.target.value)}
                     className="w-full bg-surface/50 border border-stroke rounded-xl px-4 py-3 font-sans text-text-primary focus:border-accent-start focus:ring-1 focus:ring-accent-start/50 outline-none transition-all resize-none h-24"
                     placeholder="A collection of the best tracks..."
                   />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit"
                    disabled={!newPlaylistName.trim()}
                    className="flex-1 rounded-full accent-gradient text-white font-sans font-semibold py-3 shadow-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 rounded-full bg-surface border border-stroke text-text-primary font-sans font-semibold py-3 hover:bg-surface-elevated active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Library;

// Helper Play component for the "Play All" button
const Play = ({ size, fill, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
