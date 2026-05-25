import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, Clock, Info, Music2, History } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const libraryItems = [
    { icon: Heart, label: 'Liked Songs', path: '/favorites' },
    { icon: Clock, label: 'Recently Played', path: '/recent' },
    { icon: History, label: 'Neural History', path: '/history' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg h-screen sticky top-0">
      {/* Logo */}
      <div className="p-8 border-b border-border-hard">
        <NavLink to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-brand flex items-center justify-center border border-black">
            <Music2 className="text-black w-6 h-6" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display leading-none tracking-tighter italic">SONIVIO</span>
            <span className="text-[10px] font-mono text-brand uppercase tracking-[0.2em]">Audio System v1.0</span>
          </div>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-8 overflow-y-auto">
        <div className="px-4">
          <p className="text-[10px] font-mono text-text-sub uppercase tracking-[0.3em] mb-4 px-4">Navigation</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 transition-all border border-transparent
                    ${isActive ? 'bg-brand text-black font-bold' : 'text-text-sub hover:text-text hover:border-border-hard'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                      <span className="font-mono text-xs uppercase tracking-widest">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4">
          <p className="text-[10px] font-mono text-text-sub uppercase tracking-[0.3em] mb-4 px-4">User Archive</p>
          <ul className="space-y-0.5">
            {libraryItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 transition-all border border-transparent
                    ${isActive ? 'bg-brand text-black font-bold' : 'text-text-sub hover:text-text hover:border-border-hard'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                      <span className="font-mono text-xs uppercase tracking-widest">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* About */}
      <div className="p-4 border-t border-border-hard">
        <NavLink
          to="/about"
          className="flex items-center gap-4 px-4 py-3 text-text-sub hover:bg-white hover:text-black transition-all group"
        >
          <Info size={20} />
          <span className="font-mono text-xs uppercase tracking-widest">System Info</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;