import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Info } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg border-t border-border-hard px-4 py-3 z-[60]">
      <ul className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1.5 p-1 transition-all
                ${isActive ? 'text-brand border-t-2 border-brand -mt-[13px] pt-[11px]' : 'text-text-sub hover:text-text'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                  <span className="text-[9px] font-mono uppercase tracking-widest">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;