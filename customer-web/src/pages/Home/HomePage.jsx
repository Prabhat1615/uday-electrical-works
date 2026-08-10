import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, ChevronRight, ChevronLeft, Star, Phone, Wrench, Package, Send, Building2, ExternalLink, X, Play, Pause, Store, Receipt } from 'lucide-react';
import { useProducts, useServices } from '../../hooks/useErpQueries';
import { formatCurrency } from '../../utils/formatters';
import { BrandMarquee } from '../../components/BrandMarquee';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { HeroSection } from '../../components/HeroSection';
import { AnimatedSection } from '../../components/AnimatedSection';
import { Seo } from '../../components/Seo';
import { useAuth } from '../../hooks/useAuth';
import { createLeadApi } from '../../api/leadApi';

const productCategories = [
  { title: 'Ceiling Fans', icon: '🌀' },
  { title: 'Exhaust Fans', icon: '🌬️' },
  { title: 'LED Bulbs & Battens', icon: '💡' },
  { title: 'Modular Switches & Sockets', icon: '🔌' },
  { title: 'Wires & Cables', icon: '⚡' },
  { title: 'MCBs & DB Boxes', icon: '🛡️' },
  { title: 'Water Heaters & Geysers', icon: '🚿' },
  { title: 'Voltage Stabilizers', icon: '🔋' }
];

