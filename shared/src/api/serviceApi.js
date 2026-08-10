import api from './axios';

export const getServicesApi = async (params = {}) => {
  return await api.get('/services', { params });
};

export const getServiceByIdApi = async (id) => {
  return await api.get(`/services/${id}`);
};

export const createServiceApi = async (data) => {
  return await api.post('/services', data);
};

export const updateServiceApi = async (id, data) => {
  return await api.put(`/services/${id}`, data);
};

export const deleteServiceApi = async (id) => {
  return await api.delete(`/services/${id}`);
};
