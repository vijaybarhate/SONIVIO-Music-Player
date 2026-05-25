import React, { useEffect, useState } from 'react';
import { 
  getIndianTrending, 
  getGlobalTrending, 
  getNightDriveMix, 
  getWorkoutMix, 
  getConcentrationMix
} from '../services/youtube';
import { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { LoadingState, ErrorState } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Globe, Moon, Dumbbell, Focus } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

const Home: React.FC = () => {
  const [sections, setSections] = useState<{ title: string; icon: any; tracks: Track[]; source: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { play } = usePlayerStore();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Use individual try-catches to ensure one failure doesn't break the whole page
        const fetchSection = async (title: string, icon: any, source: string, fetchFn: () => Promise<Track[]>) => {
          try {
            const tracks = await fetchFn();
            return { title, icon, tracks, source };
          } catch (e) {
            console.error(`Failed to fetch section ${title}:`, e);
            return null;
          }
        };

        const results = await Promise.all([
          fetchSection('Global_Trending', Globe, 'GLOBAL_ARCHIVE', getGlobalTrending),
          fetchSection('Indian_Trending', TrendingUp, 'REGIONAL_ARCHIVE', getIndianTrending),
          fetchSection('Night_Drive', Moon, 'ATMOSPHERIC_MIX', getNightDriveMix),
          fetchSection('Workout_Energy', Dumbbell, 'SIGNAL_BOOST', getWorkoutMix),
          fetchSection('Deep_Focus', Focus, 'NEURAL_SYNC', getConcentrationMix),
        ]);

        const validSections = results.filter((s): s is NonNullable<typeof s> => s !== null);
        
        if (validSections.length === 0) {
          setError(true);
        } else {
          setSections(validSections);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <LoadingState title="Initializing_Discovery" message="Mapping global trending data..." />;
  if (error) return <ErrorState title="Sync_Error" message="Unable to connect to audio archives. The YouTube API quota may be exceeded." actionLabel="Retry_Connection" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 pb-32">
      {/* Hero */}
      <div className="px-8 mb-20 relative">
        <div className="absolute top-0 right-8 text-[12px] font-mono text-text-sub uppercase tracking-[0.4em] [writing-mode:vertical-lr]">
          EST. 2026 // SONIVIO_AUDIO
        </div>
        <h1 className="text-7xl md:text-[120px] font-display leading-[0.85] mb-6 tracking-tighter">
          SYSTEM<br />DISCOVERY
        </h1>
        <div className="flex items-center gap-4">
          <span className="w-12 h-px bg-brand" />
          <p className="text-brand font-mono text-sm uppercase tracking-[0.2em]">Operational_Status: Optimal</p>
        </div>
      </div>

      {sections.map((section) => (
        <section key={section.title} className="mb-20 border-t border-border-hard pt-12">
          <div className="flex items-end justify-between mb-10 px-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand text-black border border-black shadow-[4px_4px_0px_0px_rgba(238,255,0,0.2)]">
                <section.icon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-4xl font-display uppercase tracking-tight leading-none">{section.title}</h2>
                <span className="font-mono text-[10px] text-text-sub uppercase tracking-[0.3em]">{section.source}</span>
              </div>
            </div>
            
            <button 
              onClick={() => play(section.tracks[0], section.tracks)}
              className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-sub hover:text-brand transition-all"
            >
              <div className="p-2 border border-border-hard group-hover:border-brand transition-colors">
                <Play size={14} fill="currentColor" />
              </div>
              <span>Play_All</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard mx-8">
            {section.tracks.map((track, i) => (
              <motion.div
                key={`${section.title}-${track.id}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="border-r border-b border-border-hard"
              >
                <SongCard track={track} context={section.tracks} source={section.title} />
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
};

export default Home;
