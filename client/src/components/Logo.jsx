import React from 'react';
import logoImg from '../assets/logo.png';

export const Logo = ({ size = 'md', iconOnly = false }) => {
  return (
    <div className="flex items-center space-x-3 group cursor-pointer select-none">
      {/* UE Brand Image Emblem */}
      <div className={`rounded-2xl overflow-hidden bg-white shadow-md shadow-orange-500/10 border border-[#E2E8F0] dark:border-slate-800 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center ${
        size === 'lg' ? 'w-12 h-12 p-1' : size === 'sm' ? 'w-7 h-7 p-0.5' : 'w-9 h-9 p-1'
      }`}>
        <img src={logoImg} alt="UE Logo" className="w-full h-full object-contain" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-[#0F172A] dark:text-white leading-tight ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base'
          }`}>
            UDAY <span className="text-[#FF6B00]">ELECTRICAL</span>
          </span>
          <span className={`uppercase font-extrabold tracking-widest text-[#0066FF] dark:text-blue-400 block ${
            size === 'lg' ? 'text-[11px]' : size === 'sm' ? 'text-[8px]' : 'text-[9px]'
          }`}>
            Retail Store & Home Services • Jamshedpur
          </span>
        </div>
      )}
    </div>
  );
};
