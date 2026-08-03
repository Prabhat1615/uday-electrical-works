import express from 'express';
import { getFieldReports, submitFieldReport } from '../controllers/fieldServiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFieldReports)
  .post(submitFieldReport);

export default router;
