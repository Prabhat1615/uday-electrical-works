import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarCheck, Wrench, MapPin, User, Clock, CalendarDays,
  ChevronDown, ChevronRight, UserCheck, CheckCircle2, Truck, Hammer,
  PartyPopper, Inbox, XCircle, AlertOctagon, Star, MessageSquareQuote
} from 'lucide-react';
import { useBookings, useCancelBooking, useCreateReview, useMyReviews } from '../../hooks/useErpQueries';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const CANCELLABLE = ['Pending', 'Confirmed', 'Assigned'];

const TIMELINE_STEPS = [
  { key: 'Pending', label: 'Request Received', icon: CalendarCheck },
  { key: 'Assigned', label: 'Technician Assigned', icon: UserCheck },
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'On The Way', label: 'On the Way', icon: Truck },
  { key: 'In Progress', label: 'In Progress', icon: Hammer },
  { key: 'Completed', label: 'Completed', icon: PartyPopper }
];

const STATUS_ORDER = ['Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed'];

const RATING_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

// Star display / picker. Interactive when `onChange` is provided.
const Stars = ({ value, onChange, size = 'w-4 h-4' }) => {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer p-0.5 transition-transform hover:scale-110' : 'cursor-default p-0.5'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`${size} ${
              n <= shown
                ? 'text-[#FFB400] fill-[#FFB400]'
                : 'text-[#CBD5E1] dark:text-slate-700'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Customer feedback for a completed booking (form or submitted view).
const FeedbackBlock = ({ booking }) => {
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (booking.feedback) {
    return (
      <div className="p-4 rounded-2xl bg-[#FFB400]/5 border border-[#FFB400]/25 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs font-black text-[#0F172A] dark:text-white flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#FFB400] fill-[#FFB400]" />
            Your Feedback · {booking.feedback.rating}/5
          </p>
          <span className="text-[10px] text-slate-400">{formatDate(booking.feedback.createdAt)}</span>
        </div>
        <Stars value={booking.feedback.rating} />
        {booking.feedback.comment && (
          <p className="text-xs text-[#475569] dark:text-slate-300">{booking.feedback.comment}</p>
        )}
        <p className="text-[10px] text-slate-400">
          Thank you, your feedback helps us improve our service.
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="p-4 rounded-2xl bg-[#FFB400]/5 border border-[#FFB400]/25 space-y-2">
        <p className="text-xs font-black text-[#0F172A] dark:text-white flex items-center gap-1.5">
          <MessageSquareQuote className="w-4 h-4 text-[#F97316]" />
          How was your service?
        </p>
        <p className="text-[11px] text-[#475569] dark:text-slate-400">
          Your feedback takes a minute and helps us keep quality high.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl btn-cta text-[11px] font-black"
        >
          Rate This Service
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      await createReview.mutateAsync({
        bookingId: booking._id,
        rating,
        comment: comment.trim()
      });
      setRating(0);
      setComment('');
      setShowForm(false);
    } catch {
      // error toast handled by caller convention; stay on form
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#FFB400]/5 border border-[#FFB400]/25 space-y-3">
      <p className="text-xs font-black text-[#0F172A] dark:text-white flex items-center gap-1.5">
        <Star className="w-4 h-4 text-[#FFB400] fill-[#FFB400]" />
        Rate this service
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <Stars value={rating} onChange={setRating} size="w-6 h-6" />
        <span className="text-[11px] font-bold text-[#475569] dark:text-slate-400">
          {rating ? RATING_LABELS[rating] : 'Tap a star to rate'}
        </span>
      </div>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional, tell us what went well or how we can improve (max 1000 characters)"
        maxLength={1000}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#F97316]/50"
      />
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowForm(false)}
          disabled={submitting}
          className="px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-xs font-bold text-[#475569] dark:text-slate-300"
        >
          Not Now
        </button>
        <button
          onClick={handleSubmit}
          disabled={!rating || submitting}
          className="px-5 py-2 rounded-xl btn-cta text-xs font-black disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

export const BookingsManager = () => {
  const { data: res, isLoading } = useBookings();
  const { data: reviewsRes } = useMyReviews();
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [busy, setBusy] = useState(false);
  const cancelMutation = useCancelBooking();

  const bookings = res?.data || [];
  const myReviews = reviewsRes?.data || [];

  // Review lookup by booking id so each completed card shows form vs. submitted.
  const feedbackByBooking = useMemo(() => {
    const map = {};
    myReviews.forEach((r) => {
      map[r.booking?._id] = r;
    });
    return map;
  }, [myReviews]);

  const handleCancel = async (booking) => {
    setBusy(true);
    try {
      await cancelMutation.mutateAsync({ id: booking._id, reason: cancelReason });
      setCancelId(null);
      setCancelReason('');
    } catch (err) {
      console.error('Could not cancel booking:', err);
    } finally {
      setBusy(false);
    }
  };

  const filtered = useMemo(
    () => (statusFilter ? bookings.filter((b) => b.status === statusFilter) : bookings),
    [bookings, statusFilter]
  );

  const filters = ['', 'Pending', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] dark:text-white font-display">My Service Bookings</h1>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-1">
            Track every electrician visit you've requested.
          </p>
        </div>
        <Link
          to="/book"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl btn-cta text-xs shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book a Service</span>
        </Link>
      </div>

      {/* Your Feedback summary */}
      {myReviews.length > 0 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card">
          <p className="text-xs font-black text-[#0F172A] dark:text-white flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 text-[#FFB400] fill-[#FFB400]" />
            Your Feedback ({myReviews.length})
          </p>
          <div className="space-y-3">
            {myReviews.map((r) => (
              <div key={r._id} className="flex items-start justify-between gap-3 py-2 border-b border-dashed border-[#E2E8F0] dark:border-slate-800 last:border-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                      {r.booking?.service?.title || 'Electrical Service'}
                    </p>
                    <span className="text-[10px] font-mono text-[#F97316] font-bold">
                      {r.booking?.bookingNumber || ''}
                    </span>
                  </div>
                  <Stars value={r.rating} />
                  {r.comment && (
                    <p className="text-[11px] text-[#475569] dark:text-slate-400">{r.comment}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{formatDate(r.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f || 'all'}
            onClick={() => setStatusFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              statusFilter === f
                ? 'bg-[#F97316] text-white border-[#F97316]'
                : 'bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300'
            }`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-center space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-bold text-[#0F172A] dark:text-white">No service bookings yet</p>
          <p className="text-xs text-[#475569] dark:text-slate-400 max-w-sm mx-auto">
            Need an electrician? Book a service and track it right here.
          </p>
          <Link
            to="/book"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl btn-cta text-xs mt-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Book a Service</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, idx) => {
            const expanded = expandedId === booking._id;
            const current = STATUS_ORDER.indexOf(booking.status);
            const terminal = booking.status === 'Cancelled' || booking.status === 'Rejected';
            const feedback = feedbackByBooking[booking._id] || null;

            return (
              <motion.div
                key={booking._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() => setExpandedId(expanded ? null : booking._id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-3 hover:bg-[#F8FAFC] dark:hover:bg-slate-950/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-[#0F172A] dark:text-white text-sm">
                        {booking.service?.title || 'Electrical Service'}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="text-[11px] font-mono text-[#F97316] font-bold">
                      {booking.bookingNumber}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-[#475569] dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(booking.preferredDate)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.preferredTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.city || 'Service address'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expandable detail + timeline */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-5 border-t border-[#E2E8F0] dark:border-slate-800 pt-4">
                        {/* Timeline */}
                        {terminal ? (
                          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-semibold space-y-1">
                            <p className="flex items-center gap-1.5">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              This request was {booking.status.toLowerCase()}. No technician timeline is shown.
                            </p>
                            {booking.status === 'Cancelled' && booking.cancellation?.reason && (
                              <p className="font-normal text-[#475569] dark:text-slate-400">
                                Reason: {booking.cancellation.reason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="py-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                              Progress Timeline
                            </p>
                            <div className="relative flex items-start">
                              {TIMELINE_STEPS.map((step, i) => {
                                const done = current >= i;
                                const Icon = step.icon;
                                return (
                                  <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                                    {i > 0 && (
                                      <div
                                        className={`absolute top-4 -left-1/2 w-full h-0.5 ${done ? 'bg-[#00C853]' : 'bg-[#E2E8F0] dark:bg-slate-800'}`}
                                      />
                                    )}
                                    <div
                                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        done
                                          ? 'bg-[#00C853] text-white shadow-md shadow-[#00C853]/30'
                                          : 'bg-[#F1F5F9] dark:bg-slate-800 text-slate-400'
                                      } ${current === i ? 'ring-4 ring-[#F97316]/20' : ''}`}
                                    >
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <span
                                      className={`text-[9px] text-center leading-tight font-bold px-0.5 ${
                                        done ? 'text-[#0F172A] dark:text-white' : 'text-slate-400'
                                      }`}
                                    >
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                              <User className="w-3 h-3" /> Contact
                            </p>
                            <p className="font-bold text-[#0F172A] dark:text-white">{booking.contactName || booking.customer?.name}</p>
                            <p className="text-slate-400">{booking.contactPhone || booking.customer?.phone}</p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Service Address
                            </p>
                            <p className="font-bold text-[#0F172A] dark:text-white">{booking.address}</p>
                            <p className="text-slate-400">
                              {booking.city}{booking.pincode ? ` · ${booking.pincode}` : ''}{booking.landmark ? ` · Near ${booking.landmark}` : ''}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                              <Wrench className="w-3 h-3" /> Technician
                            </p>
                            {booking.assignedTechnician ? (
                              <>
                                <p className="font-bold text-[#0F172A] dark:text-white">
                                  {booking.assignedTechnician.name}
                                </p>
                                <p className="text-slate-400">{booking.assignedTechnician.phone}</p>
                              </>
                            ) : (
                              <p className="text-slate-400">
                                {booking.status === 'Pending' || booking.status === 'Confirmed'
                                  ? 'Not assigned yet'
                                  : 'Awaiting reassignment'}
                              </p>
                            )}
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Requested Slot</p>
                            <p className="font-bold text-[#0F172A] dark:text-white">
                              {formatDate(booking.preferredDate)} · {booking.preferredTime}
                            </p>
                            <p className="text-slate-400">Created {formatDate(booking.createdAt)}</p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-xs">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Problem Description</p>
                            <p className="text-[#475569] dark:text-slate-300">{booking.notes}</p>
                          </div>
                        )}

                        {booking.completionDetails?.workSummary && (
                          <div className="p-3.5 rounded-2xl bg-[#00C853]/5 border border-[#00C853]/20 text-xs">
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Work Summary</p>
                            <p className="text-[#475569] dark:text-slate-300">{booking.completionDetails.workSummary}</p>
                          </div>
                        )}

                        {/* Customer feedback for completed services */}
                        {booking.status === 'Completed' && (
                          <FeedbackBlock booking={{ ...booking, feedback }} />
                        )}

                        {CANCELLABLE.includes(booking.status) && (
                          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                            <p className="text-xs font-black text-[#0F172A] dark:text-white flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-rose-500" />
                              Need to cancel this request?
                            </p>
                            {cancelId !== booking._id ? (
                              <button
                                onClick={() => { setCancelId(booking._id); setCancelReason(''); }}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-colors"
                              >
                                Cancel Booking
                              </button>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                    Reason for cancellation *
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Tell us why you're cancelling (e.g. changed plans, found another technician, no longer needed...)"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-rose-500/50"
                                  />
                                </div>
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => setCancelId(null)}
                                    disabled={busy}
                                    className="px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 text-xs font-bold text-[#475569] dark:text-slate-300"
                                  >
                                    Keep Booking
                                  </button>
                                  <button
                                    onClick={() => handleCancel(booking)}
                                    disabled={busy || !cancelReason.trim()}
                                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black disabled:opacity-50"
                                  >
                                    {busy ? 'Cancelling...' : 'Confirm Cancellation'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {!['Pending', 'Confirmed', 'Assigned', 'Cancelled', 'Rejected'].includes(booking.status) && (
                          <Link
                            to="/book"
                            className="inline-flex items-center space-x-1.5 text-xs font-black text-[#F97316] hover:underline"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>Book another service</span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
