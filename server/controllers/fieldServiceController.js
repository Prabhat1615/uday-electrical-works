import FieldServiceReport from '../models/FieldServiceReport.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get Field Service Job Reports
// @route   GET /api/field-service
// @access  Private
export const getFieldReports = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Technician') {
      query.technician = req.user._id;
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

    // Update booking status to Completed
    booking.status = 'Completed';
    await booking.save();

    const report = await FieldServiceReport.create({
      booking: booking._id,
      technician: req.user._id,
      beforeImage: beforeImage || undefined,
      afterImage: afterImage || undefined,
      customerSignature: customerSignature || '',
      notes: notes || '',
      materialsUsed: (materialsUsed || []).map((m) => ({ product: m.productId, quantity: m.quantity }))
    });

    const populatedReport = await FieldServiceReport.findById(report._id)
      .populate('booking')
      .populate('technician', 'name phone');

    res.status(201).json(new ApiResponse(201, populatedReport, 'Field service completion report submitted'));
  } catch (error) {
    next(error);
  }
};
