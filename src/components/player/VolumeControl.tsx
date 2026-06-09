import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const effectiveVol = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2 group w-28 select-none">
      <button
        onClick={toggleMute}
        className="text-mute hover:text-ink transition-colors p-1 hover:bg-canvas-soft-2 rounded cursor-pointer"
        title="Toggle mute"
      >
        <VolumeIcon size={14} />
      </button>

      <div className="relative flex-1 flex items-center h-3 cursor-pointer">
        <input
          type="range"
          min="0"
          max="100"
          value={effectiveVol}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="absolute w-full z-10 opacity-0 cursor-pointer h-full"
        />
        {/* Track Background */}
        <div className="absolute w-full h-[3px] bg-hairline rounded-full group-hover:h-1 transition-all duration-150" />
        
        {/* Progress Fill */}
        <div
          className="absolute h-[3px] bg-ink rounded-full pointer-events-none group-hover:h-1 transition-all duration-150"
          style={{ width: `${effectiveVol}%` }}
        />
        
        {/* Slider Handle */}
        <div
          className="absolute w-2 h-2 rounded-full bg-canvas border border-hairline-strong opacity-0 group-hover:opacity-100 pointer-events-none shadow-sm transition-opacity duration-150"
          style={{ left: `calc(${effectiveVol}% - 4px)` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;