import React from 'react';
import { ListMusic, Maximize2, Heart, Play, Pause, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import Equalizer from '../common/Equalizer';
import QueueDrawer from '../queue/QueueDrawer';
import ExpandedPlayer from './ExpandedPlayer';

const BottomPlayer: React.FC = () => {
  const { currentTrack, isPlaying, play, pause, next } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();
  const { setExpanded, isQueueOpen, setQueueOpen } = useUiStore();

  const isLiked = currentTrack ? likedSongs.some((t) => t.id === currentTrack.id) : false;

  return (
    <>
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 110 }}
            animate={{ y: 0 }}
            exit={{ y: 110 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50 select-none"
          >
            {/* Mobile player */}
            <div className="md:hidden glass-bar border-t border-hairline">
              <div className="px-3 pt-2">
                <ProgressBar />
              </div>

              <div className="flex items-center justify-between px-3 py-2 gap-2">
                <div
                  className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  onClick={() => setExpanded(true)}
                >
                  <div className="relative flex-shrink-0 rounded-sm overflow-hidden border border-hairline shadow-sm">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={currentTrack.id}
                        src={currentTrack.thumbnail}
                        alt=""
                        width={40}
                        height={40}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-10 h-10 object-cover"
                      />
                    </AnimatePresence>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-sans font-medium truncate text-ink leading-tight">
                      {currentTrack.title}
                    </h4>
                    <p className="text-[10px] font-sans text-mute truncate mt-0.5 leading-tight">
                      {currentTrack.artist}
                    </p>
                  </div>
                  {isPlaying && (
                    <Equalizer bars={3} className="h-3 text-link flex-shrink-0 hidden min-[380px]:flex" />
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 pr-1">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleLike(currentTrack)}
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isLiked ? 'text-link' : 'text-mute'
                    }`}
                  >
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => (isPlaying ? pause() : play())}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-ink text-canvas cursor-pointer card-shadow-lvl3"
                  >
                    {isPlaying ? (
                      <Pause size={13} fill="currentColor" />
                    ) : (
                      <Play size={13} fill="currentColor" className="ml-0.5" />
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85, x: 2 }}
                    onClick={next}
                    aria-label="Next track"
                    className="p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer text-mute hover:text-ink"
                  >
                    <SkipForward size={16} fill="currentColor" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Desktop player — glass chrome */}
            <div className="hidden md:flex h-[88px] glass-bar border-t border-hairline px-6 items-center justify-between gap-4">
              {/* Left: artwork + info */}
              <div className="flex items-center gap-3.5 min-w-0 w-[30%]">
                <div
                  onClick={() => setExpanded(true)}
                  className="relative group flex-shrink-0 cursor-pointer rounded-md overflow-hidden border border-hairline shadow-sm"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={currentTrack.id}
                      src={currentTrack.thumbnail}
                      alt=""
                      width={44}
                      height={44}
                      initial={{ opacity: 0, scale: 1.1, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                      className="w-11 h-11 object-cover transition-transform duration-300 group-hover:scale-106"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={13} className="text-canvas drop-shadow-sm" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      onClick={() => setExpanded(true)}
                      className="text-xs font-sans font-medium truncate text-ink hover:text-link cursor-pointer transition-colors leading-tight"
                    >
                      {currentTrack.title}
                    </h4>
                    {isPlaying && (
                      <Equalizer bars={3} className="h-2.5 text-link flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] font-sans text-mute truncate mt-0.5 leading-tight">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: controls + timeline */}
              <div className="flex flex-col items-center justify-center gap-1.5 flex-1 max-w-xl px-4 mt-0.5">
                <PlayerControls />
                <ProgressBar />
              </div>

              {/* Right: actions + volume */}
              <div className="flex items-center gap-4 w-[30%] justify-end">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleLike(currentTrack)}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                  className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer ${
                    isLiked ? 'text-link' : 'text-mute hover:text-ink'
                  }`}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQueueOpen(!isQueueOpen)}
                  aria-label="Toggle queue"
                  aria-pressed={isQueueOpen}
                  className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer relative ${
                    isQueueOpen ? 'text-link' : 'text-mute hover:text-ink'
                  }`}
                >
                  <ListMusic size={16} />
                  {isQueueOpen && (
                    <motion.span
                      layoutId="queue-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-link"
                    />
                  )}
                </motion.button>
                <div className="w-px h-5 bg-hairline" />
                <VolumeControl />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QueueDrawer isOpen={isQueueOpen} onClose={() => setQueueOpen(false)} />
      <ExpandedPlayer />
    </>
  );
};

export default BottomPlayer;
