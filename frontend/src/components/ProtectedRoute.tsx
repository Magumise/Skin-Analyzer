import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');
  const isUser = localStorage.getItem('access_token');

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!requireAdmin && !isUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 