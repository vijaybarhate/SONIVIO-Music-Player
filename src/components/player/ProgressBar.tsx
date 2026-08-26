import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { formatTime } from '../../utils/formatTime';

const ProgressBar: React.FC = () => {
  const { progress, duration, seek } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [localValue, setLocalValue] = useState(progress);

  useEffect(() => {
    if (!isDragging) setLocalValue(progress);
  }, [progress, isDragging]);

  const value = isDragging ? localValue : progress;
  const pct = duration > 0 ? (value / duration) * 100 : 0;
  const showThumb = isDragging || isHovering;

  return (
    <div className="flex items-center gap-2.5 w-full group select-none">
      <span className="text-[10px] text-mute font-mono tabular-nums w-8 text-right">
        {formatTime(value)}
      </span>

      <div className="relative flex-1 flex items-center h-4 cursor-pointer">
        {/* Scrub time tooltip */}
        {showThumb && duration > 0 && (
          <div
            className="absolute -top-6 px-1.5 py-0.5 rounded-sm bg-ink text-canvas text-[9px] font-mono tabular-nums pointer-events-none -translate-x-1/2 whitespace-nowrap z-20"
            style={{ left: `${pct}%` }}
          >
            {formatTime(value)}
          </div>
        )}

        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={value}
          aria-label="Seek"
          onInput={(e) => {
            setIsDragging(true);
            setLocalValue(Number(e.currentTarget.value));
          }}
          onChange={(e) => {
            seek(Number(e.currentTarget.value));
            setIsDragging(false);
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onKeyDown={() => setIsHovering(false)}
          className="absolute w-full z-10 opacity-0 cursor-pointer h-full peer focus-visible:outline-none"
        />

        {/* Track — visible focus ring via peer-focus-visible */}
        <div className="absolute w-full h-1 bg-hairline rounded-full group-hover:h-1.5 transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-link/30 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-transparent" />

        {/* Fill — gradient ink → link at the leading edge */}
        <div
          className="absolute h-1 rounded-full pointer-events-none group-hover:h-1.5 transition-all duration-150"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--ink) 82%, var(--color-link) 100%)',
          }}
        />

        {/* Thumb — glow while engaged */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-canvas border border-hairline-strong pointer-events-none transition-all duration-150 ${
            showThumb ? 'opacity-100 scale-110 shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-link)_18%,transparent)]' : 'opacity-0 scale-90'
          }`}
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      <span className="text-[10px] text-mute font-mono tabular-nums w-8">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;
