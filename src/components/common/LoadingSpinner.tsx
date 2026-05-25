import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className={`absolute w-5 h-5 bg-brand border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              ${i === 0 ? 'top-0 left-0' : i === 1 ? 'top-0 right-0' : i === 2 ? 'bottom-0 left-0' : 'bottom-0 right-0'}
            `}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-brand uppercase tracking-[0.3em] animate-pulse">Syncing_System...</span>
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="p-4 border border-border-hard bg-bg-light h-full">
    <div className="aspect-square bg-white/5 mb-4 animate-pulse border border-border-hard/50" />
    <div className="space-y-3">
      <div className="h-3 bg-white/10 w-3/4 animate-pulse" />
      <div className="h-2 bg-white/5 w-1/2 animate-pulse" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="border-r border-b border-border-hard">
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export default LoadingSpinner;