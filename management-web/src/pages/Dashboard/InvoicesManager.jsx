import React, { useState } from 'react';
import { Receipt, Plus, Search, CheckCircle2, AlertCircle, Printer, FileText, CreditCard } from 'lucide-react';
import { useInvoices, useCreateInvoice, useUpdateInvoiceStatus, useBookings } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { PrintableInvoiceModal } from '../../components/PrintableInvoiceModal';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { StaggerContainer, StaggerItem } from '../../components/motion/PageTransition';

export const InvoicesManager = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Invoice Form
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);
  const [isInterstate, setIsInterstate] = useState(false);
  const [customerGstNumber, setCustomerGstNumber] = useState('');
  const [payStatus, setPayStatus] = useState('Unpaid');
  const [payMethod, setPayMethod] = useState('Pending');

  // Status update
  const [updatePayStatus, setUpdatePayStatus] = useState('');
  const [updatePayMethod, setUpdatePayMethod] = useState('');

  const { data: res, isLoading } = useInvoices({ paymentStatus: paymentStatusFilter });
  const { data: bookingsRes } = useBookings();
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = useUpdateInvoiceStatus();

  const invoices = res?.data || [];
  const bookings = bookingsRes?.data || [];

  const handleOpenStatusModal = (inv) => {
    setActiveInvoice(inv);
    setUpdatePayStatus(inv.paymentStatus);
    setUpdatePayMethod(inv.paymentMethod || 'Pending');
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!activeInvoice) return;

    try {
      await updateInvoiceMutation.mutateAsync({
        id: activeInvoice._id,
        data: {
          paymentStatus: updatePayStatus,
          paymentMethod: updatePayMethod
        }
      });
      setActiveInvoice(null);
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) {
      alert('Please select a booking to issue invoice');
      return;
    }
    if (!itemDesc || itemPrice <= 0) {
      alert('Please provide valid invoice line item description and unit price');
      return;
    }

    try {
      await createInvoiceMutation.mutateAsync({
        bookingId: selectedBookingId,
        customerGstNumber,
        isInterstate,
        items: [
          {
            description: itemDesc,
            quantity: Number(itemQty),
            unitPrice: Number(itemPrice),
            amount: Number(itemQty) * Number(itemPrice)
          }
        ],
        paymentStatus: payStatus,
        paymentMethod: payMethod
      });

      setCreateModalOpen(false);
      setItemDesc('');
      setItemQty(1);
      setItemPrice(0);
    } catch (err) {
      alert(err.message || 'Failed to create invoice');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">GST Invoices & Billing Ledger</h1>
          <p className="text-xs text-slate-500">Generate tax compliant invoices with CGST/SGST/IGST breakdown and print receipts</p>
        </div>

        <div className="flex items-center space-x-3">
          {(role === 'Admin' || role === 'Staff') && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-card"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Tax Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoices Table */}
      {isLoading ? (
        <LoadingSpinner message="Loading invoices & financial ledger..." />
      ) : invoices.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <Receipt className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No invoices found</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Invoice #</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Taxable Subtotal</th>
                  <th className="px-4 py-2.5">Tax (GST)</th>
                  <th className="px-4 py-2.5">Grand Total</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-sky-600">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{inv.customer?.name}</p>
                      <p className="text-[10px] text-slate-500">{inv.customer?.phone || inv.customer?.email}</p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-semibold">
                      {formatCurrency(inv.subtotal || inv.totalAmount * 0.82)}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-amber-600">
                      {formatCurrency(inv.taxAmount || 0)}
                    </td>
                    <td className="px-4 py-2.5 font-extrabold text-slate-900 text-sm">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={inv.paymentStatus} />
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => setPrintInvoice(inv)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-500 border border-amber-500/30 text-amber-600 hover:text-white font-bold transition-all"
                      >
                        Print GST Invoice
                      </button>
                      {(role === 'Admin' || role === 'Staff') && (
                        <button
                          onClick={() => handleOpenStatusModal(inv)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold transition-colors"
                        >
                          Update Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable GST Invoice Modal */}
      <PrintableInvoiceModal
        isOpen={!!printInvoice}
        onClose={() => setPrintInvoice(null)}
        invoice={printInvoice}
      />

      {/* Create Invoice Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Generate Tax Invoice"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Select Booking *</label>
            <select
              value={selectedBookingId}
              onChange={(e) => {
                const bId = e.target.value;
                setSelectedBookingId(bId);
                const found = bookings.find((b) => b._id === bId);
                if (found) {
                  setItemDesc(`Electrical Service: ${found.service?.title}`);
                  setItemPrice(found.totalCost || found.service?.estimatedPrice || 0);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            >
              <option value="">Choose Booking...</option>
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.bookingNumber} - {b.customer?.name} ({b.service?.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Line Item Description *</label>
            <input
              type="text"
              placeholder="e.g. Stator Rewinding & Varnish Coating"
              value={itemDesc}
              onChange={(e) => setItemDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                value={itemQty}
                onChange={(e) => setItemQty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Unit Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Customer GSTIN</label>
              <input
                type="text"
                placeholder="36AAAAA0000A1Z5"
                value={customerGstNumber}
                onChange={(e) => setCustomerGstNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 text-slate-600 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterstate}
                  onChange={(e) => setIsInterstate(e.target.checked)}
                  className="rounded border-slate-200 text-amber-500 focus:ring-amber-500"
                />
                <span>Interstate (18% IGST)</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-card"
            >
              Create Tax Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Payment Modal */}
      <Modal
        isOpen={!!activeInvoice}
        onClose={() => setActiveInvoice(null)}
        title={`Update Payment: ${activeInvoice?.invoiceNumber}`}
      >
        {activeInvoice && (
          <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">Total Bill: {formatCurrency(activeInvoice.totalAmount)}</p>
              <p className="text-slate-500">Customer: {activeInvoice.customer?.name}</p>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Payment Status</label>
              <select
                value={updatePayStatus}
                onChange={(e) => setUpdatePayStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 font-semibold"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid (Complete Payment)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Payment Method</label>
              <select
                value={updatePayMethod}
                onChange={(e) => setUpdatePayMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveInvoice(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-card"
              >
                Save Payment Record
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
