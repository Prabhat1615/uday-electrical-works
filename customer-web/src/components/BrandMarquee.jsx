import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';

export const BrandMarquee = () => {
  const brands = [
    { name: 'HAVELLS', tag: 'Fans & Wires', color: 'border-orange-500/20 text-orange-600 dark:text-orange-400' },
    { name: 'CROMPTON', tag: 'BLDC Fans & Pumps', color: 'border-blue-500/20 text-blue-600 dark:text-blue-400' },
    { name: 'ORIENT ELECTRIC', tag: 'Aeroquiet Fans', color: 'border-amber-500/20 text-amber-600 dark:text-amber-400' },
    { name: 'BAJAJ', tag: 'Irons & Appliances', color: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
    { name: 'USHA', tag: 'High Speed Fans', color: 'border-purple-500/20 text-purple-600 dark:text-purple-400' },
    { name: 'PHILIPS', tag: 'LED Lighting', color: 'border-sky-500/20 text-sky-600 dark:text-sky-400' },
    { name: 'SYSKA', tag: 'Smart Bulbs', color: 'border-rose-500/20 text-rose-600 dark:text-rose-400' },
    { name: 'WIPRO', tag: 'LED Battens', color: 'border-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
    { name: 'ANCHOR BY PANASONIC', tag: 'Modular Switches', color: 'border-orange-500/20 text-orange-600 dark:text-orange-400' },
    { name: 'GOLDMEDAL', tag: 'Power Sockets', color: 'border-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
    { name: 'GM MODULAR', tag: 'Universal Plates', color: 'border-teal-500/20 text-teal-600 dark:text-teal-400' },
    { name: 'POLYCAB', tag: 'FR Copper Wires', color: 'border-blue-500/20 text-blue-600 dark:text-blue-400' },
    { name: 'RR KABEL', tag: 'FR-LSH Cables', color: 'border-red-500/20 text-red-600 dark:text-red-400' },
    { name: 'FINOLEX', tag: 'House Wires', color: 'border-cyan-500/20 text-cyan-600 dark:text-cyan-400' },
    { name: 'V-GUARD', tag: 'Geysers & Stabilizers', color: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400' }
  ];

  return (
    <section className="py-12 bg-slate-100/80 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 space-y-8 overflow-hidden relative backdrop-blur-sm">
      
      {/* Heading & Subheading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-widest">
          <Award className="w-3.5 h-3.5" />
          <span>100% Authorized Genuine Store Spares</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Trusted Electrical Brands
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          We stock genuine products from India's most trusted electrical brands.
        </p>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative overflow-hidden py-2 edge-fade-x">
        <div className="flex space-x-6 whitespace-nowrap animate-marquee will-change-transform">
          {brands.concat(brands).map((brand, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-glow-orange hover:border-[#FF6B00]/50 hover:-translate-y-1.5 hover:scale-[1.06] transition-all cursor-pointer ${brand.color}`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              <div>
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase block text-slate-900 dark:text-white">
                  {brand.name}
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 block tracking-normal">
                  {brand.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Gradient hairline under track */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      </div>

    </section>
  );
};
