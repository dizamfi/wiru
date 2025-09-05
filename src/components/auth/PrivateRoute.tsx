// src/components/auth/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Guardar la ubicación a la que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Si el usuario ya está autenticado y trata de acceder a login/register
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Componente para rutas públicas (login, register) que redirigen si ya está autenticado
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PrivateRoute requireAuth={false}>{children}</PrivateRoute>;
};