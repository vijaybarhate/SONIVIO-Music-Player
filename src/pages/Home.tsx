import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  getTrendingTracks,
  searchTracks
} from '../services/youtube';
import { Track } from '../types';
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
    <div className="mb-12">
      <h2 className="text-xl font-sans font-bold mb-6 text-text-primary">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-[200px] flex-shrink-0 animate-pulse bg-gradient-to-r from-surface via-surface-elevated to-surface rounded-2xl h-[280px]" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="mb-12">
      <h2 className="text-xl font-sans font-bold mb-6 text-text-primary">{title}</h2>
      <InlineError onRetry={loadData} />
    </div>
  );

  if (!tracks.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-sans font-bold mb-6 text-text-primary">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 custom-scrollbar snap-x">
        {tracks.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="w-[200px] flex-shrink-0 snap-start"
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
    { mood: "Chill Vibes", query: "chill lofi music 2025", color: "from-blue-900 to-slate-900" },
    { mood: "Energy Boost", query: "high energy workout music 2025", color: "from-orange-900 to-red-900" },
    { mood: "Focus Mode", query: "deep focus study music", color: "from-green-900 to-emerald-900" },
    { mood: "Late Night", query: "late night drive music playlist", color: "from-purple-900 to-indigo-900" },
    { mood: "Happy Vibes", query: "happy feel good songs 2025", color: "from-yellow-800 to-amber-900" },
    { mood: "Romantic", query: "romantic hindi songs 2025", color: "from-pink-900 to-rose-900" }
  ], []);

  const { play } = usePlayerStore();

  const handleMoodClick = async (query: string) => {
    try {
      const tracks = await searchTracks(query, 20);
      if (tracks.length > 0) {
        play(tracks[0], tracks);
      }
    } catch (error) {
      console.error("Failed to load mood mix", error);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-xl font-sans font-bold mb-6 text-text-primary">Mood Mixes 🎭</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {moods.map((item, i) => (
          <motion.div
            key={item.mood}
            onClick={() => handleMoodClick(item.query)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`h-32 md:h-40 rounded-2xl p-5 cursor-pointer relative overflow-hidden bg-gradient-to-br ${item.color} group shadow-md hover:shadow-glow`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            <h3 className="relative z-10 font-sans font-bold text-xl text-white tracking-tight drop-shadow-md">
              {item.mood}
            </h3>
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-sm">
              <Play size={18} fill="currentColor" className="text-white ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

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

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const trendingIndiaFetcher = useCallback(() => getTrendingTracks('IN', 12), []);
  const topGlobalFetcher = useCallback(() => getTrendingTracks('US', 10), []);
  const newReleasesFetcher = useCallback(() => searchTracks('new songs 2025 official music video', 8), []);
  const indianChartsFetcher = useCallback(() => searchTracks('top hindi songs 2025 trending', 10, 'IN'), []);

  if (error) return <ErrorState title="Connection Error" message="Unable to load the discovery feed." actionLabel="Retry" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-12"
    >
      {/* Hero Greeting */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display italic tracking-tight text-text-primary">
          {getTimeGreeting()}, <span className="bg-clip-text text-transparent accent-gradient">Vijay</span>
        </h1>
        <p className="text-text-muted mt-2 font-sans text-sm">Your audio universe is ready.</p>
      </div>

      {loading ? (
        <div className="mb-12 h-[220px] md:h-[280px] bg-gradient-to-r from-surface via-surface-elevated to-surface animate-pulse rounded-3xl" />
      ) : featured ? (
        <section className="mb-12 relative rounded-3xl overflow-hidden h-[220px] md:h-[280px] group cursor-pointer shadow-glow" onClick={() => play(featured)}>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${featured.thumbnail})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between">
            <div className="glass px-6 py-4 rounded-2xl max-w-lg w-full flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Featured Mix</p>
                <h2 className="text-2xl font-sans font-bold text-white truncate">{featured.title}</h2>
                <p className="text-sm text-text-muted truncate mt-1">{featured.artist}</p>
              </div>
              <button 
                className="w-14 h-14 rounded-full accent-gradient flex items-center justify-center flex-shrink-0 shadow-lg transform transition-transform group-hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  play(featured);
                }}
              >
                <Play size={24} className="text-white ml-1" fill="currentColor" />
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <HorizontalSection title="Trending in India 🔥" fetcher={trendingIndiaFetcher} />
      <HorizontalSection title="Top Global Hits 🌍" fetcher={topGlobalFetcher} />
      <MoodMixes />
      <HorizontalSection title="New Releases 🆕" fetcher={newReleasesFetcher} />
      <HorizontalSection title="Indian Charts 🇮🇳" fetcher={indianChartsFetcher} />

    </motion.div>
  );
};

export default React.memo(Home);
