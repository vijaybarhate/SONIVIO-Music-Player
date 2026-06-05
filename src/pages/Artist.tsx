import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelDetails, getChannelVideos } from '../services/youtube';
import { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { LoadingState, ErrorState, InlineError } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ArtistData {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount?: string;
  videoCount?: string;
  bannerUrl?: string;
}

const formatCount = (countStr?: string) => {
  if (!countStr) return '';
  const count = parseInt(countStr, 10);
  if (isNaN(count)) return countStr;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const Artist: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Video sections state
  const [popularVideos, setPopularVideos] = useState<Track[]>([]);
  const [latestVideos, setLatestVideos] = useState<Track[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(false);

  const fetchArtistData = useCallback(async () => {
    if (!channelId) return;
    try {
      setLoading(true);
      setError(false);
      const data = await getChannelDetails(channelId);
      if (data) {
        setArtist(data);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  const fetchVideosData = useCallback(async () => {
    if (!channelId) return;
    try {
      setVideosLoading(true);
      setVideosError(false);
      const [popular, latest] = await Promise.all([
        getChannelVideos(channelId, 'viewCount', 12),
        getChannelVideos(channelId, 'date', 8),
      ]);
      setPopularVideos(popular);
      setLatestVideos(latest);
    } catch (err) {
      setVideosError(true);
    } finally {
      setVideosLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchArtistData();
    fetchVideosData();
  }, [fetchArtistData, fetchVideosData]);

  if (loading) return <LoadingState title="Loading Artist..." />;
  if (error || !artist) return <ErrorState title="Artist Not Found" message="Could not load artist details." actionLabel="Go Back" onAction={() => window.history.back()} />;

  const bannerStyle = artist.bannerUrl 
    ? { backgroundImage: `url(${artist.bannerUrl})` }
    : { backgroundImage: `url(${artist.thumbnail})` }; // Fallback to thumbnail for blur

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      className="pb-12 max-w-6xl mx-auto"
    >
      {/* Hero Banner */}
      <div className="relative h-[250px] md:h-[300px] rounded-3xl overflow-hidden mb-12 shadow-md">
        <div 
          className={`absolute inset-0 bg-cover bg-center ${!artist.bannerUrl ? 'blur-3xl scale-110 opacity-50' : ''}`}
          style={bannerStyle}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-black/20" />
        
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-bg shadow-xl flex-shrink-0">
            <img src={artist.thumbnail} alt={artist.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-display italic tracking-tight text-white mb-2">{artist.title}</h1>
            <p className="font-sans text-sm font-medium text-text-muted">
              {formatCount(artist.subscriberCount)} subscribers {artist.videoCount && `• ${formatCount(artist.videoCount)} videos`}
            </p>
          </div>
          <a 
            href={`https://youtube.com/channel/${artist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans text-sm font-medium transition-all backdrop-blur-md whitespace-nowrap mt-4 md:mt-0"
          >
            Visit Channel
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Videos Sections */}
      {videosLoading ? (
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-sans font-bold mb-6 text-text-primary">Popular Videos</h2>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[200px] h-[280px] rounded-2xl bg-surface animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      ) : videosError ? (
        <InlineError message="Failed to load artist videos." onRetry={fetchVideosData} />
      ) : (
        <div className="space-y-12">
          {popularVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-sans font-bold mb-6 text-text-primary">Popular Videos</h2>
              <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 custom-scrollbar snap-x">
                {popularVideos.map((track) => (
                  <div key={track.id} className="w-[200px] flex-shrink-0 snap-start">
                    <SongCard track={track} context={popularVideos} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {latestVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-sans font-bold mb-6 text-text-primary">Latest Uploads</h2>
              <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 custom-scrollbar snap-x">
                {latestVideos.map((track) => (
                  <div key={track.id} className="w-[200px] flex-shrink-0 snap-start">
                    <SongCard track={track} context={latestVideos} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Artist;
