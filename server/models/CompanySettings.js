import mongoose from 'mongoose';

const companySettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Uday Electrical Works'
  },
  tagline: {
    type: String,
    default: 'Government Authorized Class-A Industrial Electrical Contractors & Engineers'
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  email: {
    type: String,
    default: 'sales@udayelectrical.com'
  },
  address: {
    type: String,
    default: 'Plot 42, Industrial Development Area, Balanagar, Hyderabad, TS - 500037'
  },
  gstNumber: {
    type: String,
    default: '36AAAAA0000A1Z5'
  },
  bankName: {
    type: String,
    default: 'State Bank of India'
  },
  accountNumber: {
    type: String,
    default: '38901234567'
  },
  ifscCode: {
    type: String,
    default: 'SBIN0001234'
  },
  invoiceFooterNotes: {
    type: String,
    default: 'Thank you for choosing Uday Electrical Works. Warranty valid for 6 months on motor rewinding & transformer overhaul.'
  },
  emailNotificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);
export default CompanySettings;
