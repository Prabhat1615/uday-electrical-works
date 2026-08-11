import React, { useMemo, useState } from 'react';
import { CalendarCheck, UserCheck, MapPin, Phone, User, CheckCircle2, Hammer, Truck, PartyPopper, CalendarDays, Inbox, XCircle, ClipboardCheck, AlertOctagon, Star } from 'lucide-react';
import { useBookings, useAcceptBooking, useDeclineBooking, useUpdateBookingStatus, useCancelBooking, useReviewByBooking } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

const STATUS_ORDER = ['Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed'];
const FILTERS = ['All', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

const TIMELINE_STEPS = [
  { key: 'Assigned', label: 'Assigned', icon: UserCheck },
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'On The Way', label: 'On the Way', icon: Truck },
  { key: 'In Progress', label: 'In Progress', icon: Hammer },
  { key: 'Completed', label: 'Completed', icon: PartyPopper }
];

// Customer's rating + comment for a completed job (read-only for technicians).
const CustomerFeedback = ({ bookingId }) => {
  const { data: res, isLoading } = useReviewByBooking(bookingId, {
    refetchInterval: 30000
  });
  const review = res?.data;

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
        Loading feedback...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-500" />
          Customer Feedback
        </p>
        <p className="text-slate-500 text-xs">No feedback yet, the customer may still rate this job.</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-amber-50 border border-amber-500/25 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase font-bold text-amber-600 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" />
          Customer Feedback
        </p>
        <span className="text-slate-500 text-[10px]">{formatDate(review.createdAt)}</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`w-4 h-4 ${n <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
          />
        ))}
        <span className="text-xs font-black text-slate-900 ml-1.5">{review.rating}/5</span>
      </div>
      {review.comment && <p className="text-slate-600 text-xs">"{review.comment}"</p>}
    </div>
  );
};

export const BookingsManager = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [activeBooking, setActiveBooking] = useState(null);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completion, setCompletion] = useState({ workSummary: '', partsUsed: '', notes: '' });
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [busy, setBusy] = useState(false);

  const { data: res, isLoading } = useBookings({ status: statusFilter });
  const acceptMutation = useAcceptBooking();
  const declineMutation = useDeclineBooking();
  const statusMutation = useUpdateBookingStatus();
  const cancelMutation = useCancelBooking();

  const bookings = res?.data || [];

  const counts = useMemo(() => {
    const c = { All: bookings.length };
    FILTERS.slice(1).forEach((f) => {
      c[f] = bookings.filter((b) => b.status === f).length;
    });
    return c;
  }, [bookings]);

  const stepIndex = STATUS_ORDER.indexOf(activeBooking?.status || '');

  const run = async (fn, onDone, errPrefix) => {
    setBusy(true);
    try {
      await fn();
      onDone?.();
    } catch (err) {
      alert(err.message || errPrefix);
    } finally {
      setBusy(false);
    }
  };

  const handleAccept = () => run(() => acceptMutation.mutateAsync(activeBooking._id), () => setActiveBooking(null), 'Could not accept this job');

  const handleDecline = () =>
    run(
      () => declineMutation.mutateAsync({ id: activeBooking._id, reason: declineReason || 'Not specified' }),
      () => { setActiveBooking(null); setDeclineOpen(false); setDeclineReason(''); },
      'Could not decline this job'
    );

  const handleSetStatus = (status) => run(() => statusMutation.mutateAsync({ id: activeBooking._id, data: { status } }), null, `Could not update job status`);

  const handleComplete = () =>
    run(
      () => statusMutation.mutateAsync({
        id: activeBooking._id,
        data: { status: 'Completed', completionDetails: { ...completion } }
      }),
      () => { setActiveBooking(null); setCompleteOpen(false); setCompletion({ workSummary: '', partsUsed: '', notes: '' }); },
      'Could not complete this job'
    );

  const handleCancel = () =>
    run(
      () => cancelMutation.mutateAsync({ id: activeBooking._id, reason: cancelReason }),
      () => { setActiveBooking(null); setCancelOpen(false); setCancelReason(''); },
      'Could not cancel this job'
    );

  const currentStatus = activeBooking?.status;
  const isMyJob = activeBooking?.assignedTechnician?._id === user?._id;

  const closeAll = () => {
    setActiveBooking(null);
    setDeclineOpen(false);
    setCompleteOpen(false);
    setCancelOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Jobs</h1>
          <p className="text-xs text-slate-500">Accept assigned work, update progress, and complete jobs with a summary</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f === 'All' ? '' : f)}
            className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
              (statusFilter === '' && f === 'All') || statusFilter === f
                ? 'bg-orange-500 border-orange-400 text-white shadow-card'
                : 'bg-white border-slate-200 text-slate-600 hover:border-orange-500/40 hover:bg-slate-50'
            }`}
          >
            <p className="text-[9px] uppercase font-bold opacity-70">{f}</p>
            <p className="text-lg font-black mt-0.5">{counts[f] || 0}</p>
          </button>
        ))}
      </div>

      {/* Job list */}
      {isLoading ? (
        <LoadingSpinner message="Loading your jobs..." />
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <Inbox className="w-10 h-10 text-orange-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No jobs here</h3>
          <p className="text-xs">When the shop assigns you a service request, it will appear in this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <button
              key={booking._id}
              onClick={() => { setActiveBooking(booking); setDeclineOpen(false); setCompleteOpen(false); setCancelOpen(false); }}
              className="text-left w-full p-5 rounded-xl bg-white border border-slate-200 hover:border-orange-500/40 hover:shadow-card transition-all group"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
                      {booking.service?.title || 'Electrical Service'}
                    </h3>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="font-mono text-orange-600 font-bold text-[11px]">{booking.bookingNumber}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {booking.contactName || booking.customer?.name}
                    {booking.contactPhone || booking.customer?.phone ? ` · ${booking.contactPhone || booking.customer?.phone}` : ''}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5 justify-end">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(booking.preferredDate)} · {booking.preferredTime}
                  </p>
                  <p className="flex items-center gap-1.5 justify-end">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.city || booking.address}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Job detail modal */}
      <Modal
        isOpen={!!activeBooking}
        onClose={closeAll}
        title={`Job: ${activeBooking?.bookingNumber}`}
        size="lg"
      >
        {activeBooking && (
          <div className="space-y-5 text-xs">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-900 text-sm">{activeBooking.service?.title || 'Electrical Service'}</p>
                  <p className="text-slate-500 mt-0.5">
                    {activeBooking.service?.category} ·{' '}
                    {formatCurrencySafe(activeBooking)}
                  </p>
                </div>
                <StatusBadge status={activeBooking.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-start space-x-2 text-slate-600">
                  <User className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{activeBooking.contactName || activeBooking.customer?.name}</p>
                    <p className="text-slate-500 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{activeBooking.contactPhone || activeBooking.customer?.phone}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{activeBooking.address}</p>
                    <p className="text-slate-500">
                      {activeBooking.city}{activeBooking.pincode ? ` · ${activeBooking.pincode}` : ''}
                      {activeBooking.landmark ? ` · Near ${activeBooking.landmark}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <CalendarDays className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{formatDate(activeBooking.preferredDate)} · {activeBooking.preferredTime}</p>
                    <p className="text-slate-500">Requested on {formatDate(activeBooking.createdAt)}</p>
                  </div>
                </div>
              </div>

              {activeBooking.notes && (
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Problem Description</p>
                  <p className="text-slate-600">{activeBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {!['Rejected', 'Cancelled'].includes(currentStatus) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">Job Timeline</p>
                <div className="relative flex items-start">
                  {TIMELINE_STEPS.map((step, i) => {
                    const base = stepIndex - 1;
                    const done = base >= i;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                        {i > 0 && (
                          <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        )}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        } ${base === i ? 'ring-4 ring-orange-500/25' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] text-center leading-tight font-bold ${done ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {isMyJob && currentStatus === 'Assigned' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAccept}
                    disabled={busy}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{busy ? 'Working...' : 'Accept Job'}</span>
                  </button>
                  <button
                    onClick={() => setDeclineOpen(true)}
                    disabled={busy}
                    className="py-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              )}

              {isMyJob && currentStatus === 'Accepted' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSetStatus('On The Way')}
                    disabled={busy}
                    className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{busy ? 'Updating...' : 'Start Journey - On My Way'}</span>
                  </button>
                  <button
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="py-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Unable to Complete</span>
                  </button>
                </div>
              )}

              {isMyJob && currentStatus === 'On The Way' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSetStatus('In Progress')}
                    disabled={busy}
                    className="py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Hammer className="w-4 h-4" />
                    <span>{busy ? 'Updating...' : 'Start Work'}</span>
                  </button>
                  <button
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="py-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Unable to Complete</span>
                  </button>
                </div>
              )}

              {isMyJob && currentStatus === 'In Progress' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setCompleteOpen(true)}
                    disabled={busy}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Complete Job</span>
                  </button>
                  <button
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="py-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Unable to Complete</span>
                  </button>
                </div>
              )}

              {isMyJob && currentStatus === 'Completed' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-500/30 flex items-center space-x-2.5">
                  <PartyPopper className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="font-black text-emerald-700 text-sm">Job Completed</p>
                </div>
              )}

              {/* Customer feedback on completed jobs (read-only) */}
              {currentStatus === 'Completed' && <CustomerFeedback bookingId={activeBooking._id} />}

              {currentStatus === 'Cancelled' && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-500/30 space-y-1">
                  <p className="font-black text-rose-600 text-sm flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Job Cancelled</span>
                  </p>
                  {activeBooking.cancellation?.reason && (
                    <p className="text-slate-600">Reason: {activeBooking.cancellation.reason}</p>
                  )}
                </div>
              )}

              {!isMyJob && (
                <p className="text-center text-slate-500">This job is assigned to someone else.</p>
              )}

              {activeBooking.completionDetails?.workSummary && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500/30">
                  <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Work Summary</p>
                  <p className="text-slate-600">{activeBooking.completionDetails.workSummary}</p>
                </div>
              )}

              {/* Decline reason */}
              {declineOpen && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <p className="font-black text-slate-900 flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Why are you declining this job?</span>
                  </p>
                  <textarea
                    rows={3}
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="e.g. Already booked, out of area, tools unavailable..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setDeclineOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDecline}
                      disabled={busy}
                      className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-black text-xs disabled:opacity-50"
                    >
                      Confirm Decline
                    </button>
                  </div>
                </div>
              )}

              {/* Completion form */}
              {completeOpen && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <p className="font-black text-slate-900 flex items-center space-x-2">
                    <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                    <span>Job Completion Details</span>
                  </p>
                  <div>
                    <label className="block text-slate-600 font-bold uppercase mb-1">Work Summary *</label>
                    <textarea
                      rows={3}
                      value={completion.workSummary}
                      onChange={(e) => setCompletion({ ...completion, workSummary: e.target.value })}
                      placeholder="What was repaired / installed / replaced?"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold uppercase mb-1">Parts / Materials Used</label>
                    <input
                      value={completion.partsUsed}
                      onChange={(e) => setCompletion({ ...completion, partsUsed: e.target.value })}
                      placeholder="e.g. 1m 1.5sqmm wire, switch box..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold uppercase mb-1">Additional Notes</label>
                    <input
                      value={completion.notes}
                      onChange={(e) => setCompletion({ ...completion, notes: e.target.value })}
                      placeholder="Anything the shop should know"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setCompleteOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={busy || !completion.workSummary.trim()}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs disabled:opacity-50"
                    >
                      Complete Job
                    </button>
                  </div>
                </div>
              )}
              {/* Unable to Complete / Cancel form */}
              {cancelOpen && (
                <div className="rounded-xl bg-slate-50 border border-rose-500/30 p-4 space-y-3">
                  <p className="font-black text-slate-900 flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    <span>Cancel this job?</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    The customer and the shop will be notified. A reason is required.
                  </p>
                  <div>
                    <label className="block text-slate-600 font-bold uppercase mb-1">Reason *</label>
                    <textarea
                      rows={3}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="e.g. Customer unavailable, unsafe condition, required part unavailable..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setCancelOpen(false)}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold"
                    >
                      Keep Job
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={busy || !cancelReason.trim()}
                      className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs disabled:opacity-50"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Small helper: show starting fee when available without importing the formatter twice
function formatCurrencySafe(booking) {
  const fee = booking.service?.estimatedPrice ?? booking.totalCost;
  if (typeof fee !== 'number' || Number.isNaN(fee)) return 'Fee to be confirmed';
  return '₹' + Number(fee).toLocaleString('en-IN');
}
