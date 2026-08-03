import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, LayoutDashboard, ShoppingBag, Wrench, LogIn, UserPlus, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-tight">
                UDAY <span className="text-amber-400">ELECTRICAL</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                Enterprise ERP
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-2 pl-3 border-l border-slate-800">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-200 hover:text-white hover:border-slate-700 text-sm font-semibold transition-all"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-md shadow-amber-500/10 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                Go to Dashboard ({user?.role})
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block w-full text-center py-2.5 rounded-xl bg-slate-800 text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex space-x-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-slate-800 text-slate-200 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
