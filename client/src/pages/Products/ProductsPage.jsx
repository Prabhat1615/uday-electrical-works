import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, ShieldCheck, Tag } from 'lucide-react';
import { useProducts } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);

  const categories = [
    'All Categories',
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
    'All Brands',
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

  const { data: res, isLoading } = useProducts({
    category: selectedCategory === 'All Categories' ? '' : selectedCategory,
    search
  });

  let products = res?.data || [];
  if (selectedBrand && selectedBrand !== 'All Brands') {
    products = products.filter((p) => p.brand === selectedBrand);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">Original Brand Warranted Electricals</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Indian Household Electrical Catalog</h1>
        <p className="text-slate-400 text-sm max-w-3xl">
          Genuine products from Havells, Crompton, Polycab, Philips, Anchor, Finolex, V-Guard, Orient, Syska & Wipro.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by brand, SKU, model name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 text-xs"
            />
          </div>

          {/* Brand Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full md:w-56 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-bold focus:outline-none focus:border-orange-500/50"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-t border-slate-800/80 pt-3">
          {categories.map((cat) => {
            const isSelected = (selectedCategory === '' && cat === 'All Categories') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All Categories' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <LoadingSpinner message="Fetching household electrical catalog..." />
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Package className="w-10 h-10 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No products found matching filters</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              whileHover={{ y: -5 }}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-orange-500/40 transition-colors"
            >
              <div className="h-48 overflow-hidden relative bg-slate-950">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-slate-950 font-black text-[10px] uppercase shadow">
                    {product.brand}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={product.status} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>SKU: {product.sku}</span>
                    <span className="text-blue-400 font-bold">{product.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 group-hover:text-orange-400 transition-colors line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    {product.mrp > product.price && (
                      <span className="text-[10px] text-slate-500 line-through block">MRP: ₹{product.mrp}</span>
                    )}
                    <span className="text-xl font-black text-white">{formatCurrency(product.price)}</span>
                  </div>
                  <button
                    onClick={() => setActiveProduct(product)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    View Specs
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <Modal isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct?.name || 'Product Specs'}>
        {activeProduct && (
          <div className="space-y-5 text-xs">
            <div className="h-52 rounded-2xl overflow-hidden bg-slate-950 relative">
              <img src={activeProduct.imageUrl} alt={activeProduct.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-lg bg-orange-500 text-slate-950 font-black text-xs uppercase">
                  {activeProduct.brand}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-orange-400 font-bold">SKU: {activeProduct.sku}</span>
                <span className="text-slate-500">•</span>
                <span className="text-blue-400 font-bold uppercase">{activeProduct.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{activeProduct.name}</h3>
              <p className="text-slate-300 mt-2 leading-relaxed">{activeProduct.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold uppercase text-slate-400 text-[10px]">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(activeProduct.specifications || {}).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-slate-500 font-semibold">{key}</span>
                    <span className="text-slate-200 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] block">MRP: ₹{activeProduct.mrp}</span>
                <span className="text-2xl font-black text-orange-400">{formatCurrency(activeProduct.price)}</span>
              </div>
              <a
                href="tel:+919876543210"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs shadow-md"
              >
                Inquire & Buy
              </a>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
