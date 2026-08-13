import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  Phone,
  Wrench,
  Package,
  Send,
  Building2,
  ExternalLink,
  Store,
  MapPin,
  Check,
  Zap,
  Sliders,
  Cpu,
  HelpCircle,
  Lightbulb,
  Fan,
  Eye,
  Star,
  ShoppingCart,
  Truck,
  User
} from 'lucide-react';
import { useProducts } from '../../hooks/useErpQueries';
import { formatCurrency } from '../../utils/formatters';
import { BrandMarquee } from '../../components/BrandMarquee';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { HeroSection } from '../../components/HeroSection';
import { AnimatedSection } from '../../components/AnimatedSection';
import { Seo } from '../../components/Seo';
import { ProductQuickViewModal } from '../../components/ProductQuickViewModal';
import { InteractiveBookingFlowModal } from '../../components/InteractiveBookingFlowModal';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';
import { createLeadApi } from '../../api/leadApi';

const everythingCategories = [
  { title: 'Switches & Sockets', icon: Sliders, link: '/shop?category=Modular%20Switches%20%26%20Sockets', desc: 'Modular switches, sockets, regulator plates & gang boxes', bgImage: '/images/Switch-socket.jpg' },
  { title: 'Wires & Cables', icon: Zap, link: '/shop?category=Wires%20%26%20Cables', desc: 'FR PVC insulated copper wires & multi-core industrial cables', bgImage: '/images/wires-cables.jpg' },
  { title: 'LED Lighting', icon: Lightbulb, link: '/shop?category=LED%20Bulbs%20%26%20Battens', desc: 'Energy saving LED bulbs, tube battens, panel lights & spotlights', bgImage: '/images/led-lighting.jpg' },
  { title: 'Fans', icon: Fan, link: '/shop?category=Ceiling%20Fans', desc: 'High-speed ceiling fans, exhaust fans, wall & pedestal fans', bgImage: '/images/fans.jpg' },
  { title: 'MCB & Distribution', icon: ShieldCheck, link: '/shop?category=MCBs%20%26%20DB%20Boxes', desc: 'Single & double pole MCBs, isolators, RCCB & DB enclosure boxes', bgImage: '/images/mcb-distribution.jpg' },
  { title: 'Electrical Accessories', icon: Cpu, link: '/shop?category=Home%20Appliances', desc: 'Plug tops, extension cords, insulation tapes, PVC pipes & fittings', bgImage: '/images/electrical-accessories.jpg' }
];

const professionalServices = [
  {
    id: 'wiring',
    title: 'House Wiring',
    icon: Zap,
    desc: 'Complete new residential & commercial building wiring, DB fitting, earthing and load distribution.'
  },
  {
    id: 'repair',
    title: 'Electrical Repair',
    icon: Wrench,
    desc: 'Prompt repair for short circuits, tripped MCBs, loose wiring sockets, burnt switches & power failures.'
  },
  {
    id: 'installation',
    title: 'Installation',
    icon: CheckCircle2,
    desc: 'Ceiling fan hanging, geyser mounting, LED fixture setup, inverter connection & stabilizer fitting.'
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: ShieldCheck,
    desc: 'Periodic electrical audit, main panel maintenance, DB box tightening & home electrical safety checks.'
  },
  {
    id: 'diagnosis',
    title: 'Fault Diagnosis',
    icon: HelpCircle,
    desc: 'Tracing hidden wiring faults, high electricity bill inspection & voltage fluctuation troubleshooting.'
  },
  {
    id: 'lighting',
    title: 'Lighting Setup',
    icon: Lightbulb,
    desc: 'False ceiling LED profile lights, decorative chandeliers, outdoor gate lights & shop floodlight fitting.'
  }
];

const wiremenTeam = [
  'Chandan (Fitting Specialist)',
  'Devnath (Appliance Repair)',
  'Appu (Wiring Technician)'
];

const customerReviews = [
  {
    name: 'Rajesh Kumar',
    location: 'Telco Colony, Jamshedpur',
    rating: 5,
    comment: 'Got complete house wiring materials from Havells and Polycab at Uday Electrical Shop. Genuine rates and official warranty. Their electrician Prabhat fitted the entire DB box perfectly.'
  },
  {
    name: 'Sunita Sharma',
    location: 'Chhota Govindpur, Jamshedpur',
    rating: 5,
    comment: 'Prompt doorstep repair! Called for MCB tripping issue in our home. Electrician arrived within 40 minutes and fixed the short circuit in the kitchen wiring.'
  },
  {
    name: 'Amitabh Singh',
    location: 'Baridih, Jamshedpur',
    rating: 5,
    comment: 'Bought Crompton ceiling fans and Philips LED battens. Very polite staff and honest billing. Best electrical store in Chhota Govindpur area.'
  }
];

