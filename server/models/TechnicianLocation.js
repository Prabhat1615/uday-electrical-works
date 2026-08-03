import mongoose from 'mongoose';

const technicianLocationSchema = new mongoose.Schema({
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'On Site', 'Traveling', 'Off Duty'],
    default: 'Available'
  },
  currentJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  },
  lastCheckIn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const TechnicianLocation = mongoose.model('TechnicianLocation', technicianLocationSchema);
export default TechnicianLocation;
