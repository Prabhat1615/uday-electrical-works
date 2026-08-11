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
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Customer Enterprise Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Welcome, {user?.name}!</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your electrical orders, service maintenance visits, online payments & support tickets</p>
        </div>

        <Link
          to="/services"
          className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-card"
        >
          + Request New Service
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">My Bookings</span>
          <h3 className="text-2xl font-black text-slate-900">{bookings.length}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">My Sales Orders</span>
          <h3 className="text-2xl font-black text-orange-600">{salesOrders.length}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Tax Invoices</span>
          <h3 className="text-2xl font-black text-blue-600">{invoices.length}</h3>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase">Support Tickets</span>
          <h3 className="text-2xl font-black text-emerald-600">{tickets.length}</h3>
        </div>
      </div>

      {/* Customer Invoices & Online Pay */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">My Invoices & Online Payments</h3>
          <Link to="/dashboard/invoices" className="text-xs font-bold text-orange-600 hover:underline">View All →</Link>
        </div>

        {invoices.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No invoices issued to your account.</p>
        ) : (
          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <div key={inv._id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="font-mono text-blue-600 font-bold">{inv.invoiceNumber}</span>
                  <p className="font-bold text-slate-900 text-sm">{formatCurrency(inv.totalAmount)}</p>
                  <p className="text-slate-500">Issued: {formatDate(inv.createdAt)}</p>
                </div>
                <div className="text-right space-y-2">
                  <StatusBadge status={inv.paymentStatus} />
                  {inv.paymentStatus !== 'Paid' &&
                    (import.meta.env.DEV ? (
                      <button
                        onClick={() => handlePayInvoice(inv)}
                        className="block px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold shadow-card"
                      >
                        Pay Online (Razorpay)
                      </button>
                    ) : (
                      <p className="text-[10px] text-slate-500">Pay at shop / Call 7903789402</p>
                    ))}
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
