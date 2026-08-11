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
  { title: 'Switches & Sockets', icon: Sliders, link: '/shop?category=Modular%20Switches%20%26%20Sockets', desc: 'Modular switches, sockets, regulator plates & gang boxes' },
  { title: 'Wires & Cables', icon: Zap, link: '/shop?category=Wires%20%26%20Cables', desc: 'FR PVC insulated copper wires & multi-core industrial cables' },
  { title: 'LED Lighting', icon: Lightbulb, link: '/shop?category=LED%20Bulbs%20%26%20Battens', desc: 'Energy saving LED bulbs, tube battens, panel lights & spotlights' },
  { title: 'Fans', icon: Fan, link: '/shop?category=Ceiling%20Fans', desc: 'High-speed ceiling fans, exhaust fans, wall & pedestal fans' },
  { title: 'MCB & Distribution', icon: ShieldCheck, link: '/shop?category=MCBs%20%26%20DB%20Boxes', desc: 'Single & double pole MCBs, isolators, RCCB & DB enclosure boxes' },
  { title: 'Electrical Accessories', icon: Cpu, link: '/shop?category=Home%20Appliances', desc: 'Plug tops, extension cords, insulation tapes, PVC pipes & fittings' }
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
  'Prabhat (Master Wireman)',
  'Chandan (Fitting Specialist)',
  'Devnath (Appliance Repair)',
  'Appu (Wiring Technician)',
  'Dhruv (Lighting Expert)',
  'Amit (DB & MCB Specialist)'
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
          <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">In-Store &amp; Online Catalog</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111318] tracking-tight font-display">Everything Electrical, Under One Roof</h2>
          <p className="text-xs sm:text-sm text-[#AAB0B8]">Genuine items stocked at our Chhota Govindpur shop with manufacturer warranty &amp; GST invoice</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {everythingCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={cat.link}
                className="group p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D6A84F] hover:shadow-md transition-all flex items-start space-x-4 block"
              >
                <div className="p-3 rounded-xl bg-[#FAF6EC] text-[#C99532] border border-[#E7C878] shrink-0 group-hover:bg-[#D6A84F] group-hover:text-[#111318] transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111318] group-hover:text-[#C99532] transition-colors font-display">{cat.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Real Product Showcase */}
        <div className="pt-6 border-t border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-[#D6A84F] uppercase tracking-wider block font-display">Featured Inventory</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#111318] font-display">Top Selling Products</h3>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#D6A84F] hover:bg-[#C99532] text-[#111318] text-xs sm:text-sm font-extrabold shadow-xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Browse Full Catalog</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>

          {loadingProducts ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 4).map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#D6A84F]/60 hover:shadow-md transition-all relative"
                >
                  <div className="h-44 overflow-hidden relative bg-slate-950/60 p-2 flex items-center justify-center">
                    <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#D6A84F] text-[#111318] font-extrabold text-[10px] uppercase shadow-xs font-display">
                        {product.brand}
                      </span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute inset-x-4 bottom-3 py-2 rounded-xl bg-white/95 text-[#111318] font-extrabold text-xs shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-1.5 font-display"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D6A84F]" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#5D8FD9] uppercase tracking-wider block font-display">{product.category}</span>
                      <h3 className="text-sm font-bold text-[#111318] mt-0.5 group-hover:text-[#C99532] transition-colors line-clamp-1 font-display">{product.name}</h3>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                      <div>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-400 line-through block font-mono">MRP: {formatCurrency(product.mrp)}</span>
                        )}
                        <span className="text-base font-black text-[#111318] font-mono">{formatCurrency(product.price)}</span>
                      </div>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 rounded-xl bg-[#FAF6EC] hover:bg-[#D6A84F] hover:text-[#111318] text-[#C99532] border border-[#E7C878] text-xs font-extrabold transition-colors font-display"
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
      <section className="py-12 bg-[#F4F2ED] border-y border-[#E5E7EB]">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E7EB] pb-4 gap-4">
            <div>
              <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">Doorstep Solutions</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111318] mt-0.5 font-display">Professional Electrical Services</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#D6A84F] hover:bg-[#C99532] text-[#111318] shadow-xs hover:scale-102 transition-all font-display whitespace-nowrap"
              >
                <Wrench className="w-4 h-4 shrink-0" />
                <span>Book Service</span>
              </button>
              <Link
                to="/services"
                className="inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D6A84F] text-[#111318] shadow-xs hover:scale-102 transition-all font-display whitespace-nowrap"
              >
                <span>View All Services</span>
                <ChevronRight className="w-4 h-4 text-[#D6A84F] shrink-0" />
              </Link>
            </div>
          </div>

          {/* 6 Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between group hover:border-[#D6A84F] hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#C99532] border border-[#E7C878] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#D6A84F] group-hover:text-[#111318]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#111318] group-hover:text-[#C99532] transition-colors font-display">{svc.title}</h3>
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed pt-0.5">{svc.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">By Our Wiremen</span>
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="inline-flex items-center space-x-1 text-xs font-extrabold text-[#C99532] hover:text-[#D6A84F] font-display"
                    >
                      <span>Request Visit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* 5. Real Store Identity & About Section (Light Section) */}
      <section className="relative py-12 bg-white overflow-hidden">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Store Overview */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">Store Identity &amp; Mission</span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111318] tracking-tight font-display">
                Your Trusted Local Electrical Store in Jamshedpur
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Located on Chhota Govindpur Main Road, <strong>Uday Electrical Works</strong> operates both a retail electrical store and a dedicated doorstep electrician service. We supply 100% genuine brand products from Havells, Crompton, Polycab, Philips, Anchor, and Bajaj with official GST billing.
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Whether you need a single LED bulb, complete house wiring materials, fan repairs, or emergency fault diagnosis, our in-house wiremen team visits your home across Jamshedpur to deliver reliable electrical work.
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                {wiremenTeam.map((w) => (
                  <span key={w} className="px-3 py-1 rounded-xl bg-slate-50 border border-[#E5E7EB] text-xs font-semibold text-[#111318] flex items-center gap-1.5 shadow-xs">
                    <Check className="w-3.5 h-3.5 text-[#3FAE72]" />
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Storefront Snapshot Box */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-[#FAF6EC] border border-[#E7C878] shadow-xs space-y-4">
                <div className="flex items-center space-x-3">
                  <Store className="w-6 h-6 text-[#C99532] shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-[#111318] font-display">Uday Electrical Works Retail Store</h3>
                    <p className="text-xs text-[#64748B]">Chhota Govindpur Main Road, Jamshedpur, Jharkhand - 831015</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E7C878]/60 text-xs text-[#64748B]">
                  <p><strong className="text-[#111318]">Store Hours:</strong> Monday - Saturday (8:30 AM - 9:00 PM)</p>
                  <p><strong className="text-[#111318]">Doorstep Coverage:</strong> Telco, Govindpur, Baridih, Sidhgora, Sakchi, Mango, Adityapur &amp; all Jamshedpur areas</p>
                  <p><strong className="text-[#111318]">Direct Phone:</strong> 7903789402 / 9934187847</p>
                </div>

                <a
                  href="#store-location-map"
                  className="inline-flex items-center space-x-2 text-xs font-extrabold px-5 py-2.5 rounded-xl bg-[#D6A84F] hover:bg-[#C99532] text-[#111318] shadow-xs transition-all font-display"
                >
                  <span>View Map &amp; Directions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 6. Trust Indicators Section (Dark Contrast Section) */}
      <section className="py-12 bg-[#111318] text-white overflow-hidden border-y border-slate-800">
        <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">Our Promise</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display">Why Jamshedpur Trusts Uday Electrical</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#171A1F] border border-slate-800 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#22262D] text-[#3FAE72] border border-slate-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">100% Genuine Products</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">Direct factory sourcing from Havells, Crompton, Polycab with GST invoices.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#171A1F] border border-slate-800 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#22262D] text-[#D6A84F] border border-slate-700 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Verified Wiremen</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">Experienced local technicians for house wiring, DB fitting &amp; appliances.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#171A1F] border border-slate-800 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#22262D] text-[#5D8FD9] border border-slate-700 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Fast Doorstep Visit</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">Quick electrician visit across Govindpur, Telco, Baridih &amp; Jamshedpur.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#171A1F] border border-slate-800 text-left space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#22262D] text-[#E7C878] border border-slate-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">Local Shop Support</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">Call 7903789402 directly or visit our Chhota Govindpur main road store.</p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 7. Customer Reviews Section (Light Section) */}
      <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">Customer Feedback</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111318] font-display">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {customerReviews.map((rev, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-1 text-[#D6A84F]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed italic">"{rev.comment}"</p>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB]">
                <h4 className="text-xs font-bold text-[#111318] font-display">{rev.name}</h4>
                <span className="text-[10px] text-[#64748B] block font-sans">{rev.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* 8. Phone Assistance & Callback Request */}
      <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Left Column: Heading & Information */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-widest font-display">Instant Phone Assistance</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#111318] font-display">Request an Electrician Callback</h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Have an electrical query, wiring project, or need urgent repair? Enter your mobile number and our Chhota Govindpur shop team will call you back during store hours.
            </p>
          </div>

          {/* Right Column: Spacious Form */}
          <div className="lg:col-span-7">
            {cbSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#3FAE72] text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#3FAE72] mx-auto" />
                <h4 className="text-base font-bold font-display">Callback Request Received!</h4>
                <p className="text-xs text-slate-600">Our wiremen team will call {cbPhone} shortly during store hours (Mon-Sat, 8:30 AM - 9:00 PM).</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <form onSubmit={handleCallbackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={cbName}
                    onChange={(e) => setCbName(e.target.value)}
                    className="sm:col-span-4 px-4 py-3 h-12 rounded-xl bg-slate-50 border border-[#E5E7EB] text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#D6A84F] text-xs sm:text-sm font-medium"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={cbPhone}
                    onChange={(e) => setCbPhone(e.target.value)}
                    className="sm:col-span-4 px-4 py-3 h-12 rounded-xl bg-slate-50 border border-[#E5E7EB] text-[#111318] placeholder:text-slate-400 focus:outline-none focus:border-[#D6A84F] text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={cbLoading}
                    className="sm:col-span-4 px-6 py-3 h-12 rounded-xl bg-[#D6A84F] hover:bg-[#C99532] text-[#111318] font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center space-x-2 font-display whitespace-nowrap"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>{cbLoading ? 'Submitting...' : 'Call Me Back'}</span>
                  </button>
                </form>

                {/* Direct Phone Numbers Line — Below Button */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                  <div className="flex items-center space-x-2 font-bold text-[#C99532] font-display">
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

      {/* 9. Store Location & Embedded Google Maps */}
      <AnimatedSection direction="up" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 space-y-5" id="store-location-map">
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-extrabold text-[#F97316] uppercase tracking-widest font-display">Visit Our Retail Store</span>
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
