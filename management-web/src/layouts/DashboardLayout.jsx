import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  UsersRound,
  Headphones,
  Package,
  Boxes,
  ShoppingBag,
  Warehouse,
  CalendarCheck,
  CalendarDays,
  Wrench,
  FileCheck,
  Layers,
  Receipt,
  UserCheck,
  Users,
  BarChart3,
  History,
  Settings,
  UserCircle,
  SlidersHorizontal,
  Sparkles,
  GitBranch,
  Activity,
  Database,
  Zap,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { NotificationBell } from '../components/NotificationBell';
import { Logo } from '../components/Logo';
import { useTechnicianRequests } from '../hooks/useErpQueries';

// ---------------------------------------------------------------------------
// Navigation model - grouped categories. Routes are UNCHANGED; only labels,
// grouping and presentation change. Role arrays preserve the previous
// per-item restrictions (backend remains the authoritative guard).
// ---------------------------------------------------------------------------

const buildNavGroups = (pendingTechCount) => [
  {
    label: 'MAIN',
    items: [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Staff', 'Technician', 'Customer'] },
      { name: 'Insights', path: '/dashboard/insights', icon: TrendingUp, roles: ['Admin', 'Staff'] }
    ]
  },
  {
    label: 'SALES & CUSTOMERS',
    items: [
      { name: 'Orders', path: '/dashboard/sales', icon: ShoppingCart, roles: ['Admin', 'Staff', 'Customer'] },
      { name: 'Leads', path: '/dashboard/leads', icon: UsersRound, roles: ['Admin', 'Staff'] },
      { name: 'Support', path: '/dashboard/tickets', icon: Headphones, roles: ['Admin', 'Staff', 'Customer'] }
    ]
  },
  {
    label: 'PRODUCTS & INVENTORY',
    items: [
      { name: 'Products', path: '/dashboard/products', icon: Package, roles: ['Admin', 'Staff'] },
      { name: 'Inventory', path: '/dashboard/inventory', icon: Boxes, roles: ['Admin', 'Staff'] },
      { name: 'Purchases', path: '/dashboard/purchase', icon: ShoppingBag, roles: ['Admin', 'Staff'] },
      { name: 'Warehouses', path: '/dashboard/warehouses', icon: Warehouse, roles: ['Admin', 'Staff'] }
    ]
  },
  {
    label: 'SERVICES',
    items: [
      { name: 'Service Bookings', path: '/dashboard/bookings', icon: CalendarCheck, roles: ['Admin', 'Staff', 'Technician', 'Customer'] },
      { name: 'Service Schedule', path: '/dashboard/schedule', icon: CalendarDays, roles: ['Admin', 'Staff', 'Technician'] },
      { name: 'Field Jobs', path: '/dashboard/field-service', icon: Wrench, roles: ['Admin', 'Staff', 'Technician'] },
      { name: 'Service Feedback', path: '/dashboard/feedback', icon: Star, roles: ['Admin', 'Staff'] },
      { name: 'AMC Contracts', path: '/dashboard/amc', icon: FileCheck, roles: ['Admin', 'Staff', 'Customer'] },
      { name: 'Services', path: '/dashboard/services', icon: Layers, roles: ['Admin', 'Staff'] }
    ]
  },
  {
    label: 'BILLING',
    items: [
      { name: 'Invoices', path: '/dashboard/invoices', icon: Receipt, roles: ['Admin', 'Staff', 'Customer'] }
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      {
        name: 'Technician Requests',
        path: '/dashboard/technician-requests',
        icon: UserCheck,
        roles: ['Admin'],
        badge: pendingTechCount
      },
      { name: 'Users', path: '/dashboard/users', icon: Users, roles: ['Admin'] }
    ]
  },
  {
    label: 'REPORTS',
    items: [
      { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, roles: ['Admin', 'Staff'] },
      { name: 'Activity Log', path: '/dashboard/activity', icon: History, roles: ['Admin', 'Staff'] }
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['Admin'] },
      { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle, roles: ['Admin', 'Staff', 'Technician', 'Customer'] }
    ]
  },
  {
    label: 'ADVANCED',
    collapsible: true,
    items: [
      { name: 'AI Stock Forecast', path: '/dashboard/forecast', icon: Sparkles, roles: ['Admin', 'Staff'] },
      { name: 'Multi-Branch Network', path: '/dashboard/branches', icon: GitBranch, roles: ['Admin', 'Staff'] },
      { name: 'System Infrastructure', path: '/dashboard/health', icon: Activity, roles: ['Admin'] },
      { name: 'Backup & Restore', path: '/dashboard/backup', icon: Database, roles: ['Admin'] }
    ]
  }
];

