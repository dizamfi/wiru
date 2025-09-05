// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '@/types';
// import { authService } from '@/services/authService';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (user: User) => void;
//   logout: () => void;
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
//     const storedUser = authService.getStoredUser();
//     const token = authService.getAccessToken();

//     if (storedUser && token) {
//       setUser(storedUser);
//     }

//     setIsLoading(false);
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//   };

//   const logout = async () => {
//     await authService.logout();
//     setUser(null);
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };



// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado al iniciar
    const initializeAuth = () => {
      console.log('🔍 Verificando autenticación almacenada...');
      
      const storedUser = authService.getStoredUser();
      const token = authService.getAccessToken();

      if (storedUser && token) {
        console.log('✅ Usuario encontrado en localStorage:', storedUser);
        setUser(storedUser);
      } else {
        console.log('❌ No hay usuario autenticado');
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    console.log('🚀 Login en contexto:', userData);
    setUser(userData);
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    
    try {
      await authService.logout();
      setUser(null);
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      // Limpiar estado local aunque falle la request al backend
      authService.clearTokens();
      setUser(null);
    }
  };

  const refreshUser = () => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};