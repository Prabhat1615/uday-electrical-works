import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';

const LoginPage = lazy(() => import('../pages/Login/LoginPage').then((m) => ({ default: m.LoginPage })));

// Technician Pages
const DashboardOverview = lazy(() => import('../pages/Dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview })));
const BookingsManager = lazy(() => import('../pages/Dashboard/BookingsManager').then((m) => ({ default: m.BookingsManager })));
const FieldServicePage = lazy(() => import('../pages/Dashboard/FieldServicePage').then((m) => ({ default: m.FieldServicePage })));
const ScheduleCalendarPage = lazy(() => import('../pages/Dashboard/ScheduleCalendarPage').then((m) => ({ default: m.ScheduleCalendarPage })));
const ProfilePage = lazy(() => import('../pages/Dashboard/ProfilePage').then((m) => ({ default: m.ProfilePage })));

const withSuspense = (element) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950"><LoadingSpinner /></div>}>
    {element}
  </Suspense>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Technician Login */}
      <Route path="/login" element={withSuspense(<LoginPage />)} />

      {/* Technician Dashboard Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Technician']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={withSuspense(<DashboardOverview />)} />
          <Route path="bookings" element={withSuspense(<BookingsManager />)} />
          <Route path="field-service" element={withSuspense(<FieldServicePage />)} />
          <Route path="schedule" element={withSuspense(<ScheduleCalendarPage />)} />
          <Route path="profile" element={withSuspense(<ProfilePage />)} />
        </Route>
      </Route>

      {/* Root & catch-all redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
