import express from 'express';
import { getSystemHealthMetrics } from '../controllers/healthController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, authorize('Admin'), getSystemHealthMetrics);

export default router;
