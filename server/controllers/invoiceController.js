import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const generateInvoiceNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-INV-${dateStr}-${randomNum}`;
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email phone address')
      .populate({
        path: 'booking',
        populate: { path: 'service', select: 'title category' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, invoices, 'Invoices retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate({
        path: 'booking',
        populate: [
          { path: 'service', select: 'title category estimatedPrice' },
          { path: 'assignedTechnician', select: 'name phone' }
        ]
      });

    if (!invoice) {
      return next(new ApiError(404, 'Invoice not found'));
    }

    if (
      req.user.role === 'Customer' &&
      invoice.customer._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, 'Access denied to this invoice'));
    }

    res.status(200).json(new ApiResponse(200, invoice, 'Invoice retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private (Admin, Staff)
export const createInvoice = async (req, res, next) => {
  try {
    const { bookingId, customerId, items, taxAmount, discountAmount, paymentStatus, paymentMethod, dueDate } = req.body;

    let targetCustomerId = customerId;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return next(new ApiError(404, 'Associated booking not found'));
      }
      targetCustomerId = booking.customer;
    }

    if (!targetCustomerId) {
      return next(new ApiError(400, 'Customer ID or valid Booking ID is required'));
    }

    // Calculate subtotal and total
    let calculatedSubtotal = 0;
    const processedItems = (items || []).map(item => {
      const qty = item.quantity || 1;
      const price = item.unitPrice || 0;
      const amt = qty * price;
      calculatedSubtotal += amt;
      return {
        description: item.description,
        quantity: qty,
        unitPrice: price,
        amount: amt
      };
    });

    const tax = Number(taxAmount || 0);
    const discount = Number(discountAmount || 0);
    const totalAmount = Math.max(0, calculatedSubtotal + tax - discount);

    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      booking: bookingId || null,
      customer: targetCustomerId,
      items: processedItems,
      taxAmount: tax,
      discountAmount: discount,
      totalAmount,
      paymentStatus: paymentStatus || 'Unpaid',
      paymentMethod: paymentMethod || 'Pending',
      dueDate: dueDate || undefined
    });

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customer', 'name email phone address')
      .populate('booking');

    res.status(201).json(new ApiResponse(201, populatedInvoice, 'Invoice created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice payment status
// @route   PUT /api/invoices/:id
// @access  Private (Admin, Staff)
export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return next(new ApiError(404, 'Invoice not found'));
    }

    if (paymentStatus) {
      invoice.paymentStatus = paymentStatus;
      if (paymentStatus === 'Paid') {
        invoice.paidAt = new Date();
      }
    }
    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod;
    }

    await invoice.save();

    res.status(200).json(new ApiResponse(200, invoice, 'Invoice payment status updated'));
  } catch (error) {
    next(error);
  }
};
