import express from 'express';
import { getBranches, createBranch } from '../controllers/branchController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBranches)
  .post(authorize('Admin'), createBranch);

export default router;
