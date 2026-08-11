import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, Phone, CheckCircle2, CreditCard, Store, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { Seo } from '../../components/Seo';
import { RazorpayCheckoutModal } from '../../components/RazorpayCheckoutModal';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount, checkout, lastOrder } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState(false);
  const [pendingPayInvoice, setPendingPayInvoice] = useState(null);

  const gstRate = 18;
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const total = subtotal + gstAmount;

  const placeOrder = async (paymentStatus = 'Pending') => {
    setError('');
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    setPlacing(true);
    try {
      const result = await checkout(paymentStatus);
      if (paymentStatus === 'Paid' && result?.invoice) {
        setPendingPayInvoice(result.invoice);
        setPayModal(true);
      }
    } catch (err) {
      setError(err.message || 'Could not place order. Please call the shop at 7903789402.');
    } finally {
      setPlacing(false);
    }
  };

  const order = lastOrder?.salesOrder;
  const invoice = lastOrder?.invoice;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo title="Your Cart | Uday Electrical Works" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {order ? (
          /* Order Confirmation */
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card text-center space-y-5">
            <CheckCircle2 className="w-16 h-16 text-[#00C853] mx-auto" />
            <h1 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">Order Placed!</h1>
            <div className="space-y-2 text-sm text-[#475569] dark:text-slate-300">
              <p>
                Order <strong className="text-[#0F172A] dark:text-white">{order.orderNumber}</strong> is confirmed.
              </p>
              <p>
                {invoice && <>GST invoice <strong className="text-[#0F172A] dark:text-white">{invoice.invoiceNumber}</strong> issued.</>}
              </p>
              <p>
                Total payable: <strong className="text-[#0F172A] dark:text-white">{formatCurrency(invoice?.totalAmount || total)}</strong> (incl. 18% GST)
              </p>
              <p className="text-xs">
                Collect your items at the Chhota Govindpur shop, or we'll call you to arrange delivery.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/dashboard/sales" className="px-6 py-3 rounded-2xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md">
                View My Orders
              </Link>
              <Link to="/shop" className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs hover:border-[#F97316] transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="max-w-xl mx-auto text-center py-20 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-center">
              <ShoppingCart className="w-9 h-9 text-slate-300 dark:text-slate-700" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">Your cart is empty</h1>
            <p className="text-sm text-[#475569] dark:text-slate-400">
              Browse our shop catalog: fans, lights, switches, wires and more.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="px-7 py-3.5 rounded-2xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md hover:shadow-glow-orange">
                Browse Products
              </Link>
              <a href="tel:7903789402" className="px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center space-x-2 hover:border-[#F97316] transition-all">
                <Phone className="w-4 h-4 text-[#F97316]" />
                <span>Call Shop</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">Your Cart</h1>
                <p className="text-sm text-[#475569] dark:text-slate-400 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              </div>
              <Link to="/shop" className="text-xs font-extrabold text-[#F97316] hover:underline flex items-center space-x-1">
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card flex items-center gap-4"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">⚡</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/shop/product/${item.productId}`} className="text-sm font-bold text-[#0F172A] dark:text-white hover:text-[#F97316] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white flex items-center justify-center hover:border-[#F97316] transition-all"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-black text-[#0F172A] dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white flex items-center justify-center hover:border-[#F97316] transition-all"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-black text-[#0F172A] dark:text-white">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card space-y-4 lg:sticky lg:top-24">
                <h2 className="text-base font-black text-[#0F172A] dark:text-white uppercase tracking-wider">Order Summary</h2>

                <div className="space-y-2 text-sm text-[#475569] dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({gstRate}%)</span>
                    <span className="font-bold text-[#0F172A] dark:text-white">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between text-base">
                    <span className="font-black text-[#0F172A] dark:text-white">Total</span>
                    <span className="font-black text-[#F97316]">{formatCurrency(total)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#475569] dark:text-slate-400 leading-relaxed">
                  A GST invoice is generated automatically when you place the order. Order online and
                  collect at the shop, or we'll call you to arrange delivery.
                </p>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="space-y-2.5">
                  <button
                    onClick={() => placeOrder('Pending')}
                    disabled={placing}
                    className="w-full py-3.5 rounded-2xl btn-cta text-sm"
                  >
                    <Store className="w-4 h-4" />
                    <span>{placing ? 'Placing Order...' : 'Place Order - Pay at Shop'}</span>
                  </button>
                  {import.meta.env.DEV ? (
                    <button
                      onClick={() => placeOrder('Paid')}
                      disabled={placing}
                      className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-glow-blue"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Place Order & Pay Online</span>
                    </button>
                  ) : (
                    <p className="text-[11px] text-center text-[#475569] dark:text-slate-400">
                      Online payment is not enabled yet. Pay at the shop on pickup: cash, card or UPI.
                    </p>
                  )}
                </div>

                {!isAuthenticated && (
                  <p className="text-[11px] text-center text-[#475569] dark:text-slate-400">
                    <Link to="/login?redirect=/cart" className="font-black text-orange-500 hover:underline">Sign in</Link> to place
                    your order, your cart is saved.
                  </p>
                )}

                <a href="tel:7903789402" className="block text-center text-[11px] text-[#475569] dark:text-slate-400 hover:text-[#F97316] transition-colors">
                  Prefer to order by phone? Call 7903789402
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {payModal && pendingPayInvoice && (
        <RazorpayCheckoutModal
          isOpen={payModal}
          onClose={() => setPayModal(false)}
          amount={pendingPayInvoice.totalAmount}
          invoiceId={pendingPayInvoice._id}
          onSuccess={() => {
            setPendingPayInvoice(null);
          }}
        />
      )}
    </div>
  );
};
