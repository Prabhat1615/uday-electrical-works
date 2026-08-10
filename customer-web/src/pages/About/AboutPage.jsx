import React from 'react';
import { motion } from 'framer-motion';
import { Store, Wrench, Package, Receipt, MapPin, Phone, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMarquee } from '../../components/BrandMarquee';
import { AnimatedSection } from '../../components/AnimatedSection';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { Seo } from '../../components/Seo';

const team = [
  { name: 'Prabhat', role: 'Senior Electrician' },
  { name: 'Chandan', role: 'Appliance Technician' },
  { name: 'Devnath', role: 'Wireman' },
  { name: 'Appu', role: 'Senior Technician' },
  { name: 'Dhruv', role: 'Electrician' },
  { name: 'Amit', role: 'Appliance Repair Specialist' },
  { name: 'Sadhu', role: 'Wireman' }
];

const serviceAreas = [
  'Chhota Govindpur', 'Govindpur Housing Colony', 'Telco', 'Baridih', 'Sidhgora',
  'Agrico', 'Golmuri', 'Birsanagar', 'Parsudih', 'Jugsalai', 'Sakchi', 'Mango', 'Adityapur'
];

export const AboutPage = () => {
  return (
    <div className="space-y-20 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Seo
        title="About Us | Uday Electrical Works — Electrical Shop in Chhota Govindpur, Jamshedpur"
        description="Family-run electrical shop & service centre in Chhota Govindpur, Jamshedpur. Our own wiremen — Prabhat, Chandan, Devnath, Appu & team — handle fan repair, geyser repair, wiring & more."
      />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <AnimatedBackground className="opacity-70" />
        <AnimatedSection direction="up" className="relative z-10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 dark:text-orange-400 font-extrabold text-xs uppercase tracking-widest"
          >
            <Store className="w-4 h-4" />
            <span>Electrical Shop & Service Centre — Chhota Govindpur, Jamshedpur</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto font-display"
          >
            Your Local Shop for <span className="text-gradient-orange">Electricals & Repairs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Uday Electrical Works is a walk-in electrical retail shop and workshop on Chhota Govindpur
            Main Road. We sell genuine fans, lights, wires, switches, MCBs and geysers — and our own
            wiremen do doorstep repairs, installations and house wiring across Jamshedpur.
          </motion.p>
        </AnimatedSection>
      </div>

      <BrandMarquee />

      {/* What we do */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">What We Do</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Shop & Doorstep Service, Under One Roof</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Store, color: 'bg-orange-500/10 text-orange-500', title: 'Retail Shop', desc: 'Ceiling fans, exhaust fans, LED lights, modular switches, wires & cables, MCBs & DB boxes, stabilizers, geysers and home appliances — from Havells, Crompton, Polycab, Philips, Anchor and more.' },
            { icon: Wrench, color: 'bg-blue-500/10 text-blue-600', title: 'Doorstep Repairs', desc: 'Fan repair, geyser repair, switch & socket repair, MCB replacement, water pump repair, cooler repair, mixer grinder, iron and kettle repair — at your home.' },
            { icon: Receipt, color: 'bg-emerald-500/10 text-emerald-500', title: 'Wiring & Installation', desc: 'House wiring repair, new light & fan installation, DB box upgrades and full-home inspections — with a digital GST invoice issued for every job.' }
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

      {/* Our Team */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Our Team</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">The Wiremen Who Do the Work</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            When you book a service, one of these wiremen from our shop is assigned to your visit.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 hover:border-orange-500 transition-colors"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-sm">
                {member.name.charAt(0)}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</h4>
              <p className="text-[10px] text-slate-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Facts Band */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none"></div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '7', label: 'Wiremen on Our Team', icon: Users, color: 'text-orange-400' },
              { value: '13', label: 'Areas Served in Jamshedpur', icon: MapPin, color: 'text-blue-400' },
              { value: '10', label: 'Product Categories in Store', icon: Package, color: 'text-emerald-400' },
              { value: 'Mon–Sat', label: 'Shop Hours · 8:30 AM – 9:00 PM', icon: Clock, color: 'text-amber-400' }
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

      {/* Service Areas */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Areas We Serve</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {serviceAreas.map((area) => (
            <span key={area} className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
              {area}
            </span>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">Need an Electrician in Jamshedpur?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Book a doorstep visit online, or call the store directly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/services" className="btn-cta px-7 py-3.5 text-sm">
            <Wrench className="w-4 h-4" />
            <span>Book a Service</span>
          </Link>
          <a href="tel:7903789402" className="btn-cta px-7 py-3.5 text-sm">
            <Phone className="w-4 h-4" />
            <span>Call 7903789402</span>
          </a>
          <span className="text-xs font-bold text-slate-500">Open Mon–Sat: 8:30 AM – 9:00 PM</span>
        </div>
      </AnimatedSection>

    </div>
  );
};
