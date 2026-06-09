import React from 'react';
import { Home, Search, Library, Sun, Moon } from 'lucide-react';
import { useCurrentPath } from '../../hooks/useCurrentPath';
import { useUiStore } from '../../store/uiStore';
import { usePlayerStore } from '../../store/playerStore';

const BottomNav: React.FC = () => {
  const currentPath = useCurrentPath();
  const { theme, toggleTheme } = useUiStore();
  const { currentTrack } = usePlayerStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '/index.html';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[55] bg-canvas/90 backdrop-blur-md border-t border-hairline select-none h-14"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isLinkActive(item.path);
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors min-w-[56px] ${
                active
                  ? 'text-ink'
                  : 'text-mute'
              }`}
            >
              <item.icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                className="transition-transform duration-200"
              />
              <span className="text-[10px] font-sans font-medium leading-tight">
                {item.label}
              </span>
            </a>
          );
        })}
        
        {/* Theme toggle in bottom nav for mobile */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors text-mute min-w-[56px] cursor-pointer"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun size={20} strokeWidth={1.8} />
          ) : (
            <Moon size={20} strokeWidth={1.8} />
          )}
          <span className="text-[10px] font-sans font-medium leading-tight">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;