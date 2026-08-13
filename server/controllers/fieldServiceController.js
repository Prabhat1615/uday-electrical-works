import FieldServiceReport from '../models/FieldServiceReport.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Get Field Service Job Reports
// @route   GET /api/field-service
// @access  Private (role-scoped: customer sees only own bookings' reports)
export const getFieldReports = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Technician') {
      query.technician = req.user._id;
    } else if (req.user.role === 'Customer') {
      const myBookingIds = await Booking.find({ customer: req.user._id }).select('_id').lean();
      query.booking = { $in: myBookingIds.map((b) => b._id) };
    }

    const reports = await FieldServiceReport.find(query)
      .populate('booking')
      .populate('technician', 'name phone')
      .populate('materialsUsed.product', 'name category price')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, reports, 'Field service reports retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Technician Field Report with Signature & Photos
// @route   POST /api/field-service
// @access  Private (Technician, Admin, Staff)
export const submitFieldReport = async (req, res, next) => {
  try {
    const { bookingId, beforeImage, afterImage, customerSignature, materialsUsed, notes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new ApiError(404, 'Service booking not found'));
    }

    if (booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'Rejected') {
      return next(new ApiError(409, 'Completed jobs cannot be modified.'));
    }

    // Ownership: a technician may only report on a job assigned to them,
    // and only for a job already in progress (prevents status jumps).
    if (req.user.role === 'Technician') {
      if (booking.assignedTechnician?.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, 'You can only submit reports for jobs assigned to you'));
      }
      if (booking.status !== 'In Progress') {
        return next(new ApiError(400, `Field reports can only be submitted while the job is In Progress (current: ${booking.status})`));
      }
      if (!String(notes || '').trim()) {
        return next(new ApiError(400, 'A work summary is required when completing the job'));
      }
    }

    // A booking can have exactly one field-service completion report — update
    // the existing one instead of creating duplicates.
    let report = await FieldServiceReport.findOne({ booking: booking._id });

    // Auto reduce material stock used during service visit
    for (const mat of (materialsUsed || [])) {
      if (mat.productId) {
        const product = await Product.findById(mat.productId);
        if (product && product.stock >= mat.quantity) {
          product.stock -= mat.quantity;
          await product.save();

          await InventoryTransaction.create({
            product: product._id,
            type: 'OUT',
            quantity: mat.quantity,
            reason: `Material consumed during service job ${booking.bookingNumber}`,
            createdBy: req.user._id
          });
        }
      }
    }

    // Update booking status to Completed (terminal state — never reopened)
    if (booking.status !== 'Completed') {
      booking.status = 'Completed';
      booking.completionDetails = {
        workSummary: notes || '',
        partsUsed: (materialsUsed || []).map((m) => `${m.quantity || 1}x`).join(', '),
        notes: notes || '',
        completedAt: new Date()
      };
      booking.statusHistory.push({
        status: 'Completed',
        changedBy: req.user._id,
        reason: 'Field service completion report submitted',
        at: new Date()
      });
      await booking.save();

      await createNotification({
        userId: booking.customer,
        title: 'Your service has been completed',
        message: `Your service request ${booking.bookingNumber} has been marked completed. Thank you for choosing Uday Electrical Works.`,
        type: 'Booking'
      });
    }

    if (report) {
      report.technician = req.user._id;
      report.beforeImage = beforeImage || report.beforeImage;
      report.afterImage = afterImage || report.afterImage;
      report.customerSignature = customerSignature || report.customerSignature;
      report.notes = notes || report.notes;
      report.materialsUsed = (materialsUsed || []).map((m) => ({ product: m.productId, quantity: m.quantity }));
      report.completionDate = new Date();
      await report.save();
    } else {
      report = await FieldServiceReport.create({
        booking: booking._id,
        technician: req.user._id,
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
        customerSignature: customerSignature || '',
        notes: notes || '',
        materialsUsed: (materialsUsed || []).map((m) => ({ product: m.productId, quantity: m.quantity }))
      });
    }

    const populatedReport = await FieldServiceReport.findById(report._id)
      .populate('booking')
      .populate('technician', 'name phone');

    res.status(201).json(new ApiResponse(201, populatedReport, 'Field service completion report submitted'));
  } catch (error) {
    next(error);
  }
};
