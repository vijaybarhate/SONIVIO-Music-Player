import React, { useState } from 'react';
import { ListMusic, Maximize2, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { motion, AnimatePresence } from 'framer-motion';
import QueueDrawer from '../queue/QueueDrawer';
import ExpandedPlayer from './ExpandedPlayer';

const BottomPlayer: React.FC = () => {
  const { currentTrack, setExpanded, likedSongs, toggleLike } = usePlayerStore();
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const isLiked = currentTrack ? likedSongs.some(t => t.id === currentTrack.id) : false;

  return (
    <>
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[88px]"
          >
            <div className="h-full bg-surface/80 backdrop-blur-2xl border-t border-stroke px-4 md:px-6 flex items-center justify-between gap-4">
              {/* Left: Track Info */}
              <div className="flex items-center gap-4 min-w-0 md:w-[30%]">
                <div
                  onClick={() => setExpanded(true)}
                  className="relative group flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border border-stroke"
                >
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={16} className="text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4
                    onClick={() => setExpanded(true)}
                    className="text-sm font-sans font-medium truncate text-text-primary hover:text-accent-start cursor-pointer transition-colors"
                  >
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs font-sans text-text-muted truncate">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: Controls & Progress */}
              <div className="hidden md:flex flex-col items-center justify-center gap-1.5 flex-1 max-w-2xl px-8 mt-1">
                <PlayerControls />
                <ProgressBar />
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-4 md:w-[30%] justify-end">
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className={`transition-colors ${isLiked ? 'text-accent-start' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <div className="md:hidden">
                  <PlayerControls compact />
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => setIsQueueOpen(true)}
                    className={`transition-colors ${isQueueOpen ? 'text-accent-start' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    <ListMusic size={18} />
                  </button>
                  <div className="w-px h-6 bg-stroke" />
                  <VolumeControl />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      <ExpandedPlayer />
    </>
  );
};

export default BottomPlayer;