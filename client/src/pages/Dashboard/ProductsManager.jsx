import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const ProductsManager = () => {
  const [search, setSearch] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const { data: res, isLoading } = useProducts({ search });
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = res?.data || [];

  const categories = [
    'Ceiling Fans',
    'Exhaust Fans',
    'Wall & Pedestal Fans',
    'LED Bulbs & Battens',
    'Modular Switches & Sockets',
    'Wires & Cables',
    'MCBs & DB Boxes',
    'Water Heaters & Geysers',
    'Voltage Stabilizers',
    'Iron & Home Appliances'
  ];

  const brands = [
    'Havells',
    'Crompton',
    'Orient Electric',
    'Bajaj',
    'Usha',
    'Anchor',
    'Polycab',
    'Finolex',
    'RR Kabel',
    'Syska',
    'Wipro',
    'Philips',
    'Goldmedal',
    'GM Modular',
    'V-Guard'
  ];

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setName('');
    setBrand('Havells');
    setCategory('Ceiling Fans');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setMrp(0);
    setPrice(0);
    setStock(10);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=60');
    setActiveModal('create');
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setName(p.name);
    setBrand(p.brand || 'Havells');
    setCategory(p.category);
    setSku(p.sku || `SKU-${Date.now().toString().slice(-4)}`);
    setMrp(p.mrp || p.price);
    setPrice(p.price);
    setStock(p.stock);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setActiveModal('edit');
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
          <p className="text-xs text-slate-400">Manage real brand SKU inventory, selling prices, MRP & stock levels</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product SKU</span>
        </button>
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

      {/* Modal */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal === 'create' ? 'Create Product SKU' : 'Edit Product Details'}>
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
