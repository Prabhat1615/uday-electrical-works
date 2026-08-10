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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Inventory Control Module</h1>
          <p className="text-xs text-slate-400">Stock In, Stock Out, Manual Adjustments, Current Levels & Audit Logs</p>
        </div>
      </div>

      {/* Stock Levels Table */}
      {loadingProducts ? (
        <LoadingSpinner message="Calculating stock balances..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Current Warehouse Stock</h3>
            <span className="text-xs font-semibold text-slate-400">{products.length} Products Monitored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center space-x-3">
                        <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {p._id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-sky-400">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-white">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4 font-extrabold text-amber-400 text-sm">
                      {p.stock} units
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenTx(p, 'IN')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-slate-950 font-bold transition-all"
                      >
                        + Stock In
                      </button>
                      <button
                        onClick={() => handleOpenTx(p, 'OUT')}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 border border-rose-500/30 text-rose-400 hover:text-slate-950 font-bold transition-all"
                      >
                        - Stock Out
                      </button>
                      <button
                        onClick={() => handleOpenTx(p, 'ADJUSTMENT')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <h3 className="font-bold text-white text-sm">Inventory Transaction History Log</h3>
        </div>

        {loadingHistory ? (
          <LoadingSpinner message="Fetching history logs..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Reason / Source</th>
                  <th className="px-6 py-4">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {history.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-slate-400">{formatDate(tx.createdAt)}</td>
                    <td className="px-6 py-4 font-bold text-white">{tx.product?.name || 'Product'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-extrabold uppercase text-[10px] ${
                          tx.type === 'IN'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.type === 'OUT'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{tx.quantity}</td>
                    <td className="px-6 py-4 text-slate-300">{tx.reason}</td>
                    <td className="px-6 py-4 text-slate-400">{tx.createdBy?.name || 'System'}</td>
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
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="font-bold text-white">{selectedProduct.name}</p>
              <p className="text-amber-400 font-bold mt-1">Current Stock: {selectedProduct.stock} units</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Transaction Type</label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm font-bold focus:outline-none focus:border-amber-500/50"
              >
                <option value="IN">Stock IN (Receive items into warehouse)</option>
                <option value="OUT">Stock OUT (Issue items for sales/job)</option>
                <option value="ADJUSTMENT">Stock ADJUSTMENT (Set explicit count)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                {txType === 'ADJUSTMENT' ? 'New Set Stock Count' : 'Quantity to Add/Remove'} *
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Reason / Reference Notes *</label>
              <input
                type="text"
                required
                placeholder="e.g. Shipment received, damaged replacement..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
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
