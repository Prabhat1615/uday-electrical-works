import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import SalesOrder from '../models/SalesOrder.js';
import Lead from '../models/Lead.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

// @desc    Export database JSON backup
// @route   GET /api/backup/export
// @access  Private (Admin)
export const exportData = async (req, res, next) => {
  try {
    const backup = {
      version: '3.0',
      timestamp: new Date().toISOString(),
      data: {
        users: await User.find(),
        products: await Product.find(),
        services: await Service.find(),
        bookings: await Booking.find(),
        invoices: await Invoice.find(),
        suppliers: await Supplier.find(),
        purchaseOrders: await PurchaseOrder.find(),
        salesOrders: await SalesOrder.find(),
        leads: await Lead.find()
      }
    };

    res.status(200).json(new ApiResponse(200, backup, 'Database backup generated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Import database JSON restore
// @route   POST /api/backup/import
// @access  Private (Admin)
export const importData = async (req, res, next) => {
  try {
    const { backup } = req.body;
    if (!backup || !backup.data) {
      return next(new ApiError(400, 'Invalid JSON backup format'));
    }

    const { products, services, suppliers, leads } = backup.data;

    if (products && products.length > 0) {
      await Product.deleteMany();
      await Product.insertMany(products);
    }
    if (services && services.length > 0) {
      await Service.deleteMany();
      await Service.insertMany(services);
    }
    if (suppliers && suppliers.length > 0) {
      await Supplier.deleteMany();
      await Supplier.insertMany(suppliers);
    }
    if (leads && leads.length > 0) {
      await Lead.deleteMany();
      await Lead.insertMany(leads);
    }

    res.status(200).json(new ApiResponse(200, {}, 'Database restored successfully from backup'));
  } catch (error) {
    next(error);
  }
};
