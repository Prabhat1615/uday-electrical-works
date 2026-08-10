import express from 'express';
import {
  getTechnicianRequests,
  getTechnicianRequestById,
  approveTechnician,
  rejectTechnician
} from '../controllers/adminTechnicianController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only — Staff, Technicians, Customers and guests are rejected.
router.use(protect, authorize('Admin'));

router.route('/')
  .get(getTechnicianRequests);

router.route('/:id')
  .get(getTechnicianRequestById);

router.patch('/:id/approve', approveTechnician);
router.patch('/:id/reject', rejectTechnician);

export default router;
