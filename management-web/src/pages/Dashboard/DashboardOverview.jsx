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
  ArrowUpRight,
  Package,
  Star
} from 'lucide-react';
import { useAnalytics, useBookings, useInvoices, useLeads, useProducts } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { CountUp } from '../../components/CountUp';
import { StaggerContainer, StaggerItem } from '../../components/motion/PageTransition';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const role = user?.role || 'Customer';

  const { data: analyticsRes, isLoading: loadingAnalytics } = useAnalytics();
  const { data: bookingsRes } = useBookings();
  const { data: invoicesRes } = useInvoices();
  const { data: leadsRes } = useLeads();
  const { data: productsRes } = useProducts();

  const cards = analyticsRes?.data?.cards || {};
  const charts = analyticsRes?.data?.charts || {};
  const bookings = bookingsRes?.data || [];
  const invoices = invoicesRes?.data || [];
  const leads = leadsRes?.data || [];
  const products = productsRes?.data || [];

  const hasData = bookings.length > 0 || invoices.length > 0 || leads.length > 0 || products.length > 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(role === 'Admin' || role === 'Staff') && (
            <>
              <Link to="/dashboard/products">
                <Button variant="secondary" icon={Package}>
                  Add Product
                </Button>
              </Link>
              <Link to="/dashboard/sales">
                <Button variant="primary" icon={Plus}>
                  New Sale
                </Button>
              </Link>
            </>
          )}
          {role === 'Customer' && (
            <Link to="/dashboard/bookings">
              <Button variant="primary" icon={CalendarCheck}>
                Book Service
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Empty State for new businesses */}
      {!hasData && (
        <Card>
          <CardBody className="py-12">
            <EmptyState
              icon={TrendingUp}
              title="Your business dashboard is ready"
              description="Start by adding products, services, or making your first sale to see your analytics here."
              actionLabel="Add Your First Product"
              onAction={() => window.location.href = '/dashboard/products'}
            />
          </CardBody>
        </Card>
      )}

      {/* Role Dashboard Views */}

      {/* Admin & Staff Dashboard */}
      {(role === 'Admin' || role === 'Staff') && hasData && (
        <>
          {/* Metrics Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StaggerItem>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(cards.totalRevenue || 0)}
                icon={TrendingUp}
                color="brand"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Monthly Revenue"
                value={formatCurrency(cards.monthlyRevenue || 0)}
                icon={DollarSign}
                color="success"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Today's Revenue"
                value={formatCurrency(cards.todayRevenue || 0)}
                icon={Receipt}
                color="accent"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Pending Leads"
                value={leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length}
                icon={UserCheck}
                color="warning"
              />
            </StaggerItem>
          </StaggerContainer>

          {/* Service Requests Pipeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Service Requests</h3>
                  <p className="text-xs text-text-secondary">Live status of customer bookings</p>
                </div>
                <Link to="/dashboard/bookings" className="text-xs font-medium text-brand-600 hover:text-brand-700">Manage Requests →</Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                {[
                  { label: 'Pending', key: 'Pending', color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' },
                  { label: 'Confirmed', key: 'Confirmed', color: 'text-blue-600 bg-blue-500/10 border-blue-500/30' },
                  { label: 'Assigned', key: 'Assigned', color: 'text-blue-600 bg-blue-500/10 border-blue-500/30' },
                  { label: 'On The Way', key: 'On The Way', color: 'text-blue-600 bg-blue-500/10 border-blue-500/30' },
                  { label: 'In Progress', key: 'In Progress', color: 'text-blue-600 bg-blue-500/10 border-blue-500/30' },
                  { label: 'Completed', key: 'Completed', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' },
                  { label: 'Rejected', key: 'Rejected', color: 'text-rose-600 bg-rose-500/10 border-rose-500/30' }
                ].map((s) => {
                  const count = bookings.filter((b) => b.status === s.key).length;
                  const active = bookings.length > 0 && !['Completed', 'Rejected', 'Cancelled'].includes(s.key) && (s.key === 'Pending' || s.key === 'Assigned' || s.key === 'In Progress');
                  return (
                    <div key={s.key} className={`rounded-xl border p-3 text-center ${s.color}`}>
                      <p className="text-2xl font-black">{count}</p>
                      <p className="text-[10px] uppercase font-bold opacity-80 mt-0.5">{s.label}</p>
                      {active && count > 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mt-1.5" />}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-text-muted mt-3">
                {bookings.length} total request(s) ·{' '}
                {bookings.filter((b) => b.status === 'Pending').length} waiting for confirmation ·{' '}
                {bookings.filter((b) => b.status === 'Assigned').length} waiting for technician acceptance
              </p>
            </CardBody>
          </Card>

          {/* Analytics Row */}
          {loadingAnalytics ? (
            <LoadingSpinner message="Loading analytics..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Revenue Trend Area Chart */}
              <Card className="lg:col-span-8">
                <CardHeader>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">Revenue Growth Trend</h3>
                    <p className="text-xs text-text-secondary">Monthly gross turnover</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={charts.revenueTrend || []}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* Bookings Bar Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">Service Bookings</h3>
                    <p className="text-xs text-text-secondary">Monthly job requests</p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={charts.bookingTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }} />
                        <Bar dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

            </div>
          )}

          {/* Service Feedback Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Service Feedback</h3>
                  <p className="text-xs text-text-secondary">Customer ratings from completed bookings</p>
                </div>
                <Link to="/dashboard/feedback" className="text-xs font-medium text-brand-600 hover:text-brand-700">View All Feedback →</Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wide font-medium">Average Rating</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-black text-text-primary">
                      {cards.avgRating ? cards.avgRating.toFixed(1) : '0.0'}
                    </p>
                    <div className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${n <= Math.round(cards.avgRating || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">
                    Based on {cards.reviewCount || 0} review(s)
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((n) => {
                    const count = charts.ratingDistribution?.[`star${n}`] || 0;
                    const total = cards.reviewCount || 0;
                    const pct = total ? (count / total) * 100 : 0;
                    return (
                      <div key={n} className="flex items-center gap-2 text-[11px]">
                        <span className="w-10 text-text-secondary font-medium flex items-center gap-0.5">
                          {n} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-text-muted">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary">Active Service Bookings</h3>
                  <Link to="/dashboard/bookings" className="text-xs font-medium text-brand-600 hover:text-brand-700">View All →</Link>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div key={b._id} className="p-3 rounded-lg bg-surface-50 border border-surface-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono text-brand-600 font-semibold block">{b.bookingNumber}</span>
                        <p className="font-medium text-text-primary mt-0.5">{b.service?.title}</p>
                        <p className="text-text-secondary">{b.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={b.status} />
                        <p className="text-[10px] text-text-muted mt-1">{formatDate(b.preferredDate)}</p>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-4">No active bookings</p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Pending Leads */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary">Recent Customer Leads</h3>
                  <Link to="/dashboard/leads" className="text-xs font-medium text-brand-600 hover:text-brand-700">View CRM Pipeline →</Link>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {leads.slice(0, 4).map((l) => (
                    <div key={l._id} className="p-3 rounded-lg bg-surface-50 border border-surface-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-medium text-text-primary">{l.name}</p>
                        <p className="text-accent-600 font-semibold mt-0.5">{l.serviceRequired}</p>
                        <p className="text-text-muted">{l.phone}</p>
                      </div>
                    <div className="text-right">
                      <StatusBadge status={l.status} />
                    </div>
                  </div>
                ))}
                {leads.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-4">No leads yet</p>
                )}
              </div>
            </CardBody>
            </Card>

          </div>
        </>
      )}

      {/* Technician Dashboard */}
      {role === 'Technician' && (
        <div className="space-y-6">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StaggerItem>
              <StatCard
                title="Assigned Jobs"
                value={bookings.length}
                icon={Wrench}
                color="brand"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="In Progress"
                value={bookings.filter((b) => b.status === 'In Progress').length}
                icon={Clock}
                color="accent"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Completed"
                value={bookings.filter((b) => b.status === 'Completed').length}
                icon={CheckCircle2}
                color="success"
              />
            </StaggerItem>
          </StaggerContainer>

          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-text-primary">My Technician Dispatch Queue</h3>
            </CardHeader>
            <CardBody>
              {bookings.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">No jobs currently assigned to you.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 rounded-lg bg-surface-50 border border-surface-200 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-brand-600 font-semibold">{b.bookingNumber}</span>
                      <p className="font-medium text-text-primary text-sm">{b.service?.title}</p>
                      <p className="text-text-secondary">Customer: {b.customer?.name} ({b.customer?.phone})</p>
                      <p className="text-text-muted">Site: {b.address}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <StatusBadge status={b.status} />
                      <Link
                        to="/dashboard/bookings"
                        className="block px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors"
                      >
                        Update Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Customer Dashboard */}
      {role === 'Customer' && (
        <div className="space-y-6">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StaggerItem>
              <StatCard
                title="My Booked Services"
                value={bookings.length}
                icon={CalendarCheck}
                color="brand"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="My Invoices"
                value={invoices.length}
                icon={Receipt}
                color="accent"
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                title="Active Maintenance"
                value={bookings.filter((b) => b.status === 'In Progress').length}
                icon={Clock}
                color="success"
              />
            </StaggerItem>
          </StaggerContainer>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-text-primary">My Service Requests</h3>
                <Link to="/dashboard/bookings">
                  <Button variant="primary" size="sm" icon={Plus}>
                    Book New Service
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {bookings.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">You haven't requested any electrical service bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b._id} className="p-4 rounded-lg bg-surface-50 border border-surface-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono text-brand-600 font-semibold">{b.bookingNumber}</span>
                        <p className="font-medium text-text-primary text-sm mt-0.5">{b.service?.title}</p>
                        <p className="text-text-muted">Scheduled Date: {formatDate(b.preferredDate)}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={b.status} />
                        <p className="text-text-primary font-semibold mt-1">{formatCurrency(b.totalCost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

    </div>
  );
};
