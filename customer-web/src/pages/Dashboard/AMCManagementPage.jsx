import React, { useState } from 'react';
import { CalendarCheck, Plus, RefreshCw, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import { useAMCs, useCreateAMC, useRenewAMC, useUsers } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const AMCManagementPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [serviceType, setServiceType] = useState('Motor Maintenance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visitFrequency, setVisitFrequency] = useState('Quarterly');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedTechId, setSelectedTechId] = useState('');

  const { data: amcsRes, isLoading } = useAMCs();
  const { data: usersRes } = useUsers();
  const createAMCMutation = useCreateAMC();
  const renewAMCMutation = useRenewAMC();

  const amcs = amcsRes?.data || [];
  const customers = (usersRes?.data || []).filter((u) => u.role === 'Customer');
  const technicians = (usersRes?.data || []).filter((u) => u.role === 'Technician');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAMCMutation.mutateAsync({
        customerId: selectedCustomerId,
        serviceType,
        startDate,
        endDate,
        visitFrequency,
        totalAmount: Number(totalAmount),
        technicianId: selectedTechId || null
      });
      setCreateModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create AMC');
    }
  };

  const handleRenew = async (id) => {
    try {
      await renewAMCMutation.mutateAsync(id);
    } catch (err) {
      alert(err.message || 'Failed to renew AMC');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Annual Maintenance Contracts (AMC)</h1>
          <p className="text-xs text-slate-500">Manage plant maintenance agreements, scheduled visits, and annual contract renewals</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-cta btn-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New AMC Agreement</span>
        </button>
      </div>

      {/* AMC Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching AMC maintenance agreements..." />
      ) : amcs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <CalendarCheck className="w-10 h-10 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No AMC Contracts Found</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Contract #</th>
                  <th className="px-4 py-2.5">Customer</th>
                  <th className="px-4 py-2.5">Service Type</th>
                  <th className="px-4 py-2.5">Frequency</th>
                  <th className="px-4 py-2.5">Validity</th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {amcs.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-orange-600">{a.contractNumber}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{a.customer?.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{a.serviceType}</td>
                    <td className="px-4 py-3 text-sky-600 font-bold">{a.visitFrequency}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(a.startDate)} - {formatDate(a.endDate)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(a.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleRenew(a._id)}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 text-orange-600 hover:text-white font-bold transition-all"
                      >
                        Renew 1-Yr
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create AMC Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Issue New AMC Contract">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Select Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              required
            >
              <option value="">Choose a customer...</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Service Type *</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              >
                <option value="Motor Maintenance">Motor Maintenance</option>
                <option value="Transformer Oil BDV Test">Transformer Oil BDV Test</option>
                <option value="HT/LT Panel Audit">HT/LT Panel Audit</option>
                <option value="Full Factory Electrical Care">Full Factory Electrical Care</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Visit Frequency</label>
              <select
                value={visitFrequency}
                onChange={(e) => setVisitFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              >
                <option value="Monthly">Monthly Visit</option>
                <option value="Quarterly">Quarterly Visit</option>
                <option value="Bi-Annual">Bi-Annual Visit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Annual Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Assigned Lead Technician</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
              >
                <option value="">Unassigned</option>
                {technicians.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
            >
              Create Contract
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
