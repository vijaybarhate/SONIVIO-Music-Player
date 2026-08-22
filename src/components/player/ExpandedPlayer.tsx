import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Share2, Heart, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import Equalizer from '../common/Equalizer';
import { getRelatedTracks, getTrackDetails } from '../../services/youtube';
import type { Track } from '../../types';
import SongCard from '../cards/SongCard';

const EASE = [0.32, 0.72, 0, 1] as const;

/** Ambient pseudo-visualizer — playing-state driven, GPU-only scaleY bars. */
const Visualizer: React.FC<{ playing: boolean }> = ({ playing }) => {
  const bars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        peak: 0.2 + ((i * 7919) % 100) / 100 * 0.8,
        delay: ((i * 331) % 90) / 100,
        duration: 0.6 + ((i * 457) % 70) / 100,
      })),
    []
  );

  return (
    <div className="flex items-end justify-center gap-[3px] h-10 md:h-14 w-full max-w-xl mx-auto" aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className="eq-bar flex-1 max-w-[6px] rounded-full bg-gradient-to-t from-hairline-strong/40 to-ink/70 dark:to-ink/50"
          style={{
            height: '100%',
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            animationPlayState: playing ? 'running' : 'paused',
            ['--eq-peak' as string]: b.peak,
          }}
        />
      ))}
    </div>
  );
};

