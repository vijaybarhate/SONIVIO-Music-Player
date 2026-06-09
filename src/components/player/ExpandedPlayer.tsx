import React, { useEffect, useState } from 'react';
import { ChevronDown, Share2, Heart, ArrowUpRight } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { motion, AnimatePresence } from 'framer-motion';
import { getRelatedTracks, getTrackDetails } from '../../services/youtube';
import type { Track } from '../../types';
import SongCard from '../cards/SongCard';

const ExpandedPlayer: React.FC = () => {
  const { currentTrack } = usePlayerStore();
  const { likedSongs, toggleLike } = useLibraryStore();
  const { isExpanded, setExpanded } = useUiStore();

  const isLiked = currentTrack ? likedSongs.some(t => t.id === currentTrack.id) : false;

  const [relatedTracks, setRelatedTracks] = useState<Track[]>([]);
  const [trackDetails, setTrackDetails] = useState<Track | null>(null);

  useEffect(() => {
    if (isExpanded && currentTrack) {
      getRelatedTracks(currentTrack.id, 6, currentTrack.title).then(setRelatedTracks).catch(console.error);
      getTrackDetails(currentTrack.id).then(setTrackDetails).catch(console.error);
    }
  }, [isExpanded, currentTrack]);

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const cleanTitle = (title: string) => {
    return title.replace(/\[.*?\]|\(.*?\)|\{.*?\}|\|.*/g, '').trim();
  };

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
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-canvas-soft custom-scrollbar select-none"
        >
          {/* Faint ambient blurred background backdrop */}
          <div 
            className="fixed inset-0 bg-cover bg-center scale-105 blur-3xl opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: `url(${currentTrack.thumbnail})` }}
          />

          {/* Sticky Header */}
          <div className="relative z-10 p-4 md:p-5 flex items-center justify-between sticky top-0 bg-canvas/80 backdrop-blur-md border-b border-hairline">
            <button
              onClick={() => setExpanded(false)}
              className="p-1.5 rounded border border-hairline bg-canvas hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer"
            >
              <ChevronDown size={18} />
            </button>
            
            <div className="text-center flex flex-col">
              <span className="font-mono text-[9px] text-mute uppercase tracking-wider">Now Playing</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-1.5 rounded border border-hairline bg-canvas hover:bg-canvas-soft-2 text-mute hover:text-ink transition-colors cursor-pointer"
                title="Share track"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          {/* Main Container */}
          <div className="relative z-10 flex-1 flex flex-col items-center px-4 md:px-8 py-6 md:py-8 w-full max-w-4xl mx-auto">
            {/* Album Cover Art */}
            <div className="w-full max-w-[220px] sm:max-w-[320px] aspect-square rounded-lg overflow-hidden border border-hairline shadow-lg mb-6 md:mb-8 bg-canvas-soft-2">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Track Info Header */}
            <div className="w-full flex items-center justify-between mb-6 md:mb-8 max-w-xl">
              <div className="min-w-0 flex-1 pr-4 text-center sm:text-left">
                <h1 className="text-xl md:text-2xl font-sans font-semibold text-ink leading-tight tracking-tight mb-1 truncate">
                  {cleanTitle(currentTrack.title)}
                </h1>
                <p className="text-sm font-sans text-body truncate">
                  {currentTrack.artist}
                </p>
              </div>
              
              <button
                onClick={() => toggleLike(currentTrack)}
                className={`p-2 rounded border transition-colors hidden sm:flex ${
                  isLiked 
                    ? 'text-link border-link bg-link-bg-soft/20' 
                    : 'text-mute border-hairline hover:text-ink hover:bg-canvas-soft-2 bg-canvas shadow-sm'
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Controls panel */}
            <div className="w-full max-w-xl mb-8 md:mb-12 border-b border-hairline pb-6 md:pb-8">
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
                    className={`p-2 rounded border transition-colors ${
                      isLiked ? 'text-link border-link bg-link-bg-soft/20' : 'text-mute border-hairline'
                    }`}
                  >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
              <div className="bg-canvas border border-hairline rounded-lg p-5 card-shadow-lvl3">
                <h3 className="font-sans font-semibold text-xs text-ink mb-3 uppercase tracking-wider font-mono text-mute">Track Metadata</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-mute">Artist</span>
                    <span className="text-ink font-semibold">{currentTrack.artist}</span>
                  </div>
                  {trackDetails?.viewCount && (
                    <div className="flex justify-between text-xs">
                      <span className="text-mute">Plays</span>
                      <span className="text-ink font-semibold">{formatViewCount(trackDetails.viewCount)}</span>
                    </div>
                  )}
                  {trackDetails?.publishedAt && (
                    <div className="flex justify-between text-xs">
                      <span className="text-mute">Release Date</span>
                      <span className="text-ink font-semibold">{formatDate(trackDetails.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lyrics card proxy */}
              <div 
                className="bg-canvas border border-hairline hover:border-hairline-strong rounded-lg p-5 flex flex-col justify-center text-left group cursor-pointer transition-colors card-shadow-lvl3 hover:card-shadow-lvl4"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanTitle(currentTrack.title) + ' ' + currentTrack.artist + ' lyrics')}`, '_blank')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sans font-semibold text-xs text-ink uppercase tracking-wider font-mono text-mute">Lyrics search</h3>
                  <ArrowUpRight size={14} className="text-mute group-hover:text-ink transition-colors" />
                </div>
                <p className="font-sans text-xs text-body leading-relaxed">
                  Search for lyrics to "{cleanTitle(currentTrack.title)}" on Google.
                </p>
              </div>
            </div>

            {/* Related items list */}
            {relatedTracks.length > 0 && (
              <div className="w-full max-w-3xl">
                <h2 className="text-sm font-sans font-semibold text-ink mb-4 uppercase tracking-wider font-mono text-mute">Related Tracks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {relatedTracks.map((track) => (
                    <SongCard key={track.id} track={track} context={relatedTracks} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayer;
