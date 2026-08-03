import api from './axios';

export const getInvoicesApi = async (params = {}) => {
  return await api.get('/invoices', { params });
};

export const getInvoiceByIdApi = async (id) => {
  return await api.get(`/invoices/${id}`);
};

export const createInvoiceApi = async (data) => {
  return await api.post('/invoices', data);
};

export const updateInvoiceStatusApi = async (id, data) => {
  return await api.put(`/invoices/${id}`, data);
};
