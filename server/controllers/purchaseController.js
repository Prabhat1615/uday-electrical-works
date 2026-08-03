import Supplier from '../models/Supplier.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

// Supplier CRUD
export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, suppliers, 'Suppliers retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, email, address, gstNumber } = req.body;
    const supplier = await Supplier.create({ name, phone, email, address, gstNumber });
    res.status(201).json(new ApiResponse(201, supplier, 'Supplier created successfully'));
  } catch (error) {
    next(error);
  }
};

// Generate PO Number
const generatePONumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-PO-${dateStr}-${randomNum}`;
};

// Purchase Order CRUD
export const getPurchaseOrders = async (req, res, next) => {
  try {
    const pos = await PurchaseOrder.find()
      .populate('supplier', 'name phone email gstNumber')
      .populate('items.product', 'name category price stock')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, pos, 'Purchase Orders retrieved'));
  } catch (error) {
    next(error);
  }
};

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplierId, items, status } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return next(new ApiError(404, 'Supplier not found'));
    }

    let calculatedTotal = 0;
    const processedItems = [];

    for (const item of (items || [])) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new ApiError(404, `Product ID ${item.productId} not found`));
      }
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice || product.price);
      const amt = qty * unitPrice;
      calculatedTotal += amt;

      processedItems.push({
        product: product._id,
        quantity: qty,
        unitPrice,
        amount: amt
      });
    }

    const po = await PurchaseOrder.create({
      poNumber: generatePONumber(),
      supplier: supplier._id,
      items: processedItems,
      totalAmount: calculatedTotal,
      status: status || 'Draft'
    });

    // If initial status is Received immediately
    if (po.status === 'Received') {
      await autoIncreaseStockOnReceive(po, req.user._id);
    }

    const populatedPO = await PurchaseOrder.findById(po._id)
      .populate('supplier', 'name phone email')
      .populate('items.product', 'name category');

    res.status(201).json(new ApiResponse(201, populatedPO, 'Purchase Order created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return next(new ApiError(404, 'Purchase order not found'));
    }

    const previousStatus = po.status;
    po.status = status;
    await po.save();

    // Trigger Auto Increase Inventory when transitioning to 'Received'
    if (previousStatus !== 'Received' && status === 'Received') {
      await autoIncreaseStockOnReceive(po, req.user._id);
    }

    res.status(200).json(new ApiResponse(200, po, `Purchase Order status updated to ${status}`));
  } catch (error) {
    next(error);
  }
};

// Internal Helper for Auto Inventory increase
const autoIncreaseStockOnReceive = async (po, userId) => {
  for (const item of po.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();

      // Log Inventory Transaction
      await InventoryTransaction.create({
        product: product._id,
        type: 'IN',
        quantity: item.quantity,
        reason: `Auto stock in from Purchase Order ${po.poNumber}`,
        createdBy: userId
      });
    }
  }
};
