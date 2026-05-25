import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ListMusic, 
  PlusSquare, 
  Heart, 
  Share2, 
  ArrowUpRight 
} from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { Track } from '../../types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  x: number;
  y: number;
  track: Track;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, onClose, x, y, track }) => {
  const { 
    play, 
    playNext, 
    addToQueue, 
    toggleLike, 
    likedSongs, 
    playlists, 
    addTrackToPlaylist,
    showToast 
  } = usePlayerStore();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const isLiked = likedSongs.some(t => t.id === track.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Adjust position if menu goes off screen
  const adjustedX = Math.min(x, window.innerWidth - 250);
  const adjustedY = Math.min(y, window.innerHeight - 400);

  const menuItems = [
    { 
      label: 'Initialize_Playback', 
      icon: Play, 
      action: () => { play(track); showToast(`Playing ${track.title}`); }
    },
    { 
      label: 'Play_Next', 
      icon: ArrowUpRight, 
      action: () => { playNext(track); showToast('Added to top of queue'); }
    },
    { 
      label: 'Add_to_Queue', 
      icon: ListMusic, 
      action: () => { addToQueue(track); showToast('Added to queue'); }
    },
    { 
      label: isLiked ? 'Remove_from_Archive' : 'Tag_for_Archive', 
      icon: Heart, 
      active: isLiked,
      action: () => { toggleLike(track); showToast(isLiked ? 'Removed from favorites' : 'Added to favorites'); }
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{ top: adjustedY, left: adjustedX }}
          className="fixed z-[1000] bg-bg border border-border-hard w-56 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="p-3 border-b border-border-hard bg-bg-light">
            <p className="font-mono text-[9px] text-text-sub uppercase tracking-widest truncate">{track.title}</p>
          </div>
          
          <div className="py-1">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action(); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand hover:text-black transition-colors group ${item.active ? 'text-brand' : 'text-text'}`}
              >
                <item.icon size={14} className={item.active ? 'fill-current' : ''} />
                <span className="font-mono text-[10px] uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {playlists.length > 0 && (
            <div className="border-t border-border-hard py-1">
              <div className="px-4 py-1">
                 <span className="font-mono text-[8px] text-text-sub uppercase tracking-widest">Assign_to_Playlist</span>
              </div>
              {playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { addTrackToPlaylist(p.id, track); showToast(`Added to ${p.name}`); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white hover:text-black transition-colors"
                >
                  <PlusSquare size={12} />
                  <span className="font-mono text-[9px] uppercase tracking-tight truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="border-t border-border-hard p-1 bg-bg-light/50">
             <button className="w-full flex items-center gap-3 px-3 py-2 text-text-sub hover:text-white transition-colors">
                <Share2 size={12} />
                <span className="font-mono text-[8px] uppercase tracking-widest">Export_Signal_URL</span>
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
