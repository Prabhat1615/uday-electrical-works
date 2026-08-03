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
