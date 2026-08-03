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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Annual Maintenance Contracts (AMC)</h1>
          <p className="text-xs text-slate-400">Manage plant maintenance agreements, scheduled visits, and annual contract renewals</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New AMC Agreement</span>
        </button>
      </div>

      {/* AMC Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching AMC maintenance agreements..." />
      ) : amcs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <CalendarCheck className="w-10 h-10 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No AMC Contracts Found</h3>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Contract #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service Type</th>
                  <th className="px-6 py-4">Frequency</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {amcs.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-orange-400">{a.contractNumber}</td>
                    <td className="px-6 py-4 font-bold text-white">{a.customer?.name}</td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{a.serviceType}</td>
                    <td className="px-6 py-4 text-sky-400 font-bold">{a.visitFrequency}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(a.startDate)} - {formatDate(a.endDate)}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{formatCurrency(a.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleRenew(a._id)}
                        className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500 border border-orange-500/30 text-orange-400 hover:text-slate-950 font-bold transition-all"
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
            <label className="block text-slate-300 font-bold uppercase mb-1">Select Customer *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              required
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Service Type *</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              >
                <option value="Motor Maintenance">Motor Maintenance</option>
                <option value="Transformer Oil BDV Test">Transformer Oil BDV Test</option>
                <option value="HT/LT Panel Audit">HT/LT Panel Audit</option>
                <option value="Full Factory Electrical Care">Full Factory Electrical Care</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Visit Frequency</label>
              <select
                value={visitFrequency}
                onChange={(e) => setVisitFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              >
                <option value="Monthly">Monthly Visit</option>
                <option value="Quarterly">Quarterly Visit</option>
                <option value="Bi-Annual">Bi-Annual Visit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Annual Fee (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Assigned Lead Technician</label>
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              >
                <option value="">-- Unassigned --</option>
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
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
            >
              Create Contract
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
