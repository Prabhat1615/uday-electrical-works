import api from './axios';

export const getAMCsApi = async () => {
  return await api.get('/amc');
};

export const createAMCApi = async (data) => {
  return await api.post('/amc', data);
};

export const renewAMCApi = async (id) => {
  return await api.put(`/amc/${id}/renew`);
};
