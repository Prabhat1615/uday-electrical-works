import api from './axios';

export const getSettingsApi = async () => {
  return await api.get('/settings');
};

export const updateSettingsApi = async (data) => {
  return await api.put('/settings', data);
};
