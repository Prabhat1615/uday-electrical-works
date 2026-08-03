import express from 'express';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('Admin', 'Staff'), getLeads)
  .post(createLead);

router.route('/:id')
  .put(authorize('Admin', 'Staff'), updateLead)
  .delete(authorize('Admin'), deleteLead);

export default router;
