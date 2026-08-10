import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Phone, Mail, MapPin, Sun, Moon, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';
import { AiServiceChatbot } from '../components/AiServiceChatbot';
import { MobileConversionBar } from '../components/MobileConversionBar';
import { Logo } from '../components/Logo';
import { CustomCursor } from '../components/CustomCursor';

export const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Reviews', path: '/reviews' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Premium Desktop Cursor Glow */}
      <CustomCursor />
      
      {/* Top Contact Bar */}
      <div className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 text-[11px] py-2 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/15 via-transparent to-blue-600/15 pointer-events-none"></div>
        <div className="relative flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            <Phone className="w-3 h-3 text-orange-400" />
            <span className="font-bold text-white">Call Shop: 7903789402 / 9934187847</span>
          </span>
          <span className="hidden md:flex items-center space-x-1 text-slate-400">
            <MapPin className="w-3 h-3 text-orange-400" />
            <span>Chhota Govindpur, Jamshedpur, Jharkhand</span>
          </span>
        </div>
        <div className="relative flex items-center space-x-3 font-semibold">
          <span className="text-orange-400 font-bold">Licensed Wiremen: Prabhat, Chandan, Devnath, Appu</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">✓ Doorstep Service in Jamshedpur</span>
        </div>
      </div>

      {/* Main Navbar — transparent on top, glass blur once scrolled */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-thick border-b border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-900/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/" className="group">
            <Logo size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-extrabold uppercase tracking-wider">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 transition-colors ${
                    active
                      ? 'text-orange-500 font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls & Auth */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-all hover:scale-105"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <Link
                  to="/dashboard"
                  className="btn-cta px-4 py-2 text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/services"
                  className="hidden lg:inline-flex items-center space-x-1 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 hover:shadow-glow-blue"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Book a Visit</span>
                </Link>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-cta px-4 py-2 text-xs"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Outlet Body with Page Transitions */}
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Sticky Conversion Bar */}
      <MobileConversionBar />

      {/* AI Assistant Floating Chatbot */}
      <AiServiceChatbot />

      {/* Premium Footer */}
      <footer className="relative bg-slate-950 text-slate-300 text-xs pt-16 overflow-hidden">
        <div className="gradient-hairline absolute top-0 left-0 right-0"></div>
        <div className="absolute inset-0 bg-mesh-dark pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trusted local electrical retail store & home appliance repair shop in Chhota Govindpur, Jamshedpur. 100% genuine Havells, Crompton, Polycab, Philips & Anchor products.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Rated 4.9/5 by 1000+ families
            </div>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-4 tracking-wider">Service Areas (Jamshedpur)</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="hover:text-orange-400 transition-colors cursor-default">Chhota Govindpur • Govindpur Colony</li>
              <li className="hover:text-orange-400 transition-colors cursor-default">Telco • Baridih • Sidhgora</li>
              <li className="hover:text-orange-400 transition-colors cursor-default">Agrico • Golmuri • Birsanagar</li>
              <li className="hover:text-orange-400 transition-colors cursor-default">Parsudih • Jugsalai • Sakchi • Mango • Adityapur</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-4 tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><Link to="/about" className="group inline-flex items-center space-x-1 hover:text-orange-400 transition-colors"><ChevronRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 -ml-4 transition-opacity" /><span className="-ml-3">About Our Shop & Wiremen</span></Link></li>
              <li><Link to="/contact" className="group inline-flex items-center space-x-1 hover:text-orange-400 transition-colors"><ChevronRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 -ml-4 transition-opacity" /><span className="-ml-3">Store Map & Contact</span></Link></li>
              <li><Link to="/reviews" className="group inline-flex items-center space-x-1 hover:text-orange-400 transition-colors"><ChevronRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 -ml-4 transition-opacity" /><span className="-ml-3">Customer Ratings & Reviews</span></Link></li>
              <li><Link to="/dashboard" className="group inline-flex items-center space-x-1 hover:text-orange-400 transition-colors"><ChevronRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 -ml-4 transition-opacity" /><span className="-ml-3">Store Management Portal</span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-4 tracking-wider">Chhota Govindpur Shop</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Chhota Govindpur, Jamshedpur, Jharkhand, India - 831015
            </p>
            <div className="mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <p className="flex items-center space-x-2 text-orange-400 font-black text-xs">
                <Phone className="w-3.5 h-3.5" />
                <a href="tel:7903789402">7903789402 / 9934187847</a>
              </p>
              <p className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <a href="mailto:udayelectrical@gmail.com" className="hover:text-orange-400 transition-colors">udayelectrical@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-12 pt-6 border-t border-slate-800/80 text-center text-[10px] text-slate-500 pb-8">
          <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent mb-3"></div>
          © {new Date().getFullYear()} Uday Electrical Works. All Rights Reserved. Chhota Govindpur, Jamshedpur, Jharkhand.
        </div>
      </footer>

    </div>
  );
};
