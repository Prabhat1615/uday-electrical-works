import express from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));
router.get('/', getActivityLogs);

export default router;
