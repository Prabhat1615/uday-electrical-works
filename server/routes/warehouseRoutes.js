import express from 'express';
import { getWarehouses, createWarehouse, transferProduct } from '../controllers/warehouseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));

router.route('/')
  .get(getWarehouses)
  .post(authorize('Admin'), createWarehouse);

router.post('/transfer', transferProduct);

export default router;
