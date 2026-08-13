import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Package, 
  Phone, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt, 
  Store,
  Maximize2,
  X,
  Eye,
  Sparkles
} from 'lucide-react';
import { getProductByIdApi } from '../../api/productApi';
import { formatCurrency, getProductImages } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { Seo } from '../../components/Seo';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { getBrandMeta } from '../../../../shared/src/data/brandsData';

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
  
  // Gallery State
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [failedImgs, setFailedImgs] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const brandMeta = getBrandMeta(product?.brand);
  const productImgs = getProductImages(product);

  // Special Auto-Slide Effect when cursor is pointed/hovered on the main product image
  useEffect(() => {
    if (!isHovered || productImgs.length <= 1 || lightboxOpen) return;

    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % productImgs.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isHovered, productImgs.length, lightboxOpen]);

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
        <h1 className="text-xl font-black text-slate-900 dark:text-white font-display">Product Not Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">The product may have been removed or updated.</p>
        <Link to="/shop" className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-black text-xs hover:bg-amber-600 transition-all shadow-md font-display">
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const specs = product.specifications ? Object.entries(product.specifications) : [];
  const currentImg = productImgs[activeImgIndex] || productImgs[0];

  const handleAdd = () => {
    addItem(product, 1);
  };

  const handleNextImg = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % productImgs.length);
  };

  const handlePrevImg = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + productImgs.length) % productImgs.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={`${product.brand} ${product.name} - ${formatCurrency(product.price)} | Uday Electrical Works`}
        description={`${product.brand} ${product.name} available at Uday Electrical Works, Jamshedpur. ${product.description?.slice(0, 140)}`}
      />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Interactive Product Gallery */}
          <div className="space-y-4">
            
            {/* Main Product Image View Box with Hover Auto-Slide & Click Zoom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 sm:p-8 flex items-center justify-center min-h-[360px] sm:min-h-[440px] shadow-card cursor-pointer"
            >
              {currentImg && !failedImgs[activeImgIndex] ? (
                <motion.img
                  key={activeImgIndex}
                  initial={{ opacity: 0.3, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={currentImg}
                  alt={`${product.brand} ${product.name} view ${activeImgIndex + 1}`}
                  onError={() => setFailedImgs((prev) => ({ ...prev, [activeImgIndex]: true }))}
                  onClick={() => setLightboxOpen(true)}
                  className="max-h-[380px] max-w-full object-contain filter drop-shadow-md group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400 dark:text-slate-600 space-y-2">
                  <Package className="w-20 h-20 text-amber-500/80" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-display">
                    Electrical Product Image
                  </span>
                </div>
              )}

              {/* Hover Auto-Slide Animated Badge */}
              {isHovered && productImgs.length > 1 && (
                <div className="absolute top-4 right-14 px-3 py-1.5 rounded-full bg-[#F97316]/90 text-white font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>Auto-Sliding</span>
                </div>
              )}

              {/* Fullscreen Expand Button */}
              {currentImg && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                  className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#F97316] shadow-sm backdrop-blur-md transition-all hover:scale-110"
                  title="Click to expand full screen view"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {/* Next / Prev Arrow Navigation Controls */}
              {productImgs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md opacity-90 hover:opacity-100 hover:scale-110 transition-all z-10"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md opacity-90 hover:opacity-100 hover:scale-110 transition-all z-10"
                    title="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots pagination indicator at bottom */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md z-10">
                    {productImgs.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActiveImgIndex(idx); }}
                        className={`h-2 rounded-full transition-all ${
                          activeImgIndex === idx ? 'w-5 bg-[#F97316]' : 'w-2 bg-white/50 hover:bg-white'
                        }`}
                        title={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Official Brand Logo Badge */}
              {brandMeta?.logo ? (
                <div className="absolute top-4 left-4 px-3 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm flex items-center gap-2">
                  <img src={brandMeta.logo} alt={`${product.brand} logo`} className="h-5 w-auto object-contain" />
                  <span className="text-xs font-black text-slate-900 dark:text-white font-display">{product.brand}</span>
                </div>
              ) : (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                  {product.brand}
                </span>
              )}

              {!inStock && (
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl">
                    Currently Out of Stock
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Row Controls */}
            {productImgs.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
                {productImgs.map((imgUrl, idx) => {
                  const isActive = activeImgIndex === idx;
                  const isFailed = failedImgs[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative h-20 w-20 rounded-2xl p-2 border-2 transition-all flex items-center justify-center overflow-hidden shrink-0 ${
                        isActive
                          ? 'border-[#F97316] ring-4 ring-[#F97316]/20 bg-white dark:bg-slate-900 shadow-md scale-105'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                      title={`Click to view image ${idx + 1}`}
                    >
                      {!isFailed ? (
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          onError={() => setFailedImgs((prev) => ({ ...prev, [idx]: true }))}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                      {isActive && (
                        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {product.category}
                </span>
                {inStock ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display leading-tight">
                {product.name}
              </h1>
              {product.sku && <p className="text-xs font-mono text-slate-400 mt-1">SKU: {product.sku}</p>}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <div className="space-x-2">
                  <span className="text-sm text-slate-400 line-through">
                    MRP: {formatCurrency(product.mrp)}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Save {formatCurrency(product.mrp - product.price)}
                  </span>
                </div>
              )}
            </div>

            {product.warranty && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Manufacturer Warranty: {product.warranty}</span>
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs font-display ${
                  inStock
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 hover:scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

              <button
                onClick={() => { addItem(product, 1); navigate('/cart'); }}
                disabled={!inStock}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs font-display ${
                  inStock
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Instant Checkout</span>
              </button>

              <a
                href="tel:7903789402"
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 hover:border-amber-500 transition-all font-display"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Call Store</span>
              </a>
            </div>

            {/* Shop features */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Buy at our Chhota Govindpur shop or order online for store pickup / local delivery.</span>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Official GST invoice provided with every purchase for warranty claims.</span>
              </div>
            </div>

            {/* Specifications Table */}
            {specs.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-display">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {specs.map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">{key}</span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-between overflow-hidden"
          >
            {/* Top Toolbar */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white z-10">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-[#F97316] font-display">{product.brand}</span>
                <span className="text-xs text-slate-400">• {product.name}</span>
                <span className="text-xs text-slate-500">({activeImgIndex + 1} of {productImgs.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close fullscreen view"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Lightbox Image View */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex-1 w-full max-w-5xl flex items-center justify-center p-4"
            >
              {currentImg && !failedImgs[activeImgIndex] ? (
                <motion.img
                  key={activeImgIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={currentImg}
                  alt={`${product.name} fullscreen view ${activeImgIndex + 1}`}
                  className="max-h-[75vh] max-w-full object-contain filter drop-shadow-2xl rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-500 space-y-2">
                  <Package className="w-20 h-20" />
                  <span className="text-sm font-bold">Image unavailable</span>
                </div>
              )}

              {/* Lightbox Next/Prev Arrows */}
              {productImgs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {productImgs.length > 1 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 overflow-x-auto py-2 z-10"
              >
                {productImgs.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-16 w-16 rounded-xl p-1.5 border-2 transition-all flex items-center justify-center overflow-hidden shrink-0 ${
                      activeImgIndex === idx
                        ? 'border-[#F97316] ring-2 ring-[#F97316]/50 bg-slate-900 scale-105'
                        : 'border-slate-700 bg-slate-900/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Lightbox thumb ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
