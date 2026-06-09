import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useQueueStore } from '../../store/queueStore';

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
    currentTrack,
    progress
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
        <button
          onClick={toggleShuffle}
          className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-all cursor-pointer ${
            shuffle ? 'text-link' : 'text-mute hover:text-ink'
          }`}
        >
          <Shuffle size={14} strokeWidth={shuffle ? 2.5 : 2} />
        </button>
      )}

      <button
        onClick={previous}
        disabled={!canPrev}
        className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer ${
          canPrev ? 'text-mute hover:text-ink' : 'text-mute/20 cursor-not-allowed'
        }`}
      >
        <SkipBack size={16} fill="currentColor" />
      </button>

      <button
        onClick={() => (isPlaying ? pause() : play())}
        disabled={!currentTrack}
        className={`w-9 h-9 flex items-center justify-center rounded-full bg-ink text-canvas hover:bg-body hover:scale-102 active:scale-98 transition-all cursor-pointer ${
          !currentTrack ? 'opacity-30 cursor-not-allowed' : 'shadow-sm'
        }`}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
      </button>

      <button
        onClick={next}
        disabled={!canNext}
        className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-colors cursor-pointer ${
          canNext ? 'text-mute hover:text-ink' : 'text-mute/20 cursor-not-allowed'
        }`}
      >
        <SkipForward size={16} fill="currentColor" />
      </button>

      {!compact && (
        <button
          onClick={handleRepeatClick}
          className={`p-1.5 rounded hover:bg-canvas-soft-2 transition-all cursor-pointer ${
            repeatMode !== 'none' ? 'text-link' : 'text-mute hover:text-ink'
          }`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 size={14} strokeWidth={2.5} />
          ) : (
            <Repeat size={14} strokeWidth={repeatMode === 'all' ? 2.5 : 2} />
          )}
        </button>
      )}
    </div>
  );
};

export default PlayerControls;