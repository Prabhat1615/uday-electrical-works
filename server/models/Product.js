import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Please specify product brand'],
    trim: true,
    default: 'Generic'
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    default: 'Ceiling Fans'
  },
  description: {
    type: String,
    required: [true, 'Please add product description']
  },
  mrp: {
    type: Number,
    required: [true, 'Please add MRP'],
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Please add selling price'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 10
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  warranty: {
    type: String,
    default: '1 Year Warranty'
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60'
  },
  images: {
    type: [String],
    default: [],
    validate: [
      function (val) {
        return !val || val.length <= 3;
      },
      'A product can have a maximum of 3 image URLs.'
    ]
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Low Stock'],
    default: 'In Stock'
  }
}, {
  timestamps: true
});

// Database Indexing for High-Performance Queries
// NOTE: sku is unique via the schema field definition above (unique: true).
// No separate productSchema.index({ sku: 1 }) — that was a duplicate index.
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' });

const calculateStatus = (stock) => {
  const stockVal = Number(stock);
  if (isNaN(stockVal) || stockVal <= 0) {
    return 'Out of Stock';
  }
  if (stockVal <= 5) {
    return 'Low Stock';
  }
  return 'In Stock';
};

const processProductImages = (target) => {
  if (!target) return;
  if (Array.isArray(target.images)) {
    const validImgs = target.images
      .filter((img) => typeof img === 'string' && img.trim().length > 0)
      .map((img) => img.trim())
      .slice(0, 3);
    target.images = validImgs;
    if (validImgs.length > 0) {
      target.imageUrl = validImgs[0];
    }
  } else if (target.imageUrl && typeof target.imageUrl === 'string' && target.imageUrl.trim().length > 0) {
    target.images = [target.imageUrl.trim()];
  }
};

productSchema.pre('save', function (next) {
  this.status = calculateStatus(this.stock);
  processProductImages(this);
  next();
});

productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update) {
    let stockVal;
    if (update.stock !== undefined) {
      stockVal = update.stock;
    } else if (update.$set && update.$set.stock !== undefined) {
      stockVal = update.$set.stock;
    }

    if (stockVal !== undefined) {
      const newStatus = calculateStatus(stockVal);
      if (update.$set) {
        update.$set.status = newStatus;
      } else {
        update.status = newStatus;
      }
    }

    if (update.images !== undefined || (update.$set && update.$set.images !== undefined)) {
      const targetObj = update.$set ? update.$set : update;
      processProductImages(targetObj);
    } else if (update.imageUrl || (update.$set && update.$set.imageUrl)) {
      const targetObj = update.$set ? update.$set : update;
      processProductImages(targetObj);
    }
  }
  next();
});

productSchema.pre('updateOne', function (next) {
  const update = this.getUpdate();
  if (update) {
    let stockVal;
    if (update.stock !== undefined) {
      stockVal = update.stock;
    } else if (update.$set && update.$set.stock !== undefined) {
      stockVal = update.$set.stock;
    }

    if (stockVal !== undefined) {
      const newStatus = calculateStatus(stockVal);
      if (update.$set) {
        update.$set.status = newStatus;
      } else {
        update.status = newStatus;
      }
    }

    if (update.images !== undefined || (update.$set && update.$set.images !== undefined)) {
      const targetObj = update.$set ? update.$set : update;
      processProductImages(targetObj);
    } else if (update.imageUrl || (update.$set && update.$set.imageUrl)) {
      const targetObj = update.$set ? update.$set : update;
      processProductImages(targetObj);
    }
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
