import api from './axios';

export const getBookingsApi = async (params = {}) => {
  return await api.get('/bookings', { params });
};

export const getBookingByIdApi = async (id) => {
  return await api.get(`/bookings/${id}`);
};

export const createBookingApi = async (data) => {
  return await api.post('/bookings', data);
};

export const updateBookingApi = async (id, data) => {
  return await api.put(`/bookings/${id}`, data);
};

export const deleteBookingApi = async (id) => {
  return await api.delete(`/bookings/${id}`);
};

// Admin/Staff: approved technicians available for a booking's requested slot
export const getAvailableTechniciansApi = async (bookingId) => {
  return await api.get('/bookings/available-technicians', { params: { bookingId } });
};

// Admin/Staff: assign a technician (backend re-verifies approval + availability)
export const assignTechnicianApi = async (id, technicianId) => {
  return await api.post(`/bookings/${id}/assign`, { technicianId });
};

// Technician: accept an assigned job
export const acceptBookingApi = async (id) => {
  return await api.post(`/bookings/${id}/accept`);
};

// Technician: decline an assigned job with a required reason
export const declineBookingApi = async (id, reason) => {
  return await api.post(`/bookings/${id}/decline`, { reason });
};

// Role-aware cancellation: customer (own pre-work request), technician
// (Unable to Complete their own accepted job), Admin/Staff (any non-terminal)
export const cancelBookingApi = async (id, reason) => {
  return await api.post(`/bookings/${id}/cancel`, { reason });
};

// Validated status transitions (technician progression / admin override)
export const updateBookingStatusApi = async (id, data) => {
  return await api.put(`/bookings/${id}/status`, data);
};
