import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from '@/app/context/authContext';
import AuthenticationLayout from '../../features/authentication/layout/AuthenticationLayout';

function FirstTimeOnlyRoute() {
  const { isFirstTime, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  return isFirstTime ? (
    <AuthenticationLayout>
      <Outlet />
    </AuthenticationLayout>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default FirstTimeOnlyRoute;
