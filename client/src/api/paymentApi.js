import api from './axios';

export const createPaymentOrderApi = async (data) => {
  return await api.post('/payments/create-order', data);
};

export const verifyPaymentApi = async (data) => {
  return await api.post('/payments/verify', data);
};

export const getPaymentHistoryApi = async () => {
  return await api.get('/payments/history');
};
