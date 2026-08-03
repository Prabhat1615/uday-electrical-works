import express from 'express';
import { exportData, importData } from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin'));

router.get('/export', exportData);
router.post('/import', importData);

export default router;
