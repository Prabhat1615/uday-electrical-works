import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Package, Phone, Zap, CheckCircle2, ShieldCheck, Receipt, Store } from 'lucide-react';
import { getProductByIdApi } from '../../api/productApi';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { Seo } from '../../components/Seo';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: res, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdApi(id),
    enabled: !!id
  });

  const product = res?.data;
  const inStock = (product?.stock ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950 px-4 text-center">
        <Package className="w-14 h-14 text-slate-300 dark:text-slate-700" />
        <h1 className="text-xl font-black text-[#0F172A] dark:text-white">Product not found</h1>
        <p className="text-sm text-[#475569] dark:text-slate-400">It may have been removed from the catalog.</p>
        <Link to="/shop" className="px-6 py-3 rounded-2xl bg-[#FF6B00] text-white font-black text-xs hover:bg-[#E55A00] transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  const specs = product.specifications ? Object.entries(product.specifications) : [];

  const handleAdd = () => {
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={`${product.name} — ${formatCurrency(product.price)} | Uday Electrical Works`}
        description={product.description?.slice(0, 160)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#475569] dark:text-slate-400 hover:text-[#FF6B00] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900 shadow-card"
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-[420px] object-cover" />
            ) : (
              <div className="w-full h-[420px] flex items-center justify-center">
                <Package className="w-24 h-24 text-slate-300 dark:text-slate-700" />
              </div>
            )}
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#FF6B00] text-white font-black text-[10px] uppercase shadow-md">
              {product.brand}
            </span>
            {!inStock && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-white text-slate-900 font-black text-xs uppercase">Out of Stock</span>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-[#0066FF] uppercase">{product.category}</span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-1 leading-tight">{product.name}</h1>
              {product.sku && <p className="text-[11px] text-slate-400 mt-1">SKU: {product.sku}</p>}
            </div>

            <div className="flex items-end space-x-3">
              <span className="text-4xl font-black text-[#0F172A] dark:text-white">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <div>
                  <span className="text-sm text-slate-400 line-through block">MRP {formatCurrency(product.mrp)}</span>
                  <span className="text-xs font-black text-[#00C853]">
                    Save {formatCurrency(product.mrp - product.price)}
                  </span>
                </div>
              )}
            </div>

            {product.warranty && (
              <p className="flex items-center space-x-2 text-xs text-[#475569] dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                <span>{product.warranty}</span>
              </p>
            )}

            <p className="text-sm text-[#475569] dark:text-slate-300 leading-relaxed">{product.description}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all shadow-md ${
                  inStock
                    ? 'bg-[#FF6B00] hover:bg-[#E55A00] text-white hover:shadow-glow-orange'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              <button
                onClick={() => { addItem(product, 1); navigate('/cart'); }}
                disabled={!inStock}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs flex items-center space-x-2 transition-all shadow-md ${
                  inStock
                    ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white hover:shadow-glow-blue'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
              <a
                href="tel:7903789402"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center space-x-2 hover:border-[#FF6B00] transition-all"
              >
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span>Call Shop</span>
              </a>
            </div>

            {/* Shop notes */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <p className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-[#FF6B00]" />
                <span>Collect at our Chhota Govindpur shop or ask about delivery.</span>
              </p>
              <p className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-[#0066FF]" />
                <span>GST invoice issued with every purchase.</span>
              </p>
              <p className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                <span>Stock shown is live — if it's out of stock, call us, we restock regularly.</span>
              </p>
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {specs.map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">{key}</span>
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