const itemClasses = (active, collapsed) =>
  `group relative flex items-center rounded-xl text-xs font-bold transition-all duration-150 ${
    collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3.5 py-2.5'
  } ${
    active
      ? 'bg-[#FFF7ED] text-[#EA580C] font-extrabold shadow-xs border border-[#FED7AA]'
      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
  }`;

const iconClasses = (active) =>
  `w-4 h-4 shrink-0 ${
    active ? 'text-[#EA580C]' : 'text-[#94A3B8] group-hover:text-[#111827]'
  }`;

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('uew_sidebar_collapsed') === '1'
  );
  const [advancedOpen, setAdvancedOpen] = useState(
    () => localStorage.getItem('uew_advanced_open') === '1'
  );
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });
  const flyoutRef = useRef(null);

  // Track desktop breakpoint so the compact (icon-only) sidebar presentation
  // never leaks into the mobile drawer.
  const [isMd, setIsMd] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );
  useEffect(() => {
    const onResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const role = user?.role || 'Customer';

  // Real pending technician application count for the nav badge (Admin only).
  // Reuses the existing query — 30s refetch + Socket.IO 'technician_requests_updated'
  // invalidation already wired in SocketContext. Never hardcoded.
  const { data: techRequestsRes } = useTechnicianRequests(
    { status: 'Pending' },
    { enabled: role === 'Admin' }
  );
  const pendingTechCount = techRequestsRes?.data?.pendingCount || 0;

  const navGroups = buildNavGroups(pendingTechCount);

  // Filter by role (preserves previous per-item restrictions).
  const visibleGroups = navGroups
    .map((group) => ({ ...group, items: group.items.filter((i) => i.roles.includes(role)) }))
    .filter((group) => group.items.length > 0);

  const flatItems = visibleGroups.flatMap((g) => g.items);
  const activeItem = flatItems.find((i) => location.pathname === i.path);
  const activeName = activeItem?.name || 'Overview';

  const advancedGroup = visibleGroups.find((g) => g.collapsible) || null;
  const advancedActive = advancedGroup?.items.some((i) => location.pathname === i.path) || false;

  // Compact (icon-only) presentation applies only on desktop AND when the
  // user collapsed the sidebar; the mobile drawer always stays full.
  const compact = collapsed && isMd;

  // Close mobile drawer / flyout on navigation; auto-expand Advanced when a
  // child route is active.
  useEffect(() => {
    setMobileOpen(false);
    setFlyoutOpen(false);
    if (advancedActive) setAdvancedOpen(true);
  }, [location.pathname, advancedActive]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close the collapsed-sidebar Advanced flyout on outside click / Escape,
  // and the mobile drawer on Escape.
  useEffect(() => {
    if (!flyoutOpen && !mobileOpen) return undefined;
    const onPointerDown = (e) => {
      if (flyoutOpen && flyoutRef.current && !flyoutRef.current.contains(e.target)) {
        setFlyoutOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setFlyoutOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [flyoutOpen, mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('uew_sidebar_collapsed', next ? '1' : '0');
      return next;
    });
  };

  const toggleAdvanced = () => {
    setAdvancedOpen((prev) => {
      const next = !prev;
      localStorage.setItem('uew_advanced_open', next ? '1' : '0');
      return next;
    });
  };

  const openFlyout = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 10 });
    setFlyoutOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderItem = (item, compact) => {
    const active = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <Link
        key={item.path}
        to={item.path}
        title={compact ? item.name : undefined}
        aria-current={active ? 'page' : undefined}
        className={itemClasses(active, compact)}
      >
        <Icon className={iconClasses(active)} />
        {!compact && <span className="flex-1 truncate">{item.name}</span>}
        {!compact && item.badge > 0 && (
          <span className="shrink-0 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
        {compact && item.badge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-500" />
        )}
      </Link>
    );
  };

  const renderGroup = (group, compact) => {
    if (group.collapsible) {
      if (compact) {
        // Collapsed sidebar: single icon button opening a flyout menu.
        return (
          <div key={group.label} className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={openFlyout}
              title="Advanced"
              aria-label="Advanced options"
              aria-haspopup="true"
              aria-expanded={flyoutOpen}
              className="flex items-center justify-center rounded-lg p-2.5 text-text-muted hover:bg-surface-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <SlidersHorizontal className="w-[18px] h-[18px]" />
            </button>
          </div>
        );
      }
      const Icon = SlidersHorizontal;
      return (
        <div key={group.label} className="mt-5">
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {group.label}
          </p>
          <div className="mt-1 space-y-1">
            <button
              type="button"
              onClick={toggleAdvanced}
              aria-expanded={advancedOpen}
              aria-controls="advanced-group"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <Icon className="w-5 h-5 shrink-0 text-text-muted" />
              <span className="flex-1 truncate text-left">Advanced</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${
                  advancedOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {advancedOpen && (
              <div id="advanced-group" className="space-y-1">
                {group.items.map((item) => renderItem(item, false))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={group.label} className={compact ? 'mt-3' : 'mt-5'}>
        {compact ? (
          <div className="mx-3 h-px bg-slate-200" aria-hidden="true" />
        ) : (
          <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {group.label}
          </p>
        )}
        <div className={compact ? 'mt-3 space-y-1' : 'mt-1 space-y-1'}>
          {group.items.map((item) => renderItem(item, compact))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-50 md:flex">
      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-900/50 md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-surface-200 bg-white transition-[width,transform] duration-300 ease-in-out md:static md:translate-x-0 ${
          compact ? 'md:w-[76px]' : 'md:w-64'
        } w-[85vw] max-w-[280px] sm:w-64 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div
          className={`flex items-center border-b border-surface-200 px-4 py-4 ${
            compact ? 'justify-between md:justify-center' : 'justify-between'
          }`}
        >
          <Link
            to="/dashboard"
            className="flex items-center"
            title={compact ? 'Uday Electrical Works' : undefined}
          >
            <Logo portal="management" variant={compact ? 'icon' : 'full'} size="md" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl text-text-muted hover:text-text-primary md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
          {visibleGroups.map((group) => renderGroup(group, compact))}
        </nav>

        {/* Footer */}
        <div className="border-t border-surface-200 p-4">
          <Link
            to="/"
            title={compact ? 'Back to Storefront' : undefined}
            className={`flex items-center rounded-lg text-text-secondary hover:bg-surface-100 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
              compact ? 'justify-center p-2.5' : 'justify-center py-1'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className={`ml-1.5 text-xs font-semibold ${compact ? 'hidden md:inline' : ''}`}>
              Back to Storefront
            </span>
          </Link>
        </div>
      </aside>

      {/* Collapsed-sidebar Advanced flyout (fixed, avoids scroll-container clipping) */}
      {flyoutOpen && (
        <div
          ref={flyoutRef}
          className="fixed z-[60] w-56 rounded-xl border border-surface-200 bg-white p-1.5 shadow-lg"
          style={{ top: flyoutPos.top, left: flyoutPos.left }}
        >
          <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Advanced
          </p>
          {advancedGroup.items.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-brand-600' : 'text-text-muted'}`} />
                <span className="flex-1 truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main column: top bar + content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-surface-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile: open drawer */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl p-2 text-text-secondary hover:bg-surface-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Desktop: collapse sidebar */}
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden rounded-lg p-2 text-text-secondary hover:bg-surface-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text-muted">
                Management <span className="mx-0.5 text-text-tertiary">→</span>{' '}
                <span className="text-text-secondary">{activeName}</span>
              </p>
              <h1 className="truncate text-base font-bold text-text-primary">{activeName}</h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 text-text-secondary hover:bg-surface-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-600">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="hidden max-w-[140px] truncate text-left lg:block">
                <span className="block truncate text-xs font-bold text-text-primary">{user?.name}</span>
                <span className="block truncate text-[10px] text-text-muted">{user?.role}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-100 hover:text-danger-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger-500"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
