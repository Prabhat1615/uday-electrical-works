import React, { useState } from 'react';
import { CalendarCheck, Search, Filter, UserCheck, Wrench, Trash2, Edit3, CheckCircle2, Clock } from 'lucide-react';
import { useBookings, useUpdateBooking, useDeleteBooking, useUsers } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

export const BookingsManager = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [statusFilter, setStatusFilter] = useState('');
  const [activeBooking, setActiveBooking] = useState(null);

  // Edit / Assign Form State
  const [newStatus, setNewStatus] = useState('');
  const [assignedTechId, setAssignedTechId] = useState('');
  const [cost, setCost] = useState(0);
  const [notes, setNotes] = useState('');

  const { data: res, isLoading } = useBookings({ status: statusFilter });
  const { data: techRes } = useUsers({ role: 'Technician' });
  const updateBookingMutation = useUpdateBooking();
  const deleteBookingMutation = useDeleteBooking();

  const bookings = res?.data || [];
  const technicians = techRes?.data || [];

  const handleOpenEdit = (booking) => {
    setActiveBooking(booking);
    setNewStatus(booking.status);
    setAssignedTechId(booking.assignedTechnician?._id || '');
    setCost(booking.totalCost || booking.service?.estimatedPrice || 0);
    setNotes(booking.notes || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!activeBooking) return;

    try {
      await updateBookingMutation.mutateAsync({
        id: activeBooking._id,
        data: {
          status: newStatus,
          assignedTechnician: assignedTechId || null,
          totalCost: Number(cost),
          notes
        }
      });
      setActiveBooking(null);
    } catch (err) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service booking record?')) {
      try {
        await deleteBookingMutation.mutateAsync(id);
      } catch (err) {
        alert(err.message || 'Failed to delete booking');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Service Bookings Management</h1>
          <p className="text-xs text-slate-400">Track maintenance requests, assign technicians, and update job progress</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((st) => {
            const isSelected = (statusFilter === '' && st === 'All') || statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st === 'All' ? '' : st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching service bookings..." />
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <CalendarCheck className="w-10 h-10 text-amber-500/50 mx-auto" />
          <h3 className="text-base font-bold text-white">No service bookings found</h3>
          <p className="text-xs">There are no records matching your selected status filter.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Service & Customer</th>
                  <th className="px-6 py-4">Assigned Tech</th>
                  <th className="px-6 py-4">Preferred Date</th>
                  <th className="px-6 py-4">Total Fee</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-amber-400">
                      {booking.bookingNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{booking.service?.title || 'Electrical Service'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{booking.customer?.name} ({booking.customer?.phone || 'No Phone'})</p>
                      <span className="text-[10px] text-slate-500 block truncate max-w-xs">{booking.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.assignedTechnician ? (
                        <div className="flex items-center space-x-1.5 text-sky-400 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{booking.assignedTechnician.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {formatDate(booking.preferredDate)}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {formatCurrency(booking.totalCost)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(booking)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors"
                      >
                        {role === 'Technician' ? 'Update Status' : 'Manage'}
                      </button>
                      {(role === 'Admin' || role === 'Staff') && (
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
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

      {/* Edit Booking & Assign Technician Modal */}
      <Modal
        isOpen={!!activeBooking}
        onClose={() => setActiveBooking(null)}
        title={`Manage Booking: ${activeBooking?.bookingNumber}`}
      >
        {activeBooking && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="font-bold text-white">{activeBooking.service?.title}</p>
              <p className="text-slate-400">Customer: {activeBooking.customer?.name} ({activeBooking.customer?.email})</p>
              <p className="text-slate-500">Site: {activeBooking.address}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Job Progress Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {(role === 'Admin' || role === 'Staff') && (
              <>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Assign Electrical Technician
                  </label>
                  <select
                    value={assignedTechId}
                    onChange={(e) => setAssignedTechId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">-- Unassigned --</option>
                    {technicians.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.phone || t.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Total Estimated/Final Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Technician / Service Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add work status comments, parts required..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md"
              >
                Save Updates
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
