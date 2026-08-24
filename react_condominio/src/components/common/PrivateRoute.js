import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.primeiroAcesso && location.pathname !== '/definir-senha-permanente')  return <Navigate to="/definir-senha-permanente" replace />;

  allowedRoles.includes(user.role);
  if (allowedRoles) return <Outlet />;

  const hasRole = allowedRoles.some(role => role === user.role);

  if (!hasRole) return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;