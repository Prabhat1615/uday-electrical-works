import api from './axios';

// Customer: submit feedback for a completed service booking
export const createReviewApi = async (data) => {
  return await api.post('/reviews', data);
};

// Customer / Technician: feedback for one booking (own records only)
export const getReviewByBookingApi = async (bookingId) => {
  return await api.get(`/reviews/booking/${bookingId}`);
};

// Management: all customer feedback (newest first)
export const getReviewsApi = async () => {
  return await api.get('/reviews');
};

// Customer: all feedback submitted by the logged-in customer
export const getMyReviewsApi = async () => {
  return await api.get('/reviews/mine');
};

// Technician: feedback on own completed jobs (read-only)
export const getMyTechnicianReviewsApi = async () => {
  return await api.get('/reviews/technician/me');
};
