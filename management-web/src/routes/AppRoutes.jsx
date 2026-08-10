import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { LoginPage } from '../pages/Login/LoginPage';

// Dashboard Pages
import { DashboardOverview } from '../pages/Dashboard/DashboardOverview';
import { BookingsManager } from '../pages/Dashboard/BookingsManager';
import { InvoicesManager } from '../pages/Dashboard/InvoicesManager';
import { ProductsManager } from '../pages/Dashboard/ProductsManager';
import { ServicesManager } from '../pages/Dashboard/ServicesManager';
import { ProfilePage } from '../pages/Dashboard/ProfilePage';

// Phase 2 Pages
import { InventoryDashboard } from '../pages/Dashboard/InventoryDashboard';
import { LeadManagementPage } from '../pages/Dashboard/LeadManagementPage';
import { PurchaseManagementPage } from '../pages/Dashboard/PurchaseManagementPage';
import { SalesManagementPage } from '../pages/Dashboard/SalesManagementPage';
import { ReportsPage } from '../pages/Dashboard/ReportsPage';
import { UserManagementPage } from '../pages/Admin/UserManagementPage';

// Phase 3 Pages
import { ScheduleCalendarPage } from '../pages/Dashboard/ScheduleCalendarPage';
import { SupportTicketsPage } from '../pages/Dashboard/SupportTicketsPage';
import { CompanySettingsPage } from '../pages/Dashboard/CompanySettingsPage';
import { SystemAuditLogsPage } from '../pages/Dashboard/SystemAuditLogsPage';
import { BackupRestorePage } from '../pages/Dashboard/BackupRestorePage';

// Phase 4 Pages
import { AMCManagementPage } from '../pages/Dashboard/AMCManagementPage';
import { WarehouseInventoryPage } from '../pages/Dashboard/WarehouseInventoryPage';
import { FieldServicePage } from '../pages/Dashboard/FieldServicePage';

// Phase 5 Pages
import { MultiBranchPage } from '../pages/Dashboard/MultiBranchPage';
import { AiInventoryForecastPage } from '../pages/Dashboard/AiInventoryForecastPage';
import { SystemHealthPage } from '../pages/Dashboard/SystemHealthPage';
import { ExecutiveInsightsPage } from '../pages/Dashboard/ExecutiveInsightsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Management Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin & Staff Dashboard Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="invoices" element={<InvoicesManager />} />
          <Route path="sales" element={<SalesManagementPage />} />
          <Route path="amc" element={<AMCManagementPage />} />
          <Route path="tickets" element={<SupportTicketsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Admin & Staff Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} redirectTo="/dashboard" />}>
            <Route path="products" element={<ProductsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="inventory" element={<InventoryDashboard />} />
            <Route path="forecast" element={<AiInventoryForecastPage />} />
            <Route path="warehouses" element={<WarehouseInventoryPage />} />
            <Route path="branches" element={<MultiBranchPage />} />
            <Route path="leads" element={<LeadManagementPage />} />
            <Route path="purchase" element={<PurchaseManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="activity" element={<SystemAuditLogsPage />} />
            <Route path="schedule" element={<ScheduleCalendarPage />} />
            <Route path="field-service" element={<FieldServicePage />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} redirectTo="/dashboard" />}>
            <Route path="insights" element={<ExecutiveInsightsPage />} />
            <Route path="health" element={<SystemHealthPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<CompanySettingsPage />} />
            <Route path="backup" element={<BackupRestorePage />} />
          </Route>
        </Route>
      </Route>

      {/* Root & catch-all redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
