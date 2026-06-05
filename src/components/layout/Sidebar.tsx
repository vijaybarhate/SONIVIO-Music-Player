import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, Music2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
  ];

  return (
    <aside className="w-16 md:w-60 bg-bg border-r border-stroke flex flex-col h-full flex-shrink-0 transition-all duration-300 z-40">
      {/* Logo */}
      <div className="h-20 flex items-center px-4 md:px-6 mt-2">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center shadow-glow flex-shrink-0">
            <Music2 className="text-white w-4 h-4" />
          </div>
          <span className="hidden md:block text-2xl font-display italic tracking-tight bg-clip-text text-transparent accent-gradient">
            SONIVIO
          </span>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group
              ${isActive ? 'bg-surface-elevated text-text-primary' : 'text-text-muted hover:text-text-primary hover:bg-surface'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full accent-gradient origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <item.icon size={20} className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-accent-start' : 'group-hover:scale-110'}`} />
                <span className="hidden md:block font-sans text-sm font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / About */}
      <div className="p-4 border-t border-stroke">
        <NavLink
          to="/about"
          className="flex items-center gap-3 px-3 py-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-surface group"
        >
          <Info size={18} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden md:block font-sans text-xs">About System</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
