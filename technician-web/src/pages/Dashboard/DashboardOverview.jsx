import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, 
  CalendarCheck, 
  Receipt, 
  Users, 
  Wrench, 
  UserCheck, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { useAnalytics, useBookings, useInvoices, useLeads } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CountUp } from '../../components/CountUp';
import { StaggerGroup, StaggerItem } from '../../components/Stagger';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const role = user?.role || 'Customer';

  const isAdminOrStaff = role === 'Admin' || role === 'Staff';
  const isCustomer = role === 'Customer';

  const { data: analyticsRes, isLoading: loadingAnalytics } = useAnalytics({ enabled: isAdminOrStaff });
  const { data: bookingsRes } = useBookings();
  const { data: invoicesRes } = useInvoices(undefined, { enabled: isAdminOrStaff || isCustomer });
  const { data: leadsRes } = useLeads(undefined, { enabled: isAdminOrStaff });

  const cards = analyticsRes?.data?.cards || {};
  const charts = analyticsRes?.data?.charts || {};
  const bookings = bookingsRes?.data || [];
  const invoices = invoicesRes?.data || [];
  const leads = leadsRes?.data || [];

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#E2E8F0',
    borderRadius: '8px',
    color: '#0F172A',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-card relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">
              {role} Dashboard Console
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Uday Electrical Works Enterprise ERP (Phase 2) running with live analytics, auto-inventory & GST billing.
          </p>
        </div>

        <div className="relative flex items-center space-x-3">
          {(role === 'Admin' || role === 'Staff') && (
            <Link
              to="/dashboard/sales"
              className="btn-cta btn-sm"
            >
              New Sale & Invoice
            </Link>
          )}
          {role === 'Customer' && (
            <Link
              to="/services"
              className="btn-cta btn-sm"
            >
              Book Electrical Service
            </Link>
          )}
        </div>
      </div>

      {/* Role Dashboard Views */}

      {/* 1. ADMIN & STAFF DASHBOARD */}
      {(role === 'Admin' || role === 'Staff') && (
        <>
          {/* Metrics Grid */}
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <StatCard
                title="Total Lifetime Revenue"
                value={formatCurrency(cards.totalRevenue || 0)}
                icon={TrendingUp}
                trend="+18%"
                color="orange"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Monthly Revenue"
                value={formatCurrency(cards.monthlyRevenue || 0)}
                icon={DollarSign}
                trend="Current Month"
                color="emerald"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Today's Revenue"
                value={formatCurrency(cards.todayRevenue || 0)}
                icon={Receipt}
                color="blue"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Pending CRM Leads"
                value={<CountUp to={leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length} duration={1.6} />}
                icon={UserCheck}
                color="purple"
              />
            </StaggerItem>
          </StaggerGroup>

          {/* Recharts Analytics Row */}
          {loadingAnalytics ? (
            <LoadingSpinner message="Loading analytics..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Revenue Trend Area Chart */}
              <div className="lg:col-span-8 glass-panel rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Revenue Growth Trend (₹)</h3>
                    <p className="text-xs text-slate-500">Monthly gross turnover graph</p>
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.revenueTrend || []}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bookings & Sales Bar Chart */}
              <div className="lg:col-span-4 glass-panel rounded-xl p-5 space-y-3">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Service Bookings Trend</h3>
                  <p className="text-xs text-slate-500">Monthly job requests</p>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.bookingTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="bookings" fill="#0066FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Recent Bookings */}
            <div className="glass-panel rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Active Service Bookings</h3>
                <Link to="/dashboard/bookings" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3" /></Link>
              </div>

              <div className="space-y-2.5">
                {bookings.slice(0, 4).map((b) => (
                  <div key={b._id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-orange-600 font-bold block">{b.bookingNumber}</span>
                      <p className="font-bold text-slate-900 mt-0.5">{b.service?.title}</p>
                      <p className="text-slate-500">{b.customer?.name}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.status} />
                      <p className="text-[10px] text-slate-500 mt-1">{formatDate(b.preferredDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Leads */}
            <div className="glass-panel rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Recent Customer Leads</h3>
                <Link to="/dashboard/leads" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View CRM Pipeline <ArrowUpRight className="w-3 h-3" /></Link>
              </div>

              <div className="space-y-2.5">
                {leads.slice(0, 4).map((l) => (
                  <div key={l._id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{l.name}</p>
                      <p className="text-blue-600 font-semibold mt-0.5">{l.serviceRequired}</p>
                      <p className="text-slate-500">{l.phone}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={l.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* 2. TECHNICIAN DASHBOARD */}
      {role === 'Technician' && (
        <div className="space-y-5">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StaggerItem>
              <StatCard
                title="Assigned Service Jobs"
                value={<CountUp to={bookings.length} duration={1.5} />}
                icon={Wrench}
                color="amber"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Jobs In Progress"
                value={<CountUp to={bookings.filter((b) => b.status === 'In Progress').length} duration={1.5} />}
                icon={Clock}
                color="blue"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Jobs Completed"
                value={<CountUp to={bookings.filter((b) => b.status === 'Completed').length} duration={1.5} />}
                icon={CheckCircle2}
                color="emerald"
              />
            </StaggerItem>
          </StaggerGroup>

          <div className="glass-panel rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">My Technician Dispatch Queue</h3>
            
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No jobs currently assigned to you.</p>
            ) : (
              <div className="space-y-2.5">
                {bookings.map((b) => (
                  <div key={b._id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-orange-600 font-bold">{b.bookingNumber}</span>
                      <p className="font-bold text-slate-900 text-sm">{b.service?.title}</p>
                      <p className="text-slate-600">Customer: {b.customer?.name} ({b.customer?.phone})</p>
                      <p className="text-slate-500">Site: {b.address}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <StatusBadge status={b.status} />
                      <Link
                        to="/dashboard/bookings"
                        className="block px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                      >
                        Update Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CUSTOMER DASHBOARD */}
      {role === 'Customer' && (
        <div className="space-y-5">
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StaggerItem>
              <StatCard
                title="My Booked Services"
                value={<CountUp to={bookings.length} duration={1.5} />}
                icon={CalendarCheck}
                color="orange"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="My Invoices"
                value={<CountUp to={invoices.length} duration={1.5} />}
                icon={Receipt}
                color="blue"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Active Maintenance"
                value={<CountUp to={bookings.filter((b) => b.status === 'In Progress').length} duration={1.5} />}
                icon={Clock}
                color="emerald"
              />
            </StaggerItem>
          </StaggerGroup>

          <div className="glass-panel rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">My Maintenance Requests & History</h3>
              <Link to="/services" className="btn-primary btn-sm">
                <Plus className="w-3.5 h-3.5" />
                Book New Service
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">You haven't requested any electrical service bookings yet.</p>
            ) : (
              <div className="space-y-2.5">
                {bookings.map((b) => (
                  <div key={b._id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-orange-600 font-bold">{b.bookingNumber}</span>
                      <p className="font-bold text-slate-900 text-sm mt-0.5">{b.service?.title}</p>
                      <p className="text-slate-500">Scheduled Date: {formatDate(b.preferredDate)}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.status} />
                      <p className="text-slate-900 font-bold mt-1">{formatCurrency(b.totalCost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
