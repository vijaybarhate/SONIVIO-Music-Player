import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const { 
    play, 
    pause, 
    isPlaying, 
    next, 
    previous, 
    toggleMute, 
    currentTrack, 
    toggleLike,
    isExpanded,
    setExpanded
  } = usePlayerStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (currentTrack) {
            isPlaying ? pause() : play();
          }
          break;
        case 'KeyN':
          next();
          break;
        case 'KeyP':
          previous();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyL':
          if (currentTrack) toggleLike(currentTrack);
          break;
        case 'Slash':
          e.preventDefault();
          if (location.pathname !== '/search') {
            navigate('/search');
          }
          // Delay to allow navigation/rendering before focusing
          setTimeout(() => {
            const searchInput = document.querySelector('input[placeholder*="QUERY"]') as HTMLInputElement;
            searchInput?.focus();
          }, 50);
          break;
        case 'Escape':
          if (isExpanded) {
            setExpanded(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, play, pause, next, previous, toggleMute, currentTrack, toggleLike, isExpanded, setExpanded, navigate, location]);
};
