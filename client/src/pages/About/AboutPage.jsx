import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { BrandMarquee } from '../../components/BrandMarquee';
import { AnimatedSection } from '../../components/AnimatedSection';
import { AnimatedBackground } from '../../components/AnimatedBackground';

export const AboutPage = () => {
  return (
    <div className="space-y-20 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Hero */}
      <div className="relative overflow-hidden">
        <AnimatedBackground className="opacity-70" />
        <AnimatedSection direction="up" className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest"
        >
          <Award className="w-4 h-4" />
          <span>Govt. Licensed Electrical Engineers Since 2010</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto font-display"
        >
          Jamshedpur's Most Trusted <span className="text-gradient-orange">Doorstep Electrical</span> Services Team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
        >
          For over 15 years, Uday Electrical Works has delivered 100% safe residential electrical wiring, ceiling fan installations, geyser repairs, DB box breaker upgrades, and emergency power restoration across Jamshedpur.
        </motion.p>
      </AnimatedSection>
      </div>

      <BrandMarquee />

      {/* Trust Pillars */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Why 10,000+ Families Choose Us</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Our Quality & Safety Commitments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, color: 'bg-orange-500/10 text-orange-500', title: 'Licensed Electricians', desc: 'Every wireman on our team holds an official Jharkhand State wireman license with background verification.' },
            { icon: Clock, color: 'bg-blue-500/10 text-blue-600', title: '30-Minute Doorstep ETA', desc: 'Local workshop in Chhota Govindpur ensures instant dispatch for electrical emergencies across 13 localities.' },
            { icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-500', title: '6-Month Service Warranty', desc: 'All electrical work, geyser repairs, and switchboard fittings come backed by an unconditional 6-month free service guarantee.' }
          ].map(({ icon: Icon, color, title, desc }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="card-premium p-8 space-y-3"
            >
              <div className={`p-3.5 w-fit rounded-2xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Stats Band */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none"></div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '15+', label: 'Years of Service', icon: Award, color: 'text-orange-400' },
              { value: '10,000+', label: 'Jobs Completed', icon: Users, color: 'text-blue-400' },
              { value: '13', label: 'Localities Covered', icon: MapPin, color: 'text-emerald-400' },
              { value: '4.9★', label: 'Google Rating', icon: ShieldCheck, color: 'text-amber-400' }
            ].map(({ value, label, icon: Icon, color }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="space-y-2"
              >
                <Icon className={`w-6 h-6 mx-auto ${color}`} />
                <p className="text-2xl sm:text-3xl font-black text-white font-display">{value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">Need an Electrician in Jamshedpur?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Book a doorstep visit or call our store directly for instant dispatch.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a href="tel:7903789402" className="btn-cta px-7 py-3.5 text-sm">
            <Phone className="w-4 h-4" />
            <span>Call 7903789402</span>
          </a>
          <span className="text-xs font-bold text-slate-500">Open Mon–Sat: 8:30 AM – 9:00 PM · 24/7 Emergency</span>
        </div>
      </AnimatedSection>

    </div>
  );
};
