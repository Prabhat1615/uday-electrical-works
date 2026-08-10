import api from './axios';

export const getWarehousesApi = async () => {
  return await api.get('/warehouses');
};

export const createWarehouseApi = async (data) => {
  return await api.post('/warehouses', data);
};

export const transferProductApi = async (data) => {
  return await api.post('/warehouses/transfer', data);
};
