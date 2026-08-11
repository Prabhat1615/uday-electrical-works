import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// Populate everything the management/technician views need without leaking
// unrelated private customer data (name + phone only).
const populateReview = (query) =>
  query
    .populate('customer', 'name phone')
    .populate('technician', 'name phone')
    .populate({
      path: 'booking',
      populate: { path: 'service', select: 'title category' }
    });

const findBooking = async (bookingId) => {
  if (!bookingId) return null;
  return await Booking.findById(bookingId);
};

// @desc    Submit feedback for a completed service
// @route   POST /api/reviews
// @access  Private (Customer only)
export const createReview = async (req, res, next) => {
  try {
    // Never trust customerId / technicianId / status from the frontend.
    // Customer identity comes from the authenticated token; the technician
    // is derived from the completed booking.
    const { bookingId, rating, comment } = req.body;

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return next(new ApiError(400, 'Rating must be a whole number between 1 and 5 stars'));
    }
    if (comment !== undefined && String(comment).length > 1000) {
      return next(new ApiError(400, 'Feedback must be 1000 characters or less'));
    }

    const booking = await findBooking(bookingId);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    // Ownership: customers can only review their own service requests.
    if (String(booking.customer) !== String(req.user._id)) {
      return next(new ApiError(403, 'You can only review your own service requests'));
    }

    // Feedback is available ONLY after the service has been completed.
    if (booking.status !== 'Completed') {
      return next(
        new ApiError(400, 'Feedback is available only after the service has been completed')
      );
    }

    // One review per booking — checked here AND enforced by the unique
    // index on Review.booking (catches concurrent duplicates).
    const existing = await Review.findOne({ booking: booking._id });
    if (existing) {
      return next(new ApiError(409, 'You have already submitted feedback for this service'));
    }

    const technicianId = booking.assignedTechnician;
    if (!technicianId) {
      return next(new ApiError(400, 'This service has no assigned technician to review'));
    }

    const review = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      technician: technicianId,
      rating: ratingNum,
      comment: String(comment || '').trim()
    });

    const populatedReview = await populateReview(Review.findById(review._id));
    res.status(201).json(new ApiResponse(201, populatedReview, 'Thank you for your feedback!'));
  } catch (error) {
    // DB-level uniqueness (unique index) — surface as a clean 409.
    if (error?.code === 11000) {
      return next(new ApiError(409, 'You have already submitted feedback for this service'));
    }
    next(error);
  }
};

// @desc    List feedback (management)
// @route   GET /api/reviews
// @access  Private (Admin, Staff)
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await populateReview(Review.find().sort({ createdAt: -1 }));
    res.status(200).json(new ApiResponse(200, reviews, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Feedback for one booking (customer: own booking only;
//          technician: own job only; Admin/Staff: any)
// @route   GET /api/reviews/booking/:bookingId
// @access  Private
export const getReviewByBooking = async (req, res, next) => {
  try {
    const booking = await findBooking(req.params.bookingId);
    if (!booking) {
      return next(new ApiError(404, 'Booking not found'));
    }

    const isManager = ['Admin', 'Staff'].includes(req.user.role);
    const isOwner = String(booking.customer) === String(req.user._id);
    const isAssignedTech = booking.assignedTechnician && String(booking.assignedTechnician) === String(req.user._id);

    if (!isManager && !isOwner && !isAssignedTech) {
      return next(new ApiError(403, 'Access denied to this feedback'));
    }

    const review = await populateReview(Review.findOne({ booking: booking._id }));
    res.status(200).json(new ApiResponse(200, review || null, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Feedback on the technician's own completed jobs (read-only)
// @route   GET /api/reviews/technician/me
// @access  Private (Technician)
export const getMyTechnicianReviews = async (req, res, next) => {
  try {
    const reviews = await populateReview(
      Review.find({ technician: req.user._id }).sort({ createdAt: -1 })
    );
    res.status(200).json(new ApiResponse(200, reviews, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Feedback for one technician (management performance view)
// @route   GET /api/reviews/technician/:technicianId
// @access  Private (Admin, Staff; technicians may only query themselves)
export const getTechnicianReviews = async (req, res, next) => {
  try {
    const technicianId = req.params.technicianId;
    if (req.user.role === 'Technician' && String(req.user._id) !== String(technicianId)) {
      return next(new ApiError(403, 'You can only view feedback for your own jobs'));
    }

    const reviews = await populateReview(
      Review.find({ technician: technicianId }).sort({ createdAt: -1 })
    );
    res.status(200).json(new ApiResponse(200, reviews, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Feedback submitted by the logged-in customer (own reviews only)
// @route   GET /api/reviews/mine
// @access  Private (Customer)
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await populateReview(
      Review.find({ customer: req.user._id }).sort({ createdAt: -1 })
    );
    res.status(200).json(new ApiResponse(200, reviews, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Single review (ownership-checked; customers see only their own)
// @route   GET /api/reviews/:id
// @access  Private
export const getReviewById = async (req, res, next) => {
  try {
    const review = await populateReview(Review.findById(req.params.id));
    if (!review) {
      return next(new ApiError(404, 'Feedback not found'));
    }

    const isManager = ['Admin', 'Staff'].includes(req.user.role);
    const isOwner = String(review.customer._id) === String(req.user._id);
    const isAssignedTech = review.technician && String(review.technician._id) === String(req.user._id);

    if (!isManager && !isOwner && !isAssignedTech) {
      return next(new ApiError(403, 'Access denied to this feedback'));
    }

    res.status(200).json(new ApiResponse(200, review, 'Feedback retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
