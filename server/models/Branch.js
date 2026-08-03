import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;
