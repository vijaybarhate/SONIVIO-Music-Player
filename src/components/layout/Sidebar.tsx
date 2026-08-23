import React from 'react';
import { Home, Search, Library, Heart, Music2, Info, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentPath } from '../../hooks/useCurrentPath';
import { useUiStore } from '../../store/uiStore';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';

const Sidebar: React.FC = () => {
  const currentPath = useCurrentPath();
  const { theme, toggleTheme } = useUiStore();
  const { currentTrack } = usePlayerStore();
  const { likedSongs, playlists } = useLibraryStore();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const navItems = [
    { icon: Home, label: 'Home', path: `${basePath}/` },
    { icon: Search, label: 'Search', path: `${basePath}/search` },
    { icon: Library, label: 'Your Library', path: `${basePath}/library` },
    { icon: Heart, label: 'Favorites', path: `${basePath}/library?tab=favorites`, count: likedSongs.length },
  ];

  const isLinkActive = (path: string) => {
    if (path === `${basePath}/`) {
      return currentPath === `${basePath}/` || currentPath === `${basePath}/index.html` || currentPath === '';
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside
      style={{ ['--d' as string]: '0.05s' }}
      className={`a-slideL w-16 md:w-60 bg-canvas border-r border-hairline flex flex-col h-full flex-shrink-0 z-40 ${
        currentTrack ? 'pb-[88px]' : ''
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-4 md:px-6 border-b border-hairline">
        <a href={`${basePath}/`} className="flex items-center gap-3 select-none group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong rounded-sm" aria-label="SONIVIO home">
          <div
            style={{ ['--d' as string]: '0.26s' }}
            className="a-popIn relative w-8 h-8 rounded-md bg-ink flex items-center justify-center flex-shrink-0 card-shadow-lvl3 overflow-hidden"
          >
            <Music2 className="text-canvas w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            {/* Gradient sheen sweep on hover */}
            <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
          </div>
          <span
            style={{ ['--d' as string]: '0.32s' }}
            className="a-riseIn hidden md:block text-base font-sans font-semibold tracking-tight text-ink"
          >
            SONIVIO
          </span>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p style={{ ['--d' as string]: '0.34s' }} className="a-riseIn hidden md:block eyebrow px-3 mb-2">Browse</p>
        {navItems.map((item, i) => {
          const active = isLinkActive(item.path);
          return (
            <a
              key={item.path}
              href={item.path}
              aria-current={active ? 'page' : undefined}
              style={{ ['--d' as string]: `${0.38 + i * 0.05}s` }}
              className={`
                a-riseIn relative flex items-center gap-4 px-3 py-2.5 rounded-md transition-colors group
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong
                ${active ? 'text-ink' : 'text-body hover:text-ink'}
              `}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-md bg-canvas-soft-2"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon
                size={18}
                strokeWidth={active ? 2.2 : 1.8}
                className={`relative z-10 flex-shrink-0 transition-transform duration-200 ${
                  active ? 'text-ink' : 'group-hover:scale-108'
                }`}
              />
              <span className="hidden md:block relative z-10 font-sans text-sm flex-1">
                {item.label}
              </span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="hidden md:block relative z-10 font-mono text-[10px] text-mute tabular-nums">
                  {item.count}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-hairline flex flex-col gap-1 select-none">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ ['--d' as string]: '0.62s' }}
          className="a-riseIn flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors text-body hover:text-ink hover:bg-canvas-soft w-full text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
        >
          <span className="relative w-4 h-4 flex-shrink-0 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="absolute"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="hidden md:block font-sans">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <a
          href={`${basePath}/about`}
          style={{ ['--d' as string]: '0.68s' }}
          className={`
            a-riseIn flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong
            ${
              isLinkActive(`${basePath}/about`)
                ? 'bg-canvas-soft-2 text-ink font-medium'
                : 'text-body hover:text-ink hover:bg-canvas-soft'
            }
          `}
        >
          <Info size={16} className="group-hover:scale-108 transition-transform duration-200 flex-shrink-0" />
          <span className="hidden md:block font-sans">About System</span>
        </a>

        <p className="hidden md:block eyebrow px-3 pt-2 text-[9px]!">
          {playlists.length} playlist{playlists.length === 1 ? '' : 's'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
