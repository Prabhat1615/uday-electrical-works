import api from './axios';

export const getSalesOrdersApi = async () => {
  return await api.get('/sales');
};

export const createSalesOrderApi = async (data) => {
  return await api.post('/sales', data);
};
