import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

interface PlayerControlsProps {
  compact?: boolean;
}

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
    <div className="flex items-center gap-4 md:gap-6">
      {!compact && (
        <button
          onClick={toggleShuffle}
          className={`transition-all ${shuffle ? 'text-accent-start' : 'text-text-muted hover:text-text-primary'}`}
        >
          <Shuffle size={16} strokeWidth={shuffle ? 3 : 2} />
        </button>
      )}

      <button
        onClick={previous}
        disabled={!canPrev}
        className={`transition-colors ${canPrev ? 'text-text-muted hover:text-text-primary' : 'text-text-muted/20 cursor-not-allowed'}`}
      >
        <SkipBack size={20} fill="currentColor" />
      </button>

      <button
        onClick={() => (isPlaying ? pause() : play())}
        disabled={!currentTrack}
        className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-text-primary text-bg hover:scale-105 active:scale-95 transition-all ${!currentTrack ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>

      <button
        onClick={next}
        disabled={!canNext}
        className={`transition-colors ${canNext ? 'text-text-muted hover:text-text-primary' : 'text-text-muted/20 cursor-not-allowed'}`}
      >
        <SkipForward size={20} fill="currentColor" />
      </button>

      {!compact && (
        <button
          onClick={handleRepeatClick}
          className={`transition-all ${repeatMode !== 'none' ? 'text-accent-start' : 'text-text-muted hover:text-text-primary'}`}
        >
          {repeatMode === 'one' ? <Repeat1 size={16} strokeWidth={3} /> : <Repeat size={16} strokeWidth={repeatMode === 'all' ? 3 : 2} />}
        </button>
      )}
    </div>
  );
};

export default PlayerControls;