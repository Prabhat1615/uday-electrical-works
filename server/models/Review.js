import mongoose from 'mongoose';

// Customer feedback for a completed service booking.
//
// Authoritative lifecycle:
//  - Created only when the linked booking is status === 'Completed'
//  - One review per booking (unique index on booking — DB-level protection
//    against duplicate feedback, independent of any React-side checks)
//  - Customer and technician are DERIVED server-side from the booking
//    (never from request input), so a customer cannot review on behalf of
//    another customer and cannot attach an arbitrary technician.
const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      // One review per booking — enforced at the database level so that
      // concurrent duplicate submissions can never create two records.
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please select a rating'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: '',
      maxlength: [1000, 'Feedback must be 1000 characters or less']
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
