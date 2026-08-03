import express from 'express';
import {
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus
} from '../controllers/purchaseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));

router.route('/suppliers')
  .get(getSuppliers)
  .post(createSupplier);

router.route('/orders')
  .get(getPurchaseOrders)
  .post(createPurchaseOrder);

router.put('/orders/:id/status', updatePurchaseOrderStatus);

export default router;
