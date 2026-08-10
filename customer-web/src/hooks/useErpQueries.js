import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi } from '../api/productApi';
import { getServicesApi } from '../api/serviceApi';
import { getBookingsApi, createBookingApi, updateBookingApi, deleteBookingApi } from '../api/bookingApi';
import { getInvoicesApi, createInvoiceApi, updateInvoiceStatusApi } from '../api/invoiceApi';
import { getUsersApi } from '../api/userApi';
import { getLeadsApi } from '../api/leadApi';

import { getSalesOrdersApi, createSalesOrderApi } from '../api/salesApi';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../api/notificationApi';
import { getAnalyticsDataApi } from '../api/reportApi';

import { getTicketsApi, createTicketApi, replyTicketApi } from '../api/ticketApi';

import { createPaymentOrderApi, verifyPaymentApi } from '../api/paymentApi';
import { getAMCsApi, createAMCApi, renewAMCApi } from '../api/amcApi';

import { askAiAssistantApi } from '../api/aiApi';

export const useProducts = (params) => useQuery({ queryKey: ['products', params], queryFn: () => getProductsApi(params) });

export const useServices = (params) => useQuery({ queryKey: ['services', params], queryFn: () => getServicesApi(params) });

export const useBookings = (params) => useQuery({ queryKey: ['bookings', params], queryFn: () => getBookingsApi(params) });
export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createBookingApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }) });
};
export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateBookingApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }) });
};
export const useDeleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteBookingApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }) });
};

export const useInvoices = (params) => useQuery({ queryKey: ['invoices', params], queryFn: () => getInvoicesApi(params) });
export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createInvoiceApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) });
};
export const useUpdateInvoiceStatus = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateInvoiceStatusApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) });
};

export const useLeads = () => useQuery({ queryKey: ['leads'], queryFn: getLeadsApi });

export const useUsers = (params) => useQuery({ queryKey: ['users', params], queryFn: () => getUsersApi(params) });

export const useSalesOrders = () => useQuery({ queryKey: ['salesOrders'], queryFn: getSalesOrdersApi });
export const useCreateSalesOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createSalesOrderApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['salesOrders'] }); qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['invoices'] }); } });
};

export const useNotifications = () => useQuery({ queryKey: ['notifications'], queryFn: getNotificationsApi, refetchInterval: 15000 });
export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: markAsReadApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
};
export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: markAllAsReadApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
};

export const useAnalytics = () => useQuery({ queryKey: ['analytics'], queryFn: getAnalyticsDataApi });

export const useTickets = () => useQuery({ queryKey: ['tickets'], queryFn: getTicketsApi });
export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createTicketApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
};
export const useReplyTicket = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => replyTicketApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
};

export const useCreatePaymentOrder = () => useMutation({ mutationFn: createPaymentOrderApi });
export const useVerifyPayment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: verifyPaymentApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['paymentHistory'] }); qc.invalidateQueries({ queryKey: ['invoices'] }); } });
};

export const useAMCs = () => useQuery({ queryKey: ['amcs'], queryFn: getAMCsApi });
export const useCreateAMC = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createAMCApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['amcs'] }) });
};
export const useRenewAMC = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: renewAMCApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['amcs'] }) });
};

export const useAskAiAssistant = () => useMutation({ mutationFn: askAiAssistantApi });
