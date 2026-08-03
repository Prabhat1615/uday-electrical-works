import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide lead name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide contact phone']
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  serviceRequired: {
    type: String,
    required: [true, 'Please state service or product required']
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'],
    default: 'New'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
