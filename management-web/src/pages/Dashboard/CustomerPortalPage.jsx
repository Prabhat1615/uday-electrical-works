import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CalendarCheck, Receipt, LifeBuoy, CreditCard, User, Zap } from 'lucide-react';
import { useBookings, useInvoices, useSalesOrders, useTickets } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { RazorpayCheckoutModal } from '../../components/RazorpayCheckoutModal';

export const CustomerPortalPage = () => {
  const { user } = useAuth();
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { data: bookingsRes, isLoading: loadingBookings } = useBookings();
  const { data: invoicesRes } = useInvoices();
  const { data: salesRes } = useSalesOrders();
  const { data: ticketsRes } = useTickets();

  const bookings = bookingsRes?.data || [];
  const invoices = invoicesRes?.data || [];
  const salesOrders = salesRes?.data || [];
  const tickets = ticketsRes?.data || [];

  const handlePayInvoice = (inv) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/20 via-blue-500/10 to-transparent border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Customer Enterprise Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">Welcome, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your electrical orders, service maintenance visits, online payments & support tickets</p>
        </div>

        <Link
          to="/services"
          className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-orange-500/20"
        >
          + Request New Service
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">My Bookings</span>
          <h3 className="text-2xl font-black text-white">{bookings.length}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">My Sales Orders</span>
          <h3 className="text-2xl font-black text-orange-400">{salesOrders.length}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Tax Invoices</span>
          <h3 className="text-2xl font-black text-blue-400">{invoices.length}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-bold uppercase">Support Tickets</span>
          <h3 className="text-2xl font-black text-emerald-400">{tickets.length}</h3>
        </div>
      </div>

      {/* Customer Invoices & Online Pay */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white">My Invoices & Online Payments</h3>
          <Link to="/dashboard/invoices" className="text-xs font-bold text-orange-400 hover:underline">View All →</Link>
        </div>

        {invoices.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No invoices issued to your account.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="font-mono text-blue-400 font-bold">{inv.invoiceNumber}</span>
                  <p className="font-bold text-white text-sm">{formatCurrency(inv.totalAmount)}</p>
                  <p className="text-slate-400">Issued: {formatDate(inv.createdAt)}</p>
                </div>
                <div className="text-right space-y-2">
                  <StatusBadge status={inv.paymentStatus} />
                  {inv.paymentStatus !== 'Paid' && (
                    <button
                      onClick={() => handlePayInvoice(inv)}
                      className="block px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
                    >
                      Pay Online (Razorpay)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Razorpay Online Checkout Modal */}
      {selectedInvoice && (
        <RazorpayCheckoutModal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          amount={selectedInvoice.totalAmount}
          invoiceId={selectedInvoice._id}
        />
      )}

    </div>
  );
};
