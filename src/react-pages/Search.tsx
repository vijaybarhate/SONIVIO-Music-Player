import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, Clock, Trash2 } from 'lucide-react';
import { searchTracks, searchArtists, searchPlaylists } from '../services/youtube';
import type { Track } from '../types';
import SongCard from '../components/cards/SongCard';
import { SkeletonLoader, EmptyState } from '../components/common/FeedbackStates';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
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
  
  const debouncedQuery = useDebounce(query, 400);
  const { play } = usePlayerStore();
  const { searchHistory, addToSearchHistory, clearSearchHistory } = useLibraryStore();

  const genres = [
    { label: 'Lo-Fi Chill', gradient: 'from-violet-soft to-cyan-soft', query: 'lofi hip hop chill beats study' },
    { label: 'Acoustic Cover', gradient: 'from-link-bg-soft to-cyan-soft', query: 'acoustic pop guitar covers' },
    { label: 'Focus Study', gradient: 'from-canvas-soft-2 to-hairline-strong', query: 'deep focus concentration lofi study' },
    { label: 'Energy Workout', gradient: 'from-warning-soft to-error-soft', query: 'gym workout music high energy electro' },
    { label: 'Late Night drive', gradient: 'from-violet-soft to-error-soft', query: 'nightdrive synthwave tracks' },
    { label: 'Bollywood Hits', gradient: 'from-warning-soft to-cyan-soft', query: 'latest bollywood viral music 2026' },
    { label: 'Global Hits', gradient: 'from-link-bg-soft to-violet-soft', query: 'billboard hot 100 global hits' },
    { label: 'Classic Rock', gradient: 'from-hairline to-hairline-strong', query: 'classic rock hits 70s 80s 90s' },
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

  // Live suggestions
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

  const handleArtistClick = (channelId: string) => {
    window.location.href = `/artist/${channelId}`;
  };

  const handlePlaylistClick = (playlistId: string) => {
    window.location.href = `/playlist/${playlistId}`;
  };

  return (
    <div className="pb-12">
      {/* Search Bar Container */}
      <div className="mb-6 md:mb-8 select-none">
        <div className={`relative max-w-3xl mx-auto rounded-md bg-canvas border transition-all duration-200 ${
          isInputFocused ? 'border-ink card-shadow-lvl4' : 'border-hairline card-shadow-lvl3'
        }`}>
          <div className="flex items-center px-4 h-12">
            <SearchIcon size={18} className={isInputFocused ? 'text-ink' : 'text-mute'} />
            <input
              type="text"
              placeholder="Search songs, artists, or playlists…"
              value={query}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-ink px-3 font-sans text-sm placeholder:text-mute focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-mute hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-canvas border border-hairline rounded-md p-3 modal-shadow-lvl5"
              >
                {!query && searchHistory.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2 px-2">
                      <span className="font-mono text-[10px] font-semibold text-mute uppercase tracking-wider">Recent Searches</span>
                      <button 
                        onClick={clearSearchHistory}
                        className="flex items-center gap-1 font-sans text-[11px] text-mute hover:text-error transition-colors"
                      >
                        <Trash2 size={11} />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
                      {searchHistory.slice(0, 5).map((h, i) => (
                        <button
                          key={i}
                          onClick={() => setQuery(h)}
                          className="flex items-center gap-3 px-2 py-2 rounded hover:bg-canvas-soft-2 transition-colors text-left"
                        >
                          <Clock size={13} className="text-mute flex-shrink-0" />
                          <span className="font-sans text-xs text-ink flex-1 truncate">{h}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                
                {query && suggestions.length > 0 && (
                  <div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
                    <span className="font-mono text-[10px] font-semibold text-mute uppercase tracking-wider mb-2 px-2">Suggestions</span>
                    {suggestions.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleSuggestionClick(track)}
                        className="flex items-center gap-3 px-2 py-2 rounded hover:bg-canvas-soft-2 transition-colors text-left"
                      >
                        <SearchIcon size={13} className="text-mute flex-shrink-0" />
                        <span className="font-sans text-xs text-ink flex-1 truncate">{track.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {query && suggestions.length === 0 && !loading && (
                  <div className="p-2 text-center text-xs text-mute font-sans">Press enter to search.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Selectors (Vercel tab-ghost style) */}
      {query && (
        <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-6 md:mb-8 select-none">
          {(['songs', 'artists', 'playlists'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-8 px-4 rounded-full font-sans text-xs transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-ink text-canvas font-medium shadow-sm' 
                  : 'bg-canvas border border-hairline hover:bg-canvas-soft text-body hover:text-ink'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Results Rendering */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
                    {artists.map((artist) => (
                      <div 
                        key={artist.id} 
                        onClick={() => handleArtistClick(artist.id)}
                        className="flex flex-col items-center p-5 bg-canvas border border-hairline hover:border-hairline-strong transition-all rounded-lg cursor-pointer group card-shadow-lvl3 hover:card-shadow-lvl4 hover:-translate-y-0.5"
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-hairline shadow-md group-hover:scale-102 transition-transform duration-250">
                          <img src={artist.thumbnail} alt={artist.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-sans font-semibold text-sm text-center text-ink group-hover:text-link transition-colors line-clamp-1 w-full">{artist.title}</h3>
                        <p className="font-mono text-[10px] text-mute uppercase tracking-wide mt-1">Artist</p>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
                    {playlists.map((playlist) => (
                      <div 
                        key={playlist.id} 
                        onClick={() => handlePlaylistClick(playlist.id)}
                        className="bg-canvas border border-hairline hover:border-hairline-strong transition-all rounded-lg overflow-hidden cursor-pointer group p-4 card-shadow-lvl3 hover:card-shadow-lvl4 hover:-translate-y-0.5"
                      >
                        <div className="aspect-square rounded-md overflow-hidden mb-4 border border-hairline shadow-sm group-hover:scale-102 transition-all duration-250">
                          <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-sans font-semibold text-xs text-ink group-hover:text-link transition-colors line-clamp-2 w-full">{playlist.title}</h3>
                        <p className="font-sans text-[11px] text-mute mt-1 truncate">{playlist.artist}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No playlists found" message={`We couldn't find any playlists for "${query}".`} />
                )
              )}
            </motion.div>
          ) : (
            // Genre Browse Panel (Inactive search states)
            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
              <h2 className="text-lg font-sans font-semibold tracking-tight text-ink mb-4 md:mb-6">Browse Categories.</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {genres.map((genre, i) => (
                  <motion.div
                    key={genre.label}
                    onClick={() => setQuery(genre.query)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    className={`aspect-[16/10] rounded-lg p-5 cursor-pointer relative overflow-hidden bg-gradient-to-br ${genre.gradient} border border-hairline group card-shadow-lvl3 hover:card-shadow-lvl4 hover:-translate-y-0.5 transition-all duration-200`}
                  >
                    <div className="absolute inset-0 bg-canvas/10 group-hover:bg-transparent transition-colors duration-200" />
                    <h3 className="relative z-10 font-sans font-semibold text-base text-ink tracking-tight">
                      {genre.label}
                    </h3>
                  </motion.div>
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
