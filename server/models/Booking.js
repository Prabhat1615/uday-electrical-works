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
  // Contact snapshot (pre-filled from the customer account, editable at booking time)
  contactName: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    required: [true, 'Please provide service address']
  },
  city: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  landmark: {
    type: String,
    default: ''
  },
  preferredDate: {
    type: Date,
    required: [true, 'Please select preferred service date']
  },
  preferredTime: {
    type: String,
    default: '09:00 AM - 12:00 PM'
  },
  // Booking lifecycle:
  // Pending (awaiting assignment) -> Confirmed (optional admin confirmation)
  // -> Assigned (technician assigned, awaiting response) -> Accepted
  // -> On The Way -> In Progress -> Completed
  // Terminal states: Completed / Cancelled (customer or admin) / Rejected (admin).
  // 'Technician On The Way' is a legacy value mapped to 'On The Way' on save.
  status: {
    type: String,
    enum: [
      'Pending', 'Confirmed', 'Assigned', 'Accepted', 'On The Way',
      'In Progress', 'Completed', 'Cancelled', 'Rejected'
    ],
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
  },
  // Audit trail of status changes (server-side timestamps only)
  statusHistory: [
    {
      status: {
        type: String,
        required: true
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      reason: {
        type: String,
        default: ''
      },
      at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // Record of technicians who declined this assignment (kept for admin visibility)
  declines: [
    {
      technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        default: ''
      },
      at: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // Optional completion details captured when the technician marks the job Completed
  completionDetails: {
    workSummary: { type: String, default: '' },
    partsUsed: { type: String, default: '' },
    notes: { type: String, default: '' },
    completedAt: { type: Date, default: null }
  },
  // Cancellation record (customer / technician / admin initiated) with reason
  cancellation: {
    reason: { type: String, default: '' },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    cancelledAt: { type: Date, default: null }
  }
}, {
  timestamps: true
});

// Normalize the legacy 'Technician On The Way' status before validation so old
// records can be updated without breaking the enum.
bookingSchema.pre('validate', function (next) {
  if (this.status === 'Technician On The Way') {
    this.status = 'On The Way';
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
