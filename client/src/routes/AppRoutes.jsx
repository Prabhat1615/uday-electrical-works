import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Consumer Public Pages
import { HomePage } from '../pages/Home/HomePage';
import { ProductsPage } from '../pages/Products/ProductsPage';
import { ServicesPage } from '../pages/Services/ServicesPage';
import { AboutPage } from '../pages/About/AboutPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { ReviewsPage } from '../pages/Reviews/ReviewsPage';

import { LoginPage } from '../pages/Login/LoginPage';
import { RegisterPage } from '../pages/Register/RegisterPage';

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
import { CustomerPortalPage } from '../pages/Dashboard/CustomerPortalPage';

// Phase 5 Pages
import { MultiBranchPage } from '../pages/Dashboard/MultiBranchPage';
import { AiInventoryForecastPage } from '../pages/Dashboard/AiInventoryForecastPage';
import { SystemHealthPage } from '../pages/Dashboard/SystemHealthPage';
import { ExecutiveInsightsPage } from '../pages/Dashboard/ExecutiveInsightsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront & Company Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="portal" element={<CustomerPortalPage />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="invoices" element={<InvoicesManager />} />
          <Route path="sales" element={<SalesManagementPage />} />
          <Route path="amc" element={<AMCManagementPage />} />
          <Route path="tickets" element={<SupportTicketsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Admin, Staff & Technician */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff', 'Technician']} />}>
            <Route path="schedule" element={<ScheduleCalendarPage />} />
            <Route path="field-service" element={<FieldServicePage />} />
          </Route>

          {/* Admin & Staff Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} />}>
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
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="insights" element={<ExecutiveInsightsPage />} />
            <Route path="health" element={<SystemHealthPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<CompanySettingsPage />} />
            <Route path="backup" element={<BackupRestorePage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
