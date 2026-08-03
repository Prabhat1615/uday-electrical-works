import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { BrandMarquee } from '../../components/BrandMarquee';

export const AboutPage = () => {
  return (
    <div className="space-y-20 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest"
        >
          <Award className="w-4 h-4" />
          <span>Govt. Class-A Licensed Electrical Engineers Since 2010</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto"
        >
          Hyderabad's Most Trusted Household Electrical Services Team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
        >
          For over 15 years, Uday Electrical Works has delivered 100% safe residential electrical wiring, ceiling fan installations, geyser repairs, DB box breaker upgrades, and emergency power restoration across Hyderabad.
        </motion.p>
      </section>

      <BrandMarquee />

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Why 10,000+ Families Choose Us</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Quality & Safety Commitments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="p-3.5 w-fit rounded-2xl bg-orange-500/10 text-orange-500 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Licensed Class-A Electricians</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every wireman on our team holds an official Telangana State Electrical Inspectorate wireman license with background verification.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="p-3.5 w-fit rounded-2xl bg-blue-500/10 text-blue-500 font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">30-Minute Doorstep ETA</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Local branch workshops situated in Balanagar, Kukatpally, and Sanathnagar ensure instant dispatch for electrical emergencies.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="p-3.5 w-fit rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">6-Month Service Warranty</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All electrical work, geyser repairs, and switchboard fittings come backed by an unconditional 6-month free service guarantee.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
