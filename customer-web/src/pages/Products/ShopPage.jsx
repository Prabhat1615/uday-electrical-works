import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Package, Phone } from 'lucide-react';
import { useProducts } from '../../hooks/useErpQueries';
import { ProductCard } from '../../components/ProductCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { Seo } from '../../components/Seo';

const ALL_CATEGORIES = [
  'Ceiling Fans',
  'Exhaust Fans',
  'Wall & Pedestal Fans',
  'LED Bulbs & Battens',
  'Modular Switches & Sockets',
  'MCBs & DB Boxes',
  'Wires & Cables',
  'Voltage Stabilizers',
  'Water Heaters & Geysers',
  'Home Appliances'
];

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: productsRes, isLoading } = useProducts({ category: category || undefined, search: search || undefined });
  const products = productsRes?.data || [];

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))], [products]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (brand) list = list.filter((p) => p.brand === brand);
    if (inStockOnly) list = list.filter((p) => (p.stock ?? 0) > 0);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [products, brand, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={category ? `${category} in Jamshedpur | Uday Electrical Works Shop` : 'Shop Electricals | Uday Electrical Works, Jamshedpur'}
        description="Buy genuine Havells, Crompton, Polycab, Philips & Anchor fans, lights, switches, wires, MCBs and geysers from our shop in Chhota Govindpur, Jamshedpur. Call 7903789402."
      />

      {/* Page Header */}
      <div className="relative bg-gradient-to-b from-[#F8FAFC] to-white dark:from-slate-900 dark:to-slate-950 border-b border-[#E2E8F0] dark:border-slate-800 section-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">In-Store Catalog</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-display">
              {category || 'Shop Electrical Products'}
            </h1>
            <p className="text-sm text-[#475569] dark:text-slate-400 max-w-2xl mx-auto">
              Everything for your home — fans, lights, switches, wires & more. Buy from the shop in
              Chhota Govindpur or book online and collect at the counter.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fans, bulbs, wires, switches..."
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 shadow-card transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600" title="Clear search">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setParam('category', '')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              !category
                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/25'
                : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
            }`}
          >
            All Products
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setParam('category', cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                category === cat
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-[#FF6B00]/25'
                  : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#475569] dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          <select
            value={brand}
            onChange={(e) => setParam('brand', e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00]"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00]"
          >
            <option value="featured">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <label className="flex items-center space-x-2 text-xs font-bold text-[#475569] dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#FF6B00]"
            />
            <span>In Stock Only</span>
          </label>

          <span className="ml-auto text-xs font-bold text-[#475569] dark:text-slate-400">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Package className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-black text-[#0F172A] dark:text-white">No products match your filters</h3>
            <p className="text-sm text-[#475569] dark:text-slate-400">
              Try a different category or search — or call the shop, we may have it in stock.
            </p>
            <a
              href="tel:7903789402"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md hover:shadow-glow-orange"
            >
              <Phone className="w-4 h-4" />
              <span>Call Shop: 7903789402</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, idx) => (
              <ProductCard key={product._id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
