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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Multi-Branch Operations & Regional Units</h1>
          <p className="text-xs text-slate-400">Manage regional branch workshops, plant managers, local inventory hubs & billing units</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold shadow-md"
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
            <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-orange-400 font-bold text-xs">{b.code}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{b.name}</h3>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-orange-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{b.address}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Manager: {b.manager?.name || 'Unassigned Manager'}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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
            <label className="block text-slate-300 font-bold uppercase mb-1">Branch Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sanathnagar Rewinding Unit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Branch Code *</label>
              <input
                type="text"
                required
                placeholder="BR-HYD-02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Branch Manager</label>
              <select
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              >
                <option value="">-- Unassigned --</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1">Full Branch Address *</label>
            <textarea
              rows={2}
              required
              placeholder="Sanathnagar Industrial Zone, Hyderabad..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold shadow-md"
            >
              Register Branch
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
