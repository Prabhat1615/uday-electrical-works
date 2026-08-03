import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus
} from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getInvoices)
  .post(authorize('Admin', 'Staff'), createInvoice);

router
  .route('/:id')
  .get(getInvoiceById)
  .put(authorize('Admin', 'Staff'), updateInvoiceStatus);

export default router;
