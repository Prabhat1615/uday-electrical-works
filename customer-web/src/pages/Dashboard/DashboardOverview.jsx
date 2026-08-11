import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, ShoppingBag, Receipt, Phone, Wrench, ShoppingCart, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBookings, useSalesOrders, useInvoices } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const DashboardOverview = () => {
  const { user } = useAuth();
  const { data: bookingsRes, isLoading: loadingBookings } = useBookings();
  const { data: salesRes, isLoading: loadingSales } = useSalesOrders();
  const { data: invoicesRes, isLoading: loadingInvoices } = useInvoices();

  const bookings = bookingsRes?.data || [];
  const sales = salesRes?.data || [];
  const invoices = invoicesRes?.data || [];

  const activeBookings = bookings.filter((b) => !['Completed', 'Cancelled'].includes(b.status));
  const unpaidInvoices = invoices.filter((i) => ['Unpaid', 'Pending'].includes(i.paymentStatus));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-card relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Customer Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">
            Welcome, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your service bookings, orders and GST invoices, or book something new.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-3">
          <Link to="/services" className="btn-cta btn-sm">
            <Wrench className="w-4 h-4" />
            <span>Book a Service</span>
          </Link>
          <Link to="/shop" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-card transition-all">
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            Shop Products
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/dashboard/bookings" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-500 transition-colors group shadow-card">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-lg bg-orange-500/10 text-orange-500"><CalendarCheck className="w-5 h-5" /></span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">{loadingBookings ? '…' : activeBookings.length}</p>
          <p className="text-xs font-bold text-slate-500">Active Bookings</p>
        </Link>

        <Link to="/dashboard/sales" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 transition-colors group shadow-card">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600"><ShoppingBag className="w-5 h-5" /></span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">{loadingSales ? '…' : sales.length}</p>
          <p className="text-xs font-bold text-slate-500">Orders Placed</p>
        </Link>

        <Link to="/dashboard/invoices" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 transition-colors group shadow-card">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Receipt className="w-5 h-5" /></span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">{loadingInvoices ? '…' : unpaidInvoices.length}</p>
          <p className="text-xs font-bold text-slate-500">Unpaid Invoices</p>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/services" className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 text-center space-y-1 hover:bg-orange-500 hover:text-white transition-all">
            <Wrench className="w-5 h-5 mx-auto" />
            <span className="block text-xs font-black">Book a Service</span>
          </Link>
          <Link to="/shop" className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-center space-y-1 hover:bg-blue-600 hover:text-white transition-all">
            <ShoppingCart className="w-5 h-5 mx-auto" />
            <span className="block text-xs font-black">Shop Products</span>
          </Link>
          <a href="tel:7903789402" className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-center space-y-1 hover:bg-emerald-500 hover:text-white transition-all">
            <Phone className="w-5 h-5 mx-auto" />
            <span className="block text-xs font-black">Call the Shop</span>
          </a>
          <Link to="/dashboard/profile" className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-center space-y-1 hover:bg-slate-200 transition-all">
            <Clock className="w-5 h-5 mx-auto" />
            <span className="block text-xs font-black">My Details</span>
          </Link>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="text-xs font-extrabold text-orange-500 hover:underline">View All</Link>
        </div>
        {loadingBookings ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-card text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">No bookings yet</p>
            <Link to="/services" className="inline-block px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs transition-all">
              Book Your First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {bookings.slice(0, 4).map((b) => (
              <Link key={b._id} to="/dashboard/bookings" className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-orange-500 transition-colors shadow-card">
                <div>
                  <p className="text-sm font-bold text-slate-900">{b.service?.title || 'Service Booking'}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {b.bookingNumber} · {formatDate(b.preferredDate)} · {b.preferredTime}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">Recent Orders</h2>
          <Link to="/dashboard/sales" className="text-xs font-extrabold text-orange-500 hover:underline">View All</Link>
        </div>
        {loadingSales ? (
          <LoadingSpinner />
        ) : sales.length === 0 ? (
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-card text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">No orders yet</p>
            <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all">
              Browse the Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sales.slice(0, 4).map((s) => (
              <Link key={s._id} to="/dashboard/sales" className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-orange-500 transition-colors shadow-card">
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.orderNumber}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {s.items?.length || 0} item(s) · {formatCurrency(s.totalAmount)}
                  </p>
                </div>
                <div>
                  {s.paymentStatus === 'Paid' ? (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Paid</span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Pay at Shop</span>
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
