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
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { StaggerContainer, StaggerItem } from '../../components/motion/PageTransition';

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
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text-primary font-medium break-words">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display flex items-center gap-2">
            <span>Technician Requests</span>
            {pendingCount > 0 && (
              <Badge variant="warning" status="pending">
                {pendingCount}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-text-secondary mt-1">Review technician applications and approve or reject them</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin approval required</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['Pending', 'Approved', 'Rejected', 'All'].map((s) => {
            const isSelected = (statusFilter === '' && s === 'All') || statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s === 'All' ? '' : s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'bg-surface-100 text-text-secondary hover:text-text-primary'
                }`}
              >
                {s === 'Pending' && pendingCount > 0 && isSelected ? `${s} (${pendingCount})` : s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications */}
      {isLoading ? (
        <LoadingSpinner message="Fetching technician applications..." />
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="py-12">
            <div className="text-center">
              <UserCheck className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No technician applications found</h3>
              <p className="text-sm text-text-secondary">Try adjusting your search or filter criteria</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <StaggerItem key={a._id}>
              <Card hover>
                <CardBody className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{a.name}</h3>
                        <p className="text-xs text-text-secondary">{a.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <DetailRow label="Phone" value={a.phone} />
                    <DetailRow label="Skills" value={a.skills} />
                    <DetailRow label="Experience" value={a.experience} />
                    <DetailRow label="Applied" value={formatDate(a.submittedAt || a.createdAt)} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      icon={Eye}
                      onClick={() => setSelected(a)}
                    >
                      View
                    </Button>
                    {a.status === 'Pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle2}
                          onClick={() => handleApprove(a)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          onClick={() => openReject(a)}
                        />
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Technician Application: ${selected?.name}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface-50 border border-surface-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                <span className="text-text-primary font-medium">Current Status:</span>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
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
            <div className="space-y-3 pt-4 border-t border-surface-200">
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
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
            <div className="space-y-3 pt-4 border-t border-surface-200">
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
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
              <div className="space-y-3 pt-4 border-t border-surface-200">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Application History</span>
                </h4>
                <div className="space-y-2">
                  {detail.applicationHistory.map((h, i) => (
                    <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-50 border border-surface-200">
                      <div className="flex items-center gap-2">
                        <HistoryBadge event={h.event} />
                        <span className="text-xs text-text-secondary">
                          {h.by ? `by ${h.by.name || 'Admin'}` : 'self-submitted'}
                          {h.reason ? ` · ${h.reason}` : ''}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted shrink-0">{formatDateTime(h.at)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {detail.status === 'Pending' && (
              <div className="pt-4 border-t border-surface-200 flex justify-end gap-3">
                <Button
                  variant="danger"
                  onClick={() => { openReject(selected); setSelected(null); }}
                >
                  Reject Application
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprove(selected)}
                >
                  Approve Application
                </Button>
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
          <form onSubmit={handleReject} className="space-y-4">
            <div className="p-4 rounded-lg bg-danger-50 border border-danger-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
              <p className="text-danger-700 font-medium leading-relaxed">
                Reject this technician application? The applicant will be notified and the
                application record will be preserved for audit purposes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-50 border border-surface-200">
              <p className="font-medium text-text-primary">{rejectTarget.name}</p>
              <p className="text-sm text-text-secondary">{rejectTarget.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Rejection Reason *
              </label>
              <textarea
                required
                rows={3}
                maxLength={500}
                placeholder="Explain why this application is being rejected"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input"
              />
            </div>

            {rejectError && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium">
                {rejectError}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRejectTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                loading={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject Application'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
