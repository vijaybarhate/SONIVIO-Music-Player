import React from 'react';

interface EqualizerProps {
  bars?: number;
  className?: string;
  barClassName?: string;
  playing?: boolean;
}

/** Brand motion primitive — staggered equalizer bars driven by pure CSS. */
const Equalizer: React.FC<EqualizerProps> = ({
  bars = 3,
  className = '',
  barClassName = 'w-[2px] bg-current',
  playing = true,
}) => {
  return (
    <div
      className={`flex items-end gap-[2px] ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`eq-bar rounded-full ${barClassName}`}
          style={{
            height: '100%',
            animationDelay: `${(i * 0.13) % 0.6}s`,
            animationDuration: `${0.7 + ((i * 137) % 5) * 0.09}s`,
            animationPlayState: playing ? 'running' : 'paused',
            ['--eq-peak' as string]: `${0.65 + ((i * 89) % 4) * 0.12}`,
          }}
        />
      ))}
    </div>
  );
};

export default Equalizer;
