import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('Admin', 'Staff'), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, authorize('Admin', 'Staff'), updateProduct)
  .delete(protect, authorize('Admin', 'Staff'), deleteProduct);

export default router;
