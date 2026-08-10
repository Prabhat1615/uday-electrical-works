import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Package } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const inStock = (product.stock ?? 0) > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-premium flex flex-col justify-between group"
    >
      <Link to={`/shop/product/${product._id}`} className="flex flex-col flex-1">
        <div className="h-48 overflow-hidden relative bg-[#F8FAFC] dark:bg-slate-950">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-14 h-14 text-slate-300 dark:text-slate-700" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#FF6B00] text-white font-black text-[10px] uppercase shadow-md">
              {product.brand || 'Uday Electrical'}
            </span>
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-black text-[10px] uppercase">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#0066FF] uppercase">{product.category}</span>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white mt-1 group-hover:text-[#FF6B00] transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-2 line-clamp-2">{product.description}</p>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
            <div>
              {product.mrp > product.price && (
                <span className="text-[10px] text-slate-400 line-through block">MRP: {formatCurrency(product.mrp)}</span>
              )}
              <span className="text-xl font-black text-[#0F172A] dark:text-white">{formatCurrency(product.price)}</span>
              <span className="text-[10px] text-slate-400 block">{inStock ? `In stock · ${product.stock}` : 'Check at shop'}</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                added
                  ? 'bg-[#00C853] text-white'
                  : inStock
                    ? 'bg-[#FF6B00] hover:bg-[#E55A00] text-white shadow-md hover:shadow-glow-orange'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              title={inStock ? 'Add to cart' : 'Currently out of stock'}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              <span>{added ? 'Added' : 'Add'}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
