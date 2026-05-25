import React, { useRef, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { usePlayerStore } from '../../store/playerStore';

const HiddenYouTube: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    isMuted,
    setProgress,
    setDuration,
    next,
    lastPlayedPosition,
    repeatMode,
    queue,
    queueIndex
  } = usePlayerStore();
  
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  // Preload next thumbnail
  useEffect(() => {
    const nextItem = queue[queueIndex + 1];
    if (nextItem) {
      const img = new Image();
      img.src = nextItem.track.thumbnail;
    }
  }, [queue, queueIndex]);

  useEffect(() => {
    if (playerRef.current && isInitialLoad.current && lastPlayedPosition > 0) {
      playerRef.current.seekTo(lastPlayedPosition);
      isInitialLoad.current = false;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(isMuted ? 0 : volume);
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };

  const onPlay: YouTubeProps['onPlay'] = (event) => {
    setDuration(event.target.getDuration());
    
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setProgress(event.target.getCurrentTime());
    }, 1000);
  };

  const onPause: YouTubeProps['onPause'] = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  };

  const onEnd: YouTubeProps['onEnd'] = () => {
    if (repeatMode === 'one') {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      next();
    }
  };

  const onError: YouTubeProps['onError'] = () => {
    console.error('YouTube Player Error');
    next();
  };

  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed -z-50 pointer-events-none opacity-0">
      <YouTube 
        videoId={currentTrack.id} 
        opts={opts} 
        onReady={onReady} 
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
      />
    </div>
  );
};

export default HiddenYouTube;
