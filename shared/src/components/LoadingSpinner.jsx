import React from 'react';
import { Zap } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading ERP Data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-slate-400">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin"></div>
        <Zap className="w-4 h-4 text-orange-500 absolute animate-pulse" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500 tracking-wide">{message}</p>
    </div>
  );
};
