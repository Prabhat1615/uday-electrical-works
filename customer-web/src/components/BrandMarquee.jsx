import React from 'react';

// New Clean PNG Brand Logo Assets copied to customer-web/public/brands/
const brandLogos = [
  { name: 'Havells', file: '/brands/havells-logo.png' },
  { name: 'Philips', file: '/brands/philips-logo.png' },
  { name: 'Crompton', file: '/brands/crompton-logo.png' },
  { name: 'Polycab', file: '/brands/polycab-logo.png' },
  { name: 'Anchor', file: '/brands/anchor-logo.png' },
  { name: 'Bajaj', file: '/brands/bajaj-logo.png' },
  { name: 'Finolex', file: '/brands/finolex-logo.png' },
  { name: 'Orient', file: '/brands/orient-logo.png' },
  { name: 'GM', file: '/brands/gm-logo.png' },
  { name: 'Cona', file: '/brands/cona-logo.png' },
  { name: 'Girish', file: '/brands/girish-logo.png' },
  { name: 'Le Figaro', file: '/brands/lefigaro-logo.png' },
  { name: 'Roxy', file: '/brands/roxy-logo.png' }
];

export const BrandMarquee = () => {
  // Tripled array for 100% seamless infinite marquee loop
  const marqueeItems = [...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="relative py-2.5 sm:py-3.5 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] text-[#303841] overflow-hidden border-y border-[#E2E8F0]">
      
      {/* Subtle Environmental Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 bg-[#FF5722]/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-48 h-48 bg-[#76ABAE]/8 rounded-full blur-3xl"></div>
      </div>

      {/* Sleek Micro Header Label */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-2 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold text-[#5B8C90] uppercase tracking-[0.22em] font-display">
          <span className="w-1 h-1 rounded-full bg-[#FF5722] animate-pulse"></span>
          AUTHORIZED DISTRIBUTOR &amp; RETAIL PARTNER
        </span>
      </div>

      {/* Edge Fade Gradients */}
      <div className="relative w-full overflow-hidden edge-fade-x z-10">
        <div className="flex w-max animate-marquee space-x-6 sm:space-x-10 py-1 items-center">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center justify-center shrink-0 px-2 sm:px-3"
            >
              <img
                src={brand.file}
                alt={brand.name}
                className="h-5 sm:h-7 w-auto max-w-[85px] sm:max-w-[110px] object-contain transition-all duration-300 filter drop-shadow-2xs hover:scale-110 opacity-90 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};






