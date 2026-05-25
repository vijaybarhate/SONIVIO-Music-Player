import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Clock, Trash2, Library as LibraryIcon } from 'lucide-react';
import { searchTracks } from '../services/youtube';
import { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { SkeletonLoader, EmptyState } from '../components/common/FeedbackStates';
import { usePlayerStore } from '../store/playerStore';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'playlists'>('all');
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const { searchHistory, addToSearchHistory, clearSearchHistory, playlists, showToast } = usePlayerStore();

  const genres = [
    { label: 'Phonk', query: 'phonk music 2026' },
    { label: 'Synthwave', query: 'synthwave retrowave' },
    { label: 'Lo-Fi', query: 'lofi hip hop chill beats' },
    { label: 'Techno', query: 'industrial techno dark' },
    { label: 'Ambient', query: 'ambient sleep music' },
    { label: 'Indie', query: 'indie alternative' },
  ];

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const tracks = await searchTracks(debouncedQuery);
        setResults(tracks);
        addToSearchHistory(debouncedQuery);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const filteredPlaylists = playlists.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="py-12 pb-32">
      {/* Search Header */}
      <div className="px-8 pb-12 border-b border-border-hard mb-12">
        <div className="flex items-center gap-2 mb-8">
           <span className="w-8 h-px bg-brand" />
           <p className="text-[10px] font-mono text-brand uppercase tracking-[0.3em]">System_Search</p>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tight mb-12">QUERY_INTERFACE</h1>

        <div className="relative max-w-5xl border border-border-hard group focus-within:border-brand transition-colors bg-bg-light">
          <div className="flex items-center px-6">
            <SearchIcon size={24} className="text-brand" strokeWidth={3} />
            <input
              type="text"
              placeholder="INITIALIZE_QUERY..."
              value={query}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-text py-6 px-6 font-mono uppercase text-sm tracking-widest placeholder:text-text-sub/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-2 text-text-sub hover:text-brand transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* History Dropdown */}
          <AnimatePresence>
            {isInputFocused && !query && searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-[-1px] right-[-1px] z-50 bg-bg border border-brand p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-[10px] text-brand uppercase tracking-widest">Recent_Queries</span>
                  <button 
                    onClick={clearSearchHistory}
                    className="flex items-center gap-2 font-mono text-[9px] text-text-sub hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    <Trash2 size={12} />
                    Purge_History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(h)}
                      className="flex items-center gap-3 px-4 py-2 bg-bg-light border border-border-hard hover:border-brand hover:text-brand transition-all font-mono text-[10px] uppercase tracking-wider"
                    >
                      <Clock size={12} />
                      {h}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-8 mt-12">
          {['all', 'tracks', 'playlists'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`font-mono text-[10px] uppercase tracking-[0.3em] pb-2 border-b-2 transition-all ${
                activeTab === tab ? 'text-brand border-brand' : 'text-text-sub border-transparent hover:text-white'
              }`}
            >
              {tab}_Signals
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mb-10 flex items-center gap-4">
                 <div className="w-4 h-4 border-2 border-brand border-t-transparent animate-spin" />
                 <span className="font-mono text-[10px] text-brand uppercase tracking-widest">Decoding_Data_Stream...</span>
              </div>
              <SkeletonLoader />
            </motion.div>
          ) : results.length > 0 || (activeTab === 'playlists' && filteredPlaylists.length > 0) ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              {/* Tracks Section */}
              {(activeTab === 'all' || activeTab === 'tracks') && results.length > 0 && (
                <div>
                   <h2 className="font-display text-3xl uppercase tracking-tighter mb-8 text-brand">Track_Archive</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
                    {results.map((track, i) => (
                      <div key={track.id} className="border-r border-b border-border-hard">
                        <SongCard track={track} context={results} source="SEARCH_PTR" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Section */}
              {(activeTab === 'all' || activeTab === 'playlists') && filteredPlaylists.length > 0 && (
                <div>
                   <h2 className="font-display text-3xl uppercase tracking-tighter mb-8 text-brand">Playlist_Arrays</h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-border-hard">
                    {filteredPlaylists.map((p) => (
                      <div 
                        key={p.id} 
                        className="p-8 border-r border-b border-border-hard bg-bg-light hover:bg-white hover:text-black transition-all group cursor-pointer"
                      >
                         <div className="flex justify-between items-start mb-12">
                            <LibraryIcon size={24} className="text-brand group-hover:text-black transition-colors" />
                            <span className="font-mono text-[9px] opacity-30">ARRAY_LINK</span>
                         </div>
                         <h3 className="font-display text-3xl uppercase tracking-tight">{p.name}</h3>
                         <p className="font-mono text-[10px] uppercase tracking-widest mt-2">{p.tracks.length} Tracks</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : query && !loading ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <EmptyState 
                title="ZERO_RESULTS" 
                message={`The query "${query}" returned no matching data points in the global archive.`} 
                actionLabel="Reset_Interface"
                onAction={() => setQuery('')}
              />
            </motion.div>
          ) : (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-4 mb-10">
                 <h2 className="text-xl font-display uppercase tracking-[0.4em] text-brand">Browse_Protocols</h2>
                 <div className="flex-1 h-px bg-border-hard" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-0 border-l border-t border-border-hard">
                {genres.map((genre, i) => (
                  <motion.button
                    key={genre.label}
                    onClick={() => setQuery(genre.label)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="aspect-square border-r border-b border-border-hard p-6 text-left relative group overflow-hidden bg-bg-light hover:bg-brand transition-all"
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <span className="text-[10px] font-mono text-text-sub group-hover:text-black/50 uppercase tracking-[0.3em]">PROT_0{i+1}</span>
                      <span className="font-display text-2xl group-hover:text-black uppercase leading-none tracking-tighter">{genre.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
