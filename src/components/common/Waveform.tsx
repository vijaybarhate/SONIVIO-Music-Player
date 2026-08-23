import React, { useId } from 'react';

interface WaveformProps {
  className?: string;
  /** Skip entry choreography (e.g. reduced-motion or re-renders) */
  instant?: boolean;
}

const WAVE =
  'M0 118 C 62 44, 128 176, 196 96 S 318 34, 398 106 S 536 52, 636 142 S 758 168, 835 80';

/**
 * Signature brand moment — a waveform that DRAWS itself (three outline
 * strokes, pen easing) then FILLS left→right behind the pen.
 */
const Waveform: React.FC<WaveformProps> = ({ className = '', instant = false }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipFill = `wf-fill-${uid}`;
  const gradStroke = `wg-${uid}`;
  const gradFill = `wgf-${uid}`;

  return (
    <svg
      viewBox="0 0 835 230"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradStroke} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={gradFill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.02" />
        </linearGradient>
        <clipPath id={clipFill}>
          <rect
            x="-2"
            y="0"
            width="839"
            height="230"
            className={instant ? '' : 'wipe-x'}
            style={instant ? undefined : { ['--d' as string]: '1.72s' }}
          />
        </clipPath>
      </defs>

      {/* Fill — wipes in behind the pen */}
      <g clipPath={`url(#${clipFill})`}>
        <path d={`${WAVE} L835 230 L0 230 Z`} fill={`url(#${gradFill})`} />
      </g>

      {/* Outline strokes — draw themselves, widest + faintest first */}
      <path
        d={WAVE}
        pathLength={1}
        fill="none"
        stroke={`url(#${gradStroke})`}
        strokeWidth="6.2"
        strokeLinecap="round"
        opacity="0.17"
        className={instant ? '' : 'draw-line'}
        style={instant ? undefined : { ['--d' as string]: '1.42s', animationDuration: '1.7s' }}
      />
      <path
        d={WAVE}
        pathLength={1}
        fill="none"
        stroke={`url(#${gradStroke})`}
        strokeWidth="4.6"
        strokeLinecap="round"
        opacity="0.26"
        className={instant ? '' : 'draw-line'}
        style={instant ? undefined : { ['--d' as string]: '1.46s', animationDuration: '1.65s' }}
      />
      <path
        d={WAVE}
        pathLength={1}
        fill="none"
        stroke={`url(#${gradStroke})`}
        strokeWidth="3.4"
        strokeLinecap="round"
        className={instant ? '' : 'draw-line'}
        style={instant ? undefined : { ['--d' as string]: '1.5s' }}
      />
    </svg>
  );
};

export default Waveform;
