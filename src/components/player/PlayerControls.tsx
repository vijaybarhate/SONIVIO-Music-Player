import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useQueueStore } from '../../store/queueStore';

interface PlayerControlsProps {
  compact?: boolean;
}

const ghostBtn =
  'p-1.5 rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong';

const PlayerControls: React.FC<PlayerControlsProps> = ({ compact }) => {
  const {
    isPlaying,
    shuffle,
    repeatMode,
    play,
    pause,
    next,
    previous,
    toggleShuffle,
    setRepeatMode,
    currentTrack,
    progress,
  } = usePlayerStore();

  const { queue, queueIndex } = useQueueStore();

  const handleRepeatClick = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  const canNext = queue.length > 0 && (repeatMode === 'all' || queueIndex < queue.length - 1);
  const canPrev = queue.length > 0 && (repeatMode === 'all' || queueIndex > 0 || progress > 3);

  return (
    <div className="flex items-center gap-4 md:gap-5 select-none">
      {!compact && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={toggleShuffle}
          aria-label="Shuffle"
          aria-pressed={shuffle}
          className={`${ghostBtn} relative ${shuffle ? 'text-link' : 'text-mute hover:text-ink'}`}
        >
          <Shuffle size={14} strokeWidth={shuffle ? 2.5 : 2} />
          {shuffle && (
            <motion.span
              layoutId="shuffle-dot"
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-link"
            />
          )}
        </motion.button>
      )}

      <motion.button
        whileTap={{ scale: 0.85, x: -2 }}
        onClick={previous}
        disabled={!canPrev}
        aria-label="Previous track"
        className={`${ghostBtn} ${
          canPrev ? 'text-mute hover:text-ink' : 'text-mute/25 cursor-not-allowed'
        }`}
      >
        <SkipBack size={16} fill="currentColor" />
      </motion.button>

      {/* Primary play — morphing icon, layered depth */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (isPlaying ? pause() : play())}
        disabled={!currentTrack}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-ink text-canvas cursor-pointer card-shadow-lvl4 ${
          !currentTrack ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        {/* Halo ring on play */}
        {isPlaying && (
          <motion.span
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-ink pointer-events-none"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isPlaying ? 'pause' : 'play'}
            initial={{ scale: 0.5, opacity: 0, rotate: isPlaying ? -60 : 60 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: isPlaying ? 60 : -60 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause size={15} fill="currentColor" />
            ) : (
              <Play size={15} fill="currentColor" className="ml-0.5" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.85, x: 2 }}
        onClick={next}
        disabled={!canNext}
        aria-label="Next track"
        className={`${ghostBtn} ${
          canNext ? 'text-mute hover:text-ink' : 'text-mute/25 cursor-not-allowed'
        }`}
      >
        <SkipForward size={16} fill="currentColor" />
      </motion.button>

      {!compact && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleRepeatClick}
          aria-label={`Repeat mode: ${repeatMode}`}
          className={`${ghostBtn} relative ${
            repeatMode !== 'none' ? 'text-link' : 'text-mute hover:text-ink'
          }`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 size={14} strokeWidth={2.5} />
          ) : (
            <Repeat size={14} strokeWidth={repeatMode === 'all' ? 2.5 : 2} />
          )}
          {repeatMode !== 'none' && (
            <motion.span
              layoutId="repeat-dot"
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-link"
            />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default PlayerControls;
