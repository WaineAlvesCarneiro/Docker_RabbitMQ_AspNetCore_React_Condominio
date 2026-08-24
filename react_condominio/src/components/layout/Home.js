import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Suporte') return <Navigate to="/empresas" replace />; 
  
  return <Navigate to="/dashboard" replace />;
};

export default HomeRedirect;