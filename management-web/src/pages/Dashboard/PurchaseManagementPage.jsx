import React, { useState } from 'react';
import { Truck, Plus, PackageCheck, CheckCircle2, FileText, Building2 } from 'lucide-react';
import { 
  useSuppliers, 
  useCreateSupplier, 
  usePurchaseOrders, 
  useCreatePurchaseOrder, 
  useUpdatePurchaseOrderStatus, 
  useProducts 
} from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const PurchaseManagementPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'suppliers'
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);

  // New Supplier Form
  const [supName, setSupName] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supAddress, setSupAddress] = useState('');
  const [supGst, setSupGst] = useState('');

  // New PO Form
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const { data: suppliersRes, isLoading: loadingSuppliers } = useSuppliers();
  const { data: posRes, isLoading: loadingPOs } = usePurchaseOrders();
  const { data: productsRes } = useProducts();

  const createSupplierMutation = useCreateSupplier();
  const createPOMutation = useCreatePurchaseOrder();
  const updatePOStatusMutation = useUpdatePurchaseOrderStatus();

  const suppliers = suppliersRes?.data || [];
  const purchaseOrders = posRes?.data || [];
  const products = productsRes?.data || [];

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await createSupplierMutation.mutateAsync({
        name: supName,
        phone: supPhone,
        email: supEmail,
        address: supAddress,
        gstNumber: supGst
      });
      setSupplierModalOpen(false);
      setSupName('');
      setSupPhone('');
      setSupEmail('');
      setSupAddress('');
      setSupGst('');
    } catch (err) {
      alert(err.message || 'Failed to create supplier');
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId || !selectedProductId) {
      alert('Please select a supplier and a product');
      return;
    }

    try {
      await createPOMutation.mutateAsync({
        supplierId: selectedSupplierId,
        items: [{ productId: selectedProductId, quantity: Number(quantity), unitPrice: Number(unitPrice) }],
        status: 'Ordered'
      });
      setPoModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create Purchase Order');
    }
  };

  const handleStatusChange = async (poId, status) => {
    if (status === 'Received' && !window.confirm('Marking PO as RECEIVED will automatically add items to your warehouse inventory stock. Proceed?')) {
      return;
    }
    try {
      await updatePOStatusMutation.mutateAsync({ id: poId, data: { status } });
    } catch (err) {
      alert(err.message || 'Failed to update PO status');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Purchase Orders & Procurement</h1>
          <p className="text-xs text-slate-500">Manage raw copper, transformer oil, motor components & supplier directory</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSupplierModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100"
          >
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Add Supplier</span>
          </button>

          <button
            onClick={() => setPoModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'suppliers'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {/* Orders View */}
      {activeTab === 'orders' && (
        loadingPOs ? (
          <LoadingSpinner message="Loading procurement records..." />
        ) : purchaseOrders.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
            <Truck className="w-10 h-10 text-amber-500/50 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Purchase Orders Issued</h3>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">PO Number</th>
                    <th className="px-4 py-2.5">Supplier</th>
                    <th className="px-4 py-2.5">Total Amount</th>
                    <th className="px-4 py-2.5">Date Issued</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseOrders.map((po) => (
                    <tr key={po._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono font-bold text-amber-600">{po.poNumber}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{po.supplier?.name || 'Supplier'}</td>
                      <td className="px-4 py-2.5 font-extrabold text-slate-900 text-sm">{formatCurrency(po.totalAmount)}</td>
                      <td className="px-4 py-2.5 text-slate-500">{formatDate(po.createdAt)}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={po.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right space-x-2">
                        {po.status !== 'Received' && (
                          <button
                            onClick={() => handleStatusChange(po._id, 'Received')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-600 hover:text-white font-bold transition-all"
                          >
                            Mark Received (+Stock)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Suppliers View */}
      {activeTab === 'suppliers' && (
        loadingSuppliers ? (
          <LoadingSpinner message="Fetching suppliers..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((s) => (
              <div key={s._id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                  <span className="text-[10px] font-mono text-sky-600 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    GST: {s.gstNumber || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Phone: {s.phone}</p>
                  <p>Email: {s.email || 'N/A'}</p>
                  <p>Address: {s.address}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add Supplier Modal */}
      <Modal isOpen={supplierModalOpen} onClose={() => setSupplierModalOpen(false)} title="Register Supplier">
        <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Supplier Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Siemens India Industrial Spares"
              value={supName}
              onChange={(e) => setSupName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={supPhone}
                onChange={(e) => setSupPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">GSTIN Number</label>
              <input
                type="text"
                placeholder="36AAAAA0000A1Z5"
                value={supGst}
                onChange={(e) => setSupGst(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Address</label>
            <textarea
              rows={2}
              value={supAddress}
              onChange={(e) => setSupAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setSupplierModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Purchase Order Modal */}
      <Modal isOpen={poModalOpen} onClose={() => setPoModalOpen(false)} title="Issue Purchase Order">
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Select Supplier *</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            >
              <option value="">Choose Supplier...</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Product to Order *</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                const pId = e.target.value;
                setSelectedProductId(pId);
                const found = products.find((p) => p._id === pId);
                if (found) setUnitPrice(found.price);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              required
            >
              <option value="">Select Inventory Product...</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name} (Current Stock: {p.stock})</option>
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
              <label className="block text-slate-600 font-bold uppercase mb-1">Unit Cost Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-slate-500 block">Total Calculated PO Cost:</span>
            <span className="text-lg font-black text-amber-600">{formatCurrency(Number(quantity) * Number(unitPrice))}</span>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setPoModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
            >
              Dispatch PO
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
