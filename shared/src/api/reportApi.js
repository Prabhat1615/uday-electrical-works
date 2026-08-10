import api from './axios';

export const getAnalyticsDataApi = async () => {
  return await api.get('/reports/analytics');
};

export const getExportReportApi = async (type) => {
  return await api.get(`/reports/export/${type}`);
};
