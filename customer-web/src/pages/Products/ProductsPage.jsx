import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, ShieldCheck, Tag, Filter, ChevronLeft, ChevronRight, CheckCircle2, Phone, ShoppingCart, Sparkles, Award } from 'lucide-react';
import { useProducts } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { AnimatedSection } from '../../components/AnimatedSection';
import { SpotlightCard } from '../../components/SpotlightCard';

export const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeProduct, setActiveProduct] = useState(null);
  const itemsPerPage = 9;

  const categories = [
    'All',
    'Ceiling Fans',
    'Exhaust Fans',
    'LED Bulbs',
    'LED Battens',
    'Switches',
    'Sockets',
    'Modular Accessories',
    'Table Fans',
    'Pedestal Fans',
    'Tube Lights',
    'Wires',
    'MCBs',
    'Extension Boards',
    'Door Bells',
    'Water Pumps',
    'Geysers',
    'Electrical Accessories'
  ];

  const brands = [
    'All',
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
    'Polycab',
    'RR Kabel',
    'Finolex',
    'V-Guard'
  ];

  const { data: res, isLoading } = useProducts({ search });

  const filteredProducts = useMemo(() => {
    let list = res?.data || [];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase();
        const sCat = selectedCategory.toLowerCase();
        return pCat.includes(sCat) || sCat.includes(pCat);
      });
    }

    if (selectedBrand !== 'All') {
      list = list.filter((p) => {
        if (!p.brand) return false;
        return p.brand.toLowerCase().includes(selectedBrand.toLowerCase());
      });
    }

    return list;
  }, [res, selectedCategory, selectedBrand]);

  // Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header Banner */}
      <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            <span>100% Genuine Brand Warranted Stock</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            Household Electrical Catalog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl font-medium">
            Explore original Havells, Crompton, Polycab, Philips, Anchor, Finolex, V-Guard, Syska & Wipro products available at our Chhota Govindpur store.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3 text-xs hover:shadow-card transition-shadow">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white block">Official Factory Warranty</span>
            <span className="text-slate-500 text-[10px]">Instant Store Billing & GST Receipt</span>
          </div>
        </div>
      </AnimatedSection>

      {/* Filter & Search Console */}
      <AnimatedSection direction="up" delay={0.05}>
        <div className="space-y-4 bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card backdrop-blur-2xl hover:shadow-card-hover transition-shadow">
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, SKU, product name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Brand Filter Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Brand Filter:</span>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandSelect(e.target.value)}
              className="w-full md:w-56 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-orange-500"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b === 'All' ? 'All Brands (Havells, Crompton...)' : b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-t border-slate-200 dark:border-slate-800 pt-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-orange-500 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        </div>
      </AnimatedSection>

      {/* Product Grid & States */}
      {isLoading ? (
        <LoadingSpinner message="Fetching Jamshedpur store products..." />
      ) : paginatedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <Package className="w-12 h-12 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No products found matching filters</h3>
          <p className="text-xs text-slate-500">Try changing the category, brand, or search terms.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs shadow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {paginatedProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <SpotlightCard className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card transition-shadow hover:shadow-card-hover flex flex-col justify-between group">
                  <div className="h-52 overflow-hidden relative bg-slate-100 dark:bg-slate-950">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-black text-[10px] uppercase shadow-md">
                        {product.brand}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={product.status} />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>SKU: {product.sku}</span>
                        <span className="text-blue-600 font-bold uppercase">{product.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-orange-500 transition-colors line-clamp-2 font-display">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-400 line-through block">MRP: ₹{product.mrp}</span>
                        )}
                        <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
                      </div>

                      <button
                        onClick={() => setActiveProduct(product)}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-all"
                      >
                        View Specs & Buy
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Details Specs Modal */}
      <Modal isOpen={!!activeProduct} onClose={() => setActiveProduct(null)} title={activeProduct?.name || 'Product Details'}>
        {activeProduct && (
          <div className="space-y-5 text-xs">
            <div className="h-56 rounded-2xl overflow-hidden bg-slate-950 relative">
              <img src={activeProduct.imageUrl} alt={activeProduct.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-lg bg-orange-500 text-slate-950 font-black text-xs uppercase">
                  {activeProduct.brand}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-orange-500 font-bold">SKU: {activeProduct.sku}</span>
                <span className="text-slate-400">•</span>
                <span className="text-blue-500 font-bold uppercase">{activeProduct.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeProduct.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{activeProduct.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold uppercase text-slate-400 text-[10px]">Technical Specifications</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(activeProduct.specifications || {}).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-slate-500 font-semibold">{key}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] block">MRP: ₹{activeProduct.mrp}</span>
                <span className="text-2xl font-black text-orange-500">{formatCurrency(activeProduct.price)}</span>
              </div>
              <a
                href="tel:7903789402"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-md flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store to Buy (7903789402)</span>
              </a>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
