import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  address: {
    type: String,
    required: [true, 'Please provide service address']
  },
  preferredDate: {
    type: Date,
    required: [true, 'Please select preferred service date']
  },
  preferredTime: {
    type: String,
    default: '10:00 AM - 12:00 PM'
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Technician On The Way', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  },
  totalCost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
