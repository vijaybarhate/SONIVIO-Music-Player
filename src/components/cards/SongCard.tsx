import React, { useRef } from 'react';
import { Play, Heart } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { TrackContextMenu, TrackMenuButton } from '../common/ContextMenu';
import Equalizer from '../common/Equalizer';

interface SongCardProps {
  track: Track;
  context?: Track[];
  variant?: 'vertical' | 'horizontal';
}

const SPRING = { type: 'spring', stiffness: 400, damping: 28 } as const;

const SongCard: React.FC<SongCardProps> = ({ track, context, variant = 'vertical' }) => {
  const { play, currentTrack, isPlaying } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();

  const isActive = currentTrack?.id === track.id;
  const isLiked = likedSongs.some((t) => t.id === track.id);

  // 3D tilt — pointer-driven, spring-damped, GPU-only transforms
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const rotateX = useTransform(rx, (v) => `${v}deg`);
  const rotateY = useTransform(ry, (v) => `${v}deg`);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTilt = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 7);
    rx.set(-py * 7);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  if (variant === 'horizontal') {
    return (
      <TrackContextMenu track={track}>
        <div
          onClick={() => play(track, context)}
          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer group border transition-colors duration-200 ${
            isActive
              ? 'bg-canvas-soft-2 border-hairline-strong'
              : 'bg-canvas hover:bg-canvas-soft border-hairline hover:border-hairline-strong'
          }`}
        >
          <div className="relative w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 border border-hairline bg-canvas-soft-2">
            <img
              src={track.thumbnail}
              alt=""
              loading="lazy"
              width={480}
              height={360}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
            />
            <div
              className={`absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {isActive ? (
                <Equalizer bars={3} className="h-3 text-canvas" playing={isPlaying} />
              ) : (
                <Play size={10} className="text-canvas ml-0.5" fill="currentColor" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className={`font-sans font-medium text-xs truncate ${isActive ? 'text-link' : 'text-ink'}`}>
              {track.title}
            </h4>
            <p className="font-sans text-[10px] text-mute truncate mt-0.5">{track.artist}</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(track);
            }}
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded hover:bg-canvas transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${
              isLiked ? 'text-link opacity-100' : 'text-mute opacity-0 group-hover:opacity-100 hover:text-ink'
            }`}
          >
            <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>
          <TrackMenuButton track={track} className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100" />
        </div>
      </TrackContextMenu>
    );
  }

  return (
    <TrackContextMenu track={track} className="h-full">
      <div className="perspective-card h-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          style={{ rotateX, rotateY }}
          onClick={() => play(track, context)}
          className="bg-canvas border border-hairline hover:border-hairline-strong rounded-lg overflow-hidden group cursor-pointer transition-[border-color,box-shadow] duration-200 card-shadow-lvl3 hover:card-shadow-lvl4 flex flex-col h-full"
        >
          <div className="p-2 pb-0">
            <div className="relative aspect-square w-full rounded-md overflow-hidden bg-canvas-soft-2 border border-hairline">
              <img
                src={track.thumbnail}
                alt=""
                loading="lazy"
                width={480}
                height={360}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
              />

              {/* Play overlay — springs up on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent flex items-end justify-center pb-3 transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ y: isActive ? 0 : 6, scale: isActive ? 1 : 0.92, opacity: 1 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={SPRING}
                  className="w-10 h-10 rounded-full bg-ink text-canvas flex items-center justify-center shadow-lg"
                >
                  {isActive ? (
                    <Equalizer bars={4} className="h-3.5 text-canvas" playing={isPlaying} />
                  ) : (
                    <Play size={15} fill="currentColor" className="ml-0.5" />
                  )}
                </motion.div>
              </div>

              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(track);
                  }}
                  aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-1 rounded bg-canvas/95 backdrop-blur-sm border border-hairline shadow-sm transition-colors ${
                    isLiked ? 'text-link' : 'text-mute hover:text-ink'
                  }`}
                >
                  <Heart size={11} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="p-2.5 flex flex-col gap-0.5 select-none">
            <h3 className={`font-sans font-medium text-xs truncate ${isActive ? 'text-link' : 'text-ink'}`}>
              {track.title}
            </h3>
            <p className="font-sans text-[10px] text-mute truncate">{track.artist}</p>
          </div>
        </motion.div>
      </div>
    </TrackContextMenu>
  );
};

export default SongCard;