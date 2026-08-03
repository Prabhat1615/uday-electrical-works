import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import SalesOrder from '../models/SalesOrder.js';
import Lead from '../models/Lead.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Notification from '../models/Notification.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already initialized. Skipping seed.');
      return;
    }

    console.log('Seeding Phase 1 & Phase 2 Enterprise ERP demo data...');

    // 1. Users
    const admin = await User.create({
      name: 'Uday Kiran (Admin)',
      email: 'admin@udayelectrical.com',
      password: 'adminpassword123',
      role: 'Admin',
      phone: '+91 98765 43210',
      address: 'Plot 42, Industrial Development Area, Hyderabad'
    });

    const staff = await User.create({
      name: 'Ramesh Kumar (Staff)',
      email: 'staff@udayelectrical.com',
      password: 'staffpassword123',
      role: 'Staff',
      phone: '+91 98765 43211',
      address: 'Main Branch Store, Hyderabad'
    });

    const tech1 = await User.create({
      name: 'Suresh Varma (Sr. Technician)',
      email: 'tech1@udayelectrical.com',
      password: 'techpassword123',
      role: 'Technician',
      phone: '+91 98765 43212',
      address: 'Kukatpally, Hyderabad'
    });

    const customer1 = await User.create({
      name: 'Sri Lakshmi Industries',
      email: 'customer@srilakshmi.com',
      password: 'customerpassword123',
      role: 'Customer',
      phone: '+91 98765 43213',
      address: 'Phase 3, Balanagar Industrial Area, Hyderabad'
    });

    // 2. Products
    const products = await Product.insertMany([
      {
        name: 'High Performance 3-Phase 10HP Induction Motor',
        category: 'Motors',
        description: 'Heavy duty industrial AC motor with IP55 protection, Class F insulation, copper winding.',
        price: 34500,
        stock: 12,
        specifications: { Power: '10 HP', Voltage: '415V', RPM: '1440', Phase: '3-Phase' },
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
      },
      {
        name: 'Oil Cooled Distribution Transformer 100KVA',
        category: 'Transformers',
        description: '11KV/433V 100KVA step-down transformer built to BIS 1180 energy efficiency levels.',
        price: 185000,
        stock: 3,
        specifications: { Capacity: '100 KVA', PrimaryVoltage: '11 KV', Cooling: 'ONAN' },
        imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=60'
      },
      {
        name: 'Automatic Star Delta Starter Panel 25HP',
        category: 'Control Panels',
        description: 'Fully wired motor control panel equipped with Siemens contactors and overload relay.',
        price: 24000,
        stock: 8,
        specifications: { Rating: '25 HP', Enclosure: 'Powder Coated IP54' },
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
      },
      {
        name: 'Armoured XLPE Copper Cable 4 Core 35 sq.mm (100m Roll)',
        category: 'Wires & Cables',
        description: 'Underground heavy-duty copper power distribution cable with ISI certification.',
        price: 42000,
        stock: 15,
        specifications: { Conductor: 'Copper', Cores: '4 Core', Length: '100 Meters' },
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60'
      }
    ]);

    // 3. Services
    const services = await Service.insertMany([
      {
        title: 'Industrial Motor Rewinding & Overhauling',
        category: 'Rewinding & Overhaul',
        description: 'Complete stator rewinding, dual varnish dip, dynamic balancing, and bearing replacement.',
        estimatedPrice: 8500,
        estimatedDuration: '1-2 Days',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60'
      },
      {
        title: 'Transformer Oil Testing & Filtration',
        category: 'Maintenance',
        description: 'On-site transformer oil dielectric BDV testing, moisture removal, and high vacuum filtration.',
        estimatedPrice: 15000,
        estimatedDuration: '4-6 Hours',
        imageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=60'
      }
    ]);

    // 4. Suppliers
    const supplier1 = await Supplier.create({
      name: 'Siemens India Industrial Supplies',
      phone: '+91 40 2345 6789',
      email: 'orders@siemens-supplies.com',
      address: 'Plot 18, Electronic Complex, Kushaiguda, Hyderabad',
      gstNumber: '36AAACS1234F1Z1'
    });

    // 5. Purchase Order (Received -> auto increased stock)
    await PurchaseOrder.create({
      poNumber: 'UEW-PO-20260803-3001',
      supplier: supplier1._id,
      items: [
        { product: products[0]._id, quantity: 5, unitPrice: 28000, amount: 140000 }
      ],
      totalAmount: 140000,
      status: 'Received'
    });

    await InventoryTransaction.create({
      product: products[0]._id,
      type: 'IN',
      quantity: 5,
      reason: 'Initial PO receipt from Siemens India',
      createdBy: admin._id
    });

    // 6. Sales Order & GST Invoice
    const salesOrder = await SalesOrder.create({
      orderNumber: 'UEW-SO-20260803-4001',
      customer: customer1._id,
      items: [
        { product: products[2]._id, quantity: 1, unitPrice: 24000, amount: 24000, hsnCode: '8537' }
      ],
      totalAmount: 24000,
      paymentStatus: 'Paid'
    });

    await Invoice.create({
      invoiceNumber: 'UEW-INV-20260803-5001',
      salesOrder: salesOrder._id,
      customer: customer1._id,
      gstNumber: '36AAAAA0000A1Z5',
      customerGstNumber: '36AAACS9999K1Z2',
      items: [
        { description: 'Automatic Star Delta Starter Panel 25HP', quantity: 1, unitPrice: 24000, amount: 24000, hsnCode: '8537' }
      ],
      subtotal: 24000,
      isInterstate: false,
      cgstRate: 9,
      cgstAmount: 2160,
      sgstRate: 9,
      sgstAmount: 2160,
      igstRate: 0,
      igstAmount: 0,
      taxAmount: 4320,
      discountAmount: 0,
      totalAmount: 28320,
      paymentStatus: 'Paid',
      paymentMethod: 'Bank Transfer',
      paidAt: new Date()
    });

    // 7. Customer Leads
    await Lead.create({
      name: 'Nagarjuna Fertilizers Pvt Ltd',
      phone: '+91 91234 56789',
      email: 'procurement@nagarjuna.com',
      address: 'Industrial Belt, Kakinada',
      serviceRequired: '1000KVA Transformer Maintenance & Filtration',
      notes: 'Requested emergency quote for plant shutdown next week.',
      status: 'Quoted',
      assignedTo: staff._id
    });

    await Lead.create({
      name: 'Hyderabad Granites & Marble Plant',
      phone: '+91 99887 76655',
      serviceRequired: '50HP Motor Rewinding',
      notes: 'Customer inquired over phone call.',
      status: 'New',
      assignedTo: null
    });

    // 8. Notifications
    await Notification.create({
      user: admin._id,
      title: 'Phase 2 ERP Engine Active',
      message: 'System loaded with GST Invoicing, Auto-Inventory, Purchase Orders & CRM Lead Management.',
      type: 'General'
    });

    console.log('Phase 1 & Phase 2 Enterprise Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
