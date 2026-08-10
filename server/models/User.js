import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['Admin', 'Staff', 'Technician', 'Customer'],
    default: 'Customer'
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  // Technician onboarding status. Fail-closed role-aware default:
  // any account created with role = Technician that does NOT explicitly
  // set a status lands as 'Pending' (not authorized until an Admin
  // approves). All other roles default to 'Approved' so existing
  // Customer/Admin/Staff behavior is unchanged. Admin-created
  // technicians are explicitly saved with status = 'Approved' because
  // the Admin's creation IS the authorization.
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: function () {
      return this.role === 'Technician' ? 'Pending' : 'Approved';
    }
  },
  // Technician application professional information
  submittedAt: {
    type: Date
  },
  skills: {
    type: String,
    default: ''
  },
  specialization: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  // Approval audit trail (server-side timestamps only)
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  // Immutable application lifecycle events (Submitted / Approved / Rejected)
  applicationHistory: [
    {
      event: {
        type: String,
        enum: ['Submitted', 'Approved', 'Rejected'],
        required: true
      },
      by: {
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
  ]
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
