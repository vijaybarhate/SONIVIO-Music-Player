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
import { useQueueStore } from '../../store/queueStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import type { Track } from '../../types';

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  x: number;
  y: number;
  track: Track;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, onClose, x, y, track }) => {
  const { play } = usePlayerStore();
  const { playNext, addToQueue } = useQueueStore();
  const { likedSongs, toggleLike, playlists, addTrackToPlaylist } = useLibraryStore();
  const { showToast } = useUiStore();
  
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
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://youtube.com/watch?v=${track.id}`);
      showToast('Track URL copied to clipboard', 'success');
    }
  };

  const menuItems = [
    { 
      label: 'Play Track', 
      icon: Play, 
      action: () => { play(track); showToast(`Playing "${track.title}"`); }
    },
    { 
      label: 'Play Next', 
      icon: ArrowUpRight, 
      action: () => { playNext(track); showToast('Added to top of queue'); }
    },
    { 
      label: 'Add to Queue', 
      icon: ListMusic, 
      action: () => { addToQueue(track); showToast('Added to play queue'); }
    },
    { 
      label: isLiked ? 'Remove from Favorites' : 'Add to Favorites', 
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
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.1 }}
          style={{ top: adjustedY, left: adjustedX }}
          className="fixed z-[1000] w-48 bg-canvas border border-hairline rounded-md py-1 modal-shadow-lvl5 select-none"
        >
          <div className="px-3 py-1.5 border-b border-hairline">
            <p className="font-sans text-[10px] font-semibold text-mute truncate">{track.title}</p>
          </div>
          
          <div className="py-0.5">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => { item.action(); onClose(); }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-canvas-soft-2 font-sans text-xs transition-colors group text-left cursor-pointer ${
                  item.active ? 'text-link' : 'text-ink'
                }`}
              >
                <item.icon size={13} className={item.active ? 'fill-current' : 'text-mute group-hover:text-ink'} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {playlists.length > 0 && (
            <div className="border-t border-hairline py-0.5">
              <div className="px-3 py-1">
                 <span className="font-mono text-[9px] text-mute uppercase tracking-wider">Add to Playlist</span>
              </div>
              {playlists.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => { addTrackToPlaylist(p.id, track); showToast(`Added to "${p.name}"`); onClose(); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-canvas-soft-2 font-sans text-xs text-body hover:text-ink transition-colors text-left cursor-pointer"
                >
                  <PlusSquare size={12} className="text-mute" />
                  <span className="truncate flex-1">{p.name}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="border-t border-hairline py-0.5">
             <button 
               onClick={() => { handleShare(); onClose(); }}
               className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-canvas-soft-2 font-sans text-xs text-body hover:text-ink transition-colors text-left cursor-pointer"
             >
                <Share2 size={13} className="text-mute" />
                <span>Share Link</span>
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
