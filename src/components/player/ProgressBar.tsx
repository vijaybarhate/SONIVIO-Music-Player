import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { formatTime } from '../../utils/formatTime';

const ProgressBar: React.FC = () => {
  const { progress, duration, seek } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(progress);

  useEffect(() => {
    if (!isDragging) setLocalValue(progress);
  }, [progress, isDragging]);

  const pct = duration > 0 ? ((isDragging ? localValue : progress) / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2.5 w-full group select-none">
      {/* Elapsed Time */}
      <span className="text-[10px] text-mute font-mono tabular-nums w-8 text-right">
        {formatTime(isDragging ? localValue : progress)}
      </span>

      {/* Slider Input */}
      <div className="relative flex-1 flex items-center h-3 cursor-pointer">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={isDragging ? localValue : progress}
          onInput={(e) => {
            setIsDragging(true);
            setLocalValue(Number(e.currentTarget.value));
          }}
          onChange={(e) => {
            seek(Number(e.currentTarget.value));
            setIsDragging(false);
          }}
          className="absolute w-full z-10 opacity-0 cursor-pointer h-full"
        />
        {/* Track Background */}
        <div className="absolute w-full h-1 bg-hairline rounded-full group-hover:h-1.5 transition-all duration-150" />
        
        {/* Progress Fill */}
        <div
          className="absolute h-1 rounded-full bg-ink pointer-events-none group-hover:h-1.5 transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
        
        {/* Handle Thumb */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-canvas border border-hairline-strong opacity-0 group-hover:opacity-100 pointer-events-none shadow-sm transition-opacity duration-150"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>

      {/* Duration Time */}
      <span className="text-[10px] text-mute font-mono tabular-nums w-8">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;