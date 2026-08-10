import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { LoginPage } from '../pages/Login/LoginPage';

// Technician Pages
import { DashboardOverview } from '../pages/Dashboard/DashboardOverview';
import { BookingsManager } from '../pages/Dashboard/BookingsManager';
import { FieldServicePage } from '../pages/Dashboard/FieldServicePage';
import { ScheduleCalendarPage } from '../pages/Dashboard/ScheduleCalendarPage';
import { ProfilePage } from '../pages/Dashboard/ProfilePage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Technician Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Technician Dashboard Layout */}
      <Route element={<ProtectedRoute allowedRoles={['Technician']} redirectTo="/login" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="field-service" element={<FieldServicePage />} />
          <Route path="schedule" element={<ScheduleCalendarPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Root & catch-all redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
