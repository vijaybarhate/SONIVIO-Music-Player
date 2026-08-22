import React from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';

const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const effectiveVol = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2 group w-28 select-none">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title="Toggle mute"
        className="text-mute hover:text-ink transition-colors p-1 hover:bg-canvas-soft-2 rounded cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
      >
        <VolumeIcon size={14} />
      </motion.button>

      <div className="relative flex-1 flex items-center h-3 cursor-pointer">
        <input
          type="range"
          min="0"
          max="100"
          value={effectiveVol}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="absolute w-full z-10 opacity-0 cursor-pointer h-full focus-visible:outline-none"
        />
        <div className="absolute w-full h-[3px] bg-hairline rounded-full group-hover:h-1 transition-all duration-150" />
        <div
          className="absolute h-[3px] bg-ink rounded-full pointer-events-none group-hover:h-1 transition-all duration-150"
          style={{ width: `${effectiveVol}%` }}
        />
        <div
          className={`absolute w-2.5 h-2.5 rounded-full bg-canvas border border-hairline-strong pointer-events-none transition-all duration-150 ${
            effectiveVol > 0 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: `calc(${effectiveVol}% - 5px)` }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
