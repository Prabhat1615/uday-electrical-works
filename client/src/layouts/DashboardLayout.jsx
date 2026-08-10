import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Receipt, 
  Package, 
  Wrench, 
  Users, 
  User, 
  Zap, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Boxes,
  UserCheck,
  Truck,
  ShoppingBag,
  BarChart3,
  Calendar,
  LifeBuoy,
  Settings,
  Shield,
  Database,
  Building2,
  FileCheck,
  Sparkles,
  Activity,
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || 'Customer';

  const allNavItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Staff', 'Technician', 'Customer']
    },
    {
      name: 'Executive Insights',
      path: '/dashboard/insights',
      icon: TrendingUp,
      roles: ['Admin']
    },
    {
      name: 'Customer Hub',
      path: '/dashboard/portal',
      icon: UserCheck,
      roles: ['Customer']
    },
    {
      name: 'Service Schedule',
      path: '/dashboard/schedule',
      icon: Calendar,
      roles: ['Admin', 'Staff', 'Technician']
    },
    {
      name: 'Field Job Reports',
      path: '/dashboard/field-service',
      icon: FileCheck,
      roles: ['Admin', 'Staff', 'Technician']
    },
    {
      name: 'AMC Contracts',
      path: '/dashboard/amc',
      icon: CalendarCheck,
      roles: ['Admin', 'Staff', 'Customer']
    },
    {
      name: 'Service Bookings',
      path: '/dashboard/bookings',
      icon: CalendarCheck,
      roles: ['Admin', 'Staff', 'Technician', 'Customer']
    },
    {
      name: 'Sales Orders',
      path: '/dashboard/sales',
      icon: ShoppingBag,
      roles: ['Admin', 'Staff', 'Customer']
    },
    {
      name: 'GST Invoices',
      path: '/dashboard/invoices',
      icon: Receipt,
      roles: ['Admin', 'Staff', 'Customer']
    },
    {
      name: 'Support Tickets',
      path: '/dashboard/tickets',
      icon: LifeBuoy,
      roles: ['Admin', 'Staff', 'Customer']
    },
    {
      name: 'Inventory Control',
      path: '/dashboard/inventory',
      icon: Boxes,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'AI Stock Forecast',
      path: '/dashboard/forecast',
      icon: Sparkles,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Warehouse Locations',
      path: '/dashboard/warehouses',
      icon: Building2,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Multi-Branch Network',
      path: '/dashboard/branches',
      icon: GitBranch,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Customer Leads',
      path: '/dashboard/leads',
      icon: UserCheck,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Purchase Orders',
      path: '/dashboard/purchase',
      icon: Truck,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Products Catalog',
      path: '/dashboard/products',
      icon: Package,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Services Catalog',
      path: '/dashboard/services',
      icon: Wrench,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Reports & Exports',
      path: '/dashboard/reports',
      icon: BarChart3,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'Activity Audit Trail',
      path: '/dashboard/activity',
      icon: Shield,
      roles: ['Admin', 'Staff']
    },
    {
      name: 'System Infrastructure',
      path: '/dashboard/health',
      icon: Activity,
      roles: ['Admin']
    },
    {
      name: 'Company Settings',
      path: '/dashboard/settings',
      icon: Settings,
      roles: ['Admin']
    },
    {
      name: 'Backup & Restore',
      path: '/dashboard/backup',
      icon: Database,
      roles: ['Admin']
    },
    {
      name: 'User Management',
      path: '/dashboard/users',
      icon: Users,
      roles: ['Admin']
    },
    {
      name: 'My Profile',
      path: '/dashboard/profile',
      icon: User,
      roles: ['Admin', 'Staff', 'Technician', 'Customer']
    }
  ];

  const allowedNav = allNavItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-orange-500 text-slate-950">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-white">UEW ERP</span>
        </Link>
        <div className="flex items-center space-x-2">
          <NotificationBell />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Dashboard Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 text-slate-950 font-black shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-tight">
                UDAY <span className="text-orange-400">ERP</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                Enterprise Intelligence v5.0
              </span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Notification Bell Header */}
        <div className="p-4 mx-3 my-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <NotificationBell />
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              Role: {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {allowedNav.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-400'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="block text-center text-xs font-semibold text-slate-400 hover:text-orange-400 py-1 transition-colors"
          >
            ← Back to Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-slate-950 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-rose-400 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
