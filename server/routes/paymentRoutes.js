import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  processRefund
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);
router.post('/:id/refund', authorize('Admin'), processRefund);

export default router;
