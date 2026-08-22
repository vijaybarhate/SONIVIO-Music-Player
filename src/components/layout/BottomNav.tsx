import React from 'react';
import { Home, Search, Library, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrentPath } from '../../hooks/useCurrentPath';
import { useUiStore } from '../../store/uiStore';

const BottomNav: React.FC = () => {
  const currentPath = useCurrentPath();
  const { theme, toggleTheme } = useUiStore();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const navItems = [
    { icon: Home, label: 'Home', path: `${basePath}/` },
    { icon: Search, label: 'Search', path: `${basePath}/search` },
    { icon: Library, label: 'Library', path: `${basePath}/library` },
  ];

  const isLinkActive = (path: string) => {
    if (path === `${basePath}/`) {
      return currentPath === `${basePath}/` || currentPath === `${basePath}/index.html` || currentPath === '';
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[55] glass-bar border-t border-hairline select-none h-14">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isLinkActive(item.path);
          return (
            <motion.a
              key={item.path}
              href={item.path}
              whileTap={{ scale: 0.88 }}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg min-w-[56px] transition-colors ${
                active ? 'text-ink' : 'text-mute'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-pill"
                  className="absolute inset-0 rounded-lg bg-canvas-soft-2"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon
                size={20}
                strokeWidth={active ? 2.2 : 1.8}
                className={`relative z-10 transition-transform duration-200 ${active ? 'scale-105' : ''}`}
              />
              <span className="relative z-10 text-[10px] font-sans font-medium leading-tight">
                {item.label}
              </span>
            </motion.a>
          );
        })}

        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors text-mute min-w-[56px] cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
          <span className="text-[10px] font-sans font-medium leading-tight">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </motion.button>
      </div>
    </nav>
  );
};

export default BottomNav;
