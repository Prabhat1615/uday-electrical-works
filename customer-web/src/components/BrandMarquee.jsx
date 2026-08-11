import React from 'react';
import { motion } from 'framer-motion';

// Real Brand Image Assets provided in customer-web/public/brands/
const brandLogos = [
  { name: 'Havells', file: '/brands/haveels.jpg' },
  { name: 'Philips', file: '/brands/philips.jpg' },
  { name: 'Crompton', file: '/brands/crompton.jpg' },
  { name: 'Polycab', file: '/brands/polycab.jpg' },
  { name: 'Anchor', file: '/brands/anchor.jpg' },
  { name: 'Bajaj', file: '/brands/bajaj.jpg' },
  { name: 'Finolex', file: '/brands/finolex.jpg' },
  { name: 'Orient', file: '/brands/orient(1).jpg' },
  { name: 'GM', file: '/brands/GM.jpg' },
  { name: 'Cona', file: '/brands/cona.jpg' },
  { name: 'Girish', file: '/brands/girish.jpg' },
  { name: 'Le Figaro', file: '/brands/lefigaro.jpg' },
  { name: 'Roxy', file: '/brands/roxy.jpg' }
];

export const BrandMarquee = () => {
  // Tripled array for seamless 100% infinite marquee loop
  const marqueeItems = [...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="relative py-10 bg-[#111827] text-white overflow-hidden border-y border-slate-800">
      
      {/* Visual Depth Background Halo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">
          AUTHORIZED DISTRIBUTOR &amp; RETAIL PARTNER
        </span>
      </div>

      {/* Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden edge-fade-x">
        <div className="flex w-max animate-marquee space-x-8 sm:space-x-12 py-2">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center justify-center h-16 sm:h-20 w-36 sm:w-44 px-4 bg-white/95 rounded-2xl border border-slate-700/60 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#F97316] group shrink-0"
            >
              <img
                src={brand.file}
                alt={brand.name}
                className="max-h-12 max-w-[130px] object-contain transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
