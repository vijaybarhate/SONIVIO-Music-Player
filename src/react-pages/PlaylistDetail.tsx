import React, { useEffect, useState, useCallback } from 'react';
import { getPlaylistDetails, getPlaylistItems } from '../services/youtube';
import type { Track } from '../types';
import { LoadingState, ErrorState } from '../components/common/FeedbackStates';
import { motion } from 'framer-motion';
import { Play, Shuffle, Trash2, ArrowLeft, ListMusic } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { useUiStore } from '../store/uiStore';

interface PlaylistDetailProps {
  id?: string;
}

const PlaylistDetail: React.FC<PlaylistDetailProps> = ({ id }) => {
  const { play, toggleShuffle, setRepeatMode } = usePlayerStore();
  const { playlists, removeTrackFromPlaylist } = useLibraryStore();
  const { showToast } = useUiStore();
  
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
          trackCount: details.contentDetails?.itemCount || items.length
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
      setRepeatMode('none');
      const player = usePlayerStore.getState();
      if (player.shuffle) {
        toggleShuffle();
      }
      play(tracks[0], tracks);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      const player = usePlayerStore.getState();
      if (!player.shuffle) {
        toggleShuffle();
      }
      const randomIndex = Math.floor(Math.random() * tracks.length);
      play(tracks[randomIndex], tracks);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (loading) return <LoadingState title="Loading Playlist…" />;
  if (error || !playlist) return <ErrorState title="Playlist Not Found" message="Could not load the requested playlist." actionLabel="Go Back" onAction={goBack} />;

  return (
    <div
      className="pb-12 max-w-6xl mx-auto"
    >
      <button
        onClick={goBack}
        className="flex items-center gap-1.5 text-mute hover:text-ink mb-6 transition-colors font-sans text-xs select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong rounded-sm"
      >
        <ArrowLeft size={14} />
        <span>Back</span>
      </button>

      {/* Playlist Metadata Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end mb-8 md:mb-10 select-none"
      >
        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-lg overflow-hidden border border-hairline modal-shadow-lvl5 bg-canvas-soft-2 flex items-center justify-center">
          {playlist.thumbnail ? (
            <img src={playlist.thumbnail} alt="" className="w-full h-full object-cover" />
          ) : (
            <ListMusic size={40} className="text-mute" />
          )}
        </div>

        <div className="flex-1">
          <span className="eyebrow mb-2 block">Playlist</span>
          <h1 className="text-display-md md:text-display-xl text-ink leading-tight mb-2 md:mb-3 line-clamp-2">{playlist.title}</h1>
          {playlist.description && (
            <p className="font-sans text-xs text-body mb-4 line-clamp-2 max-w-2xl leading-relaxed">{playlist.description}</p>
          )}
          <p className="font-mono text-[11px] text-mute tabular-nums mb-6">
            {playlist.trackCount || tracks.length} TRACKS
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-1.5 h-9 px-5 rounded-full bg-ink hover:bg-body text-canvas font-sans font-medium text-xs card-shadow-lvl3 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link"
            >
              <Play size={13} fill="currentColor" />
              <span>Play</span>
            </button>
            <button
              onClick={handleShufflePlay}
              disabled={tracks.length === 0}
              className="flex items-center gap-1.5 h-9 px-5 rounded-full bg-canvas border border-hairline hover:bg-canvas-soft text-body hover:text-ink font-sans font-medium text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shuffle size={13} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tracks List */}
      <div>
        <div className="flex items-center px-4 py-2 border-b border-hairline mb-3 text-mute font-mono text-[10px] font-semibold uppercase tracking-wider select-none">
          <div className="w-6 text-center">#</div>
          <div className="flex-1 ml-4">Title</div>
          {isLocal && <div className="w-10 text-center"></div>}
        </div>

        {tracks.length > 0 ? (
          <div className="space-y-0.5">
            {tracks.map((track, i) => (
              <div 
                key={`${track.id}-${i}`}
                className="flex items-center px-4 py-2.5 rounded-md hover:bg-canvas-soft-2 transition-colors group cursor-pointer"
                onClick={() => play(track, tracks)}
              >
                <div className="w-6 text-center font-mono text-xs text-mute group-hover:hidden select-none">
                  {i + 1}
                </div>
                <div className="w-6 text-center hidden group-hover:flex items-center justify-center text-ink select-none">
                  <Play size={12} fill="currentColor" />
                </div>
                
                <div className="flex-1 ml-4 flex items-center gap-3 min-w-0">
                  <img src={track.thumbnail} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 border border-hairline" />
                  <div className="min-w-0">
                    <p className="font-sans text-xs font-semibold text-ink truncate group-hover:text-link transition-colors leading-tight">{track.title}</p>
                    <p className="font-sans text-[11px] text-mute truncate mt-0.5 leading-tight">{track.artist}</p>
                  </div>
                </div>

                {isLocal && id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(id, track.id);
                      showToast('Track removed from playlist', 'info');
                    }}
                    className="w-10 text-center text-mute hover:text-error opacity-0 group-hover:opacity-100 transition-opacity flex justify-center py-1 hover:bg-canvas rounded"
                    title="Remove from playlist"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center select-none">
            <p className="font-sans text-xs text-mute">This playlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
