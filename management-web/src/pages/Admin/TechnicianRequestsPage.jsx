import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Briefcase,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useTechnicianRequests, useTechnicianRequest, useApproveTechnician, useRejectTechnician } from '../../hooks/useErpQueries';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';

export const TechnicianRequestsPage = () => {
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const { data: res, isLoading } = useTechnicianRequests({ status: statusFilter, search });
  const { data: detailRes } = useTechnicianRequest(selected?._id, !!selected);
  const approveMutation = useApproveTechnician();
  const rejectMutation = useRejectTechnician();

  const applications = res?.data?.applications || [];
  const pendingCount = res?.data?.pendingCount || 0;
  // Prefer the populated detail record (approvedBy/rejectedBy names) when open.
  const detail = detailRes?.data || selected;

  const filtered = applications.filter((a) =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (app) => {
    if (!window.confirm(`Approve this technician application?\n\n${app.name} (${app.email})`)) return;
    try {
      await approveMutation.mutateAsync(app._id);
    } catch (err) {
      alert(err.message || 'Failed to approve application');
    }
  };

  const openReject = (app) => {
    setRejectTarget(app);
    setRejectionReason('');
    setRejectError('');
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectError('A rejection reason is required');
      return;
    }
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget._id, rejectionReason: rejectionReason.trim() });
      setRejectTarget(null);
      setRejectionReason('');
    } catch (err) {
      setRejectError(err.message || 'Failed to reject application');
    }
  };

  const HistoryBadge = ({ event }) => {
    const styles = {
      Submitted: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${styles[event]}`}>
        {event}
      </span>
    );
  };

  const DetailRow = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm text-slate-200 font-semibold break-words">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Technician Requests</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                {pendingCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400">Review technician applications and approve or reject them</p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin approval required</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {['Pending', 'Approved', 'Rejected', 'All'].map((s) => {
            const isSelected = (statusFilter === '' && s === 'All') || statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s === 'All' ? '' : s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s === 'Pending' && pendingCount > 0 && isSelected ? `${s} (${pendingCount})` : s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching technician applications..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Application Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No technician applications found
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{a.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{a.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-semibold">
                        {a.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-[180px] truncate">
                        {a.skills || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-[160px] truncate">
                        {a.experience || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDate(a.submittedAt || a.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelected(a)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        {a.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(a)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => openReject(a)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Technician Application: ${selected?.name}`}
      >
        {selected && (
          <div className="space-y-5 text-xs">
            {/* Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-bold">Current Status:</span>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Full Name" value={detail.name} />
                <DetailRow label="Email" value={detail.email} />
                <DetailRow label="Phone" value={detail.phone} />
                <DetailRow label="Address" value={detail.address} />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Skills" value={detail.skills} />
                <DetailRow label="Specialization" value={detail.specialization} />
                <DetailRow label="Experience" value={detail.experience} />
                <DetailRow label="Additional Information" value={detail.additionalInfo} />
              </div>
            </div>

            {/* Application Info */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Application Information</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow label="Application Date" value={formatDateTime(detail.submittedAt || detail.createdAt)} />
                <DetailRow label="Account Created" value={formatDate(detail.createdAt)} />
                {detail.status === 'Approved' && (
                  <>
                    <DetailRow label="Approved By" value={detail.approvedBy?.name || 'Admin'} />
                    <DetailRow label="Approved At" value={formatDateTime(detail.approvedAt)} />
                  </>
                )}
                {detail.status === 'Rejected' && (
                  <>
                    <DetailRow label="Rejected By" value={detail.rejectedBy?.name || 'Admin'} />
                    <DetailRow label="Rejected At" value={formatDateTime(detail.rejectedAt)} />
                    <div className="md:col-span-2">
                      <DetailRow label="Rejection Reason" value={detail.rejectionReason} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Application History (audit trail) */}
            {detail.applicationHistory?.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Application History</span>
                </h4>
                <div className="space-y-2">
                  {detail.applicationHistory.map((h, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <HistoryBadge event={h.event} />
                        <span className="text-[11px] text-slate-400">
                          {h.by ? `by ${h.by.name || 'Admin'}` : 'self-submitted'}
                          {h.reason ? ` · ${h.reason}` : ''}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{formatDateTime(h.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {detail.status === 'Pending' && (
              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  onClick={() => { openReject(selected); setSelected(null); }}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-extrabold text-xs hover:bg-rose-500/20 transition-all"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => handleApprove(selected)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                >
                  Approve Application
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title={`Reject Application: ${rejectTarget?.name}`}
      >
        {rejectTarget && (
          <form onSubmit={handleReject} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 font-semibold leading-relaxed">
                Reject this technician application? The applicant will be notified and the
                application record will be preserved for audit purposes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <p className="font-bold text-white">{rejectTarget.name}</p>
              <p className="text-slate-400">{rejectTarget.email}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1.5">
                Rejection Reason *
              </label>
              <textarea
                required
                rows={3}
                maxLength={500}
                placeholder="Explain why this application is being rejected"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-rose-500/50"
              />
            </div>

            {rejectError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {rejectError}
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rejectMutation.isPending}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold shadow-md"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
