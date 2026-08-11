import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAvailableTechnicians,
  assignTechnician,
  acceptJob,
  declineJob,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize, requireApproved } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireApproved);

// Available approved technicians for a booking's requested slot (Admin/Staff only)
router
  .route('/available-technicians')
  .get(authorize('Admin', 'Staff'), getAvailableTechnicians);

router
  .route('/')
  .post(createBooking)
  .get(getBookings);

router
  .route('/:id/assign')
  .post(authorize('Admin', 'Staff'), assignTechnician);

router
  .route('/:id/accept')
  .post(authorize('Technician'), acceptJob);

router
  .route('/:id/decline')
  .post(authorize('Technician'), declineJob);

// Role-aware cancellation: customers cancel their own pre-work request,
// technicians cancel (Unable to Complete) their own accepted job, and
// Admin/Staff cancel any non-terminal request.
router
  .route('/:id/cancel')
  .post(authorize('Admin', 'Staff', 'Technician', 'Customer'), cancelBooking);

router
  .route('/:id/status')
  .put(authorize('Admin', 'Staff', 'Technician'), updateBookingStatus);

router
  .route('/:id')
  .get(getBookingById)
  .put(authorize('Admin', 'Staff', 'Technician'), updateBooking)
  .delete(authorize('Admin', 'Staff'), deleteBooking);

export default router;
