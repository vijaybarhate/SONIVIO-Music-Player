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
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-0"
          >
            <div className="bg-bg border-t border-border-hard p-3 md:p-4 flex items-center justify-between gap-4 relative overflow-hidden">
              {/* Background Label */}
              <div className="absolute top-0 right-4 text-[60px] font-display text-white/[0.03] pointer-events-none select-none leading-none">
                PLAYBACK_SYSTEM_01
              </div>

              {/* Track Info */}
              <div className="flex items-center gap-4 min-w-0 flex-1 md:flex-none md:w-[30%]">
                <div
                  onClick={() => setExpanded(true)}
                  className="relative group flex-shrink-0 cursor-pointer border border-border-hard"
                >
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                  <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={16} className="text-black bg-brand p-1" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-brand bg-brand/10 px-1 border border-brand/20">NOW_PLAYING</span>
                    <button
                      onClick={() => toggleLike(currentTrack)}
                      className={`transition-colors ${isLiked ? 'text-brand' : 'text-text-sub hover:text-brand'}`}
                    >
                      <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <h4
                    onClick={() => setExpanded(true)}
                    className="text-sm font-bold font-mono tracking-tight truncate text-text hover:text-brand cursor-pointer uppercase"
                  >
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] font-mono text-text-sub truncate uppercase tracking-wider">
                    SRC: {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="hidden md:flex flex-col items-center gap-3 flex-1 max-w-2xl px-8 border-x border-border-hard">
                <PlayerControls />
                <ProgressBar />
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-6 md:w-[30%] justify-end">
                <div className="md:hidden">
                  <PlayerControls />
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <button
                    onClick={() => setIsQueueOpen(true)}
                    className={`flex flex-col items-center gap-1 transition-all ${isQueueOpen ? 'text-brand' : 'text-text-sub hover:text-brand'}`}
                  >
                    <ListMusic size={18} />
                    <span className="text-[9px] font-mono uppercase">Queue</span>
                  </button>
                  <div className="w-px h-8 bg-border-hard" />
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