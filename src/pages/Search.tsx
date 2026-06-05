import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, Clock, Trash2 } from 'lucide-react';
import { searchTracks, searchArtists, searchPlaylists } from '../services/youtube';
import { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { SkeletonLoader, EmptyState } from '../components/common/FeedbackStates';
import { usePlayerStore } from '../store/playerStore';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

type SearchTab = 'songs' | 'artists' | 'playlists';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('songs');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<Track[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const { searchHistory, addToSearchHistory, clearSearchHistory, play } = usePlayerStore();

  const genres = [
    { label: 'Music', gradient: 'from-blue-600 to-purple-600', query: 'popular music 2026' },
    { label: 'Podcasts', gradient: 'from-emerald-500 to-teal-700', query: 'top podcasts' },
    { label: 'Hip-Hop', gradient: 'from-orange-500 to-red-600', query: 'hip hop rap' },
    { label: 'Electronic', gradient: 'from-pink-500 to-purple-700', query: 'electronic dance music' },
    { label: 'Pop', gradient: 'from-yellow-400 to-orange-500', query: 'pop hits' },
    { label: 'Rock', gradient: 'from-red-600 to-gray-900', query: 'rock classics' },
    { label: 'Jazz', gradient: 'from-indigo-500 to-blue-800', query: 'smooth jazz' },
    { label: 'Lo-Fi', gradient: 'from-teal-400 to-blue-500', query: 'lofi hip hop chill' },
    { label: 'Bollywood', gradient: 'from-fuchsia-600 to-pink-500', query: 'bollywood hits' },
    { label: 'K-Pop', gradient: 'from-indigo-400 to-cyan-400', query: 'kpop trending' },
    { label: 'EDM', gradient: 'from-violet-500 to-purple-500', query: 'edm party' },
    { label: 'Classical', gradient: 'from-amber-600 to-orange-700', query: 'classical music' },
    { label: 'Devotional', gradient: 'from-orange-400 to-rose-400', query: 'devotional songs' },
    { label: 'Punjabi', gradient: 'from-yellow-500 to-orange-500', query: 'latest punjabi songs' },
    { label: 'Tamil', gradient: 'from-red-500 to-orange-500', query: 'tamil hit songs' },
    { label: 'Chill', gradient: 'from-cyan-500 to-blue-500', query: 'chill vibes' },
  ];

  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setTracks([]);
      setArtists([]);
      setPlaylists([]);
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'songs') {
        const res = await searchTracks(debouncedQuery, 20);
        setTracks(res);
      } else if (activeTab === 'artists') {
        const res = await searchArtists(debouncedQuery, 12);
        setArtists(res);
      } else if (activeTab === 'playlists') {
        const res = await searchPlaylists(debouncedQuery, 12);
        setPlaylists(res);
      }
      addToSearchHistory(debouncedQuery);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, activeTab, addToSearchHistory]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Live Suggestions (faster debounce could be used, but reusing debouncedQuery for simplicity)
  useEffect(() => {
    if (debouncedQuery.trim() && isInputFocused) {
      searchTracks(debouncedQuery, 5).then(setSuggestions).catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, isInputFocused]);

  const handleSuggestionClick = (track: Track) => {
    setQuery(track.title);
    play(track);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-12"
    >
      {/* Search Header */}
      <div className="mb-8">
        <div className={`relative max-w-3xl mx-auto rounded-full glass transition-all duration-300 ${isInputFocused ? 'border-accent-start/50 shadow-glow' : ''}`}>
          <div className="flex items-center px-6 py-4">
            <SearchIcon size={24} className={isInputFocused ? 'text-accent-start' : 'text-text-muted'} />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-text-primary px-4 font-sans text-lg placeholder:text-text-muted"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Dropdown (History or Suggestions) */}
          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-[calc(100%+12px)] left-0 right-0 z-50 glass rounded-2xl p-4 shadow-xl"
              >
                {!query && searchHistory.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Searches</span>
                      <button 
                        onClick={clearSearchHistory}
                        className="flex items-center gap-1 font-sans text-xs text-text-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-col">
                      {searchHistory.slice(0, 8).map((h, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(h)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-elevated transition-colors text-left"
                        >
                          <Clock size={16} className="text-text-muted" />
                          <span className="font-sans text-sm text-text-primary flex-1 truncate">{h}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {query && suggestions.length > 0 && (
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-2">Suggestions</span>
                    {suggestions.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleSuggestionClick(track)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-elevated transition-colors text-left"
                      >
                        <SearchIcon size={16} className="text-text-muted" />
                        <span className="font-sans text-sm text-text-primary flex-1 truncate">{track.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs */}
      {query && (
        <div className="flex items-center justify-center gap-4 mb-8">
          {(['songs', 'artists', 'playlists'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-sans text-sm transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-text-primary text-bg font-medium shadow-glow' 
                  : 'bg-surface hover:bg-surface-elevated text-text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <SkeletonLoader />
            </motion.div>
          ) : query ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-6xl mx-auto"
            >
              {/* Songs Tab */}
              {activeTab === 'songs' && (
                tracks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tracks.map((track) => (
                      <SongCard key={track.id} track={track} context={tracks} variant="horizontal" />
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No songs found" message={`We couldn't find any songs for "${query}".`} />
                )
              )}

              {/* Artists Tab */}
              {activeTab === 'artists' && (
                artists.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {artists.map((artist) => (
                      <div key={artist.id} className="flex flex-col items-center p-6 bg-surface hover:bg-surface-elevated transition-colors rounded-2xl cursor-pointer group">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg group-hover:shadow-glow transition-all">
                          <img src={artist.thumbnail} alt={artist.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-sans font-bold text-center text-text-primary group-hover:text-accent-start transition-colors line-clamp-1">{artist.title}</h3>
                        <p className="font-sans text-xs text-text-muted mt-1">Artist</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No artists found" message={`We couldn't find any artists for "${query}".`} />
                )
              )}

              {/* Playlists Tab */}
              {activeTab === 'playlists' && (
                playlists.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {playlists.map((playlist) => (
                      <div key={playlist.id} className="bg-surface hover:bg-surface-elevated transition-colors rounded-2xl overflow-hidden cursor-pointer group p-4">
                        <div className="aspect-square rounded-xl overflow-hidden mb-4 shadow-md group-hover:shadow-glow transition-all">
                          <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-sans font-medium text-sm text-text-primary group-hover:text-accent-start transition-colors line-clamp-2">{playlist.title}</h3>
                        <p className="font-sans text-xs text-text-muted mt-1 truncate">{playlist.artist}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No playlists found" message={`We couldn't find any playlists for "${query}".`} />
                )
              )}
            </motion.div>
          ) : (
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-sans font-bold mb-6 text-text-primary">Browse Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {genres.map((genre, i) => (
                  <motion.div
                    key={genre.label}
                    onClick={() => setQuery(genre.query)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`aspect-[4/3] rounded-2xl p-5 cursor-pointer relative overflow-hidden bg-gradient-to-br ${genre.gradient} group shadow-md hover:shadow-glow`}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    <h3 className="relative z-10 font-sans font-bold text-xl text-white tracking-tight drop-shadow-md">
                      {genre.label}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Search;
