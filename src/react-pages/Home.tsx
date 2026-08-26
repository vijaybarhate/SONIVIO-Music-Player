import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { getTrendingTracks, searchTracks } from '../services/youtube';
import type { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { InlineError, ErrorState } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import Waveform from '../components/common/Waveform';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Genre marquee — editorial band between sections ────────── */
const MARQUEE_ITEMS = ['Lo-fi', 'Synthwave', 'Hip-Hop', 'Indie', 'Classical', 'EDM', 'Jazz', 'Bollywood', 'Rock', 'Ambient'];

const GenreMarquee: React.FC = () => (
  <section
    className="relative my-10 md:my-16 py-5 md:py-7 border-y border-hairline overflow-hidden select-none"
    aria-hidden="true"
  >
    <div className="flex w-max animate-marquee will-change-transform">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center shrink-0">
          {MARQUEE_ITEMS.map((genre) => (
            <span key={`${copy}-${genre}`} className="flex items-center">
              <span className="text-display-lg md:text-display-xl text-ink/90 px-6 md:px-10 whitespace-nowrap">
                {genre}
              </span>
              <span className="w-1.5 h-1.5 rounded-full accent-gradient shrink-0" />
            </span>
          ))}
        </div>
      ))}
    </div>
    {/* Edge fades */}
    <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-canvas-soft to-transparent pointer-events-none" />
    <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-canvas-soft to-transparent pointer-events-none" />
  </section>
);

/* ── Horizontal rail with edge fades + scroll reveal ────────── */
interface SectionProps {
  title: string;
  index: string;
  fetcher: () => Promise<Track[]>;
}

const HorizontalSection = React.memo(({ title, index, fetcher }: SectionProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      setTracks(await fetcher());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error && !tracks.length)
    return (
      <section className="mb-8 md:mb-12">
        <SectionHeader title={title} index={index} />
        <InlineError onRetry={loadData} />
      </section>
    );

  return (
    <section className="mb-8 md:mb-12">
      <SectionHeader title={title} index={index} />
      {loading ? (
        <div className="flex gap-3 md:gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-[140px] md:w-[180px] flex-shrink-0 shimmer-sweep bg-canvas-soft-2 border border-hairline rounded-lg h-[200px] md:h-[240px]"
            />
          ))}
        </div>
      ) : (
        tracks.length > 0 && (
          <div className="relative group/rail">
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x">
              {tracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: Math.min(i * 0.05, 0.35), duration: 0.45, ease: EASE }}
                  className="w-[140px] md:w-[180px] flex-shrink-0 snap-start"
                >
                  <SongCard track={track} context={tracks} />
                </motion.div>
              ))}
            </div>
          </div>
        )
      )}
    </section>
  );
});

const SectionHeader: React.FC<{ title: string; index: string }> = ({ title, index }) => (
  <div className="flex items-baseline gap-3 mb-4 md:mb-6">
    <span className="font-mono text-[10px] text-mute tabular-nums">{index}</span>
    <h2 className="text-display-sm text-ink tracking-tight">{title}</h2>
    <span className="flex-1 h-px bg-hairline translate-y-[-4px]" aria-hidden="true" />
  </div>
);

/* ── Mood mixes — ink cards with colored signal dots ────────── */
const MoodMixes = React.memo(() => {
  const moods = useMemo(
    () => [
      { mood: 'Chill Vibes', query: 'chill lofi music 2026', dot: '#7928ca' },
      { mood: 'Energy Boost', query: 'high energy workout music 2026', dot: '#ff4d4d' },
      { mood: 'Focus Mode', query: 'deep focus study music lofi', dot: '#007cf0' },
      { mood: 'Late Night', query: 'late night drive synthwave playlist', dot: '#ff0080' },
      { mood: 'Happy Beats', query: 'happy feel good pop songs 2026', dot: '#f9cb28' },
      { mood: 'Acoustic', query: 'acoustic guitar covers chill', dot: '#00dfd8' },
    ],
    []
  );

  const { play } = usePlayerStore();

  const handleMoodClick = async (query: string) => {
    try {
      const tracks = await searchTracks(query, 20);
      if (tracks.length > 0) play(tracks[0], tracks);
    } catch (error) {
      console.error('Failed to load mood mix', error);
    }
  };

  return (
    <section className="mb-8 md:mb-12">
      <SectionHeader title="Mood Mixes." index="03" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {moods.map((item, i) => (
          <motion.button
            key={item.mood}
            onClick={() => handleMoodClick(item.query)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: Math.min(i * 0.04, 0.25), duration: 0.4, ease: EASE }}
            className="h-24 md:h-28 rounded-lg p-4 md:p-5 cursor-pointer relative overflow-hidden bg-canvas border border-hairline hover:border-hairline-strong flex flex-col justify-between group card-shadow-lvl3 hover:card-shadow-lvl4 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
          >
            {/* Ink wash sweep on hover */}
            <div className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            <div className="relative z-10 flex items-center justify-between">
              <span
                className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: item.dot }}
              />
              <ArrowUpRight
                size={14}
                className="text-mute opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-canvas transition-all duration-200"
              />
            </div>

            <h3 className="relative z-10 font-sans font-semibold text-base text-ink group-hover:text-canvas tracking-tight transition-colors duration-300 text-left">
              {item.mood}
            </h3>
          </motion.button>
        ))}
      </div>
    </section>
  );
});

