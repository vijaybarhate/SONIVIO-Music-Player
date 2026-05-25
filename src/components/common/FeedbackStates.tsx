import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Inbox, RefreshCw, Music2 } from 'lucide-react';

interface FeedbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const LoadingState: React.FC<FeedbackProps> = ({ 
  title = "Processing_Data", 
  message = "Syncing with global audio archives..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-8 text-center gap-6">
      <div className="relative w-16 h-16">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className={`absolute w-6 h-6 bg-brand border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              ${i === 0 ? 'top-0 left-0' : i === 1 ? 'top-0 right-0' : i === 2 ? 'bottom-0 left-0' : 'bottom-0 right-0'}
            `}
          />
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl uppercase tracking-tight text-brand">{title}</h3>
        <p className="font-mono text-[10px] text-text-sub uppercase tracking-[0.2em]">{message}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<FeedbackProps> = ({ 
  title = "Archive_Empty", 
  message = "No data points detected in this sector.",
  actionLabel,
  onAction,
  icon = <Inbox size={48} />
}) => {
  return (
    <div className="flex flex-col items-start py-20 px-8 border-t border-border-hard">
      <div className="text-brand/30 mb-8">
        {icon}
      </div>
      <h3 className="text-4xl font-display uppercase tracking-tight text-brand mb-4">{title}</h3>
      <p className="font-mono text-text-sub uppercase tracking-widest max-w-md mb-8 leading-loose">{message}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-brand text-black font-display text-xl px-10 py-4 uppercase hover:bg-white hover:text-black transition-all border border-black shadow-[8px_8px_0px_0px_rgba(238,255,0,0.3)] hover:shadow-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<FeedbackProps> = ({ 
  title = "System_Failure", 
  message = "An unexpected error occurred during operation.",
  actionLabel = "Retry_Sync",
  onAction,
  icon = <AlertTriangle size={48} />
}) => {
  return (
    <div className="flex flex-col items-start py-20 px-8 border-t border-border-hard bg-red-950/10">
      <div className="text-red-500 mb-8">
        {icon}
      </div>
      <h3 className="text-4xl font-display uppercase tracking-tight text-red-500 mb-4">{title}</h3>
      <p className="font-mono text-text-sub uppercase tracking-widest max-w-md mb-8 leading-loose">{message}</p>
      
      <button
        onClick={onAction || (() => window.location.reload())}
        className="bg-red-600 text-white font-display text-xl px-10 py-4 uppercase hover:bg-white hover:text-black transition-all border border-black shadow-[8px_8px_0px_0px_rgba(220,38,38,0.3)] hover:shadow-none"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-l border-t border-border-hard">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border-r border-b border-border-hard aspect-square p-4 bg-bg-light animate-pulse">
        <div className="w-full h-full bg-white/5" />
      </div>
    ))}
  </div>
);
