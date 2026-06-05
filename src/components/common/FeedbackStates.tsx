import React from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';

interface FeedbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const LoadingState: React.FC<FeedbackProps> = ({ 
  title = "Loading...", 
  message = "Please wait while we fetch your content." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
      <div className="w-12 h-12 rounded-full border-4 border-surface-elevated border-t-accent-start animate-spin" />
      <div className="space-y-2">
        <h3 className="font-sans font-bold text-xl text-text-primary">{title}</h3>
        <p className="font-sans text-sm text-text-muted">{message}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<FeedbackProps> = ({ 
  title = "Nothing found", 
  message = "There's no content to display here.",
  actionLabel,
  onAction,
  icon = <Inbox size={48} />
}) => {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="text-text-muted mb-6 bg-surface-elevated p-6 rounded-full shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-sans font-bold text-text-primary mb-3">{title}</h3>
      <p className="font-sans text-sm text-text-muted max-w-md mb-8">{message}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 rounded-full accent-gradient text-white font-sans font-medium text-sm shadow-glow hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<FeedbackProps> = ({ 
  title = "Failed to load", 
  message = "An unexpected error occurred.",
  actionLabel = "Retry",
  onAction,
  icon = <AlertTriangle size={24} />
}) => {
  return (
    <div className="flex flex-col items-center py-10 px-6 rounded-2xl glass border border-red-500/20 bg-red-500/5">
      <div className="text-red-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-sans font-bold text-text-primary mb-2">{title}</h3>
      <p className="font-sans text-xs text-text-muted max-w-sm mb-6 text-center">{message}</p>
      
      <button
        onClick={onAction || (() => window.location.reload())}
        className="px-6 py-2 rounded-full bg-surface-elevated text-text-primary font-sans text-sm hover:bg-surface border border-stroke transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-gradient-to-r from-surface via-surface-elevated to-surface">
        <div className="aspect-square w-full bg-surface-elevated" />
        <div className="p-4">
          <div className="h-4 bg-surface rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const InlineError: React.FC<{ message?: string; onRetry?: () => void }> = ({ message = "Failed to load.", onRetry }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
    <AlertTriangle size={16} className="text-red-400" />
    <span className="text-sm font-sans text-red-200">{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="ml-auto text-xs font-medium text-red-400 hover:text-red-300">
        [Retry]
      </button>
    )}
  </div>
);
