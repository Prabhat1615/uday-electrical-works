import api from './axios';

export const getSystemHealthMetricsApi = async () => {
  return await api.get('/health/metrics');
};
