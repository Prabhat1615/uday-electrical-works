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
import { AnimatedRotatingWord } from './AnimatedRotatingWord';

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
      className="relative min-h-[85vh] flex items-center pt-8 pb-14 bg-gradient-to-b from-white via-[#F8FAFC] to-white text-[#111827] overflow-hidden font-sans border-b border-[#E5E7EB]"
    >
      {/* Light Aurora Environmental Background */}
      <AuroraBackground opacity={0.18} />

      {/* Motion Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#F97316]/40 animate-particle opacity-60"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-[#0284C7]/30 animate-particle opacity-50"></div>
        <div className="absolute top-1/2 right-1/2 w-1.5 h-1.5 rounded-full bg-[#16A34A]/40 animate-particle opacity-70"></div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* LEFT HERO CONTENT (50% Desktop Width) */}
          <div className="lg:col-span-6 space-y-6 text-center sm:text-left">

            {/* Top Official Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-extrabold tracking-widest uppercase font-display"
              >
                <Zap className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
                <span>UDAY ELECTRICAL WORKS</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-[11px] font-bold tracking-wide font-display"
              >
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>Open Mon-Sat: 8:30 AM - 9:00 PM</span>
              </motion.div>
            </div>

            {/* Staggered Animated Headline - Exactly 2 lines on mobile view */}
            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="text-[22px] sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-[1.1] text-[#111827] font-display"
              >
                <span className="block">Powering Your Home.</span>
                <span className="block text-[#F97316]">
                  <AnimatedRotatingWord
                    words={['Building', 'Lighting', 'Securing', 'Energizing', 'Electrifying']}
                  />
                  <span> Your Future.</span>
                </span>
              </motion.h1>
            </div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="text-[#64748B] text-xs sm:text-base leading-relaxed max-w-xl mx-auto sm:mx-0"
            >
              Located on Chhota Govindpur Main Road, Uday Electrical Works offers genuine electrical products and doorstep electrician services with official GST billing.
            </motion.p>

            {/* Action Buttons - Centered & Compact 2 Buttons on Mobile View */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-2"
            >
              {/* Primary CTA */}
              <Link
                to="/shop"
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-[11px] sm:text-sm shadow-xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
              >
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Explore Products</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </Link>

              {/* Secondary CTA */}
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F97316] text-[#111827] font-extrabold text-[11px] sm:text-sm shadow-2xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
              >
                <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] shrink-0" />
                <span>Book a Service</span>
              </button>

              {/* Visit Store Action (Desktop / Tablet Only) */}
              <a
                href="#store-location-map"
                onClick={scrollToMap}
                className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#EA580C] transition-colors font-display shrink-0 whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
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
