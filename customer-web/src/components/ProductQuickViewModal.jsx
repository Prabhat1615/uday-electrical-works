import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Zap, 
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const ProductQuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              title="Close Quick View"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
              {/* Product Photo Showcase (Left 5 cols) */}
              <div className="md:col-span-5 flex flex-col justify-center items-center bg-slate-950/60 p-4 rounded-2xl relative min-h-[260px] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-56 max-w-full object-contain transition-transform duration-300 hover:scale-110"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#D6A84F] text-[#111318] font-extrabold text-[11px] uppercase tracking-wider shadow-xs font-display">
                  {product.brand}
                </span>
              </div>

              {/* Product Info & Actions (Right 7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-extrabold text-[#D6A84F] uppercase tracking-wider font-display">
                      {product.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center text-[11px] font-bold text-[#3FAE72] gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock at Chhota Govindpur
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#111318] tracking-tight font-display">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                    {product.description || 'Genuine branded electrical item supplied directly from authorized distribution channels with manufacturer warranty and GST invoice.'}
                  </p>
                </div>

                {/* Price Box */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6EC] border border-[#E7C878] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider block font-display">Store Price</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#111318] font-mono">
                        {formatCurrency(product.price)}
                      </span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-slate-400 line-through font-mono">
                          MRP: {formatCurrency(product.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                  {product.mrp > product.price && (
                    <span className="px-2.5 py-1 rounded-md bg-[#F0FDF4] text-[#3FAE72] font-extrabold text-xs border border-[#BBF7D0]">
                      Save {formatCurrency(product.mrp - product.price)}
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-[#111318] font-display">Quantity:</span>
                  <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-slate-50 p-1 space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold font-mono px-2 text-[#111318]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-200 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`px-4 py-3 rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 font-display ${
                      added
                        ? 'bg-[#3FAE72] text-white'
                        : 'bg-[#D6A84F] hover:bg-[#C99532] text-[#111318]'
                    }`}
                  >
                    {added ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="px-4 py-3 rounded-xl bg-[#171A1F] hover:bg-[#22262D] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 font-display border border-slate-700"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
                  </button>
                </div>

                {/* Guarantee Badges */}
                <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    Official Brand Warranty
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#0284C7]" />
                    Store Pickup / Delivery
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
