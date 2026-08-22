import React from 'react';
import Equalizer from './Equalizer';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Equalizer bars={5} className="h-8 text-ink" barClassName="w-[3px] bg-current" />
      <span className="eyebrow">Loading</span>
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="p-2 rounded-lg border border-hairline bg-canvas card-shadow-lvl2 h-full">
    <div className="aspect-square rounded-md bg-canvas-soft-2 mb-3 shimmer-sweep" />
    <div className="px-1 pb-1 space-y-2">
      <div className="h-3 rounded-sm bg-canvas-soft-2 w-3/4 shimmer-sweep" />
      <div className="h-2.5 rounded-sm bg-canvas-soft-2 w-1/2 shimmer-sweep" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSpinner;
