import api from './axios';

export const getLeadsApi = async (params = {}) => {
  return await api.get('/leads', { params });
};

export const createLeadApi = async (data) => {
  return await api.post('/leads', data);
};

export const updateLeadApi = async (id, data) => {
  return await api.put(`/leads/${id}`, data);
};

export const deleteLeadApi = async (id) => {
  return await api.delete(`/leads/${id}`);
};
