import React from 'react';

export const Shimmer = ({ className = '' }) => (
  <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
    <div className="absolute inset-0 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full" />
  </div>
);

export const SkeletonCard = () => (
  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
    <Shimmer className="h-40 rounded-lg w-full" />
    <div className="space-y-2">
      <Shimmer className="h-3 w-1/3 rounded-full" />
      <Shimmer className="h-4 w-4/5 rounded-md" />
    </div>
    <div className="flex items-center justify-between pt-1">
      <Shimmer className="h-5 w-20 rounded-md" />
      <Shimmer className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-4 space-y-3">
    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
      <Shimmer className="h-5 w-40 rounded-md" />
      <Shimmer className="h-8 w-28 rounded-lg" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 py-1.5">
        <Shimmer className="h-8 w-8 rounded-full shrink-0" />
        <Shimmer className="h-3.5 flex-1 rounded-md" />
        <Shimmer className="h-3.5 w-20 rounded-md" />
        <Shimmer className="h-3.5 w-16 rounded-md" />
        <Shimmer className="h-7 w-14 rounded-lg" />
      </div>
    ))}
  </div>
);

export const SkeletonLoader = ({ type = 'cards', count = 4 }) => {
  if (type === 'table') return <SkeletonTable rows={count} />;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
