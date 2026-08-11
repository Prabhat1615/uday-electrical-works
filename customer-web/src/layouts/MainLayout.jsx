import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Zap,
  ChevronRight,
  Menu,
  X,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { NotificationBell } from '../components/NotificationBell';
import { AiServiceChatbot } from '../components/AiServiceChatbot';
import { MobileConversionBar } from '../components/MobileConversionBar';
import { Logo } from '../components/Logo';
import { CustomCursor } from '../components/CustomCursor';
import { InteractiveBookingFlowModal } from '../components/InteractiveBookingFlowModal';

export const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative">

      {/* Top Viewport Scroll Progress Hairline */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#F97316] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Premium Desktop Cursor Glow */}
      <CustomCursor />

      {/* Top Contact Bar */}
      <div className="relative bg-[#111827] text-slate-300 border-b border-slate-800 text-[11px] py-2 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 z-50">
        <div className="relative flex items-center space-x-4">
          <a href="tel:7903789402" className="flex items-center space-x-1.5 hover:text-[#F97316] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <Phone className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="font-bold text-white">7903789402 / 9934187847</span>
          </a>
          <span className="hidden md:flex items-center space-x-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Open Mon-Sat, 8:30 AM - 9:00 PM</span>
          </span>
          <span className="hidden lg:flex items-center space-x-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Chhota Govindpur Main Road, Jamshedpur</span>
          </span>
        </div>
        <div className="relative flex items-center space-x-3 font-semibold text-[11px]">
          <span className="text-[#F97316] font-bold">Uday Electrical Works</span>
          <span className="text-slate-700">|</span>
          <span className="text-[#16A34A] font-bold">Doorstep Service across Jamshedpur</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs text-[#111827]'
            : 'bg-white border-b border-[#E5E7EB] text-[#111827]'
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 h-16 flex items-center justify-between">

          <Link to="/" className="group flex items-center">
            <Logo portal="customer" size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-extrabold uppercase tracking-wider font-display">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1.5 transition-colors whitespace-nowrap ${
                    active
                      ? 'text-[#F97316] font-black'
                      : 'text-[#111827] hover:text-[#F97316]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-[#F97316]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls & Auth */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative px-3.5 py-2.5 rounded-xl border bg-slate-50 border-[#E5E7EB] text-[#111827] hover:text-[#F97316] hover:border-[#F97316]/40 transition-all flex items-center justify-center shrink-0"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#F97316] text-white text-[9px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Right Action: Book a Service */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs sm:text-sm shadow-xs hover:scale-102 transition-all font-display shrink-0 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>Book a Service</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <NotificationBell />
                <Link
                  to="/dashboard"
                  className="px-4 py-2.5 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-slate-800 transition-colors font-display hidden sm:inline-flex whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2.5 rounded-xl text-xs font-bold text-[#111827] hover:text-[#F97316] transition-colors font-display whitespace-nowrap"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl border bg-slate-100 border-[#E5E7EB] text-[#111827]"
              title="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-[#E5E7EB] overflow-hidden"
            >
              <nav className="px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setBookingModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#F97316] text-white text-xs font-extrabold shadow-xs font-display"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Book Doorstep Service</span>
                </button>
                {navLinks.map((link) => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold ${
                        active
                          ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]'
                          : 'text-[#111827] hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  );
                })}
                {!isAuthenticated && (
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link to="/login" className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 text-[#111827] text-xs font-bold">
                      Sign In
                    </Link>
                    <Link to="/register" className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#F97316] text-white text-xs font-extrabold">
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Outlet Body */}
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Service Assistant */}
      <AiServiceChatbot />

      {/* Mobile Conversion Bar */}
      <MobileConversionBar />

      {/* Footer */}
      <footer className="relative bg-[#111827] text-white border-t border-slate-800 pt-12 pb-6">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-3">
            <Logo portal="customer" size="lg" light={true} />
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Authorized electrical retail shop &amp; doorstep service center in Chhota Govindpur, Jamshedpur. Stocking Havells, Crompton, Polycab, Philips &amp; Anchor.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-extrabold text-white uppercase text-xs mb-3 tracking-wider font-display">Products</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><Link to="/shop?category=Modular%20Switches%20%26%20Sockets" className="hover:text-[#F97316] transition-colors">Switches &amp; Sockets</Link></li>
              <li><Link to="/shop?category=Wires%20%26%20Cables" className="hover:text-[#F97316] transition-colors">Wires &amp; Cables</Link></li>
              <li><Link to="/shop?category=LED%20Bulbs%20%26%20Battens" className="hover:text-[#F97316] transition-colors">LED Lighting</Link></li>
              <li><Link to="/shop?category=Ceiling%20Fans" className="hover:text-[#F97316] transition-colors">Ceiling &amp; Exhaust Fans</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-extrabold text-white uppercase text-xs mb-3 tracking-wider font-display">Services</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><button onClick={() => setBookingModalOpen(true)} className="hover:text-[#F97316] transition-colors text-left">House Wiring &amp; Load Fitting</button></li>
              <li><button onClick={() => setBookingModalOpen(true)} className="hover:text-[#F97316] transition-colors text-left">Short Circuit &amp; MCB Repair</button></li>
              <li><button onClick={() => setBookingModalOpen(true)} className="hover:text-[#F97316] transition-colors text-left">Fan &amp; Geyser Installation</button></li>
              <li><button onClick={() => setBookingModalOpen(true)} className="hover:text-[#F97316] transition-colors text-left">LED Profile Light Setup</button></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs text-slate-400">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider font-display">Chhota Govindpur Shop</h4>
            <p className="leading-relaxed">
              Chhota Govindpur Main Road, Jamshedpur, Jharkhand - 831015
            </p>
            <p className="text-[#F97316] font-bold">Mon-Sat: 8:30 AM - 9:00 PM</p>
            <p className="font-bold text-white">Direct Phone: 7903789402 / 9934187847</p>
          </div>
        </div>

        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 mt-8 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Uday Electrical Works. All Rights Reserved. Chhota Govindpur, Jamshedpur, Jharkhand.
        </div>
      </footer>

      {/* 5-Step Interactive Service Booking Stepper Modal */}
      <InteractiveBookingFlowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};
