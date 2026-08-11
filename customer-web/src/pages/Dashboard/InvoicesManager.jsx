import React, { useState } from 'react';
import { Receipt, Printer, Inbox } from 'lucide-react';
import { useInvoices } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { PrintableInvoiceModal } from '../../components/PrintableInvoiceModal';

const PAYMENT_FILTERS = ['', 'Unpaid', 'Partially Paid', 'Paid'];

export const InvoicesManager = () => {
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [printInvoice, setPrintInvoice] = useState(null);

  const { data: res, isLoading } = useInvoices({ paymentStatus: paymentStatusFilter });

  const invoices = res?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">GST Invoices</h1>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-1">
            Tax invoices issued for your service jobs and product orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {PAYMENT_FILTERS.map((f) => (
            <button
              key={f || 'all'}
              onClick={() => setPaymentStatusFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                paymentStatusFilter === f
                  ? 'bg-[#F97316] text-white border-[#F97316]'
                  : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300'
              }`}
            >
              {f || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices list */}
      {isLoading ? (
        <LoadingSpinner message="Loading your invoices..." />
      ) : invoices.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">No invoices yet</h3>
          <p className="text-xs text-[#475569] dark:text-slate-400">
            Your tax invoices will appear here once a service or order is billed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-xs font-bold text-[#F97316]">{inv.invoiceNumber}</p>
                    <StatusBadge status={inv.paymentStatus} />
                  </div>
                  <p className="text-[11px] text-[#475569] dark:text-slate-400">
                    Issued {formatDate(inv.createdAt)}
                  </p>
                  {inv.booking?.bookingNumber && (
                    <p className="text-[11px] text-[#475569] dark:text-slate-400">
                      Booking <span className="font-mono">{inv.booking.bookingNumber}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Grand Total</p>
                    <p className="text-lg font-black text-[#0F172A] dark:text-white">
                      {formatCurrency(inv.totalAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrintInvoice(inv)}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#FFF7ED] dark:bg-slate-950 border border-[#FFEDD5] dark:border-slate-800 text-[#F97316] hover:bg-[#F97316] hover:text-white text-xs font-black transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 divide-y divide-[#E2E8F0] dark:divide-slate-800 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden">
                {(inv.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-950 text-xs">
                    <p className="font-bold text-[#0F172A] dark:text-white min-w-0 truncate">
                      {item.description}
                    </p>
                    <p className="text-[#475569] dark:text-slate-400 shrink-0">
                      {item.quantity} × {formatCurrency(item.unitPrice)} ={' '}
                      <span className="font-black text-[#0F172A] dark:text-white">
                        {formatCurrency(item.amount)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[#475569] dark:text-slate-400">
                <span>Subtotal: <b>{formatCurrency(inv.subtotal || 0)}</b></span>
                <span>GST ({inv.isInterstate ? 'IGST 18%' : 'CGST+SGST 18%'}): <b>{formatCurrency(inv.taxAmount || 0)}</b></span>
                <span className="inline-flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  {inv.paymentMethod || 'Payment'} {inv.paidAt ? `· ${formatDate(inv.paidAt)}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <PrintableInvoiceModal
        isOpen={!!printInvoice}
        onClose={() => setPrintInvoice(null)}
        invoice={printInvoice}
      />
    </div>
  );
};
