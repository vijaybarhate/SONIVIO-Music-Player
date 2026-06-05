import React, { useState } from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { motion } from 'framer-motion';
import ContextMenu from '../common/ContextMenu';

interface SongCardProps {
  track: Track;
  context?: Track[];
  variant?: 'vertical' | 'horizontal';
}

const SongCard: React.FC<SongCardProps> = ({ track, context, variant = 'vertical' }) => {
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

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => play(track, context)}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer group transition-colors duration-200 ${isActive ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'}`}
      >
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isActive && isPlaying ? (
              <div className="flex gap-0.5 items-end h-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [2, 8, 2] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                    className="w-0.5 bg-white"
                  />
                ))}
              </div>
            ) : (
              <Play size={14} className="text-white ml-0.5" fill="currentColor" />
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className={`font-sans font-medium text-sm truncate ${isActive ? 'text-accent-start' : 'text-text-primary'}`}>
            {track.title}
          </h4>
          <p className="font-sans text-xs text-text-muted truncate">
            {track.artist}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          className={`p-2 transition-opacity ${isLiked ? 'text-accent-start opacity-100' : 'text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary'}`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleMoreClick}
          className="p-2 text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary transition-opacity"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-surface rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-glow flex flex-col h-full"
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={() => play(track, context)}
        onContextMenu={handleContextMenu}
      >
        <div className="p-3 pb-0">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-sm">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {isActive && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                        className="w-1 bg-white"
                      />
                    ))}
                  </div>
                ) : (
                  <Play size={20} fill="currentColor" className="text-white ml-1" />
                )}
              </div>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track);
                }}
                className={`p-1.5 rounded-full glass ${isLiked ? 'text-accent-start' : 'text-white hover:text-accent-start'}`}
              >
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-1">
          <h3 className={`font-sans font-medium text-sm truncate ${isActive ? 'text-accent-start' : 'text-text-primary'}`}>
            {track.title}
          </h3>
          <p className="font-sans text-xs text-text-muted truncate">
            {track.artist}
          </p>
        </div>
      </div>

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