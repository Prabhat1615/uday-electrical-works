import api from './axios';

export const getFieldReportsApi = async () => {
  return await api.get('/field-service');
};

export const submitFieldReportApi = async (data) => {
  return await api.post('/field-service', data);
};
