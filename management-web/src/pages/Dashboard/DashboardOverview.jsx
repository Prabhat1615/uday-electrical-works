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
  Package
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
          <h1 className="text-2xl font-bold text-text-primary font-display">
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
