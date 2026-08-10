import express from 'express';
import { getFieldReports, submitFieldReport } from '../controllers/fieldServiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFieldReports)
  .post(authorize('Admin', 'Staff', 'Technician'), submitFieldReport);

export default router;
