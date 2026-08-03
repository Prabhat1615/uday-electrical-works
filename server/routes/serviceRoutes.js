import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(protect, authorize('Admin', 'Staff'), createService);

router
  .route('/:id')
  .get(getServiceById)
  .put(protect, authorize('Admin', 'Staff'), updateService)
  .delete(protect, authorize('Admin', 'Staff'), deleteService);

export default router;
