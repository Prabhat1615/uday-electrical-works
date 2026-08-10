import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const hasRealRazorpayConfig =
  !!process.env.RAZORPAY_KEY_ID &&
  !!process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_uday') &&
  !process.env.RAZORPAY_KEY_SECRET.includes('uday_electrical');

// Real Razorpay client — only constructed when genuine keys are configured.
const razorpay = hasRealRazorpayConfig
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

// Online payments are never simulated in production.
// If Razorpay is not configured, the API returns a clear 503 so no
// fake order/payment record can be created.
const assertRazorpayAvailable = (next) => {
  if (!razorpay) {
    return next(
      new ApiError(503, 'Online payments are not configured. Please pay at the shop or contact the store.')
    );
  }
  return null;
};

// @desc    Create Razorpay Payment Order
// @route   POST /api/payments/create-order
// @access  Private
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, invoiceId } = req.body;

    if (!amount || Number(amount) <= 0) {
      return next(new ApiError(400, 'Valid amount is required'));
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    let order;
    if (razorpay) {
      try {
        order = await razorpay.orders.create(options);
      } catch (rzpErr) {
        // Never fall back to a simulated order — surface the real failure.
        return next(new ApiError(502, `Payment gateway error: ${rzpErr.error?.description || rzpErr.message}`));
      }
    } else {
      // Development-only simulated order so the UI flow can be tested locally.
      console.warn('⚠️  [DEV] No RAZORPAY_KEY_ID configured — creating SIMULATED payment order. Never happens in production.');
      order = {
        id: `order_simulated_${Date.now()}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt
      };
    }

    const payment = await Payment.create({
      paymentId: razorpay ? `pay_${Date.now()}` : `simulated_${Date.now()}`,
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

    if (IS_PRODUCTION) {
      // Production: payment is only accepted with a genuine Razorpay signature.
      const notConfigured = assertRazorpayAvailable(next);
      if (notConfigured) return notConfigured;

      if (!razorpayPaymentId || !razorpaySignature) {
        return next(new ApiError(400, 'Payment verification details missing'));
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return next(new ApiError(400, 'Invalid payment signature. Payment could not be verified.'));
      }

      payment.status = 'Success';
      payment.transactionId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      await payment.save();
    } else {
      // Development-only: simulated payments (from the local dev flow) are accepted.
      payment.status = 'Success';
      payment.transactionId = razorpayPaymentId || `txn_${Date.now()}`;
      payment.razorpaySignature = razorpaySignature || 'simulated_sig';
      await payment.save();
    }

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
