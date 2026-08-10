import express from 'express';
import {
  applyAsTechnician,
  getApplicationStatus
} from '../controllers/technicianController.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public onboarding — the controller forces role = Technician, status = Pending.
router.post('/apply', validateRequest(['name', 'email', 'phone', 'address', 'password', 'confirmPassword']), applyAsTechnician);
router.post('/application/status', validateRequest(['email']), getApplicationStatus);

export default router;
