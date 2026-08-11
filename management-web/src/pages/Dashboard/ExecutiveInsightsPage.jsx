import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, CheckCircle2, Clock, Ban, XCircle, Package, AlertTriangle, Wrench, Star, BadgeCheck } from 'lucide-react';
import { useAnalytics } from '../../hooks/useErpQueries';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const KpiCard = ({ label, value, note, valueClass = 'text-slate-900' }) => (
  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
    <h3 className={`text-2xl font-black ${valueClass}`}>{value}</h3>
    {note && <p className="text-[11px] text-slate-500">{note}</p>}
  </div>
);

export const ExecutiveInsightsPage = () => {
  const { data: analyticsRes, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return <LoadingSpinner message="Calculating executive analytics..." />;
  }

  const cards = analyticsRes?.data?.cards || {};
  const charts = analyticsRes?.data?.charts || {};
  const trend = charts.revenueTrend || [];
  const hasRevenueData = trend.some((m) => (m.revenue || 0) > 0);
  const technicians = cards.technicianProductivity || [];

  const statusRows = [
    { label: 'Pending', key: 'pendingServices', color: 'text-amber-600', icon: Clock },
    { label: 'In Progress', key: 'inProgressServices', color: 'text-blue-600', icon: Wrench },
    { label: 'Completed', key: 'jobsCompleted', color: 'text-emerald-600', icon: CheckCircle2 },
    { label: 'Cancelled', key: 'cancelledServices', color: 'text-rose-600', icon: Ban }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-extrabold text-slate-900">Insights</h1>
        <p className="text-xs text-slate-500">Business performance based on your actual application data</p>
        {isError && (
          <p className="text-[11px] text-rose-600 mt-2">
            Analytics could not be loaded. Please try again.
          </p>
        )}
      </div>

      {/* Business Overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            label="Gross Revenue"
            value={formatCurrency(cards.totalRevenue || 0)}
            note={cards.totalRevenue > 0 ? 'From paid invoices' : 'No completed sales recorded yet'}
          />
          <KpiCard
            label="Net Profit"
            value="Not available yet"
            valueClass="text-slate-500 text-lg font-bold leading-tight pt-1.5"
            note="Expense tracking is required to calculate this metric"
          />
          <KpiCard
            label="Orders"
            value={cards.orderCount ?? 0}
            note={cards.orderCount > 0 ? 'Total sales orders' : 'No orders recorded yet'}
          />
          <KpiCard
            label="Customers"
            value={cards.customerCount ?? 0}
            note={cards.customerCount > 0 ? 'Total customer accounts' : 'No customer accounts yet'}
          />
        </div>
      </section>

      {/* Service Performance */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statusRows.map(({ label, key, color, icon: Icon }) => (
            <div key={key} className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </span>
              <h3 className={`text-2xl font-black ${color}`}>{cards[key] ?? 0}</h3>
              <p className="text-[11px] text-slate-500">Service bookings</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Job Completion Rate</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {cards.completionRate === null || cards.completionRate === undefined
              ? 'No data yet'
              : `${cards.completionRate}%`}
          </h3>
          <p className="text-[11px] text-slate-500">
            {cards.completionRate === null || cards.completionRate === undefined
              ? 'No service job data yet'
              : 'Completed jobs / eligible jobs (excludes cancelled and rejected)'}
          </p>
        </div>
      </section>

      {/* Inventory */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            label="Products"
            value={cards.productCount ?? 0}
            note={cards.productCount > 0 ? 'Total catalog products' : 'No products recorded yet'}
          />
          <KpiCard
            label="Low Stock"
            value={cards.lowStockCount ?? 0}
            note="5 units or fewer"
            valueClass="text-amber-600"
          />
          <KpiCard
            label="Out of Stock"
            value={cards.outOfStockCount ?? 0}
            note="Zero stock units"
            valueClass="text-rose-600"
          />
        </div>
      </section>

      {/* Technicians */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Technicians</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            label="Approved Technicians"
            value={cards.approvedTechnicianCount ?? 0}
            note="Approved accounts only"
          />
          <KpiCard
            label="Jobs Completed"
            value={cards.jobsCompleted ?? 0}
            note={cards.jobsCompleted > 0 ? 'Completed service bookings' : 'No completed jobs yet'}
          />
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Average Rating</span>
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
              {cards.reviewCount > 0 ? cards.avgRating?.toFixed(1) : 'No data yet'}
              {cards.reviewCount > 0 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
            </h3>
            <p className="text-[11px] text-slate-500">
              {cards.reviewCount > 0
                ? `Based on ${cards.reviewCount} review(s) from completed jobs`
                : 'No feedback recorded yet'}
            </p>
          </div>
        </div>

        {/* Technician Productivity Leaderboard (real technicians only) */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-card space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-brand-600" />
            Technician Productivity
          </h3>
          {technicians.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No technician productivity data yet.</p>
          ) : (
            <ol className="space-y-2">
              {technicians.map((t, i) => (
                <li
                  key={t._id || i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-brand-100 text-brand-600 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium text-slate-900">{t.name}</span>
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-500">{t.jobsCompleted} completed job(s)</span>
                    {t.reviewCount > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {t.avgRating?.toFixed(1)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Revenue Trend (real invoice data only) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Revenue Trend</h2>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Revenue</h3>
              <p className="text-[11px] text-slate-500">Paid invoices grouped by month (last 6 months)</p>
            </div>
            {hasRevenueData && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <TrendingUp className="w-3 h-3" /> Real data
              </span>
            )}
          </div>
          {hasRevenueData ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No revenue history yet</p>
              <p className="text-xs text-slate-500 mt-1">Data will appear as your business activity grows.</p>
            </div>
          )}
        </div>
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400 pb-2">
        <AlertTriangle className="w-3.5 h-3.5" />
        All metrics are calculated from your application data. No estimates or sample figures are shown.
      </p>
    </div>
  );
};
