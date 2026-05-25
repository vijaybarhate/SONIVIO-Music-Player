import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { motion } from 'framer-motion';

const PlayerControls: React.FC = () => {
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
    queue,
    queueIndex,
    currentTrack,
    progress
  } = usePlayerStore();

  const handleRepeatClick = () => {
    if (repeatMode === 'none') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('none');
  };

  const canNext = queue.length > 0 && (repeatMode === 'all' || queueIndex < queue.length - 1);
  const canPrev = queue.length > 0 && (repeatMode === 'all' || queueIndex > 0 || progress > 3);

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={toggleShuffle}
        className={`transition-all ${shuffle ? 'text-brand' : 'text-text-sub hover:text-white'}`}
        title="SHUFFLE_MODE"
      >
        <Shuffle size={16} strokeWidth={shuffle ? 3 : 2} />
      </button>

      <button
        onClick={previous}
        disabled={!canPrev}
        className={`transition-colors ${canPrev ? 'text-text-sub hover:text-white' : 'text-text-sub/20 cursor-not-allowed'}`}
        title="PREV_TRACK"
      >
        <SkipBack size={22} fill="currentColor" />
      </button>

      <motion.button
        onClick={() => (isPlaying ? pause() : play())}
        whileHover={{ scale: currentTrack ? 1.05 : 1 }}
        whileTap={{ scale: currentTrack ? 0.95 : 1 }}
        disabled={!currentTrack}
        className={`w-12 h-12 flex items-center justify-center bg-brand text-black border border-black transition-all shadow-[4px_4px_0px_0px_rgba(238,255,0,0.3)] hover:shadow-none ${!currentTrack ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-white'}`}
        title={isPlaying ? "PAUSE_SYSTEM" : "INITIALIZE_PLAYBACK"}
      >
        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
      </motion.button>

      <button
        onClick={next}
        disabled={!canNext}
        className={`transition-colors ${canNext ? 'text-text-sub hover:text-white' : 'text-text-sub/20 cursor-not-allowed'}`}
        title="NEXT_TRACK"
      >
        <SkipForward size={22} fill="currentColor" />
      </button>

      <button
        onClick={handleRepeatClick}
        className={`transition-all ${repeatMode !== 'none' ? 'text-brand' : 'text-text-sub hover:text-white'}`}
        title="REPEAT_MODE"
      >
        {repeatMode === 'one' ? <Repeat1 size={16} strokeWidth={3} /> : <Repeat size={16} strokeWidth={repeatMode === 'all' ? 3 : 2} />}
      </button>
    </div>
  );
};

export default PlayerControls;