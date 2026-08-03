import SalesOrder from '../models/SalesOrder.js';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

const generateSalesOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-SO-${dateStr}-${randomNum}`;
};

const generateInvoiceNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `UEW-INV-${dateStr}-${randomNum}`;
};

// @desc    Get Sales Orders
// @route   GET /api/sales
// @access  Private
export const getSalesOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'Customer') {
      query.customer = req.user._id;
    }

    const sales = await SalesOrder.find(query)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name category price')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, sales, 'Sales orders retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create Sales Order, auto-reduce inventory & generate GST Invoice
// @route   POST /api/sales
// @access  Private (Admin, Staff, Customer)
export const createSalesOrder = async (req, res, next) => {
  try {
    const { customerId, items, paymentStatus, isInterstate, customerGstNumber } = req.body;

    const targetCustomerId = customerId || req.user._id;
    const customer = await User.findById(targetCustomerId);
    if (!customer) {
      return next(new ApiError(404, 'Customer not found'));
    }

    if (!items || items.length === 0) {
      return next(new ApiError(400, 'Sales order must contain at least one item'));
    }

    let calculatedSubtotal = 0;
    const processedItems = [];
    const invoiceItems = [];

    // 1. Verify stock & process items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(new ApiError(404, `Product ID ${item.productId} not found`));
      }

      const qty = Number(item.quantity) || 1;
      if (product.stock < qty) {
        return next(new ApiError(400, `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${qty}`));
      }

      const unitPrice = Number(item.unitPrice || product.price);
      const amt = qty * unitPrice;
      calculatedSubtotal += amt;

      // Auto-reduce product stock
      product.stock -= qty;
      await product.save();

      // Log OUT inventory transaction
      await InventoryTransaction.create({
        product: product._id,
        type: 'OUT',
        quantity: qty,
        reason: `Auto stock out for Sale Order`,
        createdBy: req.user._id
      });

      processedItems.push({
        product: product._id,
        quantity: qty,
        unitPrice,
        amount: amt,
        hsnCode: item.hsnCode || '8501'
      });

      invoiceItems.push({
        description: `${product.name} (${product.category})`,
        quantity: qty,
        unitPrice,
        amount: amt,
        hsnCode: item.hsnCode || '8501'
      });
    }

    // 2. Create Sales Order
    const salesOrder = await SalesOrder.create({
      orderNumber: generateSalesOrderNumber(),
      customer: customer._id,
      items: processedItems,
      totalAmount: calculatedSubtotal,
      paymentStatus: paymentStatus || 'Pending'
    });

    // 3. Auto-Calculate GST Rates & Amounts
    const cgstRate = isInterstate ? 0 : 9;
    const sgstRate = isInterstate ? 0 : 9;
    const igstRate = isInterstate ? 18 : 0;

    const cgstAmount = isInterstate ? 0 : (calculatedSubtotal * 0.09);
    const sgstAmount = isInterstate ? 0 : (calculatedSubtotal * 0.09);
    const igstAmount = isInterstate ? (calculatedSubtotal * 0.18) : 0;
    const taxAmount = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = calculatedSubtotal + taxAmount;

    // 4. Auto Generate GST Invoice
    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      salesOrder: salesOrder._id,
      customer: customer._id,
      customerGstNumber: customerGstNumber || '',
      items: invoiceItems,
      subtotal: calculatedSubtotal,
      isInterstate: !!isInterstate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      taxAmount,
      totalAmount: grandTotal,
      paymentStatus: paymentStatus === 'Paid' ? 'Paid' : 'Unpaid',
      paymentMethod: paymentStatus === 'Paid' ? 'Bank Transfer' : 'Pending',
      paidAt: paymentStatus === 'Paid' ? new Date() : null
    });

    await createNotification({
      userId: customer._id,
      title: 'Sales Order & Invoice Generated',
      message: `Sales Order ${salesOrder.orderNumber} placed. Tax invoice ${invoice.invoiceNumber} has been issued.`,
      type: 'Invoice'
    });

    const populatedSO = await SalesOrder.findById(salesOrder._id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name category price');

    res.status(201).json(new ApiResponse(201, { salesOrder: populatedSO, invoice }, 'Sales Order created & invoice generated successfully'));
  } catch (error) {
    next(error);
  }
};
