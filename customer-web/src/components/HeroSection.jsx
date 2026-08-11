import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  MapPin, 
  Package, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { AuroraBackground } from './Backgrounds';
import { InteractiveBookingFlowModal } from './InteractiveBookingFlowModal';

export const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth 3D mouse perspective tilt controls for desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 20
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 20
  });

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToMap = (e) => {
    e.preventDefault();
    const mapElem = document.getElementById('store-location-map');
    if (mapElem) {
      mapElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] flex items-center pt-8 pb-14 bg-gradient-to-b from-[#111318] via-[#171A1F] to-[#111318] text-[#F5F5F2] overflow-hidden font-sans border-b border-slate-800"
    >
      {/* Light Aurora Environmental Background */}
      <AuroraBackground opacity={0.12} />

      {/* Warm Gold Ambient Halo */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#D6A84F]/15 blur-[120px] pointer-events-none" />

      {/* Motion Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#D6A84F]/50 animate-particle opacity-70"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-[#5D8FD9]/40 animate-particle opacity-60"></div>
        <div className="absolute top-1/2 right-1/2 w-1.5 h-1.5 rounded-full bg-[#3FAE72]/50 animate-particle opacity-70"></div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* LEFT HERO CONTENT (50% Desktop Width) */}
          <div className="lg:col-span-6 space-y-6 text-left">

            {/* Small Business Identity Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#22262D] border border-[#D6A84F]/30 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#3FAE72] animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">
                UDAY ELECTRICAL WORKS · JAMSHEDPUR
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12] font-display">
                Electrical Store &amp; <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6A84F] via-[#E7C878] to-[#C99532]">
                  Doorstep Services
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#E7C878] uppercase tracking-wider font-display pt-1">
                Chhota Govindpur Main Road · Official Brand Retailer
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-xs sm:text-base text-[#AAB0B8] leading-relaxed max-w-xl font-sans"
            >
              Buy 100% genuine electrical products from Havells, Crompton, Polycab, Philips &amp; Anchor at our Chhota Govindpur shop with GST invoices, or book our in-house wiremen for doorstep repairs, fan fittings, and house wiring across Jamshedpur.
            </motion.p>

            {/* In-House Wiremen Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              <span className="text-[11px] font-bold text-slate-400 font-display mr-1">Doorstep Wiremen:</span>
              {['Prabhat', 'Chandan', 'Devnath', 'Appu', 'Dhruv', 'Amit', 'Sadhu'].map((name) => (
                <span key={name} className="px-2.5 py-1 rounded-lg bg-[#22262D] border border-slate-700 text-[11px] font-bold text-[#F5F5F2]">
                  {name}
                </span>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              {/* Primary CTA */}
              <Link
                to="/shop"
                className="inline-flex items-center justify-center space-x-3 px-7 py-4 rounded-2xl bg-[#D6A84F] hover:bg-[#C99532] text-[#111318] font-extrabold text-sm sm:text-base shadow-md shadow-[#D6A84F]/25 hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
              >
                <Package className="w-5 h-5 shrink-0" />
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>

              {/* Secondary CTA */}
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center space-x-3 px-7 py-4 rounded-2xl bg-[#22262D] border border-slate-700 hover:border-[#D6A84F] text-white font-extrabold text-sm sm:text-base shadow-xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
              >
                <Wrench className="w-5 h-5 text-[#D6A84F] shrink-0" />
                <span>Book a Service</span>
              </button>

              {/* Additional Action */}
              <a
                href="#store-location-map"
                onClick={scrollToMap}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-[#AAB0B8] hover:text-[#D6A84F] transition-colors font-display shrink-0 whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 text-[#D6A84F] shrink-0" />
                <span>Visit Store</span>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.34 }}
              className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center gap-4 text-xs text-[#64748B]"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                Genuine Warranty
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Zap className="w-4 h-4 text-[#F97316]" />
                In-House Wiremen Team
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <MapPin className="w-4 h-4 text-[#0284C7]" />
                Chhota Govindpur Main Road
              </span>
            </motion.div>

          </div>

          {/* RIGHT HERO 3D ARCHITECTURAL VISUALIZATION (50% Desktop Width) */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
            
            {/* Ambient Backlight Halo */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F97316]/15 via-orange-500/5 to-transparent rounded-full blur-3xl opacity-80"></div>

            {/* 3D Storefront Container with Smooth Perspective Mouse Tilt */}
            <motion.div
              style={{
                rotateX: isMobile ? 0 : rotateXSpring,
                rotateY: isMobile ? 0 : rotateYSpring,
                transformStyle: 'preserve-3d'
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-lg lg:max-w-xl group"
            >
              {/* Floating Animation Wrapper */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* 3D Architectural Storefront Image */}
                <img
                  src="/ueworks.png"
                  alt="Uday Electrical Works 3D Storefront Visualization"
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-[0_20px_25px_rgba(15,23,42,0.15)] transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Soft Ambient Floor Shadow */}
                <div className="w-[85%] h-5 mx-auto bg-slate-900/20 blur-lg rounded-full mt-2"></div>
              </motion.div>

              {/* Floating Feature Card 1: Genuine Brands (Top Right) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-2 sm:-right-6 p-3 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-md backdrop-blur-md flex items-center space-x-3 hidden sm:flex z-20 hover:border-[#F97316]/60 transition-colors"
              >
                <div className="p-2 rounded-xl bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] font-display">Genuine Brands</h4>
                  <span className="text-[10px] text-[#64748B] block font-sans">Havells, Philips, Polycab</span>
                </div>
              </motion.div>

              {/* Floating Feature Card 2: House Wiring (Middle Left) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 p-3 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-md backdrop-blur-md flex items-center space-x-3 hidden sm:flex z-20 hover:border-[#0284C7]/60 transition-colors"
              >
                <div className="p-2 rounded-xl bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] font-display">House Wiring</h4>
                  <span className="text-[10px] text-[#64748B] block font-sans">Complete DB &amp; Fittings</span>
                </div>
              </motion.div>

              {/* Floating Feature Card 3: Doorstep Service (Bottom Right) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute -bottom-4 -right-2 sm:-right-4 p-3 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-md backdrop-blur-md flex items-center space-x-3 hidden sm:flex z-20 hover:border-[#16A34A]/60 transition-colors"
              >
                <div className="p-2 rounded-xl bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827] font-display">Doorstep Service</h4>
                  <span className="text-[10px] text-[#64748B] block font-sans">Jamshedpur Wiremen</span>
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>

      {/* Interactive Booking Stepper Modal */}
      <InteractiveBookingFlowModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </section>
  );
};
