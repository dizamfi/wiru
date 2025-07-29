import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { FullPageLoader } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  redirectTo = '/login',
  allowedRoles = [],
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loader mientras se inicializa la autenticación
  if (isLoading) {
    return <FullPageLoader text="Verificando autenticación..." />;
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ redirect: location.pathname + location.search }} 
        replace 
      />
    );
  }

  // Si no requiere autenticación y está autenticado (ej: páginas de login)
  if (!requireAuth && isAuthenticated) {
    // Obtener la URL de redirección de los params o estado
    const redirectPath = 
      location.state?.redirect || 
      new URLSearchParams(location.search).get('redirect') || 
      '/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  // Si requiere verificación de email y no está verificado
  if (requireEmailVerification && user && !user.isVerified) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ email: user.email }} 
        replace 
      />
    );
  }

  // Si se especifican roles permitidos y el usuario no tiene el rol adecuado
  if (allowedRoles.length > 0 && user ) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ requiredRoles: allowedRoles, userRole: user.role }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

// Hook para verificar permisos programáticamente
export const useRequireAuth = (redirect: string = '/login') => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = `${redirect}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirect, location.pathname, location.search]);

  return { 
    isAuthenticated, 
    isLoading, 
    user,
    isEmailVerified: user?.isVerified ?? false,
  };
};

// Hook para verificar roles específicos
export const useRequireRole = (allowedRoles: string[]) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const hasPermission = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return typeof user.role === 'string';
  }, [isAuthenticated, user, allowedRoles]);

  return {
    hasPermission,
    isLoading,
    userRole: user?.role,
    isAuthenticated,
  };
};

// Componente para proteger contenido inline basado en roles
export const RoleGuard: React.FC<{
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ allowedRoles, children, fallback = null }) => {
  const { hasPermission } = useRequireRole(allowedRoles);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

// Componente para mostrar contenido solo a usuarios autenticados
export const AuthGuard: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireEmailVerification?: boolean;
}> = ({ children, fallback = null, requireEmailVerification = false }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  if (requireEmailVerification && user && !user.isVerified) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};