import React, { useState } from 'react';
import { UserCheck, Plus, Search, Filter, Phone, Mail, MapPin, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useUsers } from '../../hooks/useErpQueries';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const LeadManagementPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [activeLead, setActiveLead] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [serviceRequired, setServiceRequired] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [leadStatus, setLeadStatus] = useState('New');

  const { data: leadsRes, isLoading } = useLeads({ status: statusFilter });
  const { data: usersRes } = useUsers();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const leads = leadsRes?.data || [];
  const staffMembers = (usersRes?.data || []).filter((u) => u.role === 'Staff' || u.role === 'Admin');

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setServiceRequired('');
    setNotes('');
    setAssignedTo('');
    setLeadStatus('New');
  };

  const handleOpenEdit = (l) => {
    setActiveLead(l);
    setLeadStatus(l.status);
    setAssignedTo(l.assignedTo?._id || '');
    setNotes(l.notes || '');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeadMutation.mutateAsync({
        name,
        phone,
        email,
        address,
        serviceRequired,
        notes,
        assignedTo: assignedTo || null
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!activeLead) return;

    try {
      await updateLeadMutation.mutateAsync({
        id: activeLead._id,
        data: {
          status: leadStatus,
          assignedTo: assignedTo || null,
          notes
        }
      });
      setActiveLead(null);
    } catch (err) {
      alert(err.message || 'Failed to update lead');
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'New': return 'bg-sky-500/10 text-sky-600 border-sky-500/30';
      case 'Contacted': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'Quoted': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'Converted': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'Lost': return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      default: return 'bg-white border border-slate-200 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Lead CRM Pipeline</h1>
          <p className="text-xs text-slate-500">Track prospective factory clients, service inquiries, quotations & lead conversions</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['All', 'New', 'Contacted', 'Quoted', 'Converted', 'Lost'].map((st) => {
          const isSelected = (statusFilter === '' && st === 'All') || statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st === 'All' ? '' : st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Leads Grid/Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching sales leads pipeline..." />
      ) : leads.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <UserCheck className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No leads found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((l) => (
            <div key={l._id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(l.status)}`}>
                    {l.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{formatDate(l.createdAt)}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{l.name}</h3>
                <p className="text-xs font-bold text-amber-600 flex items-center space-x-1">
                  <span>Req: {l.serviceRequired}</span>
                </p>

                <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                  <p className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{l.phone}</span>
                  </p>
                  {l.email && (
                    <p className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{l.email}</span>
                    </p>
                  )}
                  {l.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200 mt-2">
                      "{l.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Owner:</span>
                  <span className="text-xs font-semibold text-slate-900">{l.assignedTo?.name || 'Unassigned'}</span>
                </div>
                <button
                  onClick={() => handleOpenEdit(l)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Manage Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Lead Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Register Customer Lead">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Customer / Plant Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Balaji Steel Rolling Mills"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Email</label>
              <input
                type="email"
                placeholder="contact@client.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Service / Equipment Required *</label>
            <input
              type="text"
              required
              placeholder="e.g. 500KVA Transformer Repair & BDV Oil Test"
              value={serviceRequired}
              onChange={(e) => setServiceRequired(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Assign Sales Representative</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            >
              <option value="">Unassigned...</option>
              {staffMembers.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Inquiry Notes</label>
            <textarea
              rows={2}
              placeholder="Customer notes or site address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
            >
              Save Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal isOpen={!!activeLead} onClose={() => setActiveLead(null)} title={`Manage Lead: ${activeLead?.name}`}>
        {activeLead && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">{activeLead.name}</p>
              <p className="text-amber-600">{activeLead.serviceRequired}</p>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Lead Pipeline Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-bold focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="New">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Quoted">Quoted (Proposal Sent)</option>
                <option value="Converted">Converted (Successfully Closed)</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Assign Representative</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              >
                <option value="">Unassigned...</option>
                {staffMembers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold uppercase mb-1">Update Notes</label>
              <textarea
                rows={3}
                placeholder="Log call feedback, quote amount, next action..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-md"
              >
                Update Lead
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
