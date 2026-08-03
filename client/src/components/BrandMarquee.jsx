import React from 'react';
import { motion } from 'framer-motion';

export const BrandMarquee = () => {
  const brands = [
    'HAVELLS',
    'CROMPTON',
    'ORIENT ELECTRIC',
    'BAJAJ',
    'USHA',
    'ANCHOR BY PANASONIC',
    'POLYCAB',
    'FINOLEX',
    'RR KABEL',
    'SYSKA',
    'WIPRO',
    'PHILIPS',
    'GOLDMEDAL',
    'GM MODULAR',
    'V-GUARD'
  ];

  return (
    <div className="py-6 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden relative">
      <div className="flex space-x-12 whitespace-nowrap animate-marquee">
        {brands.concat(brands).map((brand, idx) => (
          <div key={idx} className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 font-extrabold text-xs tracking-widest uppercase hover:text-orange-500 transition-colors cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
