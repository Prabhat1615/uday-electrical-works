import React, { useState } from 'react';
import { Wrench, Plus, Camera, CheckCircle2, Image, FileText } from 'lucide-react';
import { useFieldReports, useSubmitFieldReport, useBookings, useProducts } from '../../hooks/useErpQueries';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const FieldServicePage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [customerSignature, setCustomerSignature] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [materialQty, setMaterialQty] = useState(1);
  const [notes, setNotes] = useState('');

  const { data: reportsRes, isLoading: loadingReports } = useFieldReports();
  const { data: bookingsRes } = useBookings({ status: 'In Progress' });
  const { data: productsRes } = useProducts();

  const submitReportMutation = useSubmitFieldReport();

  const reports = reportsRes?.data || [];
  const activeBookings = bookingsRes?.data || [];
  const products = productsRes?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) {
      alert('Please select a service job');
      return;
    }

    try {
      await submitReportMutation.mutateAsync({
        bookingId: selectedBookingId,
        beforeImage,
        afterImage,
        customerSignature: customerSignature || 'Digitally Signed on Site',
        materialsUsed: selectedProductId ? [{ productId: selectedProductId, quantity: Number(materialQty) }] : [],
        notes
      });
      setModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Field Technician Operations & Job Reports</h1>
          <p className="text-xs text-slate-500">Record site completion reports, before/after motor inspection photos, customer signatures & parts consumed</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-cta btn-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Job Completion Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      {loadingReports ? (
        <LoadingSpinner message="Loading field service reports..." />
      ) : reports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <Wrench className="w-10 h-10 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Field Reports Submitted Yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r._id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-orange-600 text-xs font-bold">{r.booking?.bookingNumber}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{r.booking?.service?.title || 'Electrical Repair'}</h3>
                </div>
                <span className="text-[10px] text-slate-500">{formatDate(r.completionDate || r.createdAt)}</span>
              </div>

              {/* Before & After Image Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Before Inspection</span>
                  <div className="h-32 rounded-lg bg-slate-50 overflow-hidden border border-slate-200">
                    <img src={r.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">After Completion</span>
                  <div className="h-32 rounded-lg bg-slate-50 overflow-hidden border border-slate-200">
                    <img src={r.afterImage} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                <p><strong className="text-slate-900">Technician:</strong> {r.technician?.name}</p>
                {r.notes && <p><strong className="text-slate-900">Work Notes:</strong> {r.notes}</p>}
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">✓ Signature: {r.customerSignature || 'Signed'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Report Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Field Job Completion Report">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Select Service Booking *</label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              required
            >
              <option value="">Choose a job...</option>
              {activeBookings.map((b) => (
                <option key={b._id} value={b._id}>{b.bookingNumber} - {b.customer?.name} ({b.service?.title})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Before Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={beforeImage}
                onChange={(e) => setBeforeImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">After Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={afterImage}
                onChange={(e) => setAfterImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Parts/Material Consumed</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              >
                <option value="">No material</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Material Qty Consumed</label>
              <input
                type="number"
                min="1"
                value={materialQty}
                onChange={(e) => setMaterialQty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Customer Digital Signature Code</label>
            <input
              type="text"
              placeholder="Client Name / Digital Signature Token"
              value={customerSignature}
              onChange={(e) => setCustomerSignature(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Technician Field Notes *</label>
            <textarea
              rows={2}
              placeholder="BDV test values, insulation resistance in M-Ohms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!notes.trim()}
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold disabled:opacity-50"
            >
              Submit Report & Close Job
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
