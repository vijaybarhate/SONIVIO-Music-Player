import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import BottomPlayer from '../player/BottomPlayer';
import HiddenYouTube from '../player/HiddenYouTube';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import Toasts from '../common/Toasts';
import { X } from 'lucide-react';

const AppLayout: React.FC = () => {
  useKeyboardShortcuts();
  const location = useLocation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const hasSeenShortcuts = localStorage.getItem('sonivio_shortcuts_seen');
    if (!hasSeenShortcuts) {
      setShowShortcuts(true);
      localStorage.setItem('sonivio_shortcuts_seen', 'true');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-bg text-text overflow-hidden selection:bg-brand selection:text-black">
      <HiddenYouTube />
      <Toasts />
      
      <AnimatePresence>
        {showShortcuts && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-8 right-8 z-[110] bg-bg border border-brand p-6 max-w-sm shadow-[8px_8px_0px_0px_rgba(238,255,0,0.2)]"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-display text-xl tracking-tight">System_Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="hover:text-brand transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[
                { key: 'SPACE', action: 'PLAY_PAUSE' },
                { key: 'N', action: 'NEXT_TRACK' },
                { key: 'P', action: 'PREV_TRACK' },
                { key: '/', action: 'SEARCH' },
                { key: 'M', action: 'MUTE_TOGGLE' },
                { key: 'L', action: 'LIKE_TRACK' },
                { key: 'ESC', action: 'CLOSE_UI' },
              ].map((s) => (
                <div key={s.key} className="flex flex-col">
                  <span className="font-mono text-xs text-brand font-bold">{s.key}</span>
                  <span className="font-mono text-[9px] text-text-sub uppercase tracking-widest">{s.action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:block border-r border-border-hard">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col min-w-0 pb-40 md:pb-28 relative">
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-hard bg-bg">
        <BottomPlayer />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;