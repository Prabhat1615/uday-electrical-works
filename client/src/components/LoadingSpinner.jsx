import React from 'react';
import { Zap } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading ERP Data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin"></div>
        <Zap className="w-5 h-5 text-amber-400 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-300 tracking-wide">{message}</p>
    </div>
  );
};
