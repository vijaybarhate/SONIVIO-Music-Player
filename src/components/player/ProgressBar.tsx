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
    <div className="flex items-center gap-3 w-full group">
      <span className="text-[11px] text-text-muted font-sans tabular-nums w-10 text-right">
        {formatTime(isDragging ? localValue : progress)}
      </span>

      <div className="relative flex-1 flex items-center h-4 cursor-pointer">
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
        <div className="absolute w-full h-1.5 bg-stroke rounded-full group-hover:h-2 transition-all duration-200" />
        {/* Progress Fill */}
        <div
          className="absolute h-1.5 rounded-full accent-gradient pointer-events-none group-hover:h-2 transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
        {/* Thumb Indicator */}
        <div
          className="absolute w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 pointer-events-none shadow-md transition-opacity duration-200"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      <span className="text-[11px] text-text-muted font-sans tabular-nums w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;