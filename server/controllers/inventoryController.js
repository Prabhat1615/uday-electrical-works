import InventoryTransaction from '../models/InventoryTransaction.js';
import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Log inventory transaction (IN / OUT / ADJUSTMENT) & update stock
// @route   POST /api/inventory/transaction
// @access  Private (Admin, Staff)
export const logInventoryTransaction = async (req, res, next) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return next(new ApiError(400, 'Transaction quantity must be a positive number'));
    }

    // Update stock logic
    if (type === 'IN') {
      product.stock += qty;
    } else if (type === 'OUT') {
      if (product.stock < qty) {
        return next(new ApiError(400, `Insufficient stock! Current stock: ${product.stock}, requested: ${qty}`));
      }
      product.stock -= qty;
    } else if (type === 'ADJUSTMENT') {
      // In adjustment, quantity is the new set value
      product.stock = qty;
    } else {
      return next(new ApiError(400, 'Invalid transaction type. Must be IN, OUT, or ADJUSTMENT'));
    }

    await product.save();

    // Log transaction
    const transaction = await InventoryTransaction.create({
      product: product._id,
      type,
      quantity: qty,
      reason: reason || `Manual stock ${type.toLowerCase()}`,
      createdBy: req.user._id
    });

    // Check low stock trigger
    if (product.stock <= 5) {
      await createNotification({
        userId: req.user._id,
        title: 'Low Stock Alert',
        message: `Product '${product.name}' stock dropped to ${product.stock} units.`,
        type: 'StockAlert'
      });
    }

    const populatedTx = await InventoryTransaction.findById(transaction._id)
      .populate('product', 'name category stock price')
      .populate('createdBy', 'name email');

    res.status(201).json(new ApiResponse(201, { transaction: populatedTx, currentStock: product.stock }, 'Stock transaction recorded'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory history logs
// @route   GET /api/inventory/history
// @access  Private (Admin, Staff)
export const getInventoryHistory = async (req, res, next) => {
  try {
    const { productId, type } = req.query;
    let query = {};

    if (productId) query.product = productId;
    if (type) query.type = type;

    const history = await InventoryTransaction.find(query)
      .populate('product', 'name category stock imageUrl')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, history, 'Inventory history retrieved'));
  } catch (error) {
    next(error);
  }
};
