import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';

const LoginPage = lazy(() => import('../pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })));

// Dashboard Pages
const DashboardOverview = lazy(() => import('../pages/Dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview })));
const BookingsManager = lazy(() => import('../pages/Dashboard/BookingsManager').then((m) => ({ default: m.BookingsManager })));
const InvoicesManager = lazy(() => import('../pages/Dashboard/InvoicesManager').then((m) => ({ default: m.InvoicesManager })));
const ProductsManager = lazy(() => import('../pages/Dashboard/ProductsManager').then((m) => ({ default: m.ProductsManager })));
const ServicesManager = lazy(() => import('../pages/Dashboard/ServicesManager').then((m) => ({ default: m.ServicesManager })));
const ProfilePage = lazy(() => import('../pages/Dashboard/ProfilePage').then((m) => ({ default: m.ProfilePage })));

// Phase 2 Pages
const InventoryDashboard = lazy(() => import('../pages/Dashboard/InventoryDashboard').then((m) => ({ default: m.InventoryDashboard })));
const LeadManagementPage = lazy(() => import('../pages/Dashboard/LeadManagementPage').then((m) => ({ default: m.LeadManagementPage })));
const PurchaseManagementPage = lazy(() => import('../pages/Dashboard/PurchaseManagementPage').then((m) => ({ default: m.PurchaseManagementPage })));
const SalesManagementPage = lazy(() => import('../pages/Dashboard/SalesManagementPage').then((m) => ({ default: m.SalesManagementPage })));
const ReportsPage = lazy(() => import('../pages/Dashboard/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const UserManagementPage = lazy(() => import('../pages/Admin/UserManagementPage').then((m) => ({ default: m.UserManagementPage })));
const TechnicianRequestsPage = lazy(() => import('../pages/Admin/TechnicianRequestsPage').then((m) => ({ default: m.TechnicianRequestsPage })));

// Phase 3 Pages
const ScheduleCalendarPage = lazy(() => import('../pages/Dashboard/ScheduleCalendarPage').then((m) => ({ default: m.ScheduleCalendarPage })));
const SupportTicketsPage = lazy(() => import('../pages/Dashboard/SupportTicketsPage').then((m) => ({ default: m.SupportTicketsPage })));
const CompanySettingsPage = lazy(() => import('../pages/Dashboard/CompanySettingsPage').then((m) => ({ default: m.CompanySettingsPage })));
const SystemAuditLogsPage = lazy(() => import('../pages/Dashboard/SystemAuditLogsPage').then((m) => ({ default: m.SystemAuditLogsPage })));
const BackupRestorePage = lazy(() => import('../pages/Dashboard/BackupRestorePage').then((m) => ({ default: m.BackupRestorePage })));

// Phase 4 Pages
const AMCManagementPage = lazy(() => import('../pages/Dashboard/AMCManagementPage').then((m) => ({ default: m.AMCManagementPage })));
const WarehouseInventoryPage = lazy(() => import('../pages/Dashboard/WarehouseInventoryPage').then((m) => ({ default: m.WarehouseInventoryPage })));
const FieldServicePage = lazy(() => import('../pages/Dashboard/FieldServicePage').then((m) => ({ default: m.FieldServicePage })));

// Phase 5 Pages
const MultiBranchPage = lazy(() => import('../pages/Dashboard/MultiBranchPage').then((m) => ({ default: m.MultiBranchPage })));
const AiInventoryForecastPage = lazy(() => import('../pages/Dashboard/AiInventoryForecastPage').then((m) => ({ default: m.AiInventoryForecastPage })));
const SystemHealthPage = lazy(() => import('../pages/Dashboard/SystemHealthPage').then((m) => ({ default: m.SystemHealthPage })));
const ExecutiveInsightsPage = lazy(() => import('../pages/Dashboard/ExecutiveInsightsPage').then((m) => ({ default: m.ExecutiveInsightsPage })));

const withSuspense = (element) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950"><LoadingSpinner /></div>}>
    {element}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Management Login */}
      <Route path="/login" element={withSuspense(<LoginPage />)} />

      {/* Admin & Staff Dashboard Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={withSuspense(<DashboardOverview />)} />
          <Route path="bookings" element={withSuspense(<BookingsManager />)} />
          <Route path="invoices" element={withSuspense(<InvoicesManager />)} />
          <Route path="sales" element={withSuspense(<SalesManagementPage />)} />
          <Route path="amc" element={withSuspense(<AMCManagementPage />)} />
          <Route path="tickets" element={withSuspense(<SupportTicketsPage />)} />
          <Route path="profile" element={withSuspense(<ProfilePage />)} />

          {/* Admin & Staff Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} redirectTo="/dashboard" />}>
            <Route path="products" element={withSuspense(<ProductsManager />)} />
            <Route path="services" element={withSuspense(<ServicesManager />)} />
            <Route path="inventory" element={withSuspense(<InventoryDashboard />)} />
            <Route path="forecast" element={withSuspense(<AiInventoryForecastPage />)} />
            <Route path="warehouses" element={withSuspense(<WarehouseInventoryPage />)} />
            <Route path="branches" element={withSuspense(<MultiBranchPage />)} />
            <Route path="leads" element={withSuspense(<LeadManagementPage />)} />
            <Route path="purchase" element={withSuspense(<PurchaseManagementPage />)} />
            <Route path="reports" element={withSuspense(<ReportsPage />)} />
            <Route path="activity" element={withSuspense(<SystemAuditLogsPage />)} />
            <Route path="schedule" element={withSuspense(<ScheduleCalendarPage />)} />
            <Route path="field-service" element={withSuspense(<FieldServicePage />)} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard" />}>
            <Route path="insights" element={withSuspense(<ExecutiveInsightsPage />)} />
            <Route path="health" element={withSuspense(<SystemHealthPage />)} />
            <Route path="users" element={withSuspense(<UserManagementPage />)} />
            <Route path="technician-requests" element={withSuspense(<TechnicianRequestsPage />)} />
            <Route path="settings" element={withSuspense(<CompanySettingsPage />)} />
            <Route path="backup" element={withSuspense(<BackupRestorePage />)} />
          </Route>
        </Route>
      </Route>

      {/* Root & catch-all redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
