import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi } from '../api/productApi';
import { getBookingsApi, updateBookingApi, deleteBookingApi } from '../api/bookingApi';
import { getInvoicesApi } from '../api/invoiceApi';
import { getUsersApi } from '../api/userApi';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../api/notificationApi';
import { getAnalyticsDataApi } from '../api/reportApi';
import { getLeadsApi } from '../api/leadApi';
import { getFieldReportsApi, submitFieldReportApi } from '../api/fieldServiceApi';

export const useProducts = (params) => useQuery({ queryKey: ['products', params], queryFn: () => getProductsApi(params) });

export const useBookings = (params) => useQuery({ queryKey: ['bookings', params], queryFn: () => getBookingsApi(params) });
export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateBookingApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }) });
};
export const useDeleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteBookingApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }) });
};

export const useInvoices = (params) => useQuery({ queryKey: ['invoices', params], queryFn: () => getInvoicesApi(params) });

export const useUsers = (params) => useQuery({ queryKey: ['users', params], queryFn: () => getUsersApi(params) });

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

export const useLeads = (params) => useQuery({ queryKey: ['leads', params], queryFn: () => getLeadsApi(params) });

export const useFieldReports = () => useQuery({ queryKey: ['fieldReports'], queryFn: getFieldReportsApi });
export const useSubmitFieldReport = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: submitFieldReportApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['fieldReports'] }); qc.invalidateQueries({ queryKey: ['bookings'] }); } });
};
