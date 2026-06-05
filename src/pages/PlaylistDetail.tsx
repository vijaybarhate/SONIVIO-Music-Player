import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistDetails, getPlaylistItems } from '../services/youtube';
import { Track } from '../types';
import { LoadingState, ErrorState } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { Play, Shuffle, Trash2, ArrowLeft, ListMusic } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, play, removeTrackFromPlaylist } = usePlayerStore();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  const fetchPlaylistData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);

    try {
      // Check if it's a local user playlist
      if (id.startsWith('pl_')) {
        setIsLocal(true);
        const localPl = playlists.find(p => p.id === id);
        if (localPl) {
          setPlaylist({
            title: localPl.name,
            description: localPl.description || '',
            thumbnail: localPl.tracks[0]?.thumbnail || '',
            trackCount: localPl.tracks.length
          });
          setTracks(localPl.tracks);
        } else {
          setError(true);
        }
        setLoading(false);
        return;
      }

      // Otherwise it's a YouTube playlist
      setIsLocal(false);
      const [details, items] = await Promise.all([
        getPlaylistDetails(id),
        getPlaylistItems(id)
      ]);

      if (details) {
        setPlaylist({
          title: details.snippet.title,
          description: details.snippet.description,
          thumbnail: details.snippet.thumbnails.high?.url || details.snippet.thumbnails.default?.url,
          trackCount: details.contentDetails.itemCount
        });
        setTracks(items);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id, playlists]);

  useEffect(() => {
    fetchPlaylistData();
  }, [fetchPlaylistData]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      // Normal sequential play
      usePlayerStore.getState().setRepeatMode('none');
      if (usePlayerStore.getState().shuffle) {
        usePlayerStore.getState().toggleShuffle();
      }
      play(tracks[0], tracks);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      if (!usePlayerStore.getState().shuffle) {
        usePlayerStore.getState().toggleShuffle();
      }
      // Start with a random track
      const randomIndex = Math.floor(Math.random() * tracks.length);
      play(tracks[randomIndex], tracks);
    }
  };

  if (loading) return <LoadingState title="Loading Playlist..." />;
  if (error || !playlist) return <ErrorState title="Playlist Not Found" message="Could not load the requested playlist." actionLabel="Go Back" onAction={() => window.history.back()} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }}
      className="pb-12 max-w-6xl mx-auto"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors font-sans text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-surface border border-stroke">
          {playlist.thumbnail ? (
            <img src={playlist.thumbnail} alt={playlist.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
              <ListMusic size={64} className="text-stroke" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-muted mb-2">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-display italic tracking-tight text-white mb-4 line-clamp-2">{playlist.title}</h1>
          {playlist.description && (
            <p className="font-sans text-sm text-text-muted mb-4 line-clamp-2 max-w-2xl">{playlist.description}</p>
          )}
          <p className="font-sans text-sm font-medium text-text-muted mb-6">
            {playlist.trackCount || tracks.length} tracks
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-2 px-8 py-3 rounded-full accent-gradient text-white font-sans font-bold text-sm shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Play size={18} fill="currentColor" /> Play
            </button>
            <button 
              onClick={handleShufflePlay}
              disabled={tracks.length === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-elevated text-text-primary border border-stroke font-sans font-bold text-sm hover:bg-surface active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-surface-elevated"
            >
              <Shuffle size={18} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div>
        <div className="flex items-center px-4 py-2 border-b border-stroke mb-4 text-text-muted font-sans text-xs font-semibold uppercase tracking-wider">
          <div className="w-8 text-center">#</div>
          <div className="flex-1 ml-4">Title</div>
          {isLocal && <div className="w-12 text-center"></div>}
        </div>

        {tracks.length > 0 ? (
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <div 
                key={`${track.id}-${i}`}
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-elevated transition-colors group cursor-pointer"
                onClick={() => play(track, tracks)}
              >
                <div className="w-8 text-center font-sans text-sm text-text-muted group-hover:hidden">
                  {i + 1}
                </div>
                <div className="w-8 text-center hidden group-hover:block text-text-primary">
                  <Play size={16} fill="currentColor" />
                </div>
                
                <div className="flex-1 ml-4 flex items-center gap-4 min-w-0">
                  <img src={track.thumbnail} alt="" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-medium text-text-primary truncate group-hover:text-accent-start transition-colors">{track.title}</p>
                    <p className="font-sans text-xs text-text-muted truncate">{track.artist}</p>
                  </div>
                </div>

                {isLocal && id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(id, track.id);
                    }}
                    className="w-12 text-center text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex justify-center"
                    title="Remove from playlist"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="font-sans text-text-muted">This playlist is empty.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistDetail;
