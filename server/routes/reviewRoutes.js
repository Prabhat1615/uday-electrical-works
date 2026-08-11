import express from 'express';
import {
  createReview,
  getReviews,
  getReviewByBooking,
  getMyTechnicianReviews,
  getTechnicianReviews,
  getMyReviews,
  getReviewById
} from '../controllers/reviewController.js';
import { protect, authorize, requireApproved } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireApproved);

// Customer feedback submission (customer identity is taken from the token)
router.post('/', authorize('Customer'), createReview);

// Management feedback overview
router.get('/', authorize('Admin', 'Staff'), getReviews);

// Feedback for one booking (role/ownership checked inside)
router.get('/booking/:bookingId', getReviewByBooking);

// Technician's own feedback (read-only)
router.get('/technician/me', authorize('Technician'), getMyTechnicianReviews);

// Management / self query of one technician's feedback
router.get('/technician/:technicianId', getTechnicianReviews);

// Customer's own submitted feedback
router.get('/mine', authorize('Customer'), getMyReviews);

// Single review (ownership checked inside)
router.get('/:id', getReviewById);

export default router;
