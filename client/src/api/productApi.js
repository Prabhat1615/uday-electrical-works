import api from './axios';

export const getProductsApi = async (params = {}) => {
  return await api.get('/products', { params });
};

export const getProductByIdApi = async (id) => {
  return await api.get(`/products/${id}`);
};

export const createProductApi = async (data) => {
  return await api.post('/products', data);
};

export const updateProductApi = async (id, data) => {
  return await api.put(`/products/${id}`, data);
};

export const deleteProductApi = async (id) => {
  return await api.delete(`/products/${id}`);
};
