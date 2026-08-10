import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../api/productApi';
import { getServicesApi, createServiceApi, updateServiceApi, deleteServiceApi } from '../api/serviceApi';
import { getBookingsApi, createBookingApi, updateBookingApi, deleteBookingApi } from '../api/bookingApi';
import { getInvoicesApi, createInvoiceApi, updateInvoiceStatusApi } from '../api/invoiceApi';
import { getUsersApi, createUserApi, updateUserRoleApi, deleteUserApi } from '../api/userApi';

import { logInventoryTransactionApi, getInventoryHistoryApi } from '../api/inventoryApi';
import { getLeadsApi, createLeadApi, updateLeadApi, deleteLeadApi } from '../api/leadApi';
import { getSuppliersApi, createSupplierApi, getPurchaseOrdersApi, createPurchaseOrderApi, updatePurchaseOrderStatusApi } from '../api/purchaseApi';
import { getSalesOrdersApi, createSalesOrderApi } from '../api/salesApi';
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from '../api/notificationApi';
import { getAnalyticsDataApi, getExportReportApi } from '../api/reportApi';

import { getActivityLogsApi } from '../api/activityApi';
import { getTicketsApi, createTicketApi, replyTicketApi } from '../api/ticketApi';
import { getSettingsApi, updateSettingsApi } from '../api/settingsApi';
import { exportDataApi, importDataApi } from '../api/backupApi';

import { createPaymentOrderApi, verifyPaymentApi, getPaymentHistoryApi } from '../api/paymentApi';
import { getAMCsApi, createAMCApi, renewAMCApi } from '../api/amcApi';
import { getWarehousesApi, createWarehouseApi, transferProductApi } from '../api/warehouseApi';
import { getFieldReportsApi, submitFieldReportApi } from '../api/fieldServiceApi';

import { getBranchesApi, createBranchApi } from '../api/branchApi';
import { askAiAssistantApi, getInventoryForecastApi } from '../api/aiApi';
import { getSystemHealthMetricsApi } from '../api/healthApi';

// Existing Hooks
export const useProducts = (params) => useQuery({ queryKey: ['products', params], queryFn: () => getProductsApi(params) });
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createProductApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateProductApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteProductApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useServices = (params) => useQuery({ queryKey: ['services', params], queryFn: () => getServicesApi(params) });
export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createServiceApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};
export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateServiceApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};
export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteServiceApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};

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

export const useUsers = (params) => useQuery({ queryKey: ['users', params], queryFn: () => getUsersApi(params) });
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createUserApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });
};
export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateUserRoleApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });
};
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteUserApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });
};

export const useInventoryHistory = (params) => useQuery({ queryKey: ['inventoryHistory', params], queryFn: () => getInventoryHistoryApi(params) });
export const useLogInventoryTransaction = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: logInventoryTransactionApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['inventoryHistory'] }); } });
};

export const useLeads = (params) => useQuery({ queryKey: ['leads', params], queryFn: () => getLeadsApi(params) });
export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createLeadApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }) });
};
export const useUpdateLead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateLeadApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }) });
};
export const useDeleteLead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteLeadApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }) });
};

export const useSuppliers = () => useQuery({ queryKey: ['suppliers'], queryFn: getSuppliersApi });
export const useCreateSupplier = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createSupplierApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }) });
};
export const usePurchaseOrders = () => useQuery({ queryKey: ['purchaseOrders'], queryFn: getPurchaseOrdersApi });
export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createPurchaseOrderApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['purchaseOrders'] }) });
};
export const useUpdatePurchaseOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updatePurchaseOrderStatusApi(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchaseOrders'] }); qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['inventoryHistory'] }); } });
};

export const useSalesOrders = () => useQuery({ queryKey: ['salesOrders'], queryFn: getSalesOrdersApi });
export const useCreateSalesOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createSalesOrderApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['salesOrders'] }); qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['invoices'] }); qc.invalidateQueries({ queryKey: ['inventoryHistory'] }); } });
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
export const useActivityLogs = (params) => useQuery({ queryKey: ['activityLogs', params], queryFn: () => getActivityLogsApi(params) });

export const useTickets = () => useQuery({ queryKey: ['tickets'], queryFn: getTicketsApi });
export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createTicketApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
};
export const useReplyTicket = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => replyTicketApi(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['tickets'] }) });
};

export const useCompanySettings = () => useQuery({ queryKey: ['companySettings'], queryFn: getSettingsApi });
export const useUpdateCompanySettings = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: updateSettingsApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['companySettings'] }) });
};

export const useExportData = () => useQuery({ queryKey: ['backupExport'], queryFn: exportDataApi, enabled: false });
export const useImportData = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: importDataApi, onSuccess: () => qc.invalidateQueries() });
};

export const usePaymentHistory = () => useQuery({ queryKey: ['paymentHistory'], queryFn: getPaymentHistoryApi });
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

export const useWarehouses = () => useQuery({ queryKey: ['warehouses'], queryFn: getWarehousesApi });
export const useCreateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createWarehouseApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }) });
};
export const useTransferProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: transferProductApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useFieldReports = () => useQuery({ queryKey: ['fieldReports'], queryFn: getFieldReportsApi });
export const useSubmitFieldReport = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: submitFieldReportApi, onSuccess: () => { qc.invalidateQueries({ queryKey: ['fieldReports'] }); qc.invalidateQueries({ queryKey: ['bookings'] }); } });
};

// Phase 5 New Hooks
export const useBranches = () => useQuery({ queryKey: ['branches'], queryFn: getBranchesApi });
export const useCreateBranch = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createBranchApi, onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }) });
};

export const useAskAiAssistant = () => useMutation({ mutationFn: askAiAssistantApi });
export const useInventoryForecast = () => useQuery({ queryKey: ['inventoryForecast'], queryFn: getInventoryForecastApi });
export const useSystemHealthMetrics = () => useQuery({ queryKey: ['systemHealthMetrics'], queryFn: getSystemHealthMetricsApi, refetchInterval: 30000 });
