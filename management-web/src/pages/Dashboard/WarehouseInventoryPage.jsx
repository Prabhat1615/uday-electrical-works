import React, { useState } from 'react';
import { Boxes, Plus, RefreshCcw, ArrowRightLeft, Building2 } from 'lucide-react';
import { useWarehouses, useCreateWarehouse, useTransferProduct, useProducts } from '../../hooks/useErpQueries';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const WarehouseInventoryPage = () => {
  const [whModalOpen, setWhModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // New Warehouse
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1000);

  // Transfer Form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [fromWhId, setFromWhId] = useState('');
  const [toWhId, setToWhId] = useState('');
  const [transferQty, setTransferQty] = useState(1);

  const { data: whRes, isLoading: loadingWh } = useWarehouses();
  const { data: productsRes } = useProducts();

  const createWhMutation = useCreateWarehouse();
  const transferMutation = useTransferProduct();

  const warehouses = whRes?.data || [];
  const products = productsRes?.data || [];

  const handleCreateWh = async (e) => {
    e.preventDefault();
    try {
      await createWhMutation.mutateAsync({ name, code, location, capacity: Number(capacity) });
      setWhModalOpen(false);
      setName('');
      setCode('');
      setLocation('');
    } catch (err) {
      alert(err.message || 'Failed to create warehouse');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await transferMutation.mutateAsync({
        productId: selectedProductId,
        fromWarehouseId: fromWhId,
        toWarehouseId: toWhId,
        quantity: Number(transferQty)
      });
      setTransferModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to transfer stock');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Multi-Warehouse & Stock Transfers</h1>
          <p className="text-xs text-slate-400">Manage central storage hubs, regional stock points & inter-location material transfers</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTransferModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-800"
          >
            <ArrowRightLeft className="w-4 h-4 text-orange-400" />
            <span>Transfer Stock</span>
          </button>

          <button
            onClick={() => setWhModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Warehouse Location</span>
          </button>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      {loadingWh ? (
        <LoadingSpinner message="Fetching warehouse locations..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warehouses.map((w) => (
            <div key={w._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">{w.code}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{w.name}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-orange-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>Location: {w.location}</p>
                <p>Storage Capacity: {w.capacity} Units</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Warehouse Modal */}
      <Modal isOpen={whModalOpen} onClose={() => setWhModalOpen(false)} title="Register Warehouse Location">
        <form onSubmit={handleCreateWh} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Warehouse Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Central Balanagar Depot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Code (Unique) *</label>
              <input
                type="text"
                required
                placeholder="WH-001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Capacity Units</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Address / Location *</label>
            <input
              type="text"
              required
              placeholder="Balanagar Industrial Zone..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setWhModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
            >
              Save Location
            </button>
          </div>
        </form>
      </Modal>

      {/* Transfer Stock Modal */}
      <Modal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="Inter-Warehouse Stock Transfer">
        <form onSubmit={handleTransfer} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Select Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Source Warehouse *</label>
              <select
                value={fromWhId}
                onChange={(e) => setFromWhId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                required
              >
                <option value="">-- Source --</option>
                {warehouses.map((w) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Destination Warehouse *</label>
              <select
                value={toWhId}
                onChange={(e) => setToWhId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                required
              >
                <option value="">-- Destination --</option>
                {warehouses.map((w) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Transfer Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={transferQty}
              onChange={(e) => setTransferQty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
            >
              Execute Transfer
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
