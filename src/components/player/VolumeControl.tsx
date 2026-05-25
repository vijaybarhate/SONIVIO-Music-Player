import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const effectiveVol = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-3 group w-32">
      <button
        onClick={toggleMute}
        className="text-text-sub hover:text-brand transition-colors p-1"
        title="MUTE_TOGGLE"
      >
        <VolumeIcon size={16} />
      </button>

      <div className="relative flex-1 flex items-center h-4">
        <input
          type="range"
          min="0"
          max="100"
          value={effectiveVol}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="absolute w-full z-10 opacity-0 cursor-pointer h-full"
        />
        <div className="absolute w-full h-[2px] bg-border-hard" />
        <div
          className="absolute h-[2px] bg-brand pointer-events-none"
          style={{ width: `${effectiveVol}%` }}
        />
        <div
          className="absolute w-1 h-3 bg-brand pointer-events-none -mt-[0.5px] border border-black"
          style={{ left: `calc(${effectiveVol}% - 2px)` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;