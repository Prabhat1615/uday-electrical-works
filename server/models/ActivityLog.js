import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'CREATE_BOOKING', 'UPDATE_BOOKING', 'CREATE_INVOICE', 'INVENTORY_CHANGE', 'CREATE_LEAD', 'UPDATE_LEAD', 'SETTINGS_CHANGE', 'BACKUP_EXPORT', 'RESTORE_IMPORT']
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
