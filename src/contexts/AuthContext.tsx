


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




// src/contexts/AuthContext.tsx - CORREGIDO SIN useNavigate
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

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

interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Acciones - SIN navigate interno
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
  
  // Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmailVerified: () => boolean;
  getDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ INICIALIZAR AUTENTICACIÓN
  const initializeAuth = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userData = localStorage.getItem('user');

      if (accessToken && refreshToken && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
          console.log('✅ User authenticated from localStorage');
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
          clearAuth();
        }
      } else {
        console.log('ℹ️ No authentication data found');
        clearAuth();
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LIMPIAR AUTENTICACIÓN
  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ HELPERS
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'ADMIN';
  };

  const isEmailVerified = (): boolean => {
    return user?.isEmailVerified === true;
  };

  const getDisplayName = (): string => {
    if (!user) return '';
    
    if (user.type === 'COMPANY' && user.companyName) {
      return user.companyName;
    }
    
    return `${user.firstName} ${user.lastName}`.trim();
  };

  // ✅ INICIALIZAR AL MONTAR
  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    // Estado
    isAuthenticated,
    user,
    isLoading,
    
    // Acciones
    setUser,
    setAuthenticated: setIsAuthenticated,
    clearAuth,
    initializeAuth,
    
    // Helpers
    hasRole,
    isAdmin,
    isEmailVerified,
    getDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ COMPONENTES DE PROTECCIÓN SIMPLE
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

  if (isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const RequireAuth: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
      </div>
    );
  }

  if (!isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};