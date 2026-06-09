import React, { useEffect, useState, useCallback } from 'react';
import { getChannelDetails, getChannelVideos } from '../services/youtube';
import type { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { LoadingState, ErrorState, InlineError } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ArtistProps {
  channelId?: string;
}

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

const Artist: React.FC<ArtistProps> = ({ channelId }) => {
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) return <LoadingState title="Loading Artist…" />;
  if (error || !artist) return <ErrorState title="Artist Not Found" message="Could not load artist details." actionLabel="Go Back" onAction={() => window.history.back()} />;

  const bannerStyle = artist.bannerUrl 
    ? { backgroundImage: `url(${artist.bannerUrl})` }
    : { backgroundImage: `url(${artist.thumbnail})` };

  return (
    <div 
      className="pb-12 max-w-6xl mx-auto"
    >
      {/* Artist Hero Banner (Vercel dark polarity band style) */}
      <div className="relative h-[180px] md:h-[240px] rounded-lg overflow-hidden mb-8 md:mb-12 border border-hairline shadow-md bg-ink">
        <div 
          className={`absolute inset-0 bg-cover bg-center ${!artist.bannerUrl ? 'blur-3xl scale-110 opacity-30' : 'opacity-40'}`}
          style={bannerStyle}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 md:gap-6 text-center sm:text-left select-none">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-hairline shadow-lg flex-shrink-0 bg-canvas">
              <img src={artist.thumbnail} alt={artist.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-sans font-semibold tracking-tight text-canvas mb-1">{artist.title}</h1>
              <p className="font-sans text-xs text-mute font-medium">
                {formatCount(artist.subscriberCount)} subscribers {artist.videoCount && `• ${formatCount(artist.videoCount)} videos`}
              </p>
            </div>
          </div>
          
          <a 
            href={`https://youtube.com/channel/${artist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-canvas text-ink font-sans text-xs font-semibold hover:bg-canvas-soft transition-colors cursor-pointer w-fit"
          >
            <span>Visit Channel</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Videos Section */}
      {videosLoading ? (
        <div className="space-y-8 md:space-y-12">
          <div>
            <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-6">Popular Videos.</h2>
            <div className="flex gap-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[180px] h-[240px] rounded-lg bg-canvas border border-hairline animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      ) : videosError ? (
        <InlineError message="Failed to load artist videos." onRetry={fetchVideosData} />
      ) : (
        <div className="space-y-8 md:space-y-12">
          {popularVideos.length > 0 && (
            <section>
              <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">Popular Videos.</h2>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x">
                {popularVideos.map((track) => (
                  <div key={track.id} className="w-[140px] md:w-[180px] flex-shrink-0 snap-start">
                    <SongCard track={track} context={popularVideos} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {latestVideos.length > 0 && (
            <section>
              <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">Latest Uploads.</h2>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x">
                {latestVideos.map((track) => (
                  <div key={track.id} className="w-[140px] md:w-[180px] flex-shrink-0 snap-start">
                    <SongCard track={track} context={latestVideos} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Artist;
