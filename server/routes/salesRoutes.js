import express from 'express';
import { getSalesOrders, createSalesOrder } from '../controllers/salesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSalesOrders)
  .post(createSalesOrder);

export default router;
