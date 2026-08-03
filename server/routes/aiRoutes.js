import express from 'express';
import { askAiAssistant, getInventoryForecast } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', askAiAssistant);
router.get('/forecast', protect, authorize('Admin', 'Staff'), getInventoryForecast);

export default router;
