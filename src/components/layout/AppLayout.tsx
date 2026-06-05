import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import BottomPlayer from '../player/BottomPlayer';
import HiddenYouTube from '../player/HiddenYouTube';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import Toasts from '../common/Toasts';
import { X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

const AppLayout: React.FC = () => {
  useKeyboardShortcuts();
  const location = useLocation();
  const { isKeyboardHelpOpen, setKeyboardHelpOpen } = usePlayerStore();

  useEffect(() => {
    const hasSeenShortcuts = localStorage.getItem('sonivio_shortcuts_seen');
    if (!hasSeenShortcuts) {
      setKeyboardHelpOpen(true);
      localStorage.setItem('sonivio_shortcuts_seen', 'true');
    }
  }, [setKeyboardHelpOpen]);

  return (
    <div className="flex h-screen bg-bg text-text-primary overflow-hidden">
      <HiddenYouTube />
      <Toasts />
      
      <AnimatePresence>
        {isKeyboardHelpOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-8 right-8 z-[110] glass p-6 max-w-sm rounded-2xl shadow-glow"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-2xl tracking-tight text-accent-start">System Shortcuts</h3>
              <button onClick={() => setKeyboardHelpOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[
                { key: 'SPACE', action: 'PLAY / PAUSE' },
                { key: 'N', action: 'NEXT TRACK' },
                { key: 'P', action: 'PREVIOUS' },
                { key: '← / →', action: 'SEEK 10S' },
                { key: '↑ / ↓', action: 'VOLUME' },
                { key: 'F', action: 'FAVORITE' },
                { key: '/', action: 'SEARCH' },
                { key: '?', action: 'HELP' },
              ].map((s) => (
                <div key={s.key} className="flex flex-col">
                  <span className="font-sans text-xs text-accent-start font-medium">{s.key}</span>
                  <span className="font-sans text-[10px] text-text-muted uppercase tracking-wider">{s.action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 pb-[88px] relative overflow-y-auto">
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomPlayer />
    </div>
  );
};

export default AppLayout;
