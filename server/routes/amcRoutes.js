import express from 'express';
import { getAMCs, createAMC, renewAMC } from '../controllers/amcController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAMCs)
  .post(authorize('Admin', 'Staff'), createAMC);

router.put('/:id/renew', authorize('Admin', 'Staff'), renewAMC);

export default router;
