import api from './axios';

export const getNotificationsApi = async () => {
  return await api.get('/notifications');
};

export const markAsReadApi = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

export const markAllAsReadApi = async () => {
  return await api.put('/notifications/read-all');
};