const ExpandedPlayer: React.FC = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();
  const { isExpanded, setExpanded } = useUiStore();

  const isLiked = currentTrack ? likedSongs.some((t) => t.id === currentTrack.id) : false;

  const [relatedTracks, setRelatedTracks] = useState<Track[]>([]);
  const [trackDetails, setTrackDetails] = useState<Track | null>(null);

  useEffect(() => {
    if (isExpanded && currentTrack) {
      getRelatedTracks(currentTrack.id, 6, currentTrack.title).then(setRelatedTracks).catch(console.error);
      getTrackDetails(currentTrack.id).then(setTrackDetails).catch(console.error);
    }
  }, [isExpanded, currentTrack]);

  // Lock body scroll while expanded
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isExpanded ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  if (!currentTrack) return null;

  const formatViewCount = (count?: string) => {
    if (!count) return '';
    const num = parseInt(count, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`;
    return `${num} views`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const cleanTitle = (title: string) => title.replace(/\[.*?\]|\(.*?\)|\{.*?\}|\|.*/g, '').trim();

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://youtube.com/watch?v=${currentTrack.id}`);
      useUiStore.getState().showToast('Track link copied to clipboard', 'success');
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-canvas-soft custom-scrollbar select-none"
        >
          {/* Atmosphere: blurred artwork + grain + vignette */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center blur-3xl"
              style={{ backgroundImage: `url(${currentTrack.thumbnail})` }}
            />
            <div className="absolute inset-0 mesh-gradient-backdrop opacity-40 dark:opacity-60" />
            <div className="grain-overlay fixed" />
            <div className="absolute inset-0 bg-gradient-to-b from-canvas-soft/30 via-canvas-soft/75 to-canvas-soft" />
          </div>

          {/* Sticky header */}
          <div className="relative z-10 p-4 md:p-5 flex items-center justify-between sticky top-0 glass-bar border-b border-hairline">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpanded(false)}
              aria-label="Close player"
              className="p-1.5 rounded-sm border border-hairline bg-canvas hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
            >
              <ChevronDown size={18} />
            </motion.button>

            <div className="flex items-center gap-2.5">
              <span className="eyebrow">Now Playing</span>
              {isPlaying && <Equalizer bars={4} className="h-3 text-link" />}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              aria-label="Share track"
              title="Share track"
              className="p-1.5 rounded-sm border border-hairline bg-canvas hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
            >
              <Share2 size={14} />
            </motion.button>
          </div>

          {/* Main */}
          <div className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-8 py-6 md:py-10 w-full max-w-4xl mx-auto">
            {/* Artwork — breathes while playing */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
              className={`w-full max-w-[220px] sm:max-w-[320px] aspect-square rounded-lg overflow-hidden border border-hairline modal-shadow-lvl5 mb-6 md:mb-8 bg-canvas-soft-2 ${
                isPlaying ? 'animate-breathe' : ''
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={currentTrack.id}
                  src={currentTrack.thumbnail}
                  alt=""
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </motion.div>

            {/* Title block — staggered entrance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
              className="w-full flex items-center justify-between mb-5 md:mb-6 max-w-xl gap-4"
            >
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h1 className="text-display-md md:text-display-lg text-ink leading-tight mb-1 truncate">
                  {cleanTitle(currentTrack.title)}
                </h1>
                <p className="text-body-sm font-sans text-body truncate">{currentTrack.artist}</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => toggleLike(currentTrack)}
                aria-label={isLiked ? 'Unlike' : 'Like'}
                className={`p-2 rounded-sm border transition-colors hidden sm:flex cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong ${
                  isLiked
                    ? 'text-link border-link bg-link-bg-soft/20'
                    : 'text-mute border-hairline hover:text-ink hover:bg-canvas-soft-2 bg-canvas shadow-sm'
                }`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </motion.button>
            </motion.div>

            {/* Visualizer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full mb-5 md:mb-6 px-4"
            >
              <Visualizer playing={isPlaying} />
            </motion.div>

            {/* Controls panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.24 }}
              className="w-full max-w-xl mb-8 md:mb-12 border-b border-hairline pb-6 md:pb-8"
            >
              <div className="mb-4 md:mb-6">
                <ProgressBar />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1 max-w-[150px] hidden sm:block">
                  <VolumeControl />
                </div>

                <div className="flex justify-center flex-1">
                  <PlayerControls />
                </div>

                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    onClick={() => toggleLike(currentTrack)}
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                    className={`p-2 rounded-sm border transition-colors ${
                      isLiked ? 'text-link border-link bg-link-bg-soft/20' : 'text-mute border-hairline'
                    }`}
                  >
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.34 }}
              className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12"
            >
              <div className="bg-canvas border border-hairline rounded-lg p-5 card-shadow-lvl3">
                <h3 className="eyebrow mb-3">Track Metadata</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">Artist</span>
                    <span className="text-ink font-medium">{currentTrack.artist}</span>
                  </div>
                  {trackDetails?.viewCount && (
                    <div className="flex justify-between text-xs">
                      <span className="text-mute">Plays</span>
                      <span className="text-ink font-medium font-mono tabular-nums">
                        {formatViewCount(trackDetails.viewCount)}
                      </span>
                    </div>
                  )}
                  {trackDetails?.publishedAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-mute">Release Date</span>
                      <span className="text-ink font-medium font-mono tabular-nums">
                        {formatDate(trackDetails.publishedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="bg-canvas border border-hairline hover:border-hairline-strong rounded-lg p-5 flex flex-col justify-center text-left group cursor-pointer transition-colors card-shadow-lvl3 hover:card-shadow-lvl4"
                onClick={() =>
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(
                      cleanTitle(currentTrack.title) + ' ' + currentTrack.artist + ' lyrics'
                    )}`,
                    '_blank'
                  )
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="eyebrow">Lyrics search</h3>
                  <ArrowUpRight size={14} className="text-mute group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="font-sans text-xs text-body leading-relaxed">
                  Search for lyrics to "{cleanTitle(currentTrack.title)}" on Google.
                </p>
              </div>
            </motion.div>

            {/* Related */}
            {relatedTracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.42 }}
                className="w-full max-w-3xl"
              >
                <h2 className="eyebrow mb-4">Related Tracks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {relatedTracks.map((track) => (
                    <SongCard key={track.id} track={track} context={relatedTracks} variant="horizontal" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayer;
