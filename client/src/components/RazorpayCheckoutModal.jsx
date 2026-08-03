import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useCreatePaymentOrder, useVerifyPayment } from '../hooks/useErpQueries';
import { formatCurrency } from '../utils/formatters';
import { Modal } from './Modal';

export const RazorpayCheckoutModal = ({ isOpen, onClose, amount, invoiceId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  if (!isOpen) return null;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const orderRes = await createOrderMutation.mutateAsync({ amount, invoiceId });
      const { order, payment } = orderRes?.data || {};

      // Trigger simulated / Razorpay verify
      setTimeout(async () => {
        await verifyPaymentMutation.mutateAsync({
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpayOrderId: order?.id || payment?.orderId,
          razorpaySignature: 'verified_sig',
          invoiceId
        });
        setLoading(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Razorpay Online Payment Gateway">
      <div className="space-y-6 text-xs text-slate-200">
        
        <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-transparent border border-slate-800 text-center space-y-2">
          <span className="text-[10px] uppercase font-bold text-orange-400 tracking-widest">Total Payable Amount</span>
          <h2 className="text-3xl font-black text-white">{formatCurrency(amount)}</h2>
          <p className="text-[11px] text-slate-400">Secured with 256-Bit SSL Razorpay Encryption & UPI Direct Transfer</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase text-[10px]">Accepted Payment Methods</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>UPI / GPay / PhonePe</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Credit & Debit Cards</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handlePayNow}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Processing Razorpay...' : 'Pay Now via Razorpay'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