/* ── Time-aware hero copy ───────────────────────────────────── */
const getGreetingData = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Good morning.', tagline: 'Your morning soundtrack' };
  if (hour >= 12 && hour < 17) return { greeting: 'Good afternoon.', tagline: 'Your afternoon rotation' };
  if (hour >= 17 && hour < 22) return { greeting: 'Good evening.', tagline: 'Your evening soundtrack' };
  return { greeting: 'Late night grooves.', tagline: 'Your after-hours rotation' };
};

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { play, isPlaying } = usePlayerStore();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        setError(false);
        const trendingData = await getTrendingTracks('US', 5);
        if (trendingData.length > 0) setFeatured(trendingData[0]);
      } catch {
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
      {/* ── Cinematic hero band ── */}
      <header className="relative -mx-4 md:-mx-8 px-4 md:px-8 pt-10 pb-12 md:pt-16 md:pb-20 mb-8 md:mb-12 overflow-hidden select-none">
        {/* Live drifting mesh + grain — hero scale only */}
        <div className="absolute inset-0 mesh-gradient-live pointer-events-none" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas-soft to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl">
          <span
            style={{ ['--d' as string]: '0.44s' }}
            className="a-wipeRight sheen glass-panel inline-flex items-center rounded-full px-4 py-1.5 mb-6"
          >
            <span className="eyebrow">{greetingData.tagline}</span>
          </span>

          <h1 className="text-display-xl md:text-[64px] md:leading-[68px] md:tracking-[-3px] text-ink leading-tight">
            <span className="ln">
              <span style={{ ['--d' as string]: '0.56s' }}>{greetingData.greeting}</span>
            </span>
            <span className="ln">
              <span
                style={{ ['--d' as string]: '0.67s' }}
                className="bg-gradient-to-r from-gradient-develop-start via-gradient-preview-end to-gradient-ship-end bg-clip-text text-transparent"
              >
                Press play.
              </span>
            </span>
          </h1>

          <p
            style={{ ['--d' as string]: '0.9s' }}
            className="a-wipeDown mt-5 max-w-md text-body-md text-body"
          >
            Millions of tracks, one cinematic player. Built for people who feel music.
          </p>

          {/* Signature brand strip — draws itself, then flows with the music */}
          <div style={{ ['--d' as string]: '1.4s' }} className="a-riseIn mt-8 max-w-lg opacity-80">
            <Waveform className="w-full h-14 md:h-16" playing={isPlaying} />
          </div>
        </div>
      </header>

      {/* ── Featured banner ── */}
      {loading ? (
        <div className="mb-6 md:mb-10 h-[180px] md:h-[240px] shimmer-sweep bg-canvas-soft-2 border border-hairline rounded-lg" />
      ) : (
        featured && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-6 md:mb-10 relative rounded-lg bg-canvas border border-hairline hover:border-hairline-strong p-5 md:p-8 overflow-hidden flex flex-col sm:flex-row justify-between gap-4 md:gap-6 card-shadow-lvl4 cursor-pointer hover:card-shadow-lvl3 transition-[border-color,box-shadow] duration-300 group"
            onClick={() => play(featured)}
          >
            <div className="absolute inset-0 mesh-gradient-backdrop opacity-50 dark:opacity-70 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 max-w-xl flex flex-col justify-between gap-4 md:gap-6">
              <div>
                <span className="eyebrow mb-2 block">Featured Mix</span>
                <h2 className="text-display-md md:text-display-lg text-ink leading-tight mb-1.5 line-clamp-2 group-hover:text-link transition-colors">
                  {featured.title}
                </h2>
                <p className="text-body-sm text-body truncate">{featured.artist}</p>
              </div>

              <button
                className="relative h-10 px-5 bg-ink text-canvas font-sans font-medium text-sm rounded-full flex items-center gap-2 card-shadow-lvl3 self-start transition-transform duration-200 group-hover:scale-[1.03] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link"
                onClick={(e) => {
                  e.stopPropagation();
                  play(featured);
                }}
              >
                {/* Pulsing halo — the "live" CTA */}
                <motion.span
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-link pointer-events-none"
                />
                <Play size={14} fill="currentColor" />
                <span>Play Now</span>
              </button>
            </div>

            <div className="relative z-10 flex-shrink-0 hidden sm:block w-28 h-28 md:w-36 md:h-36 rounded-md overflow-hidden border border-hairline shadow-md self-end transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:-rotate-1 animate-float">
              <img src={featured.thumbnail} alt="" className="w-full h-full object-cover" loading="eager" />
            </div>
          </motion.section>
        )
      )}

      <HorizontalSection title="Trending in India." index="01" fetcher={trendingIndiaFetcher} />
      <HorizontalSection title="Top Global Hits." index="02" fetcher={topGlobalFetcher} />
      <GenreMarquee />
      <MoodMixes />
      <HorizontalSection title="New Releases." index="04" fetcher={newReleasesFetcher} />
      <HorizontalSection title="Indian Charts." index="05" fetcher={indianChartsFetcher} />
    </div>
  );
};

export default React.memo(Home);
