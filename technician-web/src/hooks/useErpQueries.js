import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi } from '../api/productApi';
import { getBookingsApi, updateBookingApi, deleteBookingApi, acceptBookingApi, declineBookingApi, updateBookingStatusApi, cancelBookingApi } from '../api/bookingApi';
import { getInvoicesApi } from '../api/invoiceApi';
import { getUsersApi } from '../api/userApi';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../api/notificationApi';
import { getAnalyticsDataApi } from '../api/reportApi';
import { getLeadsApi } from '../api/leadApi';
import { getFieldReportsApi, submitFieldReportApi } from '../api/fieldServiceApi';
import { getReviewByBookingApi } from '../api/reviewApi';

export const useProducts = (params, options = {}) =>
  useQuery({ queryKey: ['products', params], queryFn: () => getProductsApi(params), ...options });

export const useBookings = (params, options = {}) =>
  useQuery({ queryKey: ['bookings', params], queryFn: () => getBookingsApi(params), ...options });

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => cancelBookingApi(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBookingApi(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] })
  });
};

export const useDeleteBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] })
  });
};

export const useAcceptBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptBookingApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

export const useDeclineBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => declineBookingApi(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] })
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBookingStatusApi(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    }
  });
};

export const useInvoices = (params, options = {}) =>
  useQuery({ queryKey: ['invoices', params], queryFn: () => getInvoicesApi(params), ...options });

export const useUsers = (params, options = {}) =>
  useQuery({ queryKey: ['users', params], queryFn: () => getUsersApi(params), ...options });

export const useNotifications = (options = {}) =>
  useQuery({ queryKey: ['notifications'], queryFn: getNotificationsApi, refetchInterval: 15000, ...options });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] })
  });
};

export const useAnalytics = (options = {}) =>
  useQuery({ queryKey: ['analytics'], queryFn: getAnalyticsDataApi, ...options });

export const useLeads = (params, options = {}) =>
  useQuery({ queryKey: ['leads', params], queryFn: () => getLeadsApi(params), ...options });

export const useFieldReports = (options = {}) =>
  useQuery({ queryKey: ['fieldReports'], queryFn: getFieldReportsApi, ...options });

export const useSubmitFieldReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitFieldReportApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fieldReports'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
};

// Feedback for a single booking (own jobs only — enforced by the backend)
export const useReviewByBooking = (bookingId, options = {}) =>
  useQuery({
    queryKey: ['reviews', bookingId],
    queryFn: () => getReviewByBookingApi(bookingId),
    enabled: Boolean(bookingId),
    ...options
  });
