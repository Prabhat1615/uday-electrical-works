import mongoose from 'mongoose';

const notificationHistorySchema = new mongoose.Schema({
  recipientPhone: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    enum: ['WhatsApp', 'SMS'],
    default: 'WhatsApp'
  },
  templateName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Delivered', 'Failed'],
    default: 'Sent'
  }
}, {
  timestamps: true
});

const NotificationHistory = mongoose.model('NotificationHistory', notificationHistorySchema);
export default NotificationHistory;
