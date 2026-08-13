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

productSchema.pre('save', function (next) {
  this.status = calculateStatus(this.stock);
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
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
