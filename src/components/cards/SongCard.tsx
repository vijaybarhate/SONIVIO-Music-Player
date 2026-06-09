import React, { useState } from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import type { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { motion } from 'framer-motion';
import ContextMenu from '../common/ContextMenu';

interface SongCardProps {
  track: Track;
  context?: Track[];
  variant?: 'vertical' | 'horizontal';
}

const SongCard: React.FC<SongCardProps> = ({ track, context, variant = 'vertical' }) => {
  const { play, currentTrack, isPlaying } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();
  
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
      y: rect.bottom + 6
    });
  };

  if (variant === 'horizontal') {
    return (
      <div
        onClick={() => play(track, context)}
        onContextMenu={handleContextMenu}
        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group border transition-all duration-200 ${
          isActive 
            ? 'bg-canvas-soft-2 border-hairline-strong' 
            : 'bg-canvas hover:bg-canvas-soft border-hairline hover:border-hairline-strong'
        }`}
      >
        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-hairline bg-canvas-soft-2">
          <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isActive && isPlaying ? (
              <div className="flex gap-0.5 items-end h-2.5">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [2, 7, 2] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                    className="w-0.5 bg-canvas"
                  />
                ))}
              </div>
            ) : (
              <Play size={10} className="text-canvas ml-0.5" fill="currentColor" />
            )}
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className={`font-sans font-medium text-xs truncate ${isActive ? 'text-link' : 'text-ink'}`}>
            {track.title}
          </h4>
          <p className="font-sans text-[10px] text-mute truncate mt-0.5">
            {track.artist}
          </p>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          className={`p-1.5 rounded hover:bg-canvas transition-colors ${
            isLiked ? 'text-link opacity-100' : 'text-mute opacity-0 group-hover:opacity-100 hover:text-ink'
          }`}
        >
          <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleMoreClick}
          className="p-1.5 text-mute hover:text-ink hover:bg-canvas rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={13} />
        </button>

        <ContextMenu 
          isOpen={contextMenu.isOpen}
          onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
          x={contextMenu.x}
          y={contextMenu.y}
          track={track}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className="bg-canvas border border-hairline hover:border-hairline-strong rounded-lg overflow-hidden group cursor-pointer transition-all duration-200 card-shadow-lvl3 hover:card-shadow-lvl4 flex flex-col h-full hover:-translate-y-0.5"
        onClick={() => play(track, context)}
        onContextMenu={handleContextMenu}
      >
        <div className="p-2 pb-0">
          <div className="relative aspect-square w-full rounded-md overflow-hidden bg-canvas-soft-2 border border-hairline">
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
            />
            
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className="w-10 h-10 rounded-full bg-ink text-canvas flex items-center justify-center shadow-md transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                {isActive && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [3, 9, 3] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.12 }}
                        className="w-0.5 bg-canvas"
                      />
                    ))}
                  </div>
                ) : (
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                )}
              </div>
            </div>

            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track);
                }}
                className={`p-1 rounded bg-canvas border border-hairline shadow-sm transition-colors ${
                  isLiked ? 'text-link' : 'text-mute hover:text-ink'
                }`}
              >
                <Heart size={11} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-2.5 flex flex-col gap-0.5 select-none">
          <h3 className={`font-sans font-medium text-xs truncate ${isActive ? 'text-link' : 'text-ink'}`}>
            {track.title}
          </h3>
          <p className="font-sans text-[10px] text-mute truncate">
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