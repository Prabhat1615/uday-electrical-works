import mongoose from 'mongoose';

const amcSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: [true, 'Please specify service type for AMC'],
    enum: ['Motor Maintenance', 'Transformer Oil BDV Test', 'HT/LT Panel Audit', 'Full Factory Electrical Care']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  visitFrequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Bi-Annual'],
    default: 'Quarterly'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Renewed', 'Cancelled'],
    default: 'Active'
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const AMC = mongoose.model('AMC', amcSchema);
export default AMC;
