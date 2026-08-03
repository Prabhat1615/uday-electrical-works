import React from 'react';
import { Zap } from 'lucide-react';

export const Logo = ({ size = 'md', iconOnly = false }) => {
  return (
    <div className="flex items-center space-x-2.5 group cursor-pointer select-none">
      {/* Icon Badge */}
      <div className={`rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform flex items-center justify-center ${
        size === 'lg' ? 'p-3' : size === 'sm' ? 'p-1.5' : 'p-2'
      }`}>
        <Zap className={`${size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} fill-current`} />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white leading-tight ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
          }`}>
            UDAY <span className="text-orange-500">ELECTRICAL</span>
          </span>
          <span className={`uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 block ${
            size === 'lg' ? 'text-[11px]' : size === 'sm' ? 'text-[8px]' : 'text-[9px]'
          }`}>
            Retail Store & Home Services • Jamshedpur
          </span>
        </div>
      )}
    </div>
  );
};
