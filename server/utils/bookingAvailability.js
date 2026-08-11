// Technician slot availability — derived from ACTUAL assignments, never from a
// manually-entered boolean. A technician is considered available for a slot
// only when they are an Approved technician AND have no active assigned job
// (Assigned / Accepted / On The Way / In Progress) overlapping that slot.

import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { isTechnicianAuthorized } from './technicianStatus.js';

// Statuses that occupy a technician's time (booked / in-flight work).
export const ACTIVE_JOB_STATUSES = ['Assigned', 'Accepted', 'On The Way', 'In Progress'];

// Parse a human time slot like '09:00 AM - 12:00 PM', '10:00 AM – 2:00 PM',
// '6:00 PM - 8:00 PM' into comparable minutes-of-day.
export const parseTimeSlot = (slot) => {
  if (!slot) return null;
  const normalized = String(slot).replace(/[–—]/g, '-').trim();
  const parts = normalized.split('-');
  if (parts.length !== 2) return null;

  const parseTime = (raw) => {
    const m = String(raw).trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let hours = parseInt(m[1], 10);
    const minutes = parseInt(m[2], 10);
    const meridiem = m[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const startMin = parseTime(parts[0]);
  const endMin = parseTime(parts[1]);
  if (startMin === null || endMin === null) return null;
  return { startMin, endMin };
};

export const slotsOverlap = (a, b) => {
  if (!a || !b) return true; // unknown slots are treated conservatively as overlapping
  return a.startMin < b.endMin && b.startMin < a.endMin;
};

// Same calendar day comparison (local server day) for a date and a Date field.
const isSameDay = (dateA, dateB) => {
  const d = new Date(dateA);
  const b = new Date(dateB);
  return (
    d.getFullYear() === b.getFullYear() &&
    d.getMonth() === b.getMonth() &&
    d.getDate() === b.getDate()
  );
};

// Does this technician already have an active job overlapping the requested
// slot? excludeBookingId lets the admin reassign the same booking.
export const getConflictingBookings = async ({ technicianId, date, timeSlot, excludeBookingId = null }) => {
  if (!technicianId || !date) return [];

  const techId = String(technicianId);
  const requestedSlot = parseTimeSlot(timeSlot);

  const conflicting = await Booking.find({
    assignedTechnician: techId,
    status: { $in: ACTIVE_JOB_STATUSES }
  }).lean();

  return conflicting.filter((b) => {
    if (excludeBookingId && String(b._id) === String(excludeBookingId)) return false;
    if (!isSameDay(b.preferredDate, date)) return false;
    return slotsOverlap(requestedSlot, parseTimeSlot(b.preferredTime));
  });
};

export const hasSlotConflict = async (technicianId, date, timeSlot, excludeBookingId = null) => {
  const conflicts = await getConflictingBookings({ technicianId, date, timeSlot, excludeBookingId });
  return conflicts.length > 0;
};

// Count this technician's active jobs on a given date (for the admin UI's
// "Today's schedule: N jobs" summary).
export const getDayJobCount = async (technicianId, date) => {
  const jobs = await Booking.find({
    assignedTechnician: technicianId,
    status: { $in: ACTIVE_JOB_STATUSES }
  }).lean();
  return jobs.filter((b) => isSameDay(b.preferredDate, date)).length;
};

// Approved technicians eligible for service work (fail-closed: status must be
// explicitly Approved — Pending / Rejected / unknown are never eligible).
export const getApprovedTechnicians = async () => {
  const techs = await User.find({ role: 'Technician' }).select('-password').lean();
  return techs.filter((t) => isTechnicianAuthorized(t));
};

// Full availability check for a single technician + slot.
export const isTechnicianEligibleForSlot = async ({ technicianId, date, timeSlot, excludeBookingId = null }) => {
  const technician = await User.findById(technicianId).select('-password').lean();
  if (!technician || technician.role !== 'Technician') return false;
  if (!isTechnicianAuthorized(technician)) return false;
  return !(await hasSlotConflict(technicianId, date, timeSlot, excludeBookingId));
};
