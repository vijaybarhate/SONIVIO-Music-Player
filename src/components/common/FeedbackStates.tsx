import React from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import Equalizer from './Equalizer';

interface FeedbackProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const LoadingState: React.FC<FeedbackProps> = ({
  title = "Loading…",
  message = "Please wait while we fetch your content."
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 select-none">
      <Equalizer bars={5} className="h-7 text-ink" barClassName="w-[3px] bg-current" />
      <div className="space-y-1">
        <h3 className="font-sans font-medium text-sm text-ink">{title}</h3>
        <p className="font-sans text-xs text-mute">{message}</p>
      </div>
    </div>
  );
};

export const EmptyState: React.FC<FeedbackProps> = ({ 
  title = "Nothing found.", 
  message = "There's no content to display here.",
  actionLabel,
  onAction,
  icon = <Inbox size={32} />
}) => {
  return (
    <div className="flex flex-col items-center py-16 text-center select-none">
      <div className="text-mute mb-5 bg-canvas-soft-2 border border-hairline p-4 rounded-md">
        {icon}
      </div>
      <h3 className="text-base font-sans font-semibold text-ink mb-1.5">{title}</h3>
      <p className="font-sans text-xs text-mute max-w-sm mb-6">{message}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="h-9 px-5 rounded bg-ink hover:bg-body text-canvas font-sans font-medium text-xs shadow-sm transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<FeedbackProps> = ({ 
  title = "Failed to load.", 
  message = "An unexpected network error occurred.",
  actionLabel = "Retry",
  onAction,
  icon = <AlertTriangle size={20} />
}) => {
  return (
    <div className="flex flex-col items-center py-8 px-5 rounded-md border border-error-soft bg-error-soft/10 select-none max-w-sm mx-auto">
      <div className="text-error mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-sans font-semibold text-ink mb-1">{title}</h3>
      <p className="font-sans text-xs text-mute max-w-xs mb-5 text-center leading-relaxed">{message}</p>
      
      <button
        onClick={onAction || (() => window.location.reload())}
        className="h-8 px-4 rounded border border-hairline bg-canvas hover:bg-canvas-soft text-body hover:text-ink font-sans text-xs font-semibold shadow-sm transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="rounded-lg overflow-hidden border border-hairline bg-canvas">
        <div className="aspect-square w-full bg-canvas-soft-2 border-b border-hairline shimmer-sweep" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-canvas-soft-2 rounded w-3/4 shimmer-sweep" />
          <div className="h-2 bg-canvas-soft-2 rounded w-1/2 shimmer-sweep" />
        </div>
      </div>
    ))}
  </div>
);

export const InlineError: React.FC<{ message?: string; onRetry?: () => void }> = ({ message = "Failed to load.", onRetry }) => (
  <div className="flex items-center gap-2.5 p-2.5 rounded border border-error-soft bg-error-soft/10 select-none">
    <AlertTriangle size={14} className="text-error flex-shrink-0" />
    <span className="text-xs font-sans text-error-deep">{message}</span>
    {onRetry && (
      <button onClick={onRetry} className="ml-auto text-[10px] font-semibold text-error hover:text-error-deep cursor-pointer">
        Retry
      </button>
    )}
  </div>
);
