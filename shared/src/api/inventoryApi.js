import api from './axios';

export const logInventoryTransactionApi = async (data) => {
  return await api.post('/inventory/transaction', data);
};

export const getInventoryHistoryApi = async (params = {}) => {
  return await api.get('/inventory/history', { params });
};
