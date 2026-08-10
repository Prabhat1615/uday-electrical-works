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

// Customer Dashboard Pages
import { DashboardOverview } from '../pages/Dashboard/DashboardOverview';
import { CustomerPortalPage } from '../pages/Dashboard/CustomerPortalPage';
import { BookingsManager } from '../pages/Dashboard/BookingsManager';
import { InvoicesManager } from '../pages/Dashboard/InvoicesManager';
import { SalesManagementPage } from '../pages/Dashboard/SalesManagementPage';
import { AMCManagementPage } from '../pages/Dashboard/AMCManagementPage';
import { SupportTicketsPage } from '../pages/Dashboard/SupportTicketsPage';
import { ProfilePage } from '../pages/Dashboard/ProfilePage';

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

      {/* Protected Customer Dashboard Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Customer']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="portal" element={<CustomerPortalPage />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="invoices" element={<InvoicesManager />} />
          <Route path="sales" element={<SalesManagementPage />} />
          <Route path="amc" element={<AMCManagementPage />} />
          <Route path="tickets" element={<SupportTicketsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
