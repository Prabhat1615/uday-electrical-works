import api from './axios';

export const askAiAssistantApi = async (data) => {
  return await api.post('/ai/chat', data);
};

export const getInventoryForecastApi = async () => {
  return await api.get('/ai/forecast');
};
