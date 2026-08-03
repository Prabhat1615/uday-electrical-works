import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  method: {
    type: String,
    default: 'Razorpay / UPI'
  },
  transactionId: {
    type: String,
    default: ''
  },
  razorpaySignature: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
