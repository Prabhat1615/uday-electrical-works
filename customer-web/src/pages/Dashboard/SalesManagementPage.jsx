import React, { useState } from 'react';
import { ShoppingBag, Plus, Receipt, FileText, CheckCircle2 } from 'lucide-react';
import { useSalesOrders, useCreateSalesOrder, useProducts, useUsers } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const SalesManagementPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [isInterstate, setIsInterstate] = useState(false);
  const [customerGstNumber, setCustomerGstNumber] = useState('');

  const { data: salesRes, isLoading: loadingSales } = useSalesOrders();
  const { data: productsRes } = useProducts();
  const { data: usersRes } = useUsers({ role: 'Customer' });

  const createSalesMutation = useCreateSalesOrder();

  const salesOrders = salesRes?.data || [];
  const products = productsRes?.data || [];
  const customers = usersRes?.data || [];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedProductId) {
      alert('Please select customer and product');
      return;
    }

    try {
      await createSalesMutation.mutateAsync({
        customerId: selectedCustomerId,
        items: [{ productId: selectedProductId, quantity: Number(quantity) }],
        paymentStatus,
        isInterstate,
        customerGstNumber
      });
      setCreateModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create sales order');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Sales Orders & Billing Dispatch</h1>
          <p className="text-xs text-slate-400">Process equipment sales, auto-deduct inventory, and issue GST tax invoices</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Sales Order</span>
        </button>
      </div>

      {/* Sales Orders Table */}
      {loadingSales ? (
        <LoadingSpinner message="Fetching sales order ledger..." />
      ) : salesOrders.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <ShoppingBag className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No Sales Orders Found</h3>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order Number</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {salesOrders.map((so) => (
                  <tr key={so._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-400">{so.orderNumber}</td>
                    <td className="px-6 py-4 font-bold text-white">{so.customer?.name}</td>
                    <td className="px-6 py-4 text-slate-300">{so.items?.length || 0} Products</td>
                    <td className="px-6 py-4 font-extrabold text-amber-400 text-sm">{formatCurrency(so.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={so.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(so.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Sales Order Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Sales Order & Invoice">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Customer Client *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              required
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Select Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              required
            >
              <option value="">-- Select Inventory Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.stock < 1}>
                  {p.name} (Stock: {p.stock} units - {formatCurrency(p.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid Immediately</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Customer GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="36AAACS9999K1Z2"
                value={customerGstNumber}
                onChange={(e) => setCustomerGstNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterstate}
                  onChange={(e) => setIsInterstate(e.target.checked)}
                  className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <span>Interstate Supply (IGST 18%)</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
            >
              Complete Sale & Deduct Stock
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
