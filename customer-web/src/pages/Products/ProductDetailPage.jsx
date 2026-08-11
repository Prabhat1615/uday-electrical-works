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
  const [imgError, setImgError] = React.useState(false);
  const brandMeta = getBrandMeta(product?.brand);

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

  const handleAdd = () => {
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={`${product.brand} ${product.name} - ${formatCurrency(product.price)} | Uday Electrical Works`}
        description={`${product.brand} ${product.name} available at Uday Electrical Works, Jamshedpur. ${product.description?.slice(0, 140)}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Verified Product Image Container with object-contain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-card"
          >
            {product.imageUrl && !imgError ? (
              <img
                src={product.imageUrl}
                alt={`${product.brand} ${product.name}`}
                onError={() => setImgError(true)}
                className="max-h-[380px] max-w-full object-contain filter drop-shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400 dark:text-slate-600 space-y-2">
                <Package className="w-20 h-20 text-amber-500/80" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-display">Electrical Product</span>
              </div>
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

          {/* Details Column */}
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
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`px-7 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md font-display ${
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
                className={`px-7 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md font-display ${
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
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 hover:border-amber-500 transition-all font-display"
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
    </div>
  );
};
