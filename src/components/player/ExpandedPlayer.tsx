import React, { useEffect, useState } from 'react';
import { ChevronDown, Share2, Heart, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { motion, AnimatePresence } from 'framer-motion';
import { getRelatedTracks, getTrackDetails } from '../../services/youtube';
import { Track } from '../../types';
import SongCard from '../cards/SongCard';

const ExpandedPlayer: React.FC = () => {
  const { currentTrack, isExpanded, setExpanded, likedSongs, toggleLike, isPlaying } = usePlayerStore();
  const isLiked = currentTrack ? likedSongs.some(t => t.id === currentTrack.id) : false;

  const [relatedTracks, setRelatedTracks] = useState<Track[]>([]);
  const [trackDetails, setTrackDetails] = useState<Track | null>(null);

  useEffect(() => {
    if (isExpanded && currentTrack) {
      getRelatedTracks(currentTrack.id).then(setRelatedTracks).catch(console.error);
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
    return `Released: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const cleanTitle = (title: string) => {
    return title.replace(/\[.*?\]|\(.*?\)|\{.*?\}|\|.*/g, '').trim();
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-bg custom-scrollbar"
        >
          {/* Blurred Background */}
          <div 
            className="fixed inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30 transform transition-transform duration-1000 pointer-events-none"
            style={{ backgroundImage: `url(${currentTrack.thumbnail})` }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 p-6 md:p-8 flex items-center justify-between sticky top-0 bg-bg/50 backdrop-blur-md">
            <button
              onClick={() => setExpanded(false)}
              className="p-3 rounded-full glass text-white hover:text-accent-start transition-colors"
            >
              <ChevronDown size={24} />
            </button>
            <div className="text-center flex flex-col">
              <span className="text-[10px] font-sans font-semibold text-text-muted uppercase tracking-widest">Now Playing</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors hidden md:block">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-4 pb-20 w-full max-w-5xl mx-auto">
            {/* Artwork */}
            <motion.div
              className={`w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden shadow-2xl mb-10 md:mb-12 ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
              style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
            >
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Info */}
            <div className="w-full flex items-center justify-between mb-8 max-w-2xl">
              <div className="min-w-0 flex-1 pr-6 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-display italic tracking-tight text-white mb-2 truncate">
                  {cleanTitle(currentTrack.title)}
                </h1>
                <p className="text-lg font-sans text-text-muted truncate">
                  {currentTrack.artist}
                </p>
              </div>
              
              <button
                onClick={() => toggleLike(currentTrack)}
                className={`p-4 rounded-full transition-colors hidden md:flex ${
                  isLiked ? 'text-accent-start' : 'text-text-muted hover:text-white bg-white/5'
                }`}
              >
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Progress & Controls */}
            <div className="w-full max-w-2xl mb-16">
              <div className="mb-8">
                <ProgressBar />
              </div>

              <div className="flex flex-col items-center gap-8">
                {/* Scaled up Player Controls */}
                <div className="transform scale-125 md:scale-150 flex justify-center w-full">
                  <PlayerControls />
                </div>

                <div className="w-full flex justify-between items-center pt-8 opacity-70 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleLike(currentTrack)}
                    className={`md:hidden p-3 rounded-full transition-colors ${
                      isLiked ? 'text-accent-start' : 'text-text-muted'
                    }`}
                  >
                    <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                  </button>
                  <div className="flex-1 max-w-[200px] hidden md:block">
                    <VolumeControl />
                  </div>
                </div>
              </div>
            </div>

            {/* Track Info Panel */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="bg-surface/50 backdrop-blur-xl border border-stroke rounded-3xl p-6">
                <h3 className="font-sans font-bold text-lg text-text-primary mb-4">About the Track</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted font-sans text-sm">Artist</span>
                    <span className="text-text-primary font-sans text-sm font-medium">{currentTrack.artist}</span>
                  </div>
                  {trackDetails?.viewCount && (
                    <div className="flex justify-between">
                      <span className="text-text-muted font-sans text-sm">Plays</span>
                      <span className="text-text-primary font-sans text-sm font-medium">{formatViewCount(trackDetails.viewCount)}</span>
                    </div>
                  )}
                  {trackDetails?.publishedAt && (
                    <div className="flex justify-between">
                      <span className="text-text-muted font-sans text-sm">Release Date</span>
                      <span className="text-text-primary font-sans text-sm font-medium">{formatDate(trackDetails.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lyrics Placeholder */}
              <div className="bg-surface/50 backdrop-blur-xl border border-stroke rounded-3xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface transition-colors"
                   onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanTitle(currentTrack.title) + ' ' + currentTrack.artist + ' lyrics')}`, '_blank')}
              >
                <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="text-accent-start" />
                </div>
                <h3 className="font-sans font-bold text-lg text-text-primary mb-2">Lyrics Search</h3>
                <p className="font-sans text-sm text-text-muted px-4">
                  Lyrics powered by Google Search. Click to find lyrics for {cleanTitle(currentTrack.title)}.
                </p>
              </div>
            </div>

            {/* Related Tracks */}
            {relatedTracks.length > 0 && (
              <div className="w-full max-w-6xl">
                <h2 className="text-2xl font-sans font-bold mb-6 text-text-primary">Related Tracks</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 custom-scrollbar snap-x">
                  {relatedTracks.map((track) => (
                    <div key={track.id} className="w-[200px] flex-shrink-0 snap-start">
                      <SongCard track={track} context={relatedTracks} />
                    </div>
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