export const HomePage = () => {
  const serviceScrollRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const resumeTimerRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: productsRes, isLoading: loadingProducts } = useProducts({ limit: 6 });
  const { data: servicesRes, isLoading: loadingServices } = useServices({ limit: 12 });

  const products = productsRes?.data || [];
  const services = servicesRes?.data || [];

  const autoScrollPaused = !autoPlay || isHovered || !!selectedService;

  useEffect(() => {
    const track = serviceScrollRef.current;
    if (!track || !services.length) return;
    const speed = 1.1;
    let last = performance.now();

    const step = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!autoScrollPaused) {
        progressRef.current += speed * dt;
      }
      const half = track.scrollWidth / 2;
      if (half > 0 && progressRef.current >= half) {
        progressRef.current -= half;
      }
      track.style.transform = `translate3d(-${progressRef.current}px, 0, 0)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [services, autoScrollPaused]);

  useEffect(() => () => clearTimeout(resumeTimerRef.current), []);

  const handleManualScroll = (dir) => {
    setAutoPlay(false);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setAutoPlay(true), 8000);
    const track = serviceScrollRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    const step = (first?.getBoundingClientRect().width || 300) + 24;
    const half = track.scrollWidth / 2;
    progressRef.current = (progressRef.current + dir * step + half) % half;
    track.style.transform = `translate3d(-${progressRef.current}px, 0, 0)`;
  };

  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSubmitted, setCbSubmitted] = useState(false);
  const [cbError, setCbError] = useState('');
  const [cbLoading, setCbLoading] = useState(false);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setCbError('');
    if (!isAuthenticated) {
      setCbError('Please sign in first, or call us directly at 7903789402.');
      return;
    }
    setCbLoading(true);
    try {
      await createLeadApi({
        name: cbName,
        phone: cbPhone,
        serviceRequired: 'Callback Request'
      });
      setCbSubmitted(true);
    } catch (err) {
      setCbError(err.message || 'Could not submit. Please call 7903789402.');
    } finally {
      setCbLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Seo
        title="Uday Electrical Works | Electrical Shop & Home Services in Jamshedpur"
        description="Electrical shop & doorstep service centre in Chhota Govindpur, Jamshedpur. Genuine Havells, Crompton, Polycab products. Fan repair, geyser repair, house wiring. Call 7903789402."
      />

      <HeroSection />
      <BrandMarquee />

      {/* Product Categories Grid */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Store Department</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-display">What We Sell at Our Shop</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productCategories.map((cat, idx) => (
            <Link
              key={cat.title}
              to={`/shop?category=${encodeURIComponent(cat.title)}`}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card text-center space-y-2 hover:border-[#FF6B00] hover:shadow-glow-orange transition-all hover:-translate-y-1.5 block"
            >
              <span className="text-3xl block group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
              <h3 className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight group-hover:text-[#FF6B00] transition-colors">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* Home Services Marquee */}
      <AnimatedSection direction="up" delay={0.05} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Doorstep Electrician Services</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white mt-1 font-display">Home Repair & Installation Services</h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleManualScroll(-1)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#FF6B00] text-[#0F172A] dark:text-white shadow-md hover:scale-105 transition-all"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 text-[#FF6B00]" />
              </button>
              <button
                onClick={() => setAutoPlay((prev) => !prev)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#FF6B00] text-[#0F172A] dark:text-white shadow-md hover:scale-105 transition-all"
                title={autoPlay ? 'Pause Auto Scroll' : 'Resume Auto Scroll'}
              >
                {autoPlay ? <Pause className="w-5 h-5 text-[#FF6B00]" /> : <Play className="w-5 h-5 text-[#FF6B00]" />}
              </button>
              <button
                onClick={() => handleManualScroll(1)}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#FF6B00] text-[#0F172A] dark:text-white shadow-md hover:scale-105 transition-all"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 text-[#FF6B00]" />
              </button>
            </div>

            <Link to="/services" className="text-xs font-extrabold px-4 py-2.5 rounded-2xl bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white transition-all flex items-center space-x-1">
              <span>View All Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {loadingServices ? (
          <SkeletonLoader count={3} />
        ) : (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="relative overflow-hidden edge-fade-x py-2"
          >
            <div
              ref={serviceScrollRef}
              className="flex items-stretch gap-6 will-change-transform"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              {services.concat(services).map((item, idx) => (
                <motion.div
                  key={`${item._id}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % services.length) * 0.08 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedService(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedService(item);
                    }
                  }}
                  className="w-[300px] sm:w-[360px] shrink-0 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#FF6B00]/40 hover:shadow-glow-orange transition-all cursor-pointer"
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
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#FF6B00] transition-colors">{item.title}</h3>
                      <p className="text-xs text-[#475569] dark:text-slate-400 mt-2 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Starting Fee</span>
                        <span className="text-lg font-black text-[#0F172A] dark:text-white">{formatCurrency(item.estimatedPrice)}</span>
                      </div>
                      <Link
                        to="/services"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-xl bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white font-black text-xs transition-all"
                      >
                        Book Visit
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatedSection>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 shrink-0">
              <img src={selectedService.imageUrl} alt={selectedService.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-900 shadow hover:scale-105 transition-transform"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-lg bg-slate-900/90 text-white font-bold text-[10px] uppercase shadow">
                  {selectedService.category}
                </span>
                <h3 className="text-xl font-black text-white mt-2 leading-tight">{selectedService.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed">{selectedService.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>Duration</span>
                  </span>
                  <span className="text-sm font-black text-[#0F172A] dark:text-white">{selectedService.estimatedDuration}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Starting Fee</span>
                  <span className="text-lg font-black text-[#FF6B00]">{formatCurrency(selectedService.estimatedPrice)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Receipt, text: 'Digital GST invoice after the job' },
                  { icon: CheckCircle2, text: 'Booking status tracked online in your account' },
                  { icon: ShieldCheck, text: 'Genuine brand spares available at the shop' },
                  { icon: Wrench, text: 'Done by our own wiremen — Prabhat, Chandan, Devnath, Appu & team' }
                ].map(({ icon: Icon, text }, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#475569] dark:text-slate-300">
                    <span className="p-1.5 rounded-lg bg-[#00C853]/10 text-[#00C853] shrink-0"><Icon className="w-3.5 h-3.5" /></span>
                    <span className="font-semibold">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 grid grid-cols-2 gap-3">
                <a
                  href="tel:7903789402"
                  className="py-3 px-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#0066FF] text-[#0F172A] dark:text-white font-black text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#0066FF]" />
                  <span>Call Now</span>
                </a>
                <Link
                  to="/services"
                  onClick={() => setSelectedService(null)}
                  className="py-3 px-4 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-glow-orange"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Book Visit</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <section className="relative py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 section-pattern overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B00]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0066FF]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Why Local Families Choose Us</span>
            <h2 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">A Real Shop with Real Wiremen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Store, color: 'text-[#FF6B00] bg-[#FF6B00]/10', title: 'Local Shop & Workshop', desc: 'Walk-in store on Chhota Govindpur Main Road, Jamshedpur — buy today, no delivery wait.' },
              { icon: Wrench, color: 'text-[#0066FF] bg-[#0066FF]/10', title: 'Our Own Wiremen', desc: 'Prabhat, Chandan, Devnath, Appu and team do the doorstep work themselves.' },
              { icon: Package, color: 'text-[#00C853] bg-[#00C853]/10', title: 'Genuine Brand Products', desc: 'Havells, Crompton, Polycab, Philips & Anchor — with a GST invoice on every sale.' },
              { icon: Receipt, color: 'text-purple-600 bg-purple-600/10', title: 'Clear Starting Fees', desc: 'Every service lists its starting fee and duration — see them before booking.' }
            ].map(({ icon: Icon, color, title, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="card-premium p-6 space-y-3 text-center group"
              >
                <div className={`p-3 w-fit rounded-2xl mx-auto ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{title}</h3>
                <p className="text-xs text-[#475569]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Service Process */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Simple 4-Step Booking</span>
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">How Our Doorstep Service Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Book Online or Call', desc: 'Pick a service and preferred date, or call 7903789402.' },
            { step: '2', title: 'Wireman Assigned', desc: 'One of our wiremen is assigned to your visit slot.' },
            { step: '3', title: 'Job Completed at Home', desc: 'Repair or installation done at your doorstep.' },
            { step: '4', title: 'Invoice Issued', desc: 'Digital GST invoice with your booking record.' }
          ].map(({ step, title, desc }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="card-premium p-6 space-y-3 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-amber-500 text-white font-black text-base flex items-center justify-center mx-auto shadow-md shadow-[#FF6B00]/30">
                {step}
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">{title}</h3>
              <p className="text-xs text-[#475569]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">In-Store Electrical Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white mt-1 font-display">Featured Household Electricals</h2>
          </div>
          <Link to="/shop" className="group text-sm font-extrabold text-[#FF6B00] hover:underline flex items-center space-x-1 mt-2 md:mt-0">
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingProducts ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="card-premium flex flex-col justify-between group"
              >
                <div className="h-48 overflow-hidden relative bg-[#F8FAFC] dark:bg-slate-950">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FF6B00] text-white font-black text-[10px] uppercase shadow-md">
                      {product.brand}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#0066FF] uppercase">{product.category}</span>
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white mt-1 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-[#475569] dark:text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {product.mrp > product.price && (
                        <span className="text-[10px] text-slate-400 line-through block">MRP: {formatCurrency(product.mrp)}</span>
                      )}
                      <span className="text-xl font-black text-[#0F172A] dark:text-white">{formatCurrency(product.price)}</span>
                    </div>
                    <Link
                      to="/shop"
                      className="px-4 py-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 hover:bg-[#FF6B00] hover:text-white text-[#0F172A] dark:text-slate-200 text-xs font-bold transition-all"
                    >
                      View Specs
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedSection>

      {/* Google Reviews CTA */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF6B00]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#0066FF]/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative lg:col-span-5 space-y-4">
            <span className="text-xs font-black text-[#FF8A3D] uppercase tracking-widest">We Value Your Feedback</span>
            <h2 className="text-3xl font-black text-white font-display">Bought from us or used our service?</h2>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              Share your experience on our Google Maps listing, or read what local families say
              about our shop and wiremen.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="https://www.google.com/maps/place/Uday+Electrical+Shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-amber-500 hover:from-[#E55A00] hover:to-[#FF6B00] text-white font-black text-xs shadow-lg shadow-orange-500/30 hover:scale-105 hover:shadow-glow-orange-lg transition-all text-center"
              >
                <Star className="w-4 h-4 fill-current mr-2" />
                Review Us on Google
              </a>
              <Link
                to="/reviews"
                className="relative inline-flex px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs transition-all"
              >
                Leave Feedback →
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Phone', value: '7903789402', sub: 'Also on WhatsApp' },
              { title: 'Store Hours', value: 'Mon–Sat', sub: '8:30 AM – 9:00 PM' },
              { title: 'Our Team', value: '7 Wiremen', sub: 'Prabhat, Chandan, Devnath, Appu & more' }
            ].map((card, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1.5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8A3D]">{card.title}</p>
                <p className="text-lg font-black text-white">{card.value}</p>
                <p className="text-[11px] text-slate-400">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Callback Request Form */}
      <AnimatedSection direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white to-[#FFF4EB] dark:from-slate-900 dark:to-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card space-y-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-amber-400 to-[#0066FF]"></div>
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Instant Phone Assistance</span>
            <h3 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">Request an Electrician Callback</h3>
            <p className="text-xs text-[#475569] dark:text-slate-400">Our shop team will call you back during opening hours. For urgent help, call us directly.</p>
          </div>

          {cbSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#00C853]/10 border border-[#00C853]/30 text-[#00C853] text-xs font-bold text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-[#00C853] mx-auto" />
              <p className="text-sm">Callback requested! Our team will call {cbPhone} during shop hours (Mon–Sat, 8:30 AM – 9:00 PM).</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleCallbackSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={cbName}
                  onChange={(e) => setCbName(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={cbPhone}
                  onChange={(e) => setCbPhone(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={cbLoading}
                  className="btn-cta py-3 px-6 text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{cbLoading ? 'Submitting...' : 'Call Me Back'}</span>
                </button>
              </form>
              {cbError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{cbError}</span>
                </div>
              )}
              {!isAuthenticated && (
                <p className="text-[11px] text-slate-400 text-center">
                  <Link to="/login" className="font-bold text-orange-500 hover:underline">Sign in</Link> to request a callback — or call us at{' '}
                  <a href="tel:7903789402" className="font-bold text-orange-500">7903789402</a>.
                </p>
              )}
            </>
          )}
        </div>
      </AnimatedSection>

      {/* Store Location */}
      <AnimatedSection direction="up" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Visit Our Retail Store</span>
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">Chhota Govindpur Store Location</h2>
        </div>

        <div className="card-premium p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-5 text-xs">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-[#FF6B00] shrink-0" />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] dark:text-white">Uday Electrical Works (Store & Workshop)</h4>
                <p className="text-[#475569]">Chhota Govindpur Main Road, Jamshedpur, Jharkhand - 831015</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-400">
              <p><strong className="text-[#0F172A] dark:text-white">Store Hours:</strong> Monday - Saturday (8:30 AM - 9:00 PM)</p>
              <p><strong className="text-[#0F172A] dark:text-white">Service Visits:</strong> Booked across Jamshedpur — see our service areas</p>
              <p><strong className="text-[#0F172A] dark:text-white">Store Phone:</strong> 7903789402 / 9934187847</p>
            </div>

            <a
              href="https://www.google.com/maps/place/Uday+Electrical+Shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 hover:shadow-glow-blue"
            >
              <span>Open Directions in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-7 h-72 rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-slate-700 shadow-inner bg-[#F8FAFC]">
            <iframe
              src="https://maps.google.com/maps?q=Uday%20Electrical%20Shop%2C%20Chhota%20Govindpur%2C%20Jamshedpur%2C%20Jharkhand&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Uday Electrical Shop location on Google Maps"
            ></iframe>
          </div>
        </div>
      </AnimatedSection>

    </div>
  );
};
