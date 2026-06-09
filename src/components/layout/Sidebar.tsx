import React from 'react';
import { Home, Search, Library, Heart, Music2, Info, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrentPath } from '../../hooks/useCurrentPath';
import { useUiStore } from '../../store/uiStore';
import { usePlayerStore } from '../../store/playerStore';

const Sidebar: React.FC = () => {
  const currentPath = useCurrentPath();
  const { theme, toggleTheme } = useUiStore();
  const { currentTrack } = usePlayerStore();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash

  const navItems = [
    { icon: Home, label: 'Home', path: `${basePath}/` },
    { icon: Search, label: 'Search', path: `${basePath}/search` },
    { icon: Library, label: 'Your Library', path: `${basePath}/library` },
    { icon: Heart, label: 'Favorites', path: `${basePath}/library?tab=favorites` },
  ];

  const isLinkActive = (path: string) => {
    if (path === `${basePath}/`) {
      return currentPath === `${basePath}/` || currentPath === `${basePath}/index.html` || currentPath === '';
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className={`w-16 md:w-60 bg-canvas border-r border-hairline flex flex-col h-full flex-shrink-0 transition-all duration-300 z-40 ${currentTrack ? 'pb-[88px]' : ''}`}>
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-4 md:px-6 border-b border-hairline">
        <a href={`${basePath}/`} className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center flex-shrink-0 card-shadow-lvl3">
            <Music2 className="text-canvas w-4 h-4" />
          </div>
          <span className="hidden md:block text-lg font-sans font-semibold tracking-tight text-ink">
            SONIVIO
          </span>
        </a>
      </div>

      {/* Navigation Rows */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const active = isLinkActive(item.path);
          return (
            <a
              key={item.path}
              href={item.path}
              className={`
                relative flex items-center gap-4 px-3 py-2.5 rounded-md transition-all group
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong
                ${active 
                  ? 'bg-canvas-soft-2 text-ink font-medium' 
                  : 'text-body hover:text-ink hover:bg-canvas-soft'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-ink"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon 
                size={18} 
                className={`flex-shrink-0 transition-transform duration-250 ${
                  active ? 'scale-105 text-ink' : 'group-hover:scale-105'
                }`} 
              />
              <span className="hidden md:block font-sans text-sm">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Footer Info / About */}
      <div className="p-3 border-t border-hairline flex flex-col gap-1.5 select-none">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors text-body hover:text-ink hover:bg-canvas-soft w-full text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={16} className="group-hover:scale-105 transition-transform duration-250 flex-shrink-0" />
          ) : (
            <Moon size={16} className="group-hover:scale-105 transition-transform duration-250 flex-shrink-0" />
          )}
          <span className="hidden md:block font-sans">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <a
          href={`${basePath}/about`}
          className={`
            flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong
            ${isLinkActive(`${basePath}/about`) 
              ? 'bg-canvas-soft-2 text-ink font-medium' 
              : 'text-body hover:text-ink hover:bg-canvas-soft'
            }
          `}
        >
          <Info size={16} className="group-hover:scale-105 transition-transform duration-250 flex-shrink-0" />
          <span className="hidden md:block font-sans">About System</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
