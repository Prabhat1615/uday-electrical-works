import React from 'react';

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
          <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
        </div>
      ))}
    </div>
  );
};
