import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import FieldServiceReport from '../models/FieldServiceReport.js';
import Invoice from '../models/Invoice.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';
import { isTechnicianAuthorized } from '../utils/technicianStatus.js';
import {
  ACTIVE_JOB_STATUSES,
  getApprovedTechnicians,
  getDayJobCount,
  hasSlotConflict,
  isTechnicianEligibleForSlot
} from '../utils/bookingAvailability.js';
import {
  sendBookingConfirmationEmail,
  sendBookingAssignedEmail,
  sendBookingCompletedEmail
} from '../services/emailService.js';

// Helper to generate unique booking number
const generateBookingNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-BK-${dateStr}-${randomNum}`;
};

// Helper to generate unique invoice number (matches invoiceController format)
const generateInvoiceNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-INV-${dateStr}-${randomNum}`;
};

// Notify every Admin/Staff account (management users receive all service requests).
const notifyManagement = async (title, message, type = 'Booking') => {
  const managers = await User.find({ role: { $in: ['Admin', 'Staff'] } }).select('_id').lean();
  await Promise.all(
    managers.map((m) => createNotification({ userId: m._id, title, message, type }))
  );
};

const pushStatusHistory = async (booking, status, changedBy, reason = '') => {
  booking.statusHistory.push({ status, changedBy, reason, at: new Date() });
  booking.status = status;
};

const populateBooking = (query) =>
  query
    .populate('service', 'title category estimatedPrice estimatedDuration imageUrl')
    .populate('customer', 'name email phone address')
    .populate('assignedTechnician', 'name email phone skills specialization status')
    .populate('statusHistory.changedBy', 'name role')
    .populate('declines.technician', 'name phone');

// Terminal states can never be left (except by data repair).
const TERMINAL_STATUSES = ['Completed', 'Cancelled', 'Rejected'];

const isTerminal = (status) => TERMINAL_STATUSES.includes(status);

// Allowed technician-driven transitions. Completed is terminal; a technician
// may cancel (Unable to Complete) with a mandatory reason after accepting.
const TECHNICIAN_TRANSITIONS = {
  Accepted: ['On The Way', 'In Progress', 'Cancelled'],
  'On The Way': ['In Progress', 'Cancelled'],
  'In Progress': ['Completed', 'Cancelled'],
  Assigned: ['Accepted']
};

// Statuses a CUSTOMER may cancel on their own request (before any work starts).
const CUSTOMER_CANCELLABLE_STATUSES = ['Pending', 'Confirmed', 'Assigned'];

// Statuses a TECHNICIAN may cancel (Unable to Complete) after accepting.
const TECHNICIAN_CANCELLABLE_STATUSES = ['Accepted', 'On The Way', 'In Progress'];

// Booking statuses the Admin may assign a technician to.
const ASSIGNABLE_STATUSES = ['Pending', 'Confirmed', 'Assigned'];

const isDateInPast = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d < today;
};

// Shared completion handling: completionDetails, field-service report, auto
// invoice, customer + management notifications and completion email. Used by
// the status endpoint, the legacy update endpoint and field-report submission.
const applyCompletion = async (booking, completionDetails, changedBy) => {
  booking.completionDetails = {
    workSummary: completionDetails?.workSummary || '',
    partsUsed: completionDetails?.partsUsed || '',
    notes: completionDetails?.notes || '',
    completedAt: new Date()
  };

  // Field-job integration: create a FieldServiceReport if none exists yet,
  // so the existing field-service architecture reflects the completed job.
  const existingReport = await FieldServiceReport.findOne({ booking: booking._id });
  if (!existingReport && booking.assignedTechnician) {
    await FieldServiceReport.create({
      booking: booking._id,
      technician: booking.assignedTechnician,
      notes: completionDetails?.workSummary || '',
      completionDate: new Date()
    });
  }

  // Auto-create the invoice for the completed service job.
  // The invoice appears in the customer's "My Invoices" and the shop's
  // billing module; payment is collected on delivery or at the shop.
  try {
    const existingInvoice = await Invoice.findOne({ booking: booking._id });
    if (!existingInvoice) {
      const service = await Service.findById(booking.service);
      const unitPrice = Number(booking.totalCost) || Number(service?.estimatedPrice) || 0;
      await Invoice.create({
        invoiceNumber: generateInvoiceNumber(),
        booking: booking._id,
        customer: booking.customer,
        items: [
          {
            description: service?.title || 'Electrical service visit',
            quantity: 1,
            unitPrice,
            amount: unitPrice
          }
        ],
        totalAmount: unitPrice,
        paymentStatus: 'Unpaid',
        paymentMethod: 'Pending'
      });
    }
  } catch (invoiceError) {
    console.error(`Auto-invoice failed for booking ${booking.bookingNumber}:`, invoiceError.message);
  }

  await createNotification({
    userId: booking.customer,
    title: 'Your service has been completed',
    message: `Your service has been completed. We'd love to hear about your experience, rate your service ${booking.bookingNumber} from My Service Bookings.`,
    type: 'Booking'
  });

  await notifyManagement(
    'Service job completed',
    `${booking.bookingNumber} has been marked Completed by ${changedBy?.name || 'the field team'}. An invoice has been issued.`
  );

  const customer = await User.findById(booking.customer);
  const serviceTitle = (await Service.findById(booking.service))?.title || 'Service';
  await sendBookingCompletedEmail(
    customer?.email || booking.contactEmail,
    booking.bookingNumber,
    serviceTitle
  );
};

