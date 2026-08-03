import mongoose from 'mongoose';

const fieldServiceReportSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  beforeImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
  },
  afterImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  },
  customerSignature: {
    type: String,
    default: ''
  },
  materialsUsed: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  notes: {
    type: String,
    default: ''
  },
  completionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const FieldServiceReport = mongoose.model('FieldServiceReport', fieldServiceReportSchema);
export default FieldServiceReport;
