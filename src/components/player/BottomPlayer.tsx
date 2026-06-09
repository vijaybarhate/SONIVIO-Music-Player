import React from 'react';
import { ListMusic, Maximize2, Heart, Play, Pause, SkipForward } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { motion, AnimatePresence } from 'framer-motion';
import QueueDrawer from '../queue/QueueDrawer';
import ExpandedPlayer from './ExpandedPlayer';

const BottomPlayer: React.FC = () => {
  const { currentTrack, isPlaying, play, pause, next } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();
  const { setExpanded, isQueueOpen, setQueueOpen } = useUiStore();

  const isLiked = currentTrack ? likedSongs.some(t => t.id === currentTrack.id) : false;

  return (
    <>
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 88 }}
            animate={{ y: 0 }}
            exit={{ y: 88 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50 select-none"
          >
            {/* Mobile player — two-row layout with progress bar */}
            <div className="md:hidden bg-canvas/90 backdrop-blur-md border-t border-hairline">
              {/* Progress bar at the very top of the mobile player */}
              <div className="px-3 pt-2">
                <ProgressBar />
              </div>
              
              {/* Track info + controls row */}
              <div className="flex items-center justify-between px-3 py-2 gap-2">
                {/* Left: cover + info */}
                <div
                  className="flex items-center gap-2.5 min-w-0 flex-1"
                  onClick={() => setExpanded(true)}
                >
                  <div className="relative flex-shrink-0 cursor-pointer rounded overflow-hidden border border-hairline shadow-sm">
                    <img
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-sans font-semibold truncate text-ink leading-tight">
                      {currentTrack.title}
                    </h4>
                    <p className="text-[10px] font-sans text-mute truncate mt-0.5 leading-tight">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>

                {/* Right: simplified play/pause + next controls */}
                <div className="flex items-center gap-3 flex-shrink-0 pr-1">
                  <button
                    onClick={() => toggleLike(currentTrack)}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isLiked ? 'text-link' : 'text-mute'
                    }`}
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => (isPlaying ? pause() : play())}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-ink text-canvas hover:bg-body hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-sm animate-none"
                  >
                    {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <button
                    onClick={next}
                    className="p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer text-mute hover:text-ink"
                    aria-label="Next track"
                  >
                    <SkipForward size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop player — single-row layout (unchanged) */}
            <div className="hidden md:flex h-[88px] bg-canvas/85 backdrop-blur-md border-t border-hairline px-6 items-center justify-between gap-4">
              {/* Left: Track Album Cover & Title Info */}
              <div className="flex items-center gap-3.5 min-w-0 w-[30%]">
                <div
                  onClick={() => setExpanded(true)}
                  className="relative group flex-shrink-0 cursor-pointer rounded overflow-hidden border border-hairline shadow-sm"
                >
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    width={44}
                    height={44}
                    className="w-11 h-11 object-cover transition-transform duration-250 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={13} className="text-canvas drop-shadow-sm" />
                  </div>
                </div>
                
                <div className="min-w-0">
                  <h4
                    onClick={() => setExpanded(true)}
                    className="text-xs font-sans font-semibold truncate text-ink hover:text-link cursor-pointer transition-colors leading-tight"
                  >
                    {currentTrack.title}
                  </h4>
                  <p className="text-[10px] font-sans text-mute truncate mt-0.5 leading-tight">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: Playback Controls & Timeline Slider */}
              <div className="flex flex-col items-center justify-center gap-1.5 flex-1 max-w-xl px-4 mt-0.5">
                <PlayerControls />
                <ProgressBar />
              </div>

              {/* Right: Actions & Volume */}
              <div className="flex items-center gap-4 w-[30%] justify-end">
                <button
                  onClick={() => toggleLike(currentTrack)}
                  className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer ${
                    isLiked ? 'text-link' : 'text-mute hover:text-ink'
                  }`}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => setQueueOpen(!isQueueOpen)}
                  className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer ${
                    isQueueOpen ? 'text-link' : 'text-mute hover:text-ink'
                  }`}
                  aria-label="Toggle queue"
                >
                  <ListMusic size={16} />
                </button>
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