import express from 'express';
import { getAnalyticsData, getExportReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));

router.get('/analytics', getAnalyticsData);
router.get('/export/:type', getExportReport);

export default router;
