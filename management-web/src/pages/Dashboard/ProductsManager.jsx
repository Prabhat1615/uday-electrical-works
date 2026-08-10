import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Tag, Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useErpQueries';
import { bulkImportProductsApi } from '../../api/productApi';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const ProductsManager = () => {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'bulk'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Bulk import state
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Havells');
  const [category, setCategory] = useState('Ceiling Fans');
  const [sku, setSku] = useState('');
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { data: res, isLoading, refetch } = useProducts({ search });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = res?.data || [];

  const categories = [
    'Ceiling Fans',
    'Exhaust Fans',
    'Table Fans',
    'Pedestal Fans',
    'LED Bulbs',
    'Tube Lights',
    'Switches',
    'Sockets',
    'Wires',
    'MCBs',
    'Extension Boards',
    'Door Bells',
    'Water Pumps',
    'Geysers',
    'Electrical Accessories'
  ];

  const brands = [
    'Havells',
    'Crompton',
    'Orient',
    'Bajaj',
    'Usha',
    'Philips',
    'Syska',
    'Wipro',
    'Anchor',
    'Goldmedal',
    'GM Modular',
    'RR Kabel',
    'Polycab',
    'Finolex',
    'V-Guard'
  ];

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setName('');
    setBrand('Havells');
    setCategory('Ceiling Fans');
    setSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setMrp(0);
    setPrice(0);
    setStock(10);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60');
    setActiveModal('create');
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setName(p.name);
    setBrand(p.brand || 'Havells');
    setCategory(p.category);
    setSku(p.sku || `SKU-${Date.now().toString().slice(-6)}`);
    setMrp(p.mrp || p.price);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setActiveModal('edit');
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    setBulkLoading(true);
    setBulkResult('');
    try {
      // Parse CSV or JSON lines
      let itemsToImport = [];
      if (bulkCsvText.trim().startsWith('[') || bulkCsvText.trim().startsWith('{')) {
        itemsToImport = JSON.parse(bulkCsvText);
      } else {
        const lines = bulkCsvText.split('\n').filter((l) => l.trim().length > 0);
        // Header line expected: Name,Brand,Category,SKU,MRP,Price,Stock,Warranty
        const hasHeader = lines[0].toLowerCase().includes('name');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        itemsToImport = dataLines.map((line) => {
          const parts = line.split(',').map((p) => p.trim());
          return {
            name: parts[0] || 'Bulk Product',
            brand: parts[1] || 'Havells',
            category: parts[2] || 'Electrical Accessories',
            sku: parts[3] || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
            mrp: Number(parts[4] || 0),
            price: Number(parts[5] || 0),
            stock: Number(parts[6] || 10),
            warranty: parts[7] || '1 Year Warranty'
          };
        });
      }

      const res = await bulkImportProductsApi(itemsToImport);
      setBulkResult(`✅ ${res.data?.message || 'Bulk products imported successfully!'}`);
      refetch();
    } catch (err) {
      setBulkResult(`❌ Import failed: ${err.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'create') {
        await createMutation.mutateAsync({
          name,
          brand,
          category,
          sku,
          mrp: Number(mrp),
          price: Number(price),
          stock: Number(stock),
          description,
          imageUrl
        });
      } else {
        await updateMutation.mutateAsync({
          id: selectedProduct._id,
          data: {
            name,
            brand,
            category,
            sku,
            mrp: Number(mrp),
            price: Number(price),
            stock: Number(stock),
            description,
            imageUrl
          }
        });
      }
      setActiveModal(null);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete product item?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Household Electrical Product Master</h1>
          <p className="text-xs text-slate-400">Manage real brand SKU inventory, selling prices, MRP, stock levels & CSV bulk imports</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveModal('bulk')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV / Bulk Import</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product SKU</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner message="Loading products inventory..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Brand / Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">MRP</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-orange-400 uppercase">{p.brand || 'Havells'}</span>
                        <p className="font-bold text-white text-xs">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-300">{p.category}</td>
                    <td className="px-6 py-4 font-mono text-sky-400">{p.sku}</td>
                    <td className="px-6 py-4 text-slate-500 line-through">₹{p.mrp || p.price}</td>
                    <td className="px-6 py-4 font-bold text-white text-sm">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4 font-bold text-amber-400">{p.stock} Units</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(p)} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      <Modal isOpen={activeModal === 'bulk'} onClose={() => setActiveModal(null)} title="Bulk Import Products (CSV / Excel)">
        <form onSubmit={handleBulkImport} className="space-y-4 text-xs">
          <p className="text-slate-400 leading-relaxed">
            Paste CSV formatted text or JSON array to bulk upload household products into inventory.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
            <span className="text-orange-400 font-bold block">CSV Format Sample:</span>
            <code>Name,Brand,Category,SKU,MRP,Price,Stock,Warranty</code><br/>
            <code>Havells Fan,Havells,Ceiling Fans,HAV-101,3500,2999,20,2 Years Warranty</code>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">CSV / JSON Text Content *</label>
            <textarea
              rows={6}
              required
              placeholder="Paste CSV rows or JSON array..."
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-orange-500/50"
            />
          </div>

          {bulkResult && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              {bulkResult}
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={bulkLoading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{bulkLoading ? 'Importing...' : 'Start Bulk Import'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Create / Edit Modal */}
      <Modal isOpen={activeModal === 'create' || activeModal === 'edit'} onClose={() => setActiveModal(null)} title={activeModal === 'create' ? 'Create Product SKU' : 'Edit Product Details'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Product Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50 font-bold text-orange-400"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sky-400 font-mono text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">MRP (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Product Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
            >
              Save Product SKU
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
