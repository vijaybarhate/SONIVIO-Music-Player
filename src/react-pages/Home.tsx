import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getTrendingTracks, searchTracks } from '../services/youtube';
import type { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { InlineError, ErrorState } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

interface SectionProps {
  title: string;
  fetcher: () => Promise<Track[]>;
}

const HorizontalSection = React.memo(({ title, fetcher }: SectionProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetcher();
      setTracks(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">{title}</h2>
      <div className="flex gap-3 md:gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-[140px] md:w-[180px] flex-shrink-0 animate-pulse bg-canvas-soft-2 border border-hairline rounded-lg h-[200px] md:h-[240px]" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="mb-8 md:mb-12">
      <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">{title}</h2>
      <InlineError onRetry={loadData} />
    </div>
  );

  if (!tracks.length) return null;

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">{title}</h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x">
        {tracks.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
            className="w-[140px] md:w-[180px] flex-shrink-0 snap-start"
          >
            <SongCard track={track} context={tracks} />
          </motion.div>
        ))}
      </div>
    </section>
  );
});

const MoodMixes = React.memo(() => {
  const moods = useMemo(() => [
    { mood: "Chill Vibes", query: "chill lofi music 2026", color: "from-violet-soft to-cyan-soft" },
    { mood: "Energy Boost", query: "high energy workout music 2026", color: "from-warning-soft to-error-soft" },
    { mood: "Focus Mode", query: "deep focus study music lofi", color: "from-link-bg-soft to-cyan-soft" },
    { mood: "Late Night", query: "late night drive synthwave playlist", color: "from-violet-soft to-error-soft" },
    { mood: "Happy Beats", query: "happy feel good pop songs 2026", color: "from-warning-soft to-cyan-soft" },
    { mood: "Acoustic", query: "acoustic guitar covers chill", color: "from-canvas-soft-2 to-hairline" }
  ], []);

  const { play } = usePlayerStore();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleMoodClick = async (query: string, index: number) => {
    try {
      setLoadingIndex(index);
      const tracks = await searchTracks(query, 20);
      if (tracks.length > 0) {
        play(tracks[0], tracks);
      }
    } catch (error) {
      console.error("Failed to load mood mix", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">Mood Mixes.</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {moods.map((item, i) => (
          <motion.div
            key={item.mood}
            onClick={() => handleMoodClick(item.query, i)}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className={`h-24 md:h-28 rounded-lg p-5 cursor-pointer relative overflow-hidden bg-gradient-to-br ${item.color} border border-hairline flex flex-col justify-between group transition-all duration-200 card-shadow-lvl3 hover:card-shadow-lvl4 hover:-translate-y-0.5`}
          >
            <div className="absolute inset-0 bg-canvas/10 group-hover:bg-transparent transition-colors duration-200" />
            <h3 className="relative z-10 font-sans font-semibold text-base text-ink tracking-tight">
              {item.mood}
            </h3>
            
            <div className="relative z-10 flex items-center justify-between text-xs text-mute font-mono">
              <span>Mix Playlist</span>
              <button className="w-8 h-8 rounded-full bg-ink text-canvas flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-md">
                {loadingIndex === i ? (
                  <span className="w-3.5 h-3.5 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play size={12} fill="currentColor" className="ml-0.5" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

const getGreetingData = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good morning,",
      tagline: "YOUR MORNING SOUNDTRACK."
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good afternoon,",
      tagline: "YOUR AFTERNOON ROTATION."
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      greeting: "Good evening,",
      tagline: "YOUR EVENING SOUNDTRACK."
    };
  } else {
    return {
      greeting: "Late night grooves,",
      tagline: "YOUR AFTER-HOURS ROTATION."
    };
  }
};

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { play } = usePlayerStore();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        setError(false);
        const trendingData = await getTrendingTracks('US', 5);
        if (trendingData.length > 0) {
          setFeatured(trendingData[0]);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  const trendingIndiaFetcher = useCallback(() => getTrendingTracks('IN', 12), []);
  const topGlobalFetcher = useCallback(() => getTrendingTracks('US', 10), []);
  const newReleasesFetcher = useCallback(() => searchTracks('new songs 2026 official music video hits', 12), []);
  const indianChartsFetcher = useCallback(() => searchTracks('top hindi songs 2026 trending', 10, 'IN'), []);

  if (error) return <ErrorState title="Connection Error" message="Unable to load the discovery feed." actionLabel="Retry" />;

  const greetingData = getGreetingData();

  return (
    <div className="pb-12">
      {/* Hero Header */}
      <div className="mb-6 md:mb-8 select-none">
        <span className="font-mono text-[10px] text-mute uppercase tracking-wider mb-1.5 block">
          {greetingData.tagline}
        </span>
        <h1 className="text-2xl md:text-4xl font-sans font-semibold tracking-tight text-ink leading-tight">
          {greetingData.greeting}{" "}
          <span className="bg-gradient-to-r from-link via-violet to-highlight-pink bg-clip-text text-transparent">
            Vijay.
          </span>
        </h1>
      </div>

      {/* Featured Banner with Mesh Gradient Backdrop */}
      {loading ? (
        <div className="mb-8 md:mb-12 h-[180px] md:h-[240px] bg-canvas-soft-2 border border-hairline animate-pulse rounded-lg" />
      ) : featured ? (
        <section 
          className="mb-6 md:mb-10 relative rounded-lg border border-hairline bg-canvas p-5 md:p-8 overflow-hidden flex flex-col justify-between gap-4 md:gap-6 card-shadow-lvl4 cursor-pointer hover:border-hairline-strong transition-all duration-300 group"
          onClick={() => play(featured)}
        >
          {/* Stark mesh gradient backdrop */}
          <div className="absolute inset-0 mesh-gradient-backdrop opacity-70 pointer-events-none" />
          
          <div className="relative z-10 max-w-xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] md:text-xs text-mute uppercase tracking-wider mb-1.5 md:mb-2 block">Featured Mix</span>
              <h2 className="text-xl md:text-3xl font-sans font-semibold text-ink leading-tight tracking-tight mb-1.5 md:mb-2 group-hover:text-link transition-colors line-clamp-2">
                {featured.title}
              </h2>
              <p className="text-body text-xs md:text-sm mt-1 mb-4 md:mb-6 truncate">{featured.artist}</p>
            </div>
            
            <button 
              className="h-10 px-5 bg-ink text-canvas font-sans font-medium text-sm rounded-full flex items-center gap-2 shadow-md hover:bg-body transition-colors self-start"
              onClick={(e) => {
                e.stopPropagation();
                play(featured);
              }}
            >
              <Play size={14} fill="currentColor" />
              <span>Play Now</span>
            </button>
          </div>

          {/* Right: Album Thumbnail Artwork — hidden on very small mobile */}
          <div className="relative z-10 flex-shrink-0 hidden sm:block w-28 h-28 md:w-36 md:h-36 rounded-md overflow-hidden border border-hairline shadow-md group-hover:scale-102 transition-transform duration-300 self-end">
            <img 
              src={featured.thumbnail} 
              alt={featured.title} 
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </section>
      ) : null}

      <HorizontalSection title="Trending in India." fetcher={trendingIndiaFetcher} />
      <HorizontalSection title="Top Global Hits." fetcher={topGlobalFetcher} />
      <MoodMixes />
      <HorizontalSection title="New Releases." fetcher={newReleasesFetcher} />
      <HorizontalSection title="Indian Charts." fetcher={indianChartsFetcher} />
    </div>
  );
};

export default React.memo(Home);
