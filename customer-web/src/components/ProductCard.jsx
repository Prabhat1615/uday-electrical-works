import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Package, Heart, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const inStock = (product.stock ?? 0) > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <Link to={`/shop/product/${product._id}`} className="flex flex-col flex-1">
        {/* Product Image Container with object-contain to avoid cropping electrical items */}
        <div className="relative h-32 sm:h-36 w-full p-2.5 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={`${product.brand} ${product.name}`}
              onError={() => setImgError(true)}
              loading="lazy"
              className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-1">
              <Package className="w-8 h-8 text-amber-500/80" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Electrical Product</span>
            </div>
          )}

          {/* Brand Tag */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-extrabold text-[9px] uppercase tracking-wider backdrop-blur-md shadow-sm">
              {product.brand || 'Uday Electrical'}
            </span>
          </div>

          {/* Wishlist Toggle Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:scale-110'
            }`}
            title="Wishlist product"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Hover View Details Quick Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-amber-500/90 px-2.5 py-1 rounded-md shadow-sm font-display">
              <Eye className="w-3 h-3" />
              View Details
            </span>
          </div>

          {!inStock && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3 py-1 rounded-lg bg-rose-500/90 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card Content Details */}
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <span>{product.category || 'Electrical'}</span>
              {inStock && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  In Stock ({product.stock})
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1 font-display">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              {product.mrp > product.price && (
                <span className="text-[9px] text-slate-400 line-through block">
                  MRP: {formatCurrency(product.mrp)}
                </span>
              )}
              <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                {formatCurrency(product.price)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm font-display ${
                added
                  ? 'bg-emerald-500 text-white'
                  : inStock
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 hover:scale-102'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              title={inStock ? 'Add to cart' : 'Out of stock'}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              <span>{added ? 'Added!' : 'Add'}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
