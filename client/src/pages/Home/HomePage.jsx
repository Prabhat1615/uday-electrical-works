import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, ChevronRight, Star, Phone, Sparkles, Wrench, Package, MapPin, MessageSquare, Send, Building2 } from 'lucide-react';
import { useProducts, useServices } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BrandMarquee } from '../../components/BrandMarquee';
import { SkeletonLoader } from '../../components/SkeletonLoader';

export const HomePage = () => {
  const { data: productsRes, isLoading: loadingProducts } = useProducts({ limit: 6 });
  const { data: servicesRes, isLoading: loadingServices } = useServices({ limit: 6 });

  const products = productsRes?.data || [];
  const services = servicesRes?.data || [];

  // Callback Form State
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSubmitted, setCbSubmitted] = useState(false);

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setCbSubmitted(true);
  };

  const productCategories = [
    { title: 'Ceiling & Exhaust Fans', desc: 'BLDC, High Speed & Anti-Dust', icon: '🌀', count: '15+ Models' },
    { title: 'LED Bulbs & Battens', desc: 'Philips, Syska & Wipro LED', icon: '💡', count: '20+ Models' },
    { title: 'Modular Switches & Sockets', desc: 'Anchor Roma, Goldmedal, GM', icon: '🔌', count: '30+ Models' },
    { title: 'Wires & Cables', desc: '1.0mm to 6.0mm Polycab & Finolex', icon: '⚡', count: '10+ Coils' },
    { title: 'MCB & DB Boxes', desc: 'Havells & Schneider Circuit Breakers', icon: '🛡️', count: '12+ Types' },
    { title: 'Water Heaters & Geysers', desc: 'V-Guard, Crompton & Bajaj 3L-25L', icon: '🚿', count: '8+ Models' }
  ];

  return (
    <div className="space-y-20 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* SECTION 1: Adomate-Inspired Hero Section */}
      <section className="relative pt-12 lg:pt-20 pb-20 border-b border-slate-200 dark:border-slate-800">
        
        {/* Glow Mesh Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[400px] bg-gradient-to-tr from-amber-400/20 via-blue-500/10 to-transparent blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <Zap className="w-4 h-4 fill-orange-500" />
            <span>Uday Electrical Works • Balanagar Retail Store & Home Services</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-5xl mx-auto"
          >
            Your Local Electrical Shop & Instant Doorstep <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400">Electrician Service.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Buy original Havells, Crompton, Polycab & Philips electricals or book licensed wiremen for fan fitting, geyser repair, house rewinding & MCB trips with 6-month warranty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/services"
              className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 transition-all hover:scale-105"
            >
              <span>Book Electrician Visit (30-Min ETA)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm shadow-sm transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4 text-orange-500" />
              <span>Call Store: +91 98765 43210</span>
            </a>
          </motion.div>

          {/* Floating Card Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-12 relative max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-mono font-bold text-slate-500 pl-2">uday-electrical-store.app/dispatch</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Live Status: Technicians Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Wireman</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">K. Ramesh (Lic. #8940)</h4>
                    <p className="text-emerald-500 font-bold mt-1">✓ On the way to Kukatpally</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Service Guarantee</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">6-Month Warranty</h4>
                    <p className="text-orange-500 font-bold mt-1">100% Factory Spares</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Customer Score</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">4.9 / 5.0 Rating</h4>
                    <p className="text-amber-500 font-bold mt-1">1,480+ Local Families</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: Trusted Brands Marquee */}
      <BrandMarquee />

      {/* SECTION 3: Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Store Product Department</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Household Electrical Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {productCategories.map((cat, idx) => (
            <Link
              key={idx}
              to="/products"
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-2 hover:border-orange-500 transition-all hover:-translate-y-1 block"
            >
              <span className="text-3xl block">{cat.icon}</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{cat.title}</h3>
              <span className="text-[10px] text-slate-400 block font-semibold">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: Home Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Doorstep Electrician Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Home Repair & Installation Services</h2>
          </div>
          <Link to="/services" className="text-sm font-extrabold text-orange-500 hover:underline flex items-center space-x-1 mt-2 md:mt-0">
            <span>View All 18+ Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingServices ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-[10px] uppercase shadow">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{item.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Starting Fee</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(item.estimatedPrice)}</span>
                    </div>
                    <Link
                      to="/services"
                      className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-slate-950 font-black text-xs transition-all"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5: Why Choose Us (Trust Badges) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Why Local Families Trust Uday Electricals</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Local Store Guarantee</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <Award className="w-8 h-8 text-orange-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Govt. Licensed Wiremen</h3>
            <p className="text-xs text-slate-500">Class-A certified electricians with background verification.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <Clock className="w-8 h-8 text-blue-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">30-Min Rapid ETA</h3>
            <p className="text-xs text-slate-500">Fast arrival in Balanagar, Kukatpally & Sanathnagar.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">6-Month Service Warranty</h3>
            <p className="text-xs text-slate-500">100% free repair guarantee on all electrical work.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <Package className="w-8 h-8 text-purple-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Genuine Factory Parts</h3>
            <p className="text-xs text-slate-500">Original Havells, Crompton, Polycab & Anchor materials.</p>
          </div>
        </div>
      </section>

      {/* SECTION 6: Service Process (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Simple 4-Step Booking</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How Our Doorstep Service Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 font-black text-base flex items-center justify-center mx-auto">1</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Book Online or Call</h3>
            <p className="text-xs text-slate-500">Choose service & preferred date or call our shop directly.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 font-black text-base flex items-center justify-center mx-auto">2</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wireman Dispatched</h3>
            <p className="text-xs text-slate-500">Licensed technician arrives at your doorstep in 30 mins.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 font-black text-base flex items-center justify-center mx-auto">3</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Job Repair Completed</h3>
            <p className="text-xs text-slate-500">Inspection & repair done using original brand spares.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 font-black text-base flex items-center justify-center mx-auto">4</div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Warranty & GST Invoice</h3>
            <p className="text-xs text-slate-500">Digital GST receipt issued with 6-month service warranty.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Featured Household Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">In-Store Electrical Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Featured Household Electricals</h2>
          </div>
          <Link to="/products" className="text-sm font-extrabold text-orange-500 hover:underline flex items-center space-x-1 mt-2 md:mt-0">
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingProducts ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all"
              >
                <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-950">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-slate-950 font-black text-[10px] uppercase shadow">
                      {product.brand}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase">{product.category}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-orange-500 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {product.mrp > product.price && (
                        <span className="text-[10px] text-slate-400 line-through block">MRP: ₹{product.mrp}</span>
                      )}
                      <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
                    </div>
                    <Link
                      to="/products"
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-200 text-xs font-bold"
                    >
                      View Specs
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 8: Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Verified Local Reviews</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">4.9 Star Rating in Balanagar & Kukatpally</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-xl leading-relaxed">
              Read feedback from over 1,480 local families who trust Uday Electrical Works for home repair.
            </p>
          </div>

          <Link
            to="/reviews"
            className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all text-center"
          >
            Read Customer Reviews →
          </Link>
        </div>
      </section>

      {/* SECTION 9: Business Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-orange-500">15+</h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Years Experience</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-blue-500">10,000+</h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Homes Served</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-500">30 Mins</h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Average ETA</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-purple-500">100%</h3>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Licensed Wiremen</p>
          </div>
        </div>
      </section>

      {/* SECTION 10: Callback Request Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Instant Phone Assistance</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Request an Electrician Callback</h3>
          </div>

          {cbSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm">Callback requested! Our wireman will call {cbPhone} within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={cbName}
                onChange={(e) => setCbName(e.target.value)}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                value={cbPhone}
                onChange={(e) => setCbPhone(e.target.value)}
                className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Call Me Back</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 11: Google Maps / Workshop Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Visit Our Retail Store</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Balanagar Store & Workshop Location</h2>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-4 text-xs">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Uday Electrical Works (Store & Service Hub)</h4>
                <p className="text-slate-500">Plot 42, IDA Balanagar, Hyderabad, TS - 500037</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <p><strong className="text-slate-900 dark:text-white">Store Hours:</strong> Monday - Saturday (8:30 AM - 9:00 PM)</p>
              <p><strong className="text-slate-900 dark:text-white">Emergency Visits:</strong> Available 24 Hours / 7 Days</p>
              <p><strong className="text-slate-900 dark:text-white">Store Phone:</strong> +91 98765 43210</p>
            </div>
          </div>

          <div className="md:col-span-7 h-56 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-center p-4">
            <div>
              <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-1 animate-bounce" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Plot 42, Industrial Development Area, Balanagar</p>
              <p className="text-[11px] text-slate-500">Hyderabad, Telangana - 500037</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
