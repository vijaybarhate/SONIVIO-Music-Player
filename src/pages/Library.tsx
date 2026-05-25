import React, { useState } from 'react';
import { 
  Library as LibraryIcon, 
  Heart, 
  Clock, 
  History, 
  Plus, 
  Trash2, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/playerStore';
import SongCard from '../components/cards/SongCard';
import { EmptyState } from '../components/common/FeedbackStates';
import { useNavigate, useLocation } from 'react-router-dom';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const { 
    likedSongs, 
    recentlyPlayed, 
    playlists, 
    listeningHistory,
    createPlaylist,
    deletePlaylist,
    play,
    showToast
  } = usePlayerStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateModalOpen(false);
      showToast(`Playlist "${newPlaylistName}" created`);
    }
  };

  const confirmDelete = (id: string) => {
    deletePlaylist(id);
    setPlaylistToDelete(null);
    showToast("Playlist deleted", "info");
  };

  const PageHeader = ({ title, sub, icon: Icon, tracks }: any) => (
    <div className="flex items-end gap-8 mb-16 border-b border-border-hard pb-12">
      <div className="w-48 h-48 md:w-64 md:h-64 border border-border-hard flex-shrink-0 relative overflow-hidden group bg-bg-light">
        <div className="w-full h-full bg-brand flex items-center justify-center">
          <Icon size={80} fill="black" className="text-black group-hover:scale-125 transition-transform" />
        </div>
      </div>
      <div className="pb-2 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-brand" />
          <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em]">{sub}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl md:text-8xl font-display uppercase leading-none mb-4">{title}</h1>
            <p className="font-mono text-text-sub uppercase tracking-widest">Entries: {tracks?.length || 0}</p>
          </div>
          {tracks?.length > 0 && (
            <button 
              onClick={() => play(tracks[0], tracks)}
              className="bg-brand text-black font-display text-2xl px-12 py-5 uppercase hover:bg-white hover:text-black transition-all border border-black shadow-[8px_8px_0px_0px_rgba(238,255,0,0.2)] hover:shadow-none"
            >
              Play_All
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Liked Songs View
  if (path === '/favorites') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 px-8 pb-32">
        <PageHeader title="LIKED_SONGS" sub="Archive_Alpha" icon={Heart} tracks={likedSongs} />
        {likedSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
            {likedSongs.map((track) => (
              <div key={track.id} className="border-r border-b border-border-hard">
                <SongCard track={track} context={likedSongs} source="LIKED_ARCHIVE" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="NO_LIKED_DATA" message="Your archive is currently empty. Start tagging signals to store them here." />
        )}
      </motion.div>
    );
  }

  // Recent View
  if (path === '/recent') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 px-8 pb-32">
        <PageHeader title="SYSTEM_LOGS" sub="Temporal_Trace" icon={Clock} tracks={recentlyPlayed} />
        {recentlyPlayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
            {recentlyPlayed.map((track) => (
              <div key={track.id} className="border-r border-b border-border-hard">
                <SongCard track={track} context={recentlyPlayed} source="SESSION_LOG" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="LOG_EMPTY" message="No recent activity detected. Initialize playback to generate temporal logs." />
        )}
      </motion.div>
    );
  }

  // History View
  if (path === '/history') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 px-8 pb-32">
        <PageHeader title="NEURAL_HISTORY" sub="Deep_Memory" icon={History} tracks={listeningHistory} />
        {listeningHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
            {listeningHistory.map((track, i) => (
              <div key={`${track.id}-${i}`} className="border-r border-b border-border-hard">
                <SongCard track={track} context={listeningHistory} source="HISTORY_PTR" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="MEMORY_BLANK" message="Long-term storage contains zero records. Continue discovery to build system memory." />
        )}
      </motion.div>
    );
  }

  // Main Library View (Playlists)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 px-8 pb-32">
      <div className="mb-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-brand" />
          <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em]">Global_Storage</p>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-6xl md:text-9xl font-display uppercase leading-none">LIBRARY</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-4 bg-white text-black font-display text-xl px-10 py-4 uppercase hover:bg-brand transition-all border border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <Plus size={24} strokeWidth={3} />
            New_Playlist
          </button>
        </div>
      </div>

      {/* Primary Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-l border-t border-border-hard mb-20">
        {[
          { label: 'Liked_Archive', path: '/favorites', icon: Heart, count: likedSongs.length, color: 'text-brand' },
          { label: 'System_Logs', path: '/recent', icon: Clock, count: recentlyPlayed.length, color: 'text-white' },
          { label: 'Neural_History', path: '/history', icon: History, count: listeningHistory.length, color: 'text-white' },
        ].map((link, i) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="p-8 border-r border-b border-border-hard text-left hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center justify-between mb-12">
              <link.icon className={`group-hover:scale-125 transition-transform ${link.color}`} size={32} />
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-30">SEG_0{i+1}</span>
            </div>
            <h3 className="font-display text-3xl uppercase tracking-tighter mb-2">{link.label}</h3>
            <p className="font-mono text-[10px] uppercase tracking-widest group-hover:text-black/70">Entries: {link.count}</p>
          </button>
        ))}
      </div>

      {/* Playlists Grid */}
      <div className="space-y-12">
        <div className="flex items-center gap-4 px-2">
           <h2 className="text-3xl font-display uppercase tracking-tight">Custom_Arrays</h2>
           <div className="flex-1 h-px bg-border-hard" />
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-border-hard">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="group relative border-r border-b border-border-hard bg-bg-light hover:bg-bg transition-all p-8 flex flex-col justify-between aspect-video cursor-pointer"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <div className="flex justify-between items-start">
                   <div className="p-3 border border-border-hard bg-bg">
                      <LibraryIcon size={24} className="text-brand" />
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setPlaylistToDelete(playlist.id); }}
                     className="p-2 text-text-sub hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
                <div>
                   <h3 className="text-3xl font-display uppercase tracking-tighter mb-2 group-hover:text-brand transition-colors">{playlist.name}</h3>
                   <p className="font-mono text-[10px] text-text-sub uppercase tracking-[0.2em]">{playlist.tracks.length} Data_Points</p>
                </div>
                
                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                  {playlistToDelete === playlist.id && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 bg-red-950/95 p-8 flex flex-col justify-center gap-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="font-display text-xl uppercase leading-tight text-white">Purge playlist dataset?</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => confirmDelete(playlist.id)}
                          className="flex-1 bg-white text-black font-mono text-[10px] font-bold py-3 uppercase"
                        >
                          Confirm_Purge
                        </button>
                        <button 
                          onClick={() => setPlaylistToDelete(null)}
                          className="flex-1 border border-white/20 font-mono text-[10px] font-bold py-3 uppercase"
                        >
                          Abort
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 border border-dashed border-border-hard flex flex-col items-center justify-center text-center px-8">
             <p className="font-mono text-[10px] text-text-sub uppercase tracking-[0.3em] mb-6">No custom arrays initialized</p>
             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="font-display text-xl uppercase text-brand hover:text-white transition-colors"
             >
               Start_Compilation +
             </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-full max-w-lg bg-bg border border-brand p-12 shadow-[12px_12px_0px_0px_rgba(238,255,0,0.2)]"
            >
              <h2 className="text-4xl font-display uppercase tracking-tight mb-8">Initialize_Playlist</h2>
              <form onSubmit={handleCreatePlaylist} className="space-y-8">
                <div className="space-y-4">
                   <label className="font-mono text-[10px] text-brand uppercase tracking-widest">Compilation_Name</label>
                   <input 
                     autoFocus
                     type="text"
                     value={newPlaylistName}
                     onChange={(e) => setNewPlaylistName(e.target.value)}
                     className="w-full bg-bg-light border border-border-hard p-6 font-display text-2xl uppercase tracking-tighter focus:border-brand focus:outline-none transition-colors"
                     placeholder="DATA_STREAM_01"
                   />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-brand text-black font-display text-xl py-4 uppercase hover:bg-white transition-all border border-black"
                  >
                    Create_Array
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-8 border border-border-hard font-display text-xl py-4 uppercase hover:bg-red-600 hover:border-black transition-all"
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
