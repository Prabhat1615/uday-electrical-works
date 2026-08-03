import api from './axios';

export const loginApi = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const registerApi = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const getProfileApi = async () => {
  return await api.get('/auth/profile');
};

export const updateProfileApi = async (profileData) => {
  return await api.put('/auth/profile', profileData);
};
