import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';

const HomePage = lazy(() => import('../pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../pages/Products/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('../pages/Products/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('../pages/Services/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const BookingPage = lazy(() => import('../pages/Services/BookingPage').then((m) => ({ default: m.BookingPage })));
const CartPage = lazy(() => import('../pages/Cart/CartPage').then((m) => ({ default: m.CartPage })));
const AboutPage = lazy(() => import('../pages/About/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage').then((m) => ({ default: m.ContactPage })));
const ReviewsPage = lazy(() => import('../pages/Reviews/ReviewsPage').then((m) => ({ default: m.ReviewsPage })));
const LoginPage = lazy(() => import('../pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const DashboardOverview = lazy(() => import('../pages/Dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview })));
const CustomerPortalPage = lazy(() => import('../pages/Dashboard/CustomerPortalPage').then((m) => ({ default: m.CustomerPortalPage })));
const BookingsManager = lazy(() => import('../pages/Dashboard/BookingsManager').then((m) => ({ default: m.BookingsManager })));
const InvoicesManager = lazy(() => import('../pages/Dashboard/InvoicesManager').then((m) => ({ default: m.InvoicesManager })));
const SalesManagementPage = lazy(() => import('../pages/Dashboard/SalesManagementPage').then((m) => ({ default: m.SalesManagementPage })));
const SupportTicketsPage = lazy(() => import('../pages/Dashboard/SupportTicketsPage').then((m) => ({ default: m.SupportTicketsPage })));
const ProfilePage = lazy(() => import('../pages/Dashboard/ProfilePage').then((m) => ({ default: m.ProfilePage })));

const withSuspense = (element) => (
  <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center"><LoadingSpinner /></div>}>
    {element}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront */}
      <Route element={<MainLayout />}>
        <Route path="/" element={withSuspense(<HomePage />)} />
        <Route path="/shop" element={withSuspense(<ShopPage />)} />
        <Route path="/shop/product/:id" element={withSuspense(<ProductDetailPage />)} />
        <Route path="/products" element={<Navigate to="/shop" replace />} />
        <Route path="/services" element={withSuspense(<ServicesPage />)} />
        <Route path="/services/:id" element={withSuspense(<ServiceDetailPage />)} />
        <Route path="/services/:id/book" element={withSuspense(<BookingPage />)} />
        <Route path="/cart" element={withSuspense(<CartPage />)} />
        <Route path="/about" element={withSuspense(<AboutPage />)} />
        <Route path="/contact" element={withSuspense(<ContactPage />)} />
        <Route path="/reviews" element={withSuspense(<ReviewsPage />)} />
        <Route path="/login" element={withSuspense(<LoginPage />)} />
        <Route path="/register" element={withSuspense(<RegisterPage />)} />
      </Route>

      {/* Protected Customer Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={['Customer']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={withSuspense(<DashboardOverview />)} />
          <Route path="portal" element={withSuspense(<CustomerPortalPage />)} />
          <Route path="bookings" element={withSuspense(<BookingsManager />)} />
          <Route path="invoices" element={withSuspense(<InvoicesManager />)} />
          <Route path="sales" element={withSuspense(<SalesManagementPage />)} />
          <Route path="tickets" element={withSuspense(<SupportTicketsPage />)} />
          <Route path="profile" element={withSuspense(<ProfilePage />)} />
        </Route>
      </Route>

      {/* Custom 404 */}
      <Route path="*" element={withSuspense(<NotFoundPage />)} />
    </Routes>
  );
};
