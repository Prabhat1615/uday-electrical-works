import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

export const ProtectedRoute = ({ allowedRoles, redirectTo }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner message="Authenticating credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectTo || '/dashboard'} replace />;
  }

  return <Outlet />;
};
