import React from 'react';
import { ChevronDown, Share2, ListMusic, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { motion, AnimatePresence } from 'framer-motion';

const ExpandedPlayer: React.FC = () => {
  const { currentTrack, isExpanded, setExpanded, likedSongs, toggleLike } = usePlayerStore();
  const isLiked = currentTrack ? likedSongs.some(t => t.id === currentTrack.id) : false;

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-bg flex flex-col"
        >
          {/* Header */}
          <div className="relative z-10 p-8 border-b border-border-hard flex items-center justify-between">
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 border border-border-hard group-hover:bg-brand group-hover:text-black transition-all">
                <ChevronDown size={24} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-sub group-hover:text-brand">Close_Monitor</span>
            </button>
            <div className="text-center">
              <p className="text-[10px] font-mono text-brand uppercase tracking-[0.4em]">Active_Monitor_01</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="p-2 text-text-sub hover:text-brand transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 text-text-sub hover:text-brand transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 md:flex-row md:gap-24 md:max-w-7xl md:mx-auto w-full py-12">
            {/* Artwork */}
            <motion.div
              className="w-full aspect-square max-w-[400px] mb-12 md:mb-0 relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-brand pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-brand pointer-events-none" />
              <div className="w-full h-full border border-border-hard p-4 bg-bg-light">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover grayscale opacity-90"
                />
              </div>
            </motion.div>

            {/* Info & Controls */}
            <div className="w-full max-w-[520px]">
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-8 h-px bg-brand" />
                  <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em]">Signal_Source: {currentTrack.artist}</p>
                </div>
                
                <div className="flex items-start justify-between mb-8">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-5xl md:text-7xl font-display uppercase leading-[0.9] mb-4 tracking-tighter">
                      {currentTrack.title}
                    </h1>
                    <p className="text-xl font-mono text-text-sub uppercase tracking-widest">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className={`flex items-center gap-3 py-3 px-6 border transition-all ${
                    isLiked
                      ? 'bg-brand text-black border-black'
                      : 'border-border-hard text-text-sub hover:border-brand hover:text-brand'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  <span className="font-mono text-xs uppercase tracking-widest">{isLiked ? 'Stored_in_Archive' : 'Tag_for_Archive'}</span>
                </button>
              </div>

              <div className="mb-12">
                <div className="flex justify-between mb-2">
                   <span className="font-mono text-[10px] text-text-sub uppercase tracking-widest">Temporal_Progression</span>
                   <span className="font-mono text-[10px] text-brand uppercase tracking-widest">Sync_Stable</span>
                </div>
                <ProgressBar />
              </div>

              <div className="flex flex-col items-center gap-12">
                <PlayerControls />

                <div className="w-full grid grid-cols-3 gap-8 pt-10 border-t border-border-hard">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[9px] text-text-sub uppercase tracking-widest">System_Queue</span>
                    <button className="text-text-sub hover:text-brand transition-colors flex items-center gap-2">
                      <ListMusic size={20} />
                      <span className="font-mono text-[10px] uppercase">Access</span>
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2 col-span-2">
                    <span className="font-mono text-[9px] text-text-sub uppercase tracking-widest">Volume_Regulation</span>
                    <div className="w-full">
                      <VolumeControl />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="p-4 border-t border-border-hard flex justify-between items-center px-8">
            <span className="font-mono text-[9px] text-text-sub uppercase tracking-[0.5em]">System_Status: Optimal</span>
            <span className="font-mono text-[9px] text-text-sub uppercase tracking-[0.5em]">Buffer: 100%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayer;