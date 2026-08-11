import React, { useState } from 'react';
import { Building2, Plus, Users, MapPin, Phone, Mail } from 'lucide-react';
import { useBranches, useCreateBranch, useUsers } from '../../hooks/useErpQueries';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const MultiBranchPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [managerId, setManagerId] = useState('');

  const { data: branchRes, isLoading } = useBranches();
  const { data: usersRes } = useUsers();

  const createBranchMutation = useCreateBranch();

  const branches = branchRes?.data || [];
  const managers = (usersRes?.data || []).filter((u) => u.role === 'Admin' || u.role === 'Staff');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBranchMutation.mutateAsync({
        name,
        code,
        address,
        phone,
        email,
        managerId: managerId || null
      });
      setModalOpen(false);
      setName('');
      setCode('');
      setAddress('');
    } catch (err) {
      alert(err.message || 'Failed to register branch');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Multi-Branch Operations & Regional Units</h1>
          <p className="text-xs text-slate-500">Manage regional branch workshops, plant managers, local inventory hubs & billing units</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Branch</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Fetching branch network..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b._id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-orange-600 font-bold text-xs">{b.code}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{b.name}</h3>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-orange-600">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-200">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{b.address}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Manager: {b.manager?.name || 'Unassigned Manager'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{b.phone || '+91 98765 43210'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Branch Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Branch Workshop">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Branch Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sanathnagar Rewinding Unit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Branch Code *</label>
              <input
                type="text"
                required
                placeholder="BR-HYD-02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Branch Manager</label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="">Unassigned...</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Full Branch Address *</label>
            <textarea
              rows={2}
              required
              placeholder="Sanathnagar Industrial Zone, Hyderabad..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold shadow-md"
            >
              Register Branch
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
