import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Package, Heart, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency, getProductImages } from '../utils/formatters';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const inStock = (product.stock ?? 0) > 0;

  const productImgs = getProductImages(product);
  const currentImg = productImgs[activeImgIndex] || productImgs[0] || product.imageUrl;

  // Auto-slide images on mouse hover over small product card
  useEffect(() => {
    if (!isHovered || productImgs.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % productImgs.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [isHovered, productImgs.length]);

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

  const handlePrevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + productImgs.length) % productImgs.length);
  };

  const handleNextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % productImgs.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveImgIndex(0); }}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <Link to={`/shop/product/${product._id}`} className="flex flex-col flex-1">
        {/* Product Image Container */}
        <div className="relative h-32 sm:h-44 w-full p-2.5 sm:p-3 bg-white dark:bg-white flex items-center justify-center overflow-hidden border-b border-slate-100">
          {currentImg && !imgErrors[activeImgIndex] ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImgIndex}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.2 }}
                src={currentImg}
                alt={`${product.brand} ${product.name}`}
                onError={() => setImgErrors((prev) => ({ ...prev, [activeImgIndex]: true }))}
                loading="lazy"
                className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-1">
              <Package className="w-9 h-9 text-[#F97316]" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Electrical Product</span>
            </div>
          )}

          {/* Brand Tag */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
            <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white font-extrabold text-[9px] uppercase tracking-wider backdrop-blur-md shadow-sm">
              {product.brand || 'Uday Electrical'}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#F97316] text-white font-extrabold text-[9px] tracking-wide shadow-sm">
                -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist & Image Count Indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            {productImgs.length > 1 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-900/80 text-amber-400 font-extrabold text-[9px] backdrop-blur-md shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{activeImgIndex + 1}/{productImgs.length}</span>
              </span>
            )}
            <button
              onClick={handleWishlist}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${isWishlisted
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white/90 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:scale-110'
                }`}
              title="Wishlist product"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Next / Prev Arrow Buttons on Hover */}
          {productImgs.length > 1 && isHovered && (
            <>
              <button
                type="button"
                onClick={handlePrevImg}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xs opacity-90 hover:opacity-100 hover:scale-110 transition-all z-20"
                title="Previous Image"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextImg}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xs opacity-90 hover:opacity-100 hover:scale-110 transition-all z-20"
                title="Next Image"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Dots Indicator on Card */}
          {productImgs.length > 1 && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-xs z-10">
              {productImgs.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${activeImgIndex === idx ? 'w-3.5 bg-[#F97316]' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                  title={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hover Quick View Overlay */}
          {!isHovered && (
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-[#F97316] px-3 py-1 rounded-md shadow-sm font-display tracking-wide">
                <Eye className="w-3 h-3" />
                View Product
              </span>
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center z-30">
              <span className="px-3 py-1 rounded-lg bg-rose-500/90 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[9px] font-bold text-[#F97316] uppercase tracking-wider mb-1">
              <span>{product.category || 'Electrical'}</span>
              {inStock && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#F97316] transition-colors line-clamp-1 font-display">
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
              className={`px-3 py-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm font-display min-h-[44px] sm:min-h-0 shrink-0 ${added
                  ? 'bg-emerald-500 text-white'
                  : inStock
                    ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md shadow-[#F97316]/20 hover:scale-102'
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
