import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Wrench, FileText, UserCheck, X, ChevronRight } from 'lucide-react';
import { useProducts, useBookings, useInvoices } from '../hooks/useErpQueries';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: productsRes } = useProducts({ search: query });
  const { data: bookingsRes } = useBookings();
  const { data: invoicesRes } = useInvoices();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const products = (productsRes?.data || []).slice(0, 4);
  const bookings = (bookingsRes?.data || []).filter((b) =>
    (b.bookingNumber || '').toLowerCase().includes(query.toLowerCase()) ||
    (b.address || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const invoices = (invoicesRes?.data || []).filter((inv) =>
    (inv.invoiceNumber || '').toLowerCase().includes(query.toLowerCase()) ||
    (inv.customerName || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-xs">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Global Search SKUs, Invoices, Bookings, Customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white font-bold text-sm focus:outline-none placeholder-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <p className="font-bold">Type to search across Uday Electricals Enterprise Database</p>
              <p className="text-[10px]">Search by SKU code, customer name, booking ID, or invoice number.</p>
            </div>
          ) : (
            <>
              {/* Products Section */}
              {products.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block">Products ({products.length})</span>
                  {products.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => {
                        navigate('/products');
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-orange-500 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="w-4 h-4 text-orange-500 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{p.name}</span>
                          <span className="text-[10px] text-slate-400">SKU: {p.sku} • ₹{p.price}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Bookings Section */}
              {bookings.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Bookings ({bookings.length})</span>
                  {bookings.map((b) => (
                    <div
                      key={b._id}
                      onClick={() => {
                        navigate('/dashboard/bookings');
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Wrench className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{b.bookingNumber}</span>
                          <span className="text-[10px] text-slate-400">{b.address}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices Section */}
              {invoices.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Invoices ({invoices.length})</span>
                  {invoices.map((inv) => (
                    <div
                      key={inv._id}
                      onClick={() => {
                        navigate('/dashboard/invoices');
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{inv.invoiceNumber}</span>
                          <span className="text-[10px] text-slate-400">Amount: ₹{inv.totalAmount}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 flex justify-between">
          <span>Press ESC or click X to close</span>
          <span>Uday Electricals Search Engine</span>
        </div>

      </div>
    </div>
  );
};
