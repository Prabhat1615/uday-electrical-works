import React, { useMemo, useState } from 'react';
import { CalendarCheck, UserCheck, Trash2, MapPin, Phone, User, ChevronDown, UserPlus, CheckCircle2, Hammer, Truck, PartyPopper, CalendarDays, Inbox, XCircle, AlertOctagon, Ban } from 'lucide-react';
import { useBookings, useDeleteBooking, useUsers, useAvailableTechnicians, useAssignTechnician, useUpdateBookingStatus, useCancelBooking } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

const STATUS_ORDER = ['Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed'];
const FILTERS = ['All', 'Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Rejected', 'Cancelled'];

const TIMELINE_STEPS = [
  { key: 'Pending', label: 'Request Received', icon: CalendarCheck },
  { key: 'Assigned', label: 'Technician Assigned', icon: UserCheck },
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'On The Way', label: 'On the Way', icon: Truck },
  { key: 'In Progress', label: 'In Progress', icon: Hammer },
  { key: 'Completed', label: 'Completed', icon: PartyPopper }
];

export const BookingsManager = () => {
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'Admin' || user?.role === 'Staff';

  const [statusFilter, setStatusFilter] = useState('');
  const [activeBooking, setActiveBooking] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelAction, setCancelAction] = useState('Cancel');
  const [cancelReason, setCancelReason] = useState('');

  const { data: res, isLoading } = useBookings({ status: statusFilter });
  const { data: techRes } = useUsers({ role: 'Technician' }, { enabled: isAdminOrStaff });
  const { data: availRes, isLoading: loadingAvail } = useAvailableTechnicians(activeBooking?._id, assignOpen && isAdminOrStaff);

  const updateStatusMutation = useUpdateBookingStatus();
  const assignMutation = useAssignTechnician();
  const deleteMutation = useDeleteBooking();
  const cancelMutation = useCancelBooking();

  const bookings = res?.data || [];
  const technicians = techRes?.data || [];
  const availableTechs = availRes?.data?.technicians || [];

  const counts = useMemo(() => {
    const c = { All: bookings.length };
    FILTERS.slice(1).forEach((f) => {
      c[f] = bookings.filter((b) => b.status === f).length;
    });
    return c;
  }, [bookings]);

  const stepIndex = STATUS_ORDER.indexOf(activeBooking?.status || '');

  const handleConfirm = async () => {
    if (!activeBooking) return;
    setBusy(true);
    try {
      await updateStatusMutation.mutateAsync({ id: activeBooking._id, data: { status: 'Confirmed' } });
    } catch (err) {
      alert(err.message || 'Could not confirm this request');
    } finally {
      setBusy(false);
    }
  };

  const handleAssign = async () => {
    if (!activeBooking || !selectedTechId) return;
    setBusy(true);
    try {
      await assignMutation.mutateAsync({ id: activeBooking._id, technicianId: selectedTechId });
      setAssignOpen(false);
      setSelectedTechId('');
    } catch (err) {
      alert(err.message || 'Could not assign technician');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!activeBooking || !cancelReason.trim()) return;
    setBusy(true);
    try {
      if (cancelAction === 'Reject') {
        await updateStatusMutation.mutateAsync({
          id: activeBooking._id,
          data: { status: 'Rejected', reason: cancelReason }
        });
      } else {
        await cancelMutation.mutateAsync({ id: activeBooking._id, reason: cancelReason });
      }
      setCancelOpen(false);
      setCancelReason('');
    } catch (err) {
      alert(err.message || 'Could not cancel this request');
    } finally {
      setBusy(false);
    }
  };

  const openCancel = (action) => {
    setCancelAction(action);
    setCancelReason('');
    setCancelOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service request permanently?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      setActiveBooking(null);
    } catch (err) {
      alert(err.message || 'Could not delete the booking');
    }
  };

  const canAssign = isAdminOrStaff && ['Pending', 'Confirmed', 'Assigned', 'Rejected'].includes(activeBooking?.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Service Request Management</h1>
          <p className="text-xs text-slate-500">Confirm requests, assign electricians, and track every job to completion</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f === 'All' ? '' : f)}
            className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
              (statusFilter === '' && f === 'All') || statusFilter === f
                ? 'bg-amber-500 border-amber-400 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-amber-500/40'
            }`}
          >
            <p className="text-[9px] uppercase font-bold opacity-70">{f}</p>
            <p className="text-lg font-black mt-0.5">{counts[f] || 0}</p>
          </button>
        ))}
      </div>

      {/* Bookings table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching service requests..." />
      ) : bookings.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 space-y-2">
          <Inbox className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No service requests found</h3>
          <p className="text-xs">New bookings from the customer website appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Booking ID</th>
                  <th className="px-4 py-2.5">Service & Customer</th>
                  <th className="px-4 py-2.5">Assigned Tech</th>
                  <th className="px-4 py-2.5">Preferred Slot</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-bold text-amber-600">
                      {booking.bookingNumber}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{booking.service?.title || 'Electrical Service'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {booking.contactName || booking.customer?.name}
                        {booking.contactPhone || booking.customer?.phone ? ` (${booking.contactPhone || booking.customer?.phone})` : ''}
                      </p>
                      <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                        {booking.address}{booking.city ? `, ${booking.city}` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {booking.assignedTechnician ? (
                        <div className="flex items-center space-x-1.5 text-sky-600 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{booking.assignedTechnician.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">
                      {formatDate(booking.preferredDate)} · {booking.preferredTime}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right space-x-2">
                      <button
                        onClick={() => { setActiveBooking(booking); setAssignOpen(false); setSelectedTechId(''); setCancelOpen(false); setCancelReason(''); }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
                      >
                        Manage
                      </button>
                      {isAdminOrStaff && (
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!activeBooking}
        onClose={() => { setActiveBooking(null); setAssignOpen(false); setSelectedTechId(''); setCancelOpen(false); setCancelReason(''); }}
        title={`Manage Request: ${activeBooking?.bookingNumber}`}
        size="xl"
      >
        {activeBooking && (
          <div className="space-y-5 text-xs">
            {/* Request summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-900 text-sm">{activeBooking.service?.title || 'Electrical Service'}</p>
                  <p className="text-slate-500 mt-0.5">
                    {activeBooking.service?.category} ·{' '}
                    {formatCurrency(activeBooking.service?.estimatedPrice)}
                  </p>
                </div>
                <StatusBadge status={activeBooking.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-start space-x-2 text-slate-600">
                  <User className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{activeBooking.contactName || activeBooking.customer?.name}</p>
                    <p className="text-slate-500 flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{activeBooking.contactPhone || activeBooking.customer?.phone}</span>
                    </p>
                    {activeBooking.contactEmail && <p className="text-slate-500">{activeBooking.contactEmail}</p>}
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{activeBooking.address}</p>
                    <p className="text-slate-500">
                      {activeBooking.city}{activeBooking.pincode ? ` · ${activeBooking.pincode}` : ''}
                      {activeBooking.landmark ? ` · Near ${activeBooking.landmark}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <CalendarDays className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{formatDate(activeBooking.preferredDate)} · {activeBooking.preferredTime}</p>
                    <p className="text-slate-500">Requested on {formatDate(activeBooking.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    {activeBooking.assignedTechnician ? (
                      <>
                        <p className="font-bold text-slate-900">{activeBooking.assignedTechnician.name}</p>
                        <p className="text-slate-500">{activeBooking.assignedTechnician.phone}</p>
                      </>
                    ) : (
                      <p className="font-bold text-slate-900">Not assigned yet</p>
                    )}
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

            {/* Terminal notice */}
            {['Cancelled', 'Rejected'].includes(activeBooking.status) && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <p className="font-black text-rose-600 text-sm flex items-center space-x-2">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Request {activeBooking.status.toLowerCase()}</span>
                </p>
                {activeBooking.cancellation?.reason && (
                  <p className="text-slate-600">Reason: {activeBooking.cancellation.reason}</p>
                )}
                {!activeBooking.cancellation?.reason && activeBooking.statusHistory?.length > 0 && (
                  <p className="text-slate-500">
                    Reason: {activeBooking.statusHistory[activeBooking.statusHistory.length - 1].reason || 'Not provided'}
                  </p>
                )}
              </div>
            )}

            {/* Timeline */}
            {!['Cancelled', 'Rejected'].includes(activeBooking.status) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">Progress Timeline</p>
                <div className="relative flex items-start">
                  {TIMELINE_STEPS.map((step, i) => {
                    const done = stepIndex >= i;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                        {i > 0 && (
                          <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        )}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        } ${stepIndex === i ? 'ring-4 ring-amber-500/25' : ''}`}>
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
              {isAdminOrStaff && ['Pending', 'Confirmed'].includes(activeBooking.status) && (
                <button
                  onClick={handleConfirm}
                  disabled={busy}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{busy ? 'Updating...' : 'Confirm This Request'}</span>
                </button>
              )}

              {canAssign && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <button
                    onClick={() => setAssignOpen(!assignOpen)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="flex items-center space-x-2 font-black text-slate-900">
                      <UserPlus className="w-4 h-4 text-amber-600" />
                      {activeBooking.assignedTechnician ? 'Reassign Technician' : 'Assign Technician'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${assignOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {assignOpen && (
                    <div className="space-y-3">
                      {loadingAvail ? (
                        <LoadingSpinner message="Checking technician availability..." />
                      ) : availableTechs.length === 0 ? (
                        <p className="text-slate-500 text-center py-2">
                          No approved technicians available for this slot. Try another time or check technician approvals.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {availableTechs.map((t) => (
                            <label
                              key={t._id}
                              className={`flex items-start justify-between gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                                t.available === false
                                  ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                                  : selectedTechId === t._id
                                    ? 'bg-amber-500/10 border-amber-500/50'
                                    : 'bg-white border-slate-200 hover:border-amber-500/30'
                              }`}
                            >
                              <div className="flex items-start space-x-2.5">
                                <input
                                  type="radio"
                                  name="tech"
                                  disabled={t.available === false}
                                  checked={selectedTechId === t._id}
                                  onChange={() => setSelectedTechId(t._id)}
                                  className="mt-1 accent-amber-500"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{t.name}</p>
                                  <p className="text-slate-500 text-[11px]">{t.phone}</p>
                                  {t.available === false && (
                                    <p className="text-[10px] text-rose-600 font-bold mt-0.5">Already booked in this slot</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className={`text-sm font-black ${t.todayJobs >= 4 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {t.todayJobs || 0}
                                </p>
                                <p className="text-[9px] uppercase text-slate-500 font-bold">jobs today</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={handleAssign}
                        disabled={busy || !selectedTechId || loadingAvail}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{busy ? 'Assigning...' : 'Assign Technician'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAdminOrStaff && ['Pending', 'Confirmed', 'Assigned'].includes(activeBooking.status) && (
                <div className="flex flex-wrap gap-2">
                  {technicians.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                      <select
                        value={selectedTechId || ''}
                        onChange={(e) => {
                          // Fallback quick-pick for edge cases where the availability check is empty
                          const tid = e.target.value;
                          setSelectedTechId(tid);
                          if (tid) setAssignOpen(true);
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
                      >
                        <option value="">Quick pick technician...</option>
                        {technicians.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.phone || t.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {activeBooking.completionDetails?.workSummary && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Work Summary</p>
                  <p className="text-slate-600">{activeBooking.completionDetails.workSummary}</p>
                </div>
              )}

              {isAdminOrStaff && !['Cancelled', 'Rejected'].includes(activeBooking.status) && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openCancel('Reject')}
                    disabled={busy}
                    className="py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>
                  <button
                    onClick={() => openCancel('Cancel')}
                    disabled={busy}
                    className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-black text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              )}

              {isAdminOrStaff && (
                <button
                  onClick={() => handleDelete(activeBooking._id)}
                  className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-black text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Request</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel / Reject reason modal */}
      <Modal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={cancelAction === 'Reject' ? `Reject Request: ${activeBooking?.bookingNumber}` : `Cancel Booking: ${activeBooking?.bookingNumber}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            {cancelAction === 'Reject'
              ? 'The request will be rejected and the customer will be notified with your reason.'
              : 'The booking will be cancelled and the customer + assigned technician will be notified with your reason.'}
          </p>
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Reason *</label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={cancelAction === 'Reject'
                ? 'e.g. Service not available in this area, duplicate request...'
                : 'e.g. Customer requested, technician unavailable, no longer needed...'}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
          <div className="pt-1 flex justify-end space-x-3">
            <button
              onClick={() => setCancelOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={busy || !cancelReason.trim()}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs disabled:opacity-50"
            >
              {busy ? 'Updating...' : cancelAction === 'Reject' ? 'Confirm Rejection' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
