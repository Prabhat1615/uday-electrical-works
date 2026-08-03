import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema({
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
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 1000
  }
}, {
  timestamps: true
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
