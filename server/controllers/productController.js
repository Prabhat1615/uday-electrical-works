import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const computeStockStatus = (stockVal) => {
  const num = Number(stockVal);
  if (isNaN(num) || num <= 0) return 'Out of Stock';
  if (num <= 5) return 'Low Stock';
  return 'In Stock';
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    // Self-healing database check: sync status with stock for any legacy/mismatched records
    await Promise.all([
      Product.updateMany({ stock: { $gt: 5 }, status: 'Out of Stock' }, { $set: { status: 'In Stock' } }),
      Product.updateMany({ stock: { $gt: 0, $lte: 5 }, status: 'Out of Stock' }, { $set: { status: 'Low Stock' } }),
      Product.updateMany({ stock: { $lte: 0 }, status: { $ne: 'Out of Stock' } }, { $set: { status: 'Out of Stock' } })
    ]);

    const { category, search, status } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, products, 'Products retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Staff
export const createProduct = async (req, res, next) => {
  try {
    const { name, brand, category, description, mrp, price, stock, sku, specifications, imageUrl } = req.body;
    const initialStock = Number(stock || 0);

    const product = await Product.create({
      name,
      brand: brand || 'Havells',
      category: category || 'Ceiling Fans',
      description,
      mrp: mrp || price,
      price,
      stock: initialStock,
      status: computeStockStatus(initialStock),
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      specifications: specifications || {},
      imageUrl: imageUrl || undefined
    });

    res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Import Products (CSV / Excel JSON Array)
// @route   POST /api/products/bulk-import
// @access  Private/Admin/Staff
export const bulkImportProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return next(new ApiError(400, 'Please provide an array of products to import'));
    }

    let successCount = 0;
    for (const item of products) {
      const sku = item.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`;
      const itemStock = Number(item.stock || 0);
      await Product.findOneAndUpdate(
        { sku },
        {
          name: item.name,
          brand: item.brand || 'Havells',
          category: item.category || 'Electrical Accessories',
          description: item.description || `${item.brand || 'Brand'} ${item.name}`,
          mrp: Number(item.mrp || item.price || 0),
          price: Number(item.price || 0),
          stock: itemStock,
          sku,
          warranty: item.warranty || '1 Year Warranty',
          status: computeStockStatus(itemStock)
        },
        { upsert: true, new: true, runValidators: true }
      );
      successCount++;
    }

    res.status(200).json(new ApiResponse(200, { imported: successCount }, `Successfully imported/updated ${successCount} products`));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Staff
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Automatically recalculate status if stock is being updated
    if (req.body.stock !== undefined) {
      req.body.status = computeStockStatus(req.body.stock);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Staff
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    await product.deleteOne();
    res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
