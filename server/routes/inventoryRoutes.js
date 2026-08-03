import express from 'express';
import { logInventoryTransaction, getInventoryHistory } from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('Admin', 'Staff'));

router.post('/transaction', logInventoryTransaction);
router.get('/history', getInventoryHistory);

export default router;
