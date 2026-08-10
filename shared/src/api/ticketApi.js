import api from './axios';

export const getTicketsApi = async () => {
  return await api.get('/tickets');
};

export const createTicketApi = async (data) => {
  return await api.post('/tickets', data);
};

export const replyTicketApi = async (id, data) => {
  return await api.put(`/tickets/${id}/reply`, data);
};
