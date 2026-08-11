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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sales Orders & Billing Dispatch</h1>
          <p className="text-xs text-slate-500">Process equipment sales, auto-deduct inventory, and issue GST tax invoices</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-card"
        >
          <Plus className="w-4 h-4" />
          <span>New Sales Order</span>
        </button>
      </div>

      {/* Sales Orders Table */}
      {loadingSales ? (
        <LoadingSpinner message="Fetching sales order ledger..." />
      ) : salesOrders.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <ShoppingBag className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Sales Orders Found</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Order Number</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Items Count</th>
                  <th className="px-4 py-2.5">Total Amount</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesOrders.map((so) => (
                  <tr key={so._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-sky-600">{so.orderNumber}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{so.customer?.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{so.items?.length || 0} Products</td>
                    <td className="px-4 py-2.5 font-extrabold text-amber-600 text-sm">{formatCurrency(so.totalAmount)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={so.paymentStatus} />
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{formatDate(so.createdAt)}</td>
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
            <label className="block text-slate-600 font-bold uppercase mb-1">Customer Client *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            >
              <option value="">Choose Customer...</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Select Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            >
              <option value="">Select Inventory Product...</option>
              {products.map((p) => (
                <option key={p._id} value={p._id} disabled={p.stock < 1}>
                  {p.name} (Stock: {p.stock} units - {formatCurrency(p.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid Immediately</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Customer GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="36AAACS9999K1Z2"
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
                <span>Interstate Supply (IGST 18%)</span>
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
              Complete Sale & Deduct Stock
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
