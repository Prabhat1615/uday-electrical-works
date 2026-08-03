import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please specify service category'],
    enum: [
      'Fan Repair',
      'Fan Installation',
      'Tube Light Installation',
      'LED Light Installation',
      'Switch Repair',
      'Socket Repair',
      'MCB Replacement',
      'House Wiring Repair',
      'Door Bell Installation',
      'Water Pump Repair',
      'Geyser Repair',
      'Exhaust Fan Repair',
      'Cooler Repair',
      'Mixer Grinder Repair',
      'Iron Repair',
      'Electric Kettle Repair',
      'Emergency Electrical Visit',
      'Home Electrical Inspection',
      'Fan Services',
      'Wiring Services',
      'Switch & Socket Services',
      'Lighting Services',
      'MCB Services',
      'Water Pump Services',
      'Geyser Services',
      'Appliance Repair Services',
      'Emergency Electrical Services'
    ],
    default: 'House Wiring Repair'
  },
  description: {
    type: String,
    required: [true, 'Please add service description']
  },
  estimatedDuration: {
    type: String,
    default: '1-2 Hours'
  },
  estimatedPrice: {
    type: Number,
    required: [true, 'Please add estimated service price'],
    min: 0
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
