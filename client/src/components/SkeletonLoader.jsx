import React from 'react';

const Shimmer = ({ className }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${className}`}>
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
  </div>
);

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <Shimmer className="h-44 rounded-2xl" />
          <Shimmer className="h-4 w-3/4 rounded" />
          <Shimmer className="h-3 w-1/2 rounded" />
          <div className="flex items-center justify-between pt-2">
            <Shimmer className="h-8 w-20 rounded-xl" />
            <Shimmer className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
