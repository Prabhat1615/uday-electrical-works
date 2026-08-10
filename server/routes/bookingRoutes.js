import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect, authorize, requireApproved } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireApproved);

router
  .route('/')
  .post(createBooking)
  .get(getBookings);

router
  .route('/:id')
  .get(getBookingById)
  .put(authorize('Admin', 'Staff', 'Technician'), updateBooking)
  .delete(authorize('Admin', 'Staff'), deleteBooking);

export default router;
