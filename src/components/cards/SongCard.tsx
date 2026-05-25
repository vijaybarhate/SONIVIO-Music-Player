import React, { useState } from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { motion } from 'framer-motion';
import ContextMenu from '../common/ContextMenu';

interface SongCardProps {
  track: Track;
  context?: Track[];
  source?: string;
}

const SongCard: React.FC<SongCardProps> = ({ track, context, source }) => {
  const { play, currentTrack, likedSongs, toggleLike, isPlaying } = usePlayerStore();
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0
  });

  const isActive = currentTrack?.id === track.id;
  const isLiked = likedSongs.some((t) => t.id === track.id);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      isOpen: true,
      x: rect.left,
      y: rect.bottom + 10
    });
  };

  return (
    <>
      <motion.div
        className={`
          relative group p-4 transition-all cursor-pointer h-full flex flex-col
          ${isActive ? 'bg-brand/5' : 'hover:bg-white/[0.03]'}
        `}
        onClick={() => play(track, context)}
        onContextMenu={handleContextMenu}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden mb-4 border border-border-hard group-hover:border-brand transition-colors">
          <img
            src={track.thumbnail}
            alt={track.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'}`}
          />

          {/* Play Overlay */}
          <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <motion.div
              className="w-12 h-12 flex items-center justify-center bg-brand text-black border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {isActive && isPlaying ? (
                <div className="flex gap-0.5 items-end h-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                      className="w-1 bg-black"
                    />
                  ))}
                </div>
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </motion.div>
          </div>

          {/* Top Indicators */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
            {isActive ? (
              <div className="px-1.5 py-0.5 bg-brand text-black text-[9px] font-mono font-bold border border-black flex items-center gap-1">
                ACTIVE_SIGNAL
              </div>
            ) : (
              <div className="text-[9px] font-mono text-white/40 group-hover:text-brand transition-colors">
                TRK_{track.id?.slice(0, 4).toUpperCase()}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track);
                }}
                className={`p-1 border border-black transition-all ${
                  isLiked ? 'text-black bg-brand' : 'text-white/40 bg-black opacity-0 group-hover:opacity-100 hover:text-brand'
                }`}
              >
                <Heart size={10} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleMoreClick}
                className="p-1 border border-black text-white/40 bg-black opacity-0 group-hover:opacity-100 hover:text-brand transition-all"
              >
                <MoreVertical size={10} />
              </button>
            </div>
          </div>

          {/* Source Badge */}
          {source && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-bg-light/90 border border-border-hard backdrop-blur-sm text-[8px] font-mono text-text-sub uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {source}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`font-mono font-bold text-xs uppercase tracking-tight mb-1 line-clamp-2 ${isActive ? 'text-brand' : 'text-text'}`}>
              {track.title}
            </h3>
            <p className="text-[10px] font-mono text-text-sub uppercase tracking-wider line-clamp-1">
              {track.artist}
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-border-hard/50 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-mono text-text-sub">LOAD_COMPLETE</span>
            <span className="text-[8px] font-mono text-brand">V1.0</span>
          </div>
        </div>
      </motion.div>

      <ContextMenu 
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        x={contextMenu.x}
        y={contextMenu.y}
        track={track}
      />
    </>
  );
};

export default SongCard;