// Shared cancellation handling: records the cancellation metadata and
// notifies the customer, management and the assigned technician. The status
// transition itself is recorded by the caller via pushStatusHistory.
const recordCancellation = async (booking, reason, changedBy) => {
  booking.cancellation = {
    reason,
    cancelledBy: changedBy._id,
    cancelledAt: new Date()
  };

  const actorName = changedBy.name || 'The shop';
  await createNotification({
    userId: booking.customer,
    title: 'Your service request was cancelled',
    message: `Your service request ${booking.bookingNumber} was cancelled. Reason: ${reason}.`,
    type: 'Booking'
  });
  await notifyManagement(
    'Service request cancelled',
    `${booking.bookingNumber} was cancelled by ${actorName}. Reason: ${reason}.`
  );
  if (booking.assignedTechnician) {
    await createNotification({
      userId: booking.assignedTechnician,
      title: 'Assignment cancelled',
      message: `Job ${booking.bookingNumber} has been cancelled. Reason: ${reason}.`,
      type: 'Booking'
    });
  }
};

// @desc    Create a new service booking
// @route   POST /api/bookings
// @access  Private (Customer, Staff, Admin)
export const createBooking = async (req, res, next) => {
  try {
    const {
      serviceId,
      serviceType,
      address,
      city,
      pincode,
      landmark,
      preferredDate,
      preferredTime,
      notes,
      contactName,
      contactPhone,
      contactEmail
    } = req.body;

    let targetService = null;

    if (serviceId) {
      targetService = await Service.findById(serviceId).catch(() => null);
    }

    if (!targetService && serviceType) {
      targetService = await Service.findOne({ title: { $regex: serviceType, $options: 'i' } });
    }

    if (!targetService) {
      targetService = (await Service.findOne({ status: 'Active' })) || (await Service.findOne());
    }

    if (!targetService || !address || !preferredDate) {
      return next(new ApiError(400, 'Service, address and preferred date are required'));
    }

    if (isDateInPast(preferredDate)) {
      return next(new ApiError(400, 'Preferred service date cannot be in the past'));
    }

    const service = targetService;

    const booking = await Booking.create({
      bookingNumber: generateBookingNumber(),
      customer: req.user._id,
      service: service._id,
      contactName: contactName || req.user.name || '',
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
      address,
      city: city || '',
      pincode: pincode || '',
      landmark: landmark || '',
      preferredDate,
      preferredTime: preferredTime || '09:00 AM - 12:00 PM',
      notes: notes || '',
      totalCost: service.estimatedPrice,
      status: 'Pending',
      statusHistory: [{ status: 'Pending', changedBy: req.user._id, reason: 'Service request received', at: new Date() }]
    });

    const populatedBooking = await populateBooking(Booking.findById(booking._id));

    // Customer notification
    await createNotification({
      userId: req.user._id,
      title: 'Service request received',
      message: `Your service request ${booking.bookingNumber} for ${service.title} has been received. We will assign a technician soon.`,
      type: 'Booking'
    });

    // Management notification
    await notifyManagement(
      'New service request received',
      `${booking.bookingNumber} - ${service.title} for ${req.user.name}, requested ${new Date(preferredDate).toLocaleDateString()} (${preferredTime || 'slot TBD'}).`
    );

    // Email confirmation (SMTP configured => real email, otherwise dev log fallback)
    await sendBookingConfirmationEmail(
      contactEmail || req.user.email,
      booking.bookingNumber,
      service.title,
      `${new Date(preferredDate).toLocaleDateString()} (${preferredTime || ''})`
    );

    res.status(201).json(new ApiResponse(201, populatedBooking, 'Service request received'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings (Role-filtered)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    let query = {};

    // Customer sees only own bookings
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    }
    // Technician sees only assigned bookings
    else if (req.user.role === 'Technician') {
      query.assignedTechnician = req.user._id;
    }
    // Staff & Admin see all bookings (optional status filter)
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await populateBooking(Booking.find(query).sort({ createdAt: -1 }));

    res.status(200).json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await populateBooking(Booking.findById(req.params.id));

    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Auth check: Customer can only view own booking; Technician only assigned
    if (
      req.user.role === 'Customer' &&
      booking.customer._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, 'Access denied to this booking record'));
    }
    if (
      req.user.role === 'Technician' &&
      booking.assignedTechnician?._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, 'Access denied to unassigned technician booking'));
    }

    res.status(200).json(new ApiResponse(200, booking, 'Booking details fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc    Available approved technicians for a booking's requested slot
// @route   GET /api/bookings/available-technicians?bookingId=
// @access  Private (Admin, Staff)
export const getAvailableTechnicians = async (req, res, next) => {
  try {
    const { bookingId } = req.query;
    if (!bookingId) {
      return next(new ApiError(400, 'bookingId query parameter is required'));
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    const approved = await getApprovedTechnicians();

    const result = await Promise.all(
      approved.map(async (tech) => {
        const conflicting = await hasSlotConflict(
          tech._id,
          booking.preferredDate,
          booking.preferredTime,
          booking._id
        );
        const todayJobs = await getDayJobCount(tech._id, booking.preferredDate);
        return {
          _id: tech._id,
          name: tech.name,
          phone: tech.phone,
          email: tech.email,
          skills: tech.skills || tech.specialization || '',
          experience: tech.experience || '',
          available: !conflicting,
          todayJobs,
          requestedSlot: booking.preferredTime
        };
      })
    );

    // Available first, then by fewer jobs today
    result.sort((a, b) => (a.available === b.available ? a.todayJobs - b.todayJobs : a.available ? -1 : 1));

    res.status(200).json(
      new ApiResponse(200, { technicians: result, booking: { _id: booking._id, status: booking.status, preferredTime: booking.preferredTime } }, 'Available technicians retrieved')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Assign a technician to a booking (backend-verified)
// @route   POST /api/bookings/:id/assign
// @access  Private (Admin, Staff)
export const assignTechnician = async (req, res, next) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return next(new ApiError(400, 'technicianId is required'));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    if (!ASSIGNABLE_STATUSES.includes(booking.status)) {
      return next(new ApiError(400, `This booking cannot be assigned in its current status (${booking.status})`));
    }

    // Never trust role/status/availability from the frontend — verify everything.
    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'Technician') {
      return next(new ApiError(400, 'Selected user is not a technician'));
    }
    if (!isTechnicianAuthorized(technician)) {
      return next(new ApiError(400, 'This technician is not approved for field work'));
    }

    const isReassign = booking.assignedTechnician?.toString() === technicianId;
    if (await hasSlotConflict(technicianId, booking.preferredDate, booking.preferredTime, isReassign ? booking._id : null)) {
      return next(new ApiError(409, 'This technician already has a conflicting job for the requested slot'));
    }

    booking.assignedTechnician = technician._id;
    await pushStatusHistory(booking, 'Assigned', req.user._id, `Assigned to ${technician.name}`);
    await booking.save();

    const updatedBooking = await populateBooking(Booking.findById(booking._id));

    // Notify the technician
    const serviceTitle = (await Service.findById(booking.service))?.title || 'Electrical Service';
    await createNotification({
      userId: technician._id,
      title: 'New job assigned',
      message: `You have been assigned job ${booking.bookingNumber} (${serviceTitle}) on ${new Date(booking.preferredDate).toLocaleDateString()} (${booking.preferredTime}).`,
      type: 'Booking'
    });

    // Notify the customer
    await createNotification({
      userId: booking.customer,
      title: 'Your electrician has been assigned',
      message: `Technician ${technician.name} has been assigned to your service request ${booking.bookingNumber}.`,
      type: 'Booking'
    });

    // Email the technician (dev fallback logs instead)
    await sendBookingAssignedEmail(
      technician.email,
      technician.name,
      booking.bookingNumber,
      booking.preferredTime,
      new Date(booking.preferredDate).toLocaleDateString()
    );

    res.status(200).json(new ApiResponse(200, updatedBooking, 'Technician assigned successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Technician accepts an assigned job
// @route   POST /api/bookings/:id/accept
// @access  Private (Technician — assigned tech only)
export const acceptJob = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }
    if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'You can only accept jobs assigned to you'));
    }
    if (booking.status !== 'Assigned') {
      return next(new ApiError(400, `Job cannot be accepted from status ${booking.status}`));
    }

    await pushStatusHistory(booking, 'Accepted', req.user._id, 'Technician accepted the job');
    await booking.save();

    await createNotification({
      userId: booking.customer,
      title: 'Your electrician has accepted the job',
      message: `${req.user.name} has accepted your service request ${booking.bookingNumber}.`,
      type: 'Booking'
    });

    const updatedBooking = await populateBooking(Booking.findById(booking._id));
    res.status(200).json(new ApiResponse(200, updatedBooking, 'Job accepted'));
  } catch (error) {
    next(error);
  }
};

// @desc    Technician declines an assigned job (reason required)
// @route   POST /api/bookings/:id/decline
// @access  Private (Technician — assigned tech only)
export const declineJob = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || !String(reason).trim()) {
      return next(new ApiError(400, 'A decline reason is required'));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }
    if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'You can only decline jobs assigned to you'));
    }
    if (booking.status !== 'Assigned') {
      return next(new ApiError(400, `Job cannot be declined from status ${booking.status}`));
    }

    booking.declines.push({ technician: req.user._id, reason: String(reason).trim(), at: new Date() });
    booking.assignedTechnician = null;
    await pushStatusHistory(booking, 'Pending', req.user._id, `Technician declined: ${reason}`);

    // Notify the customer that the assignment changed, and management with the reason.
    await notifyManagement(
      'Technician declined assignment',
      `${booking.bookingNumber} - ${req.user.name} declined. Reason: ${reason}. The request is awaiting reassignment.`
    );
    await createNotification({
      userId: booking.customer,
      title: 'Assignment update',
      message: `Your service request ${booking.bookingNumber} is awaiting a new technician assignment.`,
      type: 'Booking'
    });

    await booking.save();

    const updatedBooking = await populateBooking(Booking.findById(booking._id));
    res.status(200).json(new ApiResponse(200, updatedBooking, 'Job declined, request returned for reassignment'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status with validated transitions
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin, Staff, Technician)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason, completionDetails } = req.body;
    if (!status) {
      return next(new ApiError(400, 'Status is required'));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    if (isTerminal(booking.status)) {
      return next(new ApiError(409, 'Completed jobs cannot be modified.'));
    }

    const isTechnician = req.user.role === 'Technician';
    if (isTechnician) {
      // Ownership: technicians may only update their own assigned jobs.
      if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'You can only update your assigned service jobs'));
      }
      const allowed = TECHNICIAN_TRANSITIONS[booking.status] || [];
      if (!allowed.includes(status)) {
        return next(
          new ApiError(400, `Status transition ${booking.status} → ${status} is not allowed for a technician`)
        );
      }
    } else {
      // Admin/Staff are authoritative, but terminal states are never re-opened
      // through this endpoint, and Assigned requires an actual technician.
      if (status === 'Assigned' && !booking.assignedTechnician) {
        return next(new ApiError(400, 'Assign a technician first (use the assign action)'));
      }
      // Confirming is only valid while the request is still unassigned.
      if (status === 'Confirmed' && booking.status !== 'Pending') {
        return next(new ApiError(400, 'A request can only be confirmed while it is Pending'));
      }
    }

    // Completion requires a work summary regardless of the actor.
    if (status === 'Completed' && !completionDetails?.workSummary?.trim()) {
      return next(new ApiError(400, 'A work summary is required to complete the job'));
    }
    // Technician cancellations (Unable to Complete) require a reason.
    if (isTechnician && status === 'Cancelled' && !String(reason || '').trim()) {
      return next(new ApiError(400, 'A cancellation reason is required'));
    }

    await pushStatusHistory(booking, status, req.user._id, reason || '');

    if (status === 'Completed') {
      await applyCompletion(booking, completionDetails, req.user);
    } else if (status === 'Cancelled' || status === 'Rejected') {
      await recordCancellation(booking, reason || (status === 'Rejected' ? 'Declined by the shop' : 'Unable to complete'), req.user);
    } else if (status === 'On The Way') {
      await createNotification({
        userId: booking.customer,
        title: 'Your electrician is on the way',
        message: `${req.user.name} is on the way for service request ${booking.bookingNumber}.`,
        type: 'Booking'
      });
    } else if (status === 'In Progress') {
      await createNotification({
        userId: booking.customer,
        title: 'Work in progress',
        message: `Work has started on your service request ${booking.bookingNumber}.`,
        type: 'Booking'
      });
    }

    await booking.save();

    const updatedBooking = await populateBooking(Booking.findById(booking._id));
    res.status(200).json(new ApiResponse(200, updatedBooking, 'Booking status updated'));
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (role-aware)
// @route   POST /api/bookings/:id/cancel
// @access  Private (Customer — own booking; Technician — assigned job;
//          Admin/Staff — any non-terminal booking)
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!String(reason || '').trim()) {
      return next(new ApiError(400, 'A cancellation reason is required'));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }
    if (isTerminal(booking.status)) {
      return next(new ApiError(400, `This booking is already ${booking.status} and cannot be cancelled`));
    }

    if (req.user.role === 'Customer') {
      // Customers can only cancel their own request, before any work starts.
      if (String(booking.customer) !== String(req.user._id)) {
        return next(new ApiError(403, 'You can only cancel your own service requests'));
      }
      if (!CUSTOMER_CANCELLABLE_STATUSES.includes(booking.status)) {
        return next(
          new ApiError(400, `Your request is ${booking.status} and can no longer be cancelled directly`)
        );
      }
    } else if (req.user.role === 'Technician') {
      // Technicians can only cancel jobs assigned to them, after accepting.
      if (String(booking.assignedTechnician) !== String(req.user._id)) {
        return next(new ApiError(403, 'You can only cancel jobs assigned to you'));
      }
      if (!TECHNICIAN_CANCELLABLE_STATUSES.includes(booking.status)) {
        return next(
          new ApiError(400, `This job cannot be cancelled from status ${booking.status}`)
        );
      }
    }
    // Admin/Staff: any non-terminal booking (checked above).

    await pushStatusHistory(booking, 'Cancelled', req.user._id, String(reason).trim());
    await recordCancellation(booking, String(reason).trim(), req.user);
    await booking.save();

    const updatedBooking = await populateBooking(Booking.findById(booking._id));
    res.status(200).json(new ApiResponse(200, updatedBooking, 'Service request cancelled'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking (legacy generic update — kept for compatibility,
//          now with technician transition validation)
// @route   PUT /api/bookings/:id
// @access  Private (Admin, Staff, Technician)
export const updateBooking = async (req, res, next) => {
  try {
    const { status, assignedTechnician, totalCost, notes } = req.body;
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Technicians can only update notes here; job status (including
    // completion and cancellation) goes through the dedicated, validated
    // status endpoint so completion/cancellation requirements are enforced.
    if (req.user.role === 'Technician') {
      if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'You can only update your assigned service jobs'));
      }
      if (isTerminal(booking.status)) {
        return next(new ApiError(409, 'Completed jobs cannot be modified.'));
      }
      if (status) {
        return next(new ApiError(400, 'Technicians must use the job status endpoint to update job status'));
      }
      if (notes) booking.notes = notes;
    } else {
      // Admin & Staff can update status, assignedTechnician, totalCost, notes
      if (status) {
        if (isTerminal(booking.status)) {
          return next(new ApiError(400, `This booking is ${booking.status} and cannot be reopened`));
        }
        await pushStatusHistory(booking, status, req.user._id);
        if (status === 'Completed') {
          if (!req.body.completionDetails?.workSummary?.trim()) {
            return next(new ApiError(400, 'A work summary is required to complete the job'));
          }
          await applyCompletion(booking, req.body.completionDetails, req.user);
        } else if (status === 'Cancelled') {
          await recordCancellation(booking, req.body.reason || 'Cancelled by management', req.user);
        }
      }
      if (assignedTechnician !== undefined) {
        if (assignedTechnician) {
          const tech = await User.findById(assignedTechnician);
          if (!tech || tech.role !== 'Technician' || !isTechnicianAuthorized(tech)) {
            return next(new ApiError(400, 'Assigned user is not an approved technician'));
          }
        }
        booking.assignedTechnician = assignedTechnician || null;
      }
      if (totalCost !== undefined) booking.totalCost = totalCost;
      if (notes !== undefined) booking.notes = notes;
    }

    await booking.save();

    const updatedBooking = await populateBooking(Booking.findById(booking._id));

    res.status(200).json(new ApiResponse(200, updatedBooking, 'Booking updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin/Staff)
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    await booking.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'Booking deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export { ACTIVE_JOB_STATUSES };
