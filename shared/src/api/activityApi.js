import api from './axios';

export const getActivityLogsApi = async (params = {}) => {
  return await api.get('/activity', { params });
};
