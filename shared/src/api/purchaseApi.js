import api from './axios';

export const getSuppliersApi = async () => {
  return await api.get('/purchase/suppliers');
};

export const createSupplierApi = async (data) => {
  return await api.post('/purchase/suppliers', data);
};

export const getPurchaseOrdersApi = async () => {
  return await api.get('/purchase/orders');
};

export const createPurchaseOrderApi = async (data) => {
  return await api.post('/purchase/orders', data);
};

export const updatePurchaseOrderStatusApi = async (id, data) => {
  return await api.put(`/purchase/orders/${id}/status`, data);
};
