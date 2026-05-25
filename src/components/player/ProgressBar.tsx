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
    <div className="flex items-center gap-4 w-full group">
      <span className="text-[10px] text-digital font-mono tabular-nums w-12 text-right tracking-tighter">
        {formatTime(isDragging ? localValue : progress)}
      </span>

      <div className="relative flex-1 flex items-center h-4">
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
        <div className="absolute w-full h-[2px] bg-border-hard" />
        {/* Progress Fill */}
        <div
          className="absolute h-[2px] bg-brand pointer-events-none shadow-[0_0_8px_rgba(238,255,0,0.5)]"
          style={{ width: `${pct}%` }}
        />
        {/* Thumb Indicator */}
        <div
          className="absolute w-1 h-3 bg-brand pointer-events-none -mt-[0.5px] border border-black group-hover:h-4 transition-all"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>

      <span className="text-[10px] text-text-sub font-mono tabular-nums w-12 tracking-tighter">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;