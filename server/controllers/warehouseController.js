import Warehouse from '../models/Warehouse.js';
import ProductTransfer from '../models/ProductTransfer.js';
import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// @desc    Get warehouses
// @route   GET /api/warehouses
// @access  Private (Admin, Staff)
export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, warehouses, 'Warehouses retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create Warehouse location
// @route   POST /api/warehouses
// @access  Private (Admin)
export const createWarehouse = async (req, res, next) => {
  try {
    const { name, code, location, capacity } = req.body;
    const warehouse = await Warehouse.create({ name, code, location, capacity });
    res.status(201).json(new ApiResponse(201, warehouse, 'Warehouse created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer product between warehouses
// @route   POST /api/warehouses/transfer
// @access  Private (Admin, Staff)
export const transferProduct = async (req, res, next) => {
  try {
    const { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    const transfer = await ProductTransfer.create({
      transferNumber: `UEW-TR-${Date.now().toString().slice(-6)}`,
      product: product._id,
      fromWarehouse: fromWarehouseId,
      toWarehouse: toWarehouseId,
      quantity: Number(quantity),
      status: 'Completed'
    });

    const populatedTransfer = await ProductTransfer.findById(transfer._id)
      .populate('product', 'name category')
      .populate('fromWarehouse', 'name code')
      .populate('toWarehouse', 'name code');

    res.status(201).json(new ApiResponse(201, populatedTransfer, 'Stock transfer completed'));
  } catch (error) {
    next(error);
  }
};
