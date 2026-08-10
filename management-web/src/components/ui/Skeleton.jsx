import React from 'react';

export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-surface-200 rounded ${className}`}
    {...props}
  />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`card p-5 space-y-4 ${className}`}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-10 w-full" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonStat = ({ className = '' }) => (
  <div className={`card p-5 space-y-3 ${className}`}>
    <Skeleton className="h-3 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-1/4" />
  </div>
);
