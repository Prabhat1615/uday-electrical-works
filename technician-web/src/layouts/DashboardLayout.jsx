import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calendar, 
  FileCheck, 
  User, 
  Zap, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';
import { Logo } from '../components/Logo';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Minimal action-focused technician navigation
  const technicianNav = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'My Jobs',
      path: '/dashboard/bookings',
      icon: CalendarCheck
    },
    {
      name: 'Service Schedule',
      path: '/dashboard/schedule',
      icon: Calendar
    },
    {
      name: 'Field Reports',
      path: '/dashboard/field-service',
      icon: FileCheck
    },
    {
      name: 'My Profile',
      path: '/dashboard/profile',
      icon: User
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 w-full max-w-full overflow-x-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <Link to="/dashboard" className="flex items-center">
          <Logo portal="technician" size="sm" />
        </Link>
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Technician Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[280px] sm:w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <Logo portal="technician" size="md" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center md:hidden text-slate-400 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technician Profile Card */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-600 text-sm shrink-0 font-display">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate font-display">{user?.name || 'Technician'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.phone || user?.email || 'Field Wireman'}</p>
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-500/20 font-display">
              Verified Technician
            </span>
          </div>
        </div>

        {/* Action Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
            FIELD NAVIGATION
          </p>
          {technicianNav.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-[#FFF7ED] text-[#EA580C] font-extrabold shadow-xs border border-[#FED7AA]'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#EA580C]' : 'text-[#94A3B8]'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-[#EA580C]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 py-1 transition-colors font-display"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront Catalog</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-600 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
