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
    <div className="min-h-screen bg-[#F4F2ED] flex flex-col md:flex-row font-sans text-[#1B1D21]">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#171A1F] text-white border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center">
          <Logo portal="technician" size="sm" light={true} />
        </Link>
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#22262D] text-slate-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Technician Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#171A1F] text-white border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <Logo portal="technician" size="md" light={true} />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technician Profile Card */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-[#22262D] border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#D6A84F]/15 border border-[#D6A84F]/40 flex items-center justify-center font-bold text-[#D6A84F] text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate font-display">{user?.name || 'Technician'}</p>
                <p className="text-[11px] text-[#AAB0B8] truncate">{user?.phone || user?.email || 'Field Wireman'}</p>
              </div>
            </div>
            <NotificationBell />
          </div>
          <div className="mt-3 pt-2 border-t border-slate-700 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#D6A84F]/15 text-[#E7C878] border border-[#D6A84F]/30">
              Verified Technician
            </span>
          </div>
        </div>

        {/* Action Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-[#22262D] text-[#D6A84F] font-extrabold shadow-xs border-l-4 border-l-[#D6A84F]'
                    : 'text-[#AAB0B8] hover:bg-[#22262D]/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#D6A84F]' : 'text-[#AAB0B8]'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-[#D6A84F]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-[#D6A84F] py-1 transition-colors font-display"
          >
            <ArrowLeft className="w-4 h-4 text-[#D6A84F]" />
            <span>Storefront Catalog</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#22262D] hover:bg-rose-950/40 border border-slate-700 hover:border-rose-700 text-rose-400 text-xs font-bold transition-all"
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
