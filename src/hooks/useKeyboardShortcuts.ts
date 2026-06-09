import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useLibraryStore } from '../store/libraryStore';
import { useUiStore } from '../store/uiStore';

export const useKeyboardShortcuts = () => {
  const { 
    play, 
    pause, 
    isPlaying, 
    next, 
    previous, 
    toggleMute, 
    currentTrack, 
    volume, 
    setVolume, 
    progress, 
    duration, 
    seek
  } = usePlayerStore();

  const { toggleLike } = useLibraryStore();
  
  const {
    isExpanded,
    setExpanded,
    isKeyboardHelpOpen,
    setKeyboardHelpOpen
  } = useUiStore();

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
        case 'KeyF':
        case 'KeyL':
          if (currentTrack) toggleLike(currentTrack);
          break;
        case 'Slash':
          e.preventDefault();
          if (typeof window !== 'undefined') {
            if (window.location.pathname !== '/search') {
              window.location.href = '/search';
            }
            // Focus search input after transition
            setTimeout(() => {
              const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
              searchInput?.focus();
            }, 50);
          }
          break;
        case 'Escape':
          if (isExpanded) {
            setExpanded(false);
          }
          if (isKeyboardHelpOpen) {
            setKeyboardHelpOpen(false);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentTrack) {
            seek(Math.max(0, progress - 10));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentTrack) {
            seek(Math.min(duration, progress + 10));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 10));
          break;
      }

      // Handle '?' (shift + /)
      if (e.key === '?') {
        e.preventDefault();
        setKeyboardHelpOpen(!isKeyboardHelpOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying, play, pause, next, previous, toggleMute, currentTrack, 
    toggleLike, isExpanded, setExpanded,
    volume, setVolume, progress, duration, seek, setKeyboardHelpOpen, isKeyboardHelpOpen
  ]);
};
