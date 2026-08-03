import api from './axios';

export const getBranchesApi = async () => {
  return await api.get('/branches');
};

export const createBranchApi = async (data) => {
  return await api.post('/branches', data);
};
