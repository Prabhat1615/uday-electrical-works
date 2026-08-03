import api from './axios';

export const getUsersApi = async (params = {}) => {
  return await api.get('/users', { params });
};

export const updateUserRoleApi = async (id, data) => {
  return await api.put(`/users/${id}`, data);
};

export const deleteUserApi = async (id) => {
  return await api.delete(`/users/${id}`);
};
