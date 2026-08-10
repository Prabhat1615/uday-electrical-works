import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Phone, ArrowRight, Receipt, ShieldCheck, MessageCircle, Package, Wrench } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { Tilt3D } from './Tilt3D';
import { AuroraBackground, FloatingParticles, GlowBlobs, MeshGradient, AnimatedGrid } from './Backgrounds';

const stockCategories = [
  'Ceiling Fans', 'Exhaust Fans', 'Wall & Pedestal Fans', 'LED Bulbs & Battens',
  'Modular Switches & Sockets', 'MCBs & DB Boxes', 'Wires & Cables',
  'Voltage Stabilizers', 'Water Heaters & Geysers', 'Home Appliances'
];

const team = ['Prabhat', 'Chandan', 'Devnath', 'Appu', 'Dhruv', 'Amit', 'Sadhu'];

export const HeroSection = () => {
  const whatsappLink = `https://wa.me/917903789402?text=${encodeURIComponent('Hi Uday Electrical Works! I need an electrician / electrical product at my home in Jamshedpur.')}`;

  return (
    <section className="relative pt-12 lg:pt-24 pb-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      <AuroraBackground opacity={0.5} />
      <MeshGradient variant="light" opacity={0.9} />
      <GlowBlobs count={7} />
      <FloatingParticles count={20} />
      <AnimatedGrid />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-tr from-[#FF6B00]/15 via-[#0066FF]/10 to-[#00C853]/10 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] dark:text-orange-400 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Zap className="w-4 h-4 fill-[#FF6B00]" />
            <span>Chhota Govindpur • Jamshedpur Retail Store & Home Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] dark:text-white tracking-tight leading-[1.08]"
          >
            Electrical Products & Home Repair Services in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-amber-500 to-[#FF6B00]">Jamshedpur</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#475569] dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Genuine Havells, Crompton, Polycab, Philips & Anchor electricals from our shop in
            Chhota Govindpur — with doorstep fitting, repairs and house wiring by our own wiremen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            <MagneticButton>
              <Link to="/services" className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-sm shadow-xl shadow-[#FF6B00]/25 transition-colors hover:shadow-glow-orange-lg">
                <Zap className="w-4 h-4 fill-current" />
                <span>Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link to="/shop" className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-black text-sm shadow-xl shadow-[#0066FF]/25 transition-colors hover:shadow-glow-blue">
                <Package className="w-4 h-4" />
                <span>Shop Products</span>
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#00C853] hover:bg-[#00A844] text-white font-black text-sm shadow-xl shadow-[#00C853]/25 transition-colors hover:shadow-glow-emerald">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Us</span>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a href="tel:7903789402" className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-white font-bold text-sm shadow-md transition-all hover:border-[#0066FF] hover:shadow-glow-blue">
                <Phone className="w-4 h-4 text-[#0066FF]" />
                <span>Call Now (7903789402)</span>
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="relative max-w-5xl mx-auto"
        >
          <Tilt3D max={6} scale={1.01}>
            <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-800 shadow-2xl backdrop-blur-2xl gradient-border">

              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#00C853] shadow-sm"></span>
                  <span className="text-xs font-mono font-bold text-[#475569] dark:text-slate-400 pl-3">uday-electrical.com — Chhota Govindpur Store</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C853] animate-ping"></span>
                  <span className="text-xs font-bold text-[#00C853] px-3 py-1 rounded-full bg-[#00C853]/10 border border-[#00C853]/20">
                    Open Mon–Sat · 8:30 AM – 9:00 PM
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

                <div className="md:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-wider flex items-center space-x-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>What We Stock</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stockCategories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/shop?category=${encodeURIComponent(cat)}`}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[10px] font-bold text-[#475569] dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5 text-xs">
                    <p className="flex items-center space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
                      <span className="font-bold text-[#0F172A] dark:text-white">Brands we keep:</span>
                      <span className="text-[#475569]">Havells, Crompton, Polycab, Philips, Anchor</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Receipt className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span className="text-[#475569]">GST invoice issued with every purchase</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-wider flex items-center space-x-1">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Doorstep Service Team</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-slate-400 leading-relaxed">
                    Fan repair, geyser repair, wiring, DB upgrades, pump repair, appliance repair and
                    installation — at your home across Jamshedpur.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {team.map((name) => (
                      <span key={name} className="px-2.5 py-1 rounded-lg bg-[#0066FF]/10 border border-[#0066FF]/20 text-[10px] font-bold text-[#0066FF]">
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5 text-xs">
                    <p className="flex items-center space-x-2">
                      <Receipt className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span className="text-[#475569]">Starting fees shown for every service — see our service list</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
                      <span className="text-[#475569]">Booking status tracked online in your account</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tilt3D>
        </motion.div>
      </div>
    </section>
  );
};
