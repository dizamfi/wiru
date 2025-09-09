// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { FullPageLoader } from '@/components/ui';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requireAuth?: boolean;
//   requireEmailVerification?: boolean;
//   redirectTo?: string;
//   allowedRoles?: string[];
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   requireAuth = true,
//   requireEmailVerification = false,
//   redirectTo = '/login',
//   allowedRoles = [],
// }) => {
//   const { isAuthenticated, user, isLoading } = useAuth();
//   const location = useLocation();

//   // Mostrar loader mientras se inicializa la autenticación
//   if (isLoading) {
//     return <FullPageLoader text="Verificando autenticación..." />;
//   }

//   // Si requiere autenticación y no está autenticado
//   if (requireAuth && !isAuthenticated) {
//     return (
//       <Navigate 
//         to={redirectTo} 
//         state={{ redirect: location.pathname + location.search }} 
//         replace 
//       />
//     );
//   }

//   // Si no requiere autenticación y está autenticado (ej: páginas de login)
//   if (!requireAuth && isAuthenticated) {
//     // Obtener la URL de redirección de los params o estado
//     const redirectPath = 
//       location.state?.redirect || 
//       new URLSearchParams(location.search).get('redirect') || 
//       '/dashboard';
    
//     return <Navigate to={redirectPath} replace />;
//   }

//   // Si requiere verificación de email y no está verificado
//   if (requireEmailVerification && user && !user.isVerified) {
//     return (
//       <Navigate 
//         to="/verify-email" 
//         state={{ email: user.email }} 
//         replace 
//       />
//     );
//   }

//   // Si se especifican roles permitidos y el usuario no tiene el rol adecuado
//   if (allowedRoles.length > 0 && user ) {
//     return (
//       <Navigate 
//         to="/unauthorized" 
//         state={{ requiredRoles: allowedRoles, userRole: user.role }} 
//         replace 
//       />
//     );
//   }

//   return <>{children}</>;
// };

// // Hook para verificar permisos programáticamente
// export const useRequireAuth = (redirect: string = '/login') => {
//   const { isAuthenticated, isLoading, user } = useAuth();
//   const location = useLocation();

//   React.useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       const redirectUrl = `${redirect}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
//       window.location.href = redirectUrl;
//     }
//   }, [isAuthenticated, isLoading, redirect, location.pathname, location.search]);

//   return { 
//     isAuthenticated, 
//     isLoading, 
//     user,
//     isEmailVerified: user?.isVerified ?? false,
//   };
// };

// // Hook para verificar roles específicos
// export const useRequireRole = (allowedRoles: string[]) => {
//   const { isAuthenticated, user, isLoading } = useAuth();
  
//   const hasPermission = React.useMemo(() => {
//     if (!isAuthenticated || !user) return false;
//     return typeof user.role === 'string';
//   }, [isAuthenticated, user, allowedRoles]);

//   return {
//     hasPermission,
//     isLoading,
//     userRole: user?.role,
//     isAuthenticated,
//   };
// };

// // Componente para proteger contenido inline basado en roles
// export const RoleGuard: React.FC<{
//   allowedRoles: string[];
//   children: React.ReactNode;
//   fallback?: React.ReactNode;
// }> = ({ allowedRoles, children, fallback = null }) => {
//   const { hasPermission } = useRequireRole(allowedRoles);
  
//   return hasPermission ? <>{children}</> : <>{fallback}</>;
// };

// // Componente para mostrar contenido solo a usuarios autenticados
// export const AuthGuard: React.FC<{
//   children: React.ReactNode;
//   fallback?: React.ReactNode;
//   requireEmailVerification?: boolean;
// }> = ({ children, fallback = null, requireEmailVerification = false }) => {
//   const { isAuthenticated, user } = useAuth();
  
//   if (!isAuthenticated) {
//     return <>{fallback}</>;
//   }
  
//   if (requireEmailVerification && user && !user.isVerified) {
//     return <>{fallback}</>;
//   }
  
//   return <>{children}</>;
// };




// src/components/auth/ProtectedRoute.tsx - PROTECCIÓN DE RUTAS
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  allowedRoles = [],
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ✅ MOSTRAR LOADING MIENTRAS VERIFICA
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // ✅ RUTAS PÚBLICAS (requireAuth = false)
  if (!requireAuth) {
    // Si ya está autenticado y trata de acceder a login/register, redirigir
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  }

  // ✅ VERIFICAR AUTENTICACIÓN
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to={redirectTo || '/login'} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // ✅ VERIFICAR EMAIL SI ES REQUERIDO
  if (requireEmailVerification && !user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // ✅ VERIFICAR ROLES
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ VERIFICAR ESTADO DE CUENTA
  if (user.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Cuenta Suspendida</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tu cuenta ha sido suspendida. Contacta al soporte para más información.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/contact'}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#a8c241] hover:bg-[#8ea635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241]"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.status === 'INACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Cuenta Inactiva</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tu cuenta está inactiva. Contacta al soporte para activarla.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/contact'}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#a8c241] hover:bg-[#8ea635] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a8c241]"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ TODO OK - MOSTRAR CONTENIDO
  return <>{children}</>;
};

// ✅ COMPONENTE PARA REQUERIR GUEST (no autenticado)
export const RequireGuest: React.FC<{ 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{fallback || <Navigate to="/dashboard" replace />}</>;
  }

  return <>{children}</>;
};

// ✅ COMPONENTE PARA REQUERIR AUTENTICACIÓN
export const RequireAuth: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback || <Navigate to="/login" state={{ from: location.pathname }} replace />}</>;
  }

  return <>{children}</>;
};