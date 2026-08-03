import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  TrendingUp, 
  CalendarCheck, 
  Receipt, 
  AlertTriangle, 
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
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const role = user?.role || 'Customer';

  const { data: analyticsRes, isLoading: loadingAnalytics } = useAnalytics();
  const { data: bookingsRes } = useBookings();
  const { data: invoicesRes } = useInvoices();
  const { data: leadsRes } = useLeads();

  const cards = analyticsRes?.data?.cards || {};
  const charts = analyticsRes?.data?.charts || {};
  const bookings = bookingsRes?.data || [];
  const invoices = invoicesRes?.data || [];
  const leads = leadsRes?.data || [];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              {role} Dashboard Console
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Uday Electrical Works Enterprise ERP (Phase 2) running with live analytics, auto-inventory & GST billing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {(role === 'Admin' || role === 'Staff') && (
            <Link
              to="/dashboard/sales"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md"
            >
              New Sale & Invoice
            </Link>
          )}
          {role === 'Customer' && (
            <Link
              to="/services"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Lifetime Revenue"
              value={formatCurrency(cards.totalRevenue || 0)}
              icon={TrendingUp}
              trend="+18%"
              color="amber"
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(cards.monthlyRevenue || 0)}
              icon={DollarSign}
              trend="Current Month"
              color="emerald"
            />
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(cards.todayRevenue || 0)}
              icon={Receipt}
              color="blue"
            />
            <StatCard
              title="Pending CRM Leads"
              value={leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length}
              icon={UserCheck}
              color="purple"
            />
          </div>

          {/* Recharts Analytics Row */}
          {loadingAnalytics ? (
            <LoadingSpinner message="Loading Recharts visual analytics..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Revenue Trend Area Chart */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Revenue Growth Trend (₹)</h3>
                    <p className="text-xs text-slate-400">Monthly gross turnover graph</p>
                  </div>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.revenueTrend || []}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bookings & Sales Bar Chart */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">Service Bookings Trend</h3>
                  <p className="text-xs text-slate-400">Monthly job requests</p>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.bookingTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="bookings" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Bookings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">Active Service Bookings</h3>
                <Link to="/dashboard/bookings" className="text-xs font-bold text-amber-400 hover:underline">View All →</Link>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => (
                  <div key={b._id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-amber-400 font-bold block">{b.bookingNumber}</span>
                      <p className="font-bold text-white mt-0.5">{b.service?.title}</p>
                      <p className="text-slate-400">{b.customer?.name}</p>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">Recent Customer Leads</h3>
                <Link to="/dashboard/leads" className="text-xs font-bold text-amber-400 hover:underline">View CRM Pipeline →</Link>
              </div>

              <div className="space-y-3">
                {leads.slice(0, 4).map((l) => (
                  <div key={l._id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{l.name}</p>
                      <p className="text-amber-400 font-semibold mt-0.5">{l.serviceRequired}</p>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Assigned Service Jobs"
              value={bookings.length}
              icon={Wrench}
              color="amber"
            />
            <StatCard
              title="Jobs In Progress"
              value={bookings.filter((b) => b.status === 'In Progress').length}
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Jobs Completed"
              value={bookings.filter((b) => b.status === 'Completed').length}
              icon={CheckCircle2}
              color="emerald"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">My Technician Dispatch Queue</h3>
            
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No jobs currently assigned to you.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-amber-400 font-bold">{b.bookingNumber}</span>
                      <p className="font-bold text-white text-sm">{b.service?.title}</p>
                      <p className="text-slate-300">Customer: {b.customer?.name} ({b.customer?.phone})</p>
                      <p className="text-slate-400">Site: {b.address}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <StatusBadge status={b.status} />
                      <Link
                        to="/dashboard/bookings"
                        className="block px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold"
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard
              title="My Booked Services"
              value={bookings.length}
              icon={CalendarCheck}
              color="amber"
            />
            <StatCard
              title="My Invoices"
              value={invoices.length}
              icon={Receipt}
              color="blue"
            />
            <StatCard
              title="Active Maintenance"
              value={bookings.filter((b) => b.status === 'In Progress').length}
              icon={Clock}
              color="emerald"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">My Maintenance Requests & History</h3>
              <Link to="/services" className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs">
                + Book New Service
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">You haven't requested any electrical service bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-amber-400 font-bold">{b.bookingNumber}</span>
                      <p className="font-bold text-white text-sm mt-0.5">{b.service?.title}</p>
                      <p className="text-slate-400">Scheduled Date: {formatDate(b.preferredDate)}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.status} />
                      <p className="text-white font-bold mt-1">{formatCurrency(b.totalCost)}</p>
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
