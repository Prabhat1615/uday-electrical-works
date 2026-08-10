import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Wrench, Phone, ChevronRight } from 'lucide-react';
import { useServices } from '../../hooks/useErpQueries';
import { formatCurrency } from '../../utils/formatters';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Seo } from '../../components/Seo';

const ALL_CATEGORIES = [
  'Fan Repair',
  'Fan Installation',
  'Tube Light Installation',
  'LED Light Installation',
  'Switch Repair',
  'Socket Repair',
  'MCB Replacement',
  'House Wiring Repair',
  'Door Bell Installation',
  'Water Pump Repair',
  'Geyser Repair',
  'Exhaust Fan Repair',
  'Cooler Repair',
  'Mixer Grinder Repair',
  'Iron Repair',
  'Electric Kettle Repair',
  'Emergency Electrical Visit',
  'Home Electrical Inspection'
];

export const ServicesPage = () => {
  const [category, setCategory] = useState('');
  const { data: servicesRes, isLoading } = useServices({ category: category || undefined });

  const services = servicesRes?.data || [];

  const categories = useMemo(
    () => [...new Set(ALL_CATEGORIES.filter((c) => services.some((s) => s.category === c)))],
    [services]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title="Doorstep Electrician Services in Jamshedpur | Uday Electrical Works"
        description="Fan repair, geyser repair, house wiring, MCB replacement & more — starting fees listed. Book online or call 7903789402. Serving Chhota Govindpur, Telco, Baridih & all of Jamshedpur."
      />

      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-900 dark:to-slate-950 border-b border-[#E2E8F0] dark:border-slate-800 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
          <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Doorstep Service</span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-display">
            Home Repair & Installation Services
          </h1>
          <p className="text-sm text-[#475569] dark:text-slate-400 max-w-2xl mx-auto">
            Every service shows its starting fee and duration. Book online and track the status in
            your account, or call us at 7903789402.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setCategory('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              !category
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/25'
                : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                category === cat
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/25'
                  : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : services.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Wrench className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-black text-[#0F172A] dark:text-white">No services in this category yet</h3>
            <p className="text-sm text-[#475569] dark:text-slate-400">Try another category, or call us — we may still be able to help.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="card-premium flex flex-col group"
              >
                <Link to={`/services/${service._id}`} className="flex flex-col flex-1">
                  <div className="h-44 overflow-hidden relative">
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center">
                        <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-[10px] uppercase shadow">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#FF6B00] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-[#475569] dark:text-slate-400 mt-2 line-clamp-2">{service.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Starting Fee</span>
                          <span className="text-lg font-black text-[#0F172A] dark:text-white">{formatCurrency(service.estimatedPrice)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-bold text-[#475569] dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                          <span>{service.estimatedDuration}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/services/${service._id}/book`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-xs text-center transition-all shadow-md hover:shadow-glow-orange"
                        >
                          Book Visit
                        </Link>
                        <Link
                          to={`/services/${service._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-slate-200 font-bold text-xs flex items-center space-x-1 hover:border-[#0066FF] transition-all"
                        >
                          Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Service areas CTA */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl text-center space-y-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF6B00]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <h3 className="text-2xl font-black text-white font-display relative">Where We Work</h3>
          <p className="text-sm text-slate-400 max-w-3xl mx-auto relative">
            Chhota Govindpur · Govindpur Housing Colony · Telco · Baridih · Sidhgora · Agrico ·
            Golmuri · Birsanagar · Parsudih · Jugsalai · Sakchi · Mango · Adityapur
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative">
            <a
              href="tel:7903789402"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md hover:shadow-glow-orange"
            >
              <Phone className="w-4 h-4" />
              <span>Call: 7903789402</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs transition-all"
            >
              Store Map & Directions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
