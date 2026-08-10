import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Phone, ArrowRight, ShieldCheck, Star, Users, Package, Clock, Wrench, CheckCircle2, Activity, MessageCircle } from 'lucide-react';
import { CountUp } from './CountUp';
import { MagneticButton } from './MagneticButton';
import { Tilt3D } from './Tilt3D';
import { AuroraBackground, FloatingParticles, GlowBlobs, MeshGradient, AnimatedGrid } from './Backgrounds';

export const HeroSection = () => {
  const stats = [
    { label: 'Customers Served', to: 1000, suffix: '+', icon: Users, color: 'text-[#FF6B00]' },
    { label: 'Products Sold', to: 5000, suffix: '+', icon: Package, color: 'text-[#0066FF]' },
    { label: 'Services Completed', to: 2500, suffix: '+', icon: CheckCircle2, color: 'text-[#00C853]' },
    { label: 'Emergency Support', static: '24/7', icon: Clock, color: 'text-purple-600' }
  ];

  const kpiChips = [
    { icon: Activity, text: '98% On-Time Visits', color: 'text-[#0066FF] bg-blue-600/10 border-blue-600/20', top: 'top-24 -left-2 lg:-left-10' },
    { icon: CheckCircle2, text: '6-Month Job Warranty', color: 'text-[#00C853] bg-emerald-500/10 border-emerald-500/20', top: 'top-40 -right-2 lg:-right-12' },
    { icon: Star, text: '4.9★ 1000+ Reviews', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', top: 'bottom-40 -left-2 lg:-left-12' },
    { icon: ShieldCheck, text: 'Licensed Wiremen', color: 'text-[#FF6B00] bg-orange-500/10 border-orange-500/20', top: 'bottom-24 -right-2 lg:-right-8' }
  ];

  const whatsappLink = `https://wa.me/917903789402?text=${encodeURIComponent('Hi Uday Electrical Works! I need an electrician / electrical product at my home in Jamshedpur.')}`;

  return (
    <section className="relative pt-12 lg:pt-24 pb-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-[#E2E8F0] dark:border-slate-800 overflow-hidden transition-colors duration-300">
      
      {/* Premium Animated Background System */}
      <AuroraBackground opacity={0.5} />
      <MeshGradient variant="light" opacity={0.9} />
      <GlowBlobs count={7} />
      <FloatingParticles count={20} />
      <AnimatedGrid />

      {/* Center spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-tr from-[#FF6B00]/15 via-[#0066FF]/10 to-[#00C853]/10 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Header Badge & Text Content */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Adomate Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] dark:text-orange-400 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Zap className="w-4 h-4 fill-[#FF6B00]" />
            <span>Chhota Govindpur • Jamshedpur Retail Store & Home Services</span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] dark:text-white tracking-tight leading-[1.08]"
          >
            Electrical Products & Home Repair Services in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-amber-500 to-[#FF6B00]">Jamshedpur</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#475569] dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Trusted electrical products, expert home electrical services, and appliance repairs delivered by experienced technicians.
          </motion.p>

          {/* Action CTAs with Magnetic Hover + Glow */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-3"
          >
            <MagneticButton>
              <Link
                to="/services"
                className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-sm shadow-xl shadow-[#FF6B00]/25 transition-colors hover:shadow-glow-orange-lg"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#00C853] hover:bg-[#00A844] text-white font-black text-sm shadow-xl shadow-[#00C853]/25 transition-colors hover:shadow-glow-emerald"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Us</span>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="tel:7903789402"
                className="flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-white font-bold text-sm shadow-md transition-all hover:border-[#0066FF] hover:shadow-glow-blue"
              >
                <Phone className="w-4 h-4 text-[#0066FF]" />
                <span>Call Now (7903789402)</span>
              </a>
            </MagneticButton>
          </motion.div>

        </div>

        {/* 3D Perspective Floating Stage with Mouse Tilt */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Floating KPI chips around stage */}
          {kpiChips.map((chip, i) => {
            const Icon = chip.icon;
            return (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                className={`absolute ${chip.top} hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-2xl glass-card z-20 ${chip.color}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] font-extrabold whitespace-nowrap text-slate-700 dark:text-slate-200">{chip.text}</span>
              </motion.div>
            );
          })}

          <Tilt3D max={6} scale={1.01}>
            <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-800 shadow-2xl backdrop-blur-2xl gradient-border">
              
              {/* Window Bar Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                  <span className="w-3 h-3 rounded-full bg-[#00C853] shadow-sm"></span>
                  <span className="text-xs font-mono font-bold text-[#475569] dark:text-slate-400 pl-3">uday-electrical-jamshedpur.app/3d-live-dispatch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C853] animate-ping"></span>
                  <span className="text-xs font-bold text-[#00C853] px-3 py-1 rounded-full bg-[#00C853]/10 border border-[#00C853]/20">
                    Live Dispatch: Jamshedpur Wiremen Online
                  </span>
                </div>
              </div>

              {/* Floating 3D Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* 3D Card 1: Active Service Booking Stream */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="md:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-4 hover:border-[#FF6B00] hover:shadow-glow-orange transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-wider flex items-center space-x-1">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Active Service Booking</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded">In Progress</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#0F172A] dark:text-white text-sm">Geyser Element & Fan Repair</h4>
                    <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">Govindpur Housing Colony, Jamshedpur</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wireman</span>
                      <span className="font-extrabold text-[#0F172A] dark:text-white">Prabhat (Senior Tech)</span>
                    </div>
                    <span className="text-[#0066FF] font-extrabold">📞 7470508176</span>
                  </div>
                </motion.div>

                {/* 3D Card 2: Featured Store Product */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="md:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-4 hover:border-[#0066FF] hover:shadow-glow-blue transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-wider flex items-center space-x-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>Featured Store Product</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded">HAVELLS</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#0F172A] dark:text-white text-sm line-clamp-1">Stealth Air 1250mm Ceiling Fan</h4>
                    <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">280 CMM Air Delivery • Pearl White</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 line-through block">MRP: ₹5,495</span>
                      <span className="font-black text-[#0F172A] dark:text-white text-base">₹4,699</span>
                    </div>
                    <span className="text-[#00C853] font-extrabold bg-[#00C853]/10 px-2.5 py-1 rounded-lg text-[10px]">
                      In Stock (Chhota Govindpur)
                    </span>
                  </div>
                </motion.div>

                {/* 3D Card 3: Technicians Status & Revenue */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="md:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-xl space-y-4 hover:border-[#00C853] hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#00C853] uppercase tracking-wider flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>On-Field Technician Roster</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">7 Wiremen</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                      <span className="font-bold text-[#0F172A] dark:text-white">Chandan (Appliance Lead)</span>
                      <span className="text-[#00C853] font-extrabold text-[10px]">✓ Telco Visit</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                      <span className="font-bold text-[#0F172A] dark:text-white">Devnath (DB Specialist)</span>
                      <span className="text-[#00C853] font-extrabold text-[10px]">✓ Baridih Visit</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-[#475569] font-semibold">Service Guarantee:</span>
                    <span className="font-extrabold text-[#FF6B00]">6-Month Warranty</span>
                  </div>
                </motion.div>

              </div>

            </div>
          </Tilt3D>
        </motion.div>

        {/* Statistics Counters Banner with Stagger Reveal + Hover Elevation */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="card-premium p-6 text-center space-y-2"
              >
                <div className={`p-3 w-fit rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 mx-auto ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-display">
                  {stat.static ? (
                    stat.static
                  ) : (
                    <CountUp to={stat.to} suffix={stat.suffix} duration={2.2} />
                  )}
                </h3>
                <p className="text-xs font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
