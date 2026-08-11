import React, { useState } from 'react';
import { Package, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, Search, Plus, FileText } from 'lucide-react';
import { useProducts, useInventoryHistory, useLogInventoryTransaction } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const InventoryDashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [txType, setTxType] = useState('IN');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: productsRes, isLoading: loadingProducts } = useProducts();
  const { data: historyRes, isLoading: loadingHistory } = useInventoryHistory();
  const logTransactionMutation = useLogInventoryTransaction();

  const products = productsRes?.data || [];
  const history = historyRes?.data || [];

  const handleOpenTx = (product, type) => {
    setSelectedProduct(product);
    setTxType(type);
    setQuantity(1);
    setReason('');
    setModalOpen(true);
  };

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await logTransactionMutation.mutateAsync({
        productId: selectedProduct._id,
        type: txType,
        quantity: Number(quantity),
        reason
      });
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to log inventory transaction');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inventory Control Module</h1>
          <p className="text-xs text-slate-500">Stock In, Stock Out, Manual Adjustments, Current Levels & Audit Logs</p>
        </div>
      </div>

      {/* Stock Levels Table */}
      {loadingProducts ? (
        <LoadingSpinner message="Calculating stock balances..." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Current Warehouse Stock</h3>
            <span className="text-xs font-semibold text-slate-500">{products.length} Products Monitored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Unit Price</th>
                  <th className="px-4 py-2.5">Current Stock</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-900">
                      <div className="flex items-center space-x-3">
                        <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {p._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-sky-600">{p.category}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-2.5 font-extrabold text-amber-600 text-sm">
                      {p.stock} units
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenTx(p, 'IN')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-600 hover:text-white font-bold transition-all"
                      >
                        + Stock In
                      </button>
                      <button
                        onClick={() => handleOpenTx(p, 'OUT')}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 text-rose-600 hover:text-white font-bold transition-all"
                      >
                        - Stock Out
                      </button>
                      <button
                        onClick={() => handleOpenTx(p, 'ADJUSTMENT')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-200 text-slate-600 font-semibold"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction History Log */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Inventory Transaction History Log</h3>
        </div>

        {loadingHistory ? (
          <LoadingSpinner message="Fetching history logs..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Quantity</th>
                  <th className="px-4 py-2.5">Reason / Source</th>
                  <th className="px-4 py-2.5">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-500">{formatDate(tx.createdAt)}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{tx.product?.name || 'Product'}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-extrabold uppercase text-[10px] ${
                          tx.type === 'IN'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : tx.type === 'OUT'
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{tx.quantity}</td>
                    <td className="px-4 py-2.5 text-slate-600">{tx.reason}</td>
                    <td className="px-4 py-2.5 text-slate-500">{tx.createdBy?.name || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Transaction Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Stock Transaction: ${selectedProduct?.name}`}
      >
        {selectedProduct && (
          <form onSubmit={handleTxSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">{selectedProduct.name}</p>
              <p className="text-amber-600 font-bold mt-1">Current Stock: {selectedProduct.stock} units</p>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-bold focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="IN">Stock IN (Receive items into warehouse)</option>
                <option value="OUT">Stock OUT (Issue items for sales/job)</option>
                <option value="ADJUSTMENT">Stock ADJUSTMENT (Set explicit count)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">
                {txType === 'ADJUSTMENT' ? 'New Set Stock Count' : 'Quantity to Add/Remove'} *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Reason / Reference Notes *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shipment received, damaged replacement..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
              >
                Record Transaction
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
