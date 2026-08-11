import React from 'react';
import { ShoppingBag, FileText, Inbox } from 'lucide-react';
import { useSalesOrders } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SalesManagementPage = () => {
  const { data: salesRes, isLoading: loadingSales } = useSalesOrders();

  const salesOrders = salesRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">My Orders</h1>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-1">
            Products you've purchased from the shop, with their GST invoice status.
          </p>
        </div>
        <span className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#FFF7ED] dark:bg-slate-900 border border-[#FFEDD5] dark:border-slate-800 text-[#F97316] text-xs font-black shrink-0">
          <ShoppingBag className="w-4 h-4" />
          <span>{salesOrders.length} Order{salesOrders.length === 1 ? '' : 's'}</span>
        </span>
      </div>

      {/* Orders list */}
      {loadingSales ? (
        <LoadingSpinner message="Loading your orders..." />
      ) : salesOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">No orders yet</h3>
          <p className="text-xs text-[#475569] dark:text-slate-400">
            Shop for electrical products and your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {salesOrders.map((so) => (
            <div
              key={so._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-mono text-xs font-bold text-[#F97316]">{so.orderNumber}</p>
                  <p className="text-[11px] text-[#475569] dark:text-slate-400">
                    {formatDate(so.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={so.paymentStatus} />
                  <p className="text-base font-black text-[#0F172A] dark:text-white">
                    {formatCurrency(so.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl overflow-hidden">
                {(so.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F8FAFC] dark:bg-slate-950">
                    <div className="flex items-center space-x-3 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Qty {item.quantity} × {formatCurrency(item.unitPrice ?? item.price ?? 0)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-[#0F172A] dark:text-white shrink-0">
                      {formatCurrency((item.unitPrice ?? item.price ?? 0) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