export const HomePage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { data: productsRes, isLoading: loadingProducts } = useProducts({ limit: 4 });

  const products = productsRes?.data || [];

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
    <div className="space-y-16 pb-16 bg-[#F8FAFC] text-[#111827] font-sans overflow-hidden">
      <Seo
        title="Uday Electrical Works | Electrical Shop & Home Services in Jamshedpur"
        description="Electrical store & doorstep service centre in Chhota Govindpur, Jamshedpur. Genuine Havells, Crompton, Polycab, Philips products. House wiring, fan repair, geyser servicing. Call 7903789402."
      />

      {/* 1. Cinematic 3D Architectural Storefront Hero */}
      <HeroSection />

      {/* 2. Official Brand Logo Marquee (Dark Contrast Section) */}
      <BrandMarquee />

      {/* 3. Product Section: Everything Electrical, Under One Roof (Light Section) */}
      <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">-- In-Store &amp; Online Catalog --</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight font-display">Everything Electrical, Under One Roof</h2>
          <p className="text-xs sm:text-sm text-[#64748B]">Genuine items stocked at our Chhota Govindpur shop with manufacturer warranty &amp; GST invoice</p>
        </div>

        {/* 2 Cards per Row on Mobile View, 3 Cards per Row on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {everythingCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-[#E5E7EB] hover:border-[#FF5722] transition-all duration-300 h-36 sm:h-52 flex flex-col justify-end p-3 sm:p-5 block"
                style={
                  cat.bgImage
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(15, 23, 42, 0.95) 100%), url(${cat.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : { backgroundColor: '#252C34' }
                }
              >
                {/* Top Right Floating Micro Badge */}
                <div className="absolute top-2 right-2 p-1.5 sm:top-3 sm:right-3 sm:p-2 rounded-lg sm:rounded-xl bg-white/95 text-[#FF5722] shadow-sm border border-white/40 group-hover:bg-[#FF5722] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                {/* Card Bottom Content Overlay */}
                <div className="relative z-10 space-y-0.5 sm:space-y-1">
                  <h3 className="text-xs sm:text-lg font-bold text-white group-hover:text-[#FF7043] transition-colors font-display line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-200 line-clamp-1 font-medium leading-tight">
                    {cat.desc}
                  </p>
                  <div className="pt-1 sm:pt-2 flex items-center justify-between text-[10px] sm:text-xs font-extrabold text-[#FF5722]">
                    <span className="inline-flex items-center gap-0.5 font-display group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-white/80 font-normal uppercase tracking-wider hidden xs:inline">In Stock</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Real Product Showcase */}
        <div className="pt-6 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-5 sm:mb-6 gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-[#F97316] uppercase tracking-wider block font-display">-- Featured Inventory --</span>
              <h3 className="text-base sm:text-2xl font-black text-[#111827] font-display">Top Selling Products</h3>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] sm:text-sm font-extrabold shadow-xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden xs:inline" />
              <span>Browse Catalog</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </Link>
          </div>

          {loadingProducts ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.slice(0, 4).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#F97316]/50 hover:shadow-md transition-all relative"
                >
                  <div className="h-44 overflow-hidden relative bg-white border-b border-[#E5E7EB] p-2 flex items-center justify-center">
                    <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#F97316] text-white font-extrabold text-[10px] uppercase shadow-xs font-display">
                        {product.brand}
                      </span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute inset-x-4 bottom-3 py-2 rounded-xl bg-white/95 text-[#111827] font-extrabold text-xs shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-1.5 font-display"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#0284C7] uppercase tracking-wider block font-display">{product.category}</span>
                      <h3 className="text-sm font-bold text-[#111827] mt-0.5 group-hover:text-[#F97316] transition-colors line-clamp-1 font-display">{product.name}</h3>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <div>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-400 line-through block font-mono">MRP: {formatCurrency(product.mrp)}</span>
                        )}
                        <span className="text-base font-black text-[#111827] font-mono">{formatCurrency(product.price)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 rounded-xl bg-[#FFF7ED] hover:bg-[#F97316] hover:text-white text-[#EA580C] border border-[#FED7AA] text-xs font-extrabold transition-colors font-display"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* 4. Services Section: Professional Electrical Services (Warm Cream Canvas) */}
      <section className="py-12 bg-[#FAFAF8] border-y border-[#E5E7EB]">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 sm:pb-4 gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">-- Doorstep Solutions --</span>
              <h2 className="text-base sm:text-4xl font-black text-[#111827] mt-0.5 font-display">Professional Electrical Services</h2>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center space-x-1 sm:space-x-2 text-[11px] sm:text-sm font-extrabold px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs hover:scale-102 transition-all font-display whitespace-nowrap"
              >
                <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Book Service</span>
              </button>
              <Link
                to="/services"
                className="hidden sm:inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#F97316] text-[#111827] shadow-xs hover:scale-102 transition-all font-display whitespace-nowrap"
              >
                <span>View All Services</span>
                <ChevronRight className="w-4 h-4 text-[#F97316] shrink-0" />
              </Link>
            </div>
          </div>

          {/* 6 Service Cards - 2 Cards per Row on Mobile View */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {professionalServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between group hover:border-[#F97316] hover:shadow-md transition-all"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#F97316] group-hover:text-white">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h3 className="text-xs sm:text-base font-bold text-[#111827] group-hover:text-[#F97316] transition-colors font-display line-clamp-1">{svc.title}</h3>
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#64748B] leading-tight sm:leading-relaxed line-clamp-2">{svc.desc}</p>
                  </div>

                  <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[11px] font-semibold text-slate-400 hidden xs:inline">By Wiremen</span>
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="inline-flex items-center space-x-0.5 sm:space-x-1 text-[10px] sm:text-xs font-extrabold text-[#F97316] hover:text-[#EA580C] font-display"
                    >
                      <span>Request Visit</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* 5. Real Store Identity & About Section (Redesigned Editorial Showcase Layout) */}
      <section className="relative py-12 sm:py-16 bg-white overflow-hidden border-b border-[#E5E7EB]">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-10 relative">
          
          {/* Header */}
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-extrabold tracking-widest uppercase font-display">
              <Store className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Store Identity &amp; Mission</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight font-display">
              Your Trusted Local Electrical Store in Jamshedpur
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Serving Chhota Govindpur, Telco, Baridih &amp; all Jamshedpur since 2012
            </p>
          </div>

          {/* Unified Architectural Layout (No Boxy Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Visual Showcase Image Frame */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-50">
                <img
                  src="/ueworks.png"
                  alt="Uday Electrical Works Retail Storefront"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Image Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-2 drop-shadow-md">
                  <div className="flex items-center space-x-2 text-white">
                    <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold font-display leading-tight text-white">Chhota Govindpur Store</p>
                      <p className="text-[10px] sm:text-xs text-slate-200 font-medium font-sans truncate">Main Road, Jamshedpur - 831015</p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-emerald-400 font-display uppercase tracking-wider shrink-0">
                    Open Mon-Sat
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Editorial Content & Wiremen Bar */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              
              {/* Highlight Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[#F97316] uppercase font-display block">Retail &amp; Wholesale</span>
                  <p className="text-xs font-bold text-slate-900 font-display">100% Genuine GST</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[#0284C7] uppercase font-display block">Store Hours</span>
                  <p className="text-xs font-bold text-slate-900 font-display">Mon-Sat 8:30am-9pm</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-extrabold text-[#16A34A] uppercase font-display block">Doorstep Visit</span>
                  <p className="text-xs font-bold text-slate-900 font-display">All Jamshedpur</p>
                </div>
              </div>

              {/* Storytelling Content */}
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#475569] leading-relaxed">
                <p>
                  <strong className="text-slate-900 font-semibold">Uday Electrical Works</strong> is your trusted local destination for authentic electrical supplies and professional home repair services. Located prominently on Chhota Govindpur Main Road, we stock leading brands including Havells, Crompton, Polycab, Philips, and Anchor with manufacturer warranties and GST billing.
                </p>
                <p>
                  From full house wiring materials to ceiling fan fittings, MCB box upgrades, geyser mounting, and emergency short-circuit diagnosis, our in-house verified wiremen team delivers prompt, safe electrical solutions directly to your doorstep.
                </p>
              </div>

              {/* Wiremen Team Strip */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-display">
                  Verified In-House Wiremen Team:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {wiremenTeam.map((w) => (
                    <span key={w} className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 border border-slate-200/60">
                      <Check className="w-3 h-3 text-[#16A34A]" />
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {/* Action CTAs in 1 Line on Mobile */}
              <div className="pt-2 grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                <a
                  href="#store-location-map"
                  className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] sm:text-sm font-extrabold shadow-xs transition-all font-display whitespace-nowrap w-full sm:w-auto"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Store Directions</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-80 hidden xs:inline" />
                </a>

                <a
                  href="tel:7903789402"
                  className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-2.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-[11px] sm:text-sm font-bold transition-all font-display whitespace-nowrap w-full sm:w-auto"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F97316] shrink-0" />
                  <span>Call 7903789402</span>
                </a>
              </div>

            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 6. Combined Our Promise & Instant Phone Assistance Section (2 Columns on Desktop) */}
      <section className="py-12 sm:py-16 bg-[#FAFAF8] text-[#111827] overflow-hidden border-y border-[#E5E7EB]">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Column: Our Promise (50% Desktop Width) */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between text-left">
              <div>
                <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">-- Our Promise --</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1 font-display">
                  Why Jamshedpur Trusts Uday Electrical
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                  Over a decade of uncompromised quality, genuine electrical products &amp; trusted doorstep services.
                </p>
              </div>

              {/* 4 Trust Cards in 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-[#16A34A] transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shrink-0">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] font-display line-clamp-1">100% Genuine</h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#64748B] leading-tight line-clamp-2">Direct manufacturer sourcing &amp; GST billing.</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-[#F97316] transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FFF7ED] text-[#F97316] border border-[#FED7AA] shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] font-display line-clamp-1">Verified Wiremen</h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#64748B] leading-tight line-clamp-2">Local expert wiremen for safe fittings.</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-[#0284C7] transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] shrink-0">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] font-display line-clamp-1">Fast Doorstep</h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#64748B] leading-tight line-clamp-2">Quick visits across all Jamshedpur areas.</p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-amber-500 transition-all">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#111827] font-display line-clamp-1">Local Shop</h4>
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#64748B] leading-tight line-clamp-2">Direct phone support &amp; Govindpur shop.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Instant Phone Assistance Callback Form (50% Desktop Width) */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs space-y-5 flex flex-col justify-between text-left">
              <div>
                <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">-- Instant Phone Assistance --</span>
                <h3 className="text-xl sm:text-2xl font-black text-[#111827] mt-1 font-display">Request an Electrician Callback</h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  Have an electrical query, wiring project, or need urgent repair? Enter your mobile number and our Chhota Govindpur shop team will call you back during store hours.
                </p>
              </div>

              {cbSubmitted ? (
                <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold text-center space-y-2">
                  <CheckCircle2 className="w-7 h-7 text-[#16A34A] mx-auto" />
                  <h4 className="text-base font-bold font-display">Callback Request Received!</h4>
                  <p className="text-xs text-slate-600">Our wiremen team will call {cbPhone} shortly during store hours (Mon-Sat, 8:30 AM - 9:00 PM).</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleCallbackSubmit} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={cbName}
                        onChange={(e) => setCbName(e.target.value)}
                        className="px-4 py-3 h-11 rounded-xl bg-slate-50 border border-[#E5E7EB] text-[#111827] placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] text-xs sm:text-sm font-medium w-full"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number"
                        value={cbPhone}
                        onChange={(e) => setCbPhone(e.target.value)}
                        className="px-4 py-3 h-11 rounded-xl bg-slate-50 border border-[#E5E7EB] text-[#111827] placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] text-xs sm:text-sm font-medium w-full"
                      />
                    </div>
                    <div className="flex justify-center sm:block">
                      <button
                        type="submit"
                        disabled={cbLoading}
                        className="w-auto sm:w-full px-6 py-2.5 sm:py-3 h-10 sm:h-11 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center space-x-2 font-display"
                      >
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>{cbLoading ? 'Submitting...' : 'Call Me Back'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Direct Phone Numbers Line */}
                  <div className="pt-2 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                    <div className="flex items-center space-x-2 font-bold text-[#F97316] font-display">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Store Direct: <a href="tel:7903789402" className="hover:underline">7903789402</a> / <a href="tel:9934187847" className="hover:underline">9934187847</a></span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">Store Hours: Mon-Sat (8:30 AM - 9:00 PM)</span>
                  </div>

                  {cbError && (
                    <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs font-semibold flex items-center space-x-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{cbError}</span>
                    </div>
                  )}
                  {!isAuthenticated && (
                    <p className="text-[11px] text-[#64748B]">
                      <Link to="/login" className="font-bold text-[#F97316] hover:underline">Sign in</Link> to track callback status online.
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </AnimatedSection>
      </section>

      {/* 9. Store Location & Embedded Google Maps */}
      <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-5" id="store-location-map">
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">-- Visit Our Retail Store --</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight font-display">Chhota Govindpur Store Location</h2>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <Building2 className="w-6 h-6 text-[#F97316] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-[#111827] font-display">Uday Electrical Works (Store & Workshop)</h4>
                <p className="text-[#64748B] mt-1">Chhota Govindpur Main Road, Jamshedpur, Jharkhand - 831015</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E5E7EB] text-[#64748B]">
              <p><strong className="text-[#111827]">Store Hours:</strong> Monday - Saturday (8:30 AM - 9:00 PM)</p>
              <p><strong className="text-[#111827]">Service Area:</strong> Doorstep electrician visits across Jamshedpur</p>
              <p><strong className="text-[#111827]">Store Phone:</strong> 7903789402 / 9934187847</p>
            </div>

            <a
              href="https://www.google.com/maps/place/Uday+Electrical+Shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-extrabold px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white shadow-xs transition-all font-display"
            >
              <span>Get Directions in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-7 h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-inner bg-slate-100">
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

      {/* Quick View Modal Component */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Interactive Booking Stepper Modal */}
      <InteractiveBookingFlowModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

    </div>
  );
};
