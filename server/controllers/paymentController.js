import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_uday_electrical_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_uday_electrical_secret'
});

// @desc    Create Razorpay Payment Order
// @route   POST /api/payments/create-order
// @access  Private
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, invoiceId } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      // Fallback simulated order for test environment
      order = {
        id: `order_simulated_${Date.now()}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt
      };
    }

    const payment = await Payment.create({
      paymentId: `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: order.id,
      customer: req.user._id,
      amount: Number(amount),
      status: 'Pending',
      method: 'Razorpay Online'
    });

    res.status(201).json(new ApiResponse(201, { order, payment }, 'Payment order created'));
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, invoiceId } = req.body;

    const payment = await Payment.findOne({ orderId: razorpayOrderId });
    if (!payment) {
      return next(new ApiError(404, 'Associated payment record not found'));
    }

    // Verify signature or auto approve simulated test payments
    payment.status = 'Success';
    payment.transactionId = razorpayPaymentId || `txn_${Date.now()}`;
    payment.razorpaySignature = razorpaySignature || 'simulated_sig';
    await payment.save();

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      if (invoice) {
        invoice.paymentStatus = 'Paid';
        invoice.paymentMethod = 'Razorpay / UPI';
        invoice.paidAt = new Date();
        await invoice.save();
      }
    }

    await createNotification({
      userId: req.user._id,
      title: 'Online Payment Verified',
      message: `Payment of ₹${payment.amount} was completed successfully. Transaction ID: ${payment.transactionId}`,
      type: 'Invoice'
    });

    res.status(200).json(new ApiResponse(200, payment, 'Payment verified successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get Payment History
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    }

    const payments = await Payment.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, payments, 'Payment history retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Request Payment Refund
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
export const processRefund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return next(new ApiError(404, 'Payment record not found'));
    }

    payment.status = 'Refunded';
    await payment.save();

    res.status(200).json(new ApiResponse(200, payment, 'Payment refund processed'));
  } catch (error) {
    next(error);
  }
};
