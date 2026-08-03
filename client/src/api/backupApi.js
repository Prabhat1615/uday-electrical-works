import api from './axios';

export const exportDataApi = async () => {
  return await api.get('/backup/export');
};

export const importDataApi = async (data) => {
  return await api.post('/backup/import', data);
};
