import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide supplier name'],
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
  gstNumber: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
