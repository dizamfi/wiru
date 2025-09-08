


// // src/contexts/AuthContext.tsx
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '@/types';
// import { authService } from '@/services/authService';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (user: User) => void;
//   logout: () => Promise<void>;
//   refreshUser: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Verificar si hay un usuario guardado al iniciar
//     const initializeAuth = () => {
//       console.log('🔍 Verificando autenticación almacenada...');
      
//       const storedUser = authService.getStoredUser();
//       const token = authService.getAccessToken();

//       if (storedUser && token) {
//         console.log('✅ Usuario encontrado en localStorage:', storedUser);
//         setUser(storedUser);
//       } else {
//         console.log('❌ No hay usuario autenticado');
//       }

//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   const login = (userData: User) => {
//     console.log('🚀 Login en contexto:', userData);
//     setUser(userData);
//   };

//   const logout = async () => {
//     console.log('🚪 Cerrando sesión...');
    
//     try {
//       await authService.logout();
//       setUser(null);
//       console.log('✅ Sesión cerrada exitosamente');
//     } catch (error) {
//       console.error('❌ Error al cerrar sesión:', error);
//       // Limpiar estado local aunque falle la request al backend
//       authService.clearTokens();
//       setUser(null);
//     }
//   };

//   const refreshUser = () => {
//     const storedUser = authService.getStoredUser();
//     setUser(storedUser);
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     logout,
//     refreshUser,
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="text-gray-600">Cargando...</p>
//         </div>
//       </div>
//     );
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };





// src/contexts/AuthContext.tsx (Frontend) - Versión Completa
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Tipos
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  type: string;
  status: string;
  isEmailVerified: boolean;
  companyName?: string;
  referralCode?: string;
  createdAt: string;
  wallet?: {
    balance: number;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
    status: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  userType: 'person' | 'company';
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  [key: string]: any;
}

interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones básicas
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // OAuth
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message: string; data?: any }>;
  loginWithFacebook: (accessToken: string) => Promise<{ success: boolean; message: string; data?: any }>;
  getOAuthAccounts: () => Promise<{ google: boolean; facebook: boolean }>;
  unlinkOAuthAccount: (provider: 'google' | 'facebook') => Promise<void>;
  
  // Verificación y recuperación
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Utilidades
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmailVerified: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    // Estado
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    
    // Acciones básicas
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    
    // OAuth
    loginWithGoogle: auth.loginWithGoogle,
    loginWithFacebook: auth.loginWithFacebook,
    getOAuthAccounts: auth.getOAuthAccounts,
    unlinkOAuthAccount: auth.unlinkOAuthAccount,
    
    // Verificación y recuperación
    verifyEmail: auth.verifyEmail,
    resendVerification: auth.resendVerification,
    forgotPassword: auth.forgotPassword,
    resetPassword: auth.resetPassword,
    changePassword: auth.changePassword,
    
    // Utilidades
    clearError: auth.clearError,
    updateUser: auth.updateUser,
    
    // Helpers
    hasRole: auth.hasRole,
    isAdmin: auth.isAdmin,
    isEmailVerified: auth.isEmailVerified,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// Component para proteger rutas que requieren autenticación
interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireEmailVerified?: boolean;
  requiredRole?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallback,
  requireEmailVerified = false,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading, hasRole, isEmailVerified } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <div>Redirigiendo al login...</div>;
  }

  if (requireEmailVerified && !isEmailVerified()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Email no verificado
          </h3>
          <p className="text-gray-600 mb-4">
            Necesitas verificar tu email antes de continuar. Revisa tu bandeja de entrada.
          </p>
          <button
            onClick={() => window.location.href = '/verify-email'}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Ir a verificación
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Acceso denegado
          </h3>
          <p className="text-gray-600 mb-4">
            No tienes permisos suficientes para acceder a esta página.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Component para mostrar contenido solo si NO está autenticado
interface RequireGuestProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireGuest: React.FC<RequireGuestProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return fallback ? <>{fallback}</> : <div>Redirigiendo al dashboard...</div>;
  }

  return <>{children}</>;
};

// Higher-Order Component para proteger rutas
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireEmailVerified?: boolean;
    requiredRole?: string;
  }
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    return (
      <RequireAuth
        requireEmailVerified={options?.requireEmailVerified}
        requiredRole={options?.requiredRole}
      >
        <Component {...props} />
      </RequireAuth>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return AuthenticatedComponent;
};

// Hook personalizado para verificaciones específicas
export const useAuthChecks = () => {
  const { user, isAuthenticated, hasRole, isEmailVerified } = useAuthContext();

  return {
    isAuthenticated,
    isEmailVerified: isEmailVerified(),
    isAdmin: hasRole('ADMIN'),
    isModerator: hasRole('MODERATOR') || hasRole('ADMIN'),
    isUser: hasRole('USER'),
    isPerson: user?.type === 'PERSON',
    isCompany: user?.type === 'COMPANY',
    isActive: user?.status === 'ACTIVE',
    isPending: user?.status === 'PENDING_VERIFICATION',
    isSuspended: user?.status === 'SUSPENDED',
    canAccess: (requiredRole?: string) => {
      if (!isAuthenticated) return false;
      if (!requiredRole) return true;
      return hasRole(requiredRole);
    },
  };
};