import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Phone, Mail, MapPin, Sun, Moon, Info, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';
import { AiServiceChatbot } from '../components/AiServiceChatbot';
import { MobileConversionBar } from '../components/MobileConversionBar';
import { Logo } from '../components/Logo';

export const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

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
      
      {/* Top Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-2 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Phone className="w-3 h-3 text-orange-400" />
            <span className="font-bold text-white">Call Shop: 7903789402 / 9934187847</span>
          </span>
          <span className="hidden md:flex items-center space-x-1 text-slate-400">
            <MapPin className="w-3 h-3 text-orange-400" />
            <span>Chhota Govindpur, Jamshedpur, Jharkhand</span>
          </span>
        </div>
        <div className="flex items-center space-x-3 font-semibold">
          <span className="text-orange-400 font-bold">Licensed Wiremen: Prabhat, Chandan, Devnath, Appu</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">✓ Doorstep Service in Jamshedpur</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link to="/">
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
                  className={`transition-colors py-1 ${
                    active
                      ? 'text-orange-500 border-b-2 border-orange-500 font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Controls & Auth */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-md transition-transform hover:scale-105"
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
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-md transition-transform hover:scale-105"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Outlet Body */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Sticky Conversion Bar */}
      <MobileConversionBar />

      {/* AI Assistant Floating Chatbot */}
      <AiServiceChatbot />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo size="sm" />
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trusted local electrical retail store & home appliance repair shop in Chhota Govindpur, Jamshedpur. 100% genuine Havells, Crompton, Polycab, Philips & Anchor products.
            </p>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-3">Service Areas (Jamshedpur)</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Chhota Govindpur • Govindpur Colony</li>
              <li>Telco • Baridih • Sidhgora</li>
              <li>Agrico • Golmuri • Birsanagar</li>
              <li>Parsudih • Jugsalai • Sakchi • Mango • Adityapur</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li><Link to="/about" className="hover:text-orange-400">About Our Shop & Wiremen</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400">Store Map & Contact</Link></li>
              <li><Link to="/reviews" className="hover:text-orange-400">Customer Ratings & Reviews</Link></li>
              <li><Link to="/dashboard" className="hover:text-orange-400">Store Management Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white uppercase text-xs mb-3">Chhota Govindpur Shop</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Chhota Govindpur, Jamshedpur, Jharkhand, India - 831015
            </p>
            <p className="mt-2 text-orange-400 font-black text-xs">WhatsApp / Call: 7903789402 / 9934187847</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} Uday Electrical Works. All Rights Reserved. Chhota Govindpur, Jamshedpur, Jharkhand.
        </div>
      </footer>

    </div>
  );
};
