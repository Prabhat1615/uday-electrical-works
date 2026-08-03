import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  hsnCode: { type: String, default: '8501' }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  salesOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    default: null
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gstNumber: {
    type: String,
    default: '36AAAAA0000A1Z5' // Uday Electrical Works Default GSTIN
  },
  customerGstNumber: {
    type: String,
    default: ''
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  isInterstate: {
    type: Boolean,
    default: false
  },
  cgstRate: { type: Number, default: 9 }, // 9% CGST
  cgstAmount: { type: Number, default: 0 },
  sgstRate: { type: Number, default: 9 }, // 9% SGST
  sgstAmount: { type: Number, default: 0 },
  igstRate: { type: Number, default: 18 }, // 18% IGST
  igstAmount: { type: Number, default: 0 },
  taxAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Partially Paid'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Pending'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000)
  },
  paidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
