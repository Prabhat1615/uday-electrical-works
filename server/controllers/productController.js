import Product from '../models/Product.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

const computeStockStatus = (stockVal) => {
  const num = Number(stockVal);
  if (isNaN(num) || num <= 0) return 'Out of Stock';
  if (num <= 5) return 'Low Stock';
  return 'In Stock';
};

const SAMPLE_GALLERY = {
  'Ceiling Fans': [
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1540518614846-7ede433c517a?w=800&auto=format&fit=crop&q=60'
  ],
  'Exhaust Fans': [
    'https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60'
  ],
  'LED Bulbs': [
    'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&auto=format&fit=crop&q=60'
  ],
  'LED Battens': [
    'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=60'
  ],
  'Modular Switches': [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60'
  ],
  'default': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=800&auto=format&fit=crop&q=60'
  ]
};

// Helper: Ensures products in DB have multi-image gallery arrays
const populateProductGallery = async (products) => {
  if (!Array.isArray(products)) return;
  for (const product of products) {
    let imgs = Array.isArray(product.images) ? product.images.filter((x) => typeof x === 'string' && x.trim().length > 0) : [];
    if (imgs.length === 0 && product.imageUrl) {
      imgs = [product.imageUrl];
    }
    if (imgs.length < 2) {
      const sample = SAMPLE_GALLERY[product.category] || SAMPLE_GALLERY.default;
      for (const sampleUrl of sample) {
        if (imgs.length < 3 && !imgs.includes(sampleUrl)) {
          imgs.push(sampleUrl);
        }
      }
      product.images = imgs;
      await Product.updateOne({ _id: product._id }, { $set: { images: imgs, imageUrl: imgs[0] } });
    }
  }
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
    
    // Automatic backfill: ensure products have multi-image gallery arrays
    await populateProductGallery(products);

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
    await populateProductGallery([product]);
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
    const { name, brand, category, description, mrp, price, stock, sku, specifications, imageUrl, images: rawImages } = req.body;
    const initialStock = Number(stock || 0);

    let images = [];
    if (Array.isArray(rawImages)) {
      images = rawImages
        .filter((img) => typeof img === 'string' && img.trim().length > 0)
        .map((img) => img.trim())
        .slice(0, 3);
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      images = [imageUrl.trim()];
    }

    const primaryImage = images.length > 0 ? images[0] : (imageUrl ? imageUrl.trim() : undefined);

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
      imageUrl: primaryImage,
      images
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

      let itemImages = [];
      if (Array.isArray(item.images)) {
        itemImages = item.images
          .filter((img) => typeof img === 'string' && img.trim().length > 0)
          .map((img) => img.trim())
          .slice(0, 3);
      } else if (item.imageUrl || item.image) {
        const single = (item.imageUrl || item.image).toString().trim();
        if (single) itemImages = [single];
      }

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
          status: computeStockStatus(itemStock),
          imageUrl: itemImages.length > 0 ? itemImages[0] : (item.imageUrl || item.image || undefined),
          images: itemImages
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

    // Normalize images array if provided
    if (Array.isArray(req.body.images)) {
      const validImgs = req.body.images
        .filter((img) => typeof img === 'string' && img.trim().length > 0)
        .map((img) => img.trim())
        .slice(0, 3);
      req.body.images = validImgs;
      if (validImgs.length > 0) {
        req.body.imageUrl = validImgs[0];
      }
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
