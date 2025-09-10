// import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// // Tipos
// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   avatar?: string;
//   role: string;
//   type: string;
//   status: string;
//   isEmailVerified: boolean;
//   companyName?: string;
//   referralCode?: string;
//   createdAt: string;
//   wallet?: {
//     balance: number;
//     availableBalance: number;
//     pendingBalance: number;
//     currency: string;
//     status: string;
//   };
// }

// interface AuthContextType {
//   // Estado
//   isAuthenticated: boolean;
//   user: User | null;
//   isLoading: boolean;
  
//   // Acciones - SIN navigate interno
//   setUser: (user: User | null) => void;
//   setAuthenticated: (authenticated: boolean) => void;
//   clearAuth: () => void;
//   initializeAuth: () => void;
  
//   // Helpers
//   hasRole: (role: string) => boolean;
//   isAdmin: () => boolean;
//   isEmailVerified: () => boolean;
//   getDisplayName: () => string;
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
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // ✅ INICIALIZAR AUTENTICACIÓN
//   const initializeAuth = () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const refreshToken = localStorage.getItem('refreshToken');
//       const userData = localStorage.getItem('user');

//       if (accessToken && refreshToken && userData) {
//         try {
//           const user = JSON.parse(userData);
//           setUser(user);
//           setIsAuthenticated(true);
//           console.log('✅ User authenticated from localStorage');
//         } catch (error) {
//           console.error('❌ Error parsing user data:', error);
//           clearAuth();
//         }
//       } else {
//         console.log('ℹ️ No authentication data found');
//         clearAuth();
//       }
//     } catch (error) {
//       console.error('❌ Error initializing auth:', error);
//       clearAuth();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ✅ LIMPIAR AUTENTICACIÓN
//   const clearAuth = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   // ✅ HELPERS
//   const hasRole = (role: string): boolean => {
//     return user?.role === role;
//   };

//   const isAdmin = (): boolean => {
//     return user?.role === 'ADMIN';
//   };

//   const isEmailVerified = (): boolean => {
//     return user?.isEmailVerified === true;
//   };

//   const getDisplayName = (): string => {
//     if (!user) return '';
    
//     if (user.type === 'COMPANY' && user.companyName) {
//       return user.companyName;
//     }
    
//     return `${user.firstName} ${user.lastName}`.trim();
//   };

//   // ✅ INICIALIZAR AL MONTAR
//   useEffect(() => {
//     initializeAuth();
//   }, []);

//   const value: AuthContextType = {
//     // Estado
//     isAuthenticated,
//     user,
//     isLoading,
    
//     // Acciones
//     setUser,
//     setAuthenticated: setIsAuthenticated,
//     clearAuth,
//     initializeAuth,
    
//     // Helpers
//     hasRole,
//     isAdmin,
//     isEmailVerified,
//     getDisplayName,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ COMPONENTES DE PROTECCIÓN SIMPLE
// export const RequireGuest: React.FC<{ 
//   children: React.ReactNode; 
//   fallback?: React.ReactNode 
// }> = ({ children, fallback }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
//       </div>
//     );
//   }

//   if (isAuthenticated && fallback) {
//     return <>{fallback}</>;
//   }

//   return <>{children}</>;
// };

// export const RequireAuth: React.FC<{ 
//   children: React.ReactNode;
//   fallback?: React.ReactNode;
// }> = ({ children, fallback }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a8c241]"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated && fallback) {
//     return <>{fallback}</>;
//   }

//   return <>{children}</>;
// };




// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, User } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  getDisplayName: () => string;
  getUserInitials: () => string;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = AuthService.getCurrentUser();
        const token = AuthService.getAccessToken();

        if (storedUser && token) {
          setUser(storedUser);
          setIsAuthenticated(true);
          console.log('✅ Auth initialized with stored user:', storedUser.email);
        } else {
          console.log('ℹ️ No stored authentication found');
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        // Si hay error, limpiar datos corruptos
        AuthService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helpers
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = user?.role === 'ADMIN';
  const isEmailVerified = user?.isEmailVerified === true;

  const getDisplayName = (): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  const getUserInitials = (): string => {
    if (!user) return '';
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  const setAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    hasRole,
    isAdmin,
    isEmailVerified,
    getDisplayName,
    getUserInitials,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};