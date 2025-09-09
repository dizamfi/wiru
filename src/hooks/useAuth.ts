// import { useEffect } from 'react';
// import { useAuthStore } from '@/stores/authStore';

// export const useAuth = () => {
//   const store = useAuthStore();

//   // Inicializar autenticación al montar el hook
//   useEffect(() => {
//     store.initializeAuth();
//   }, []);

//   return {
//     // Estado
//     isAuthenticated: store.isAuthenticated,
//     user: store.user,
//     isLoading: store.isLoading,
//     error: store.error,
    
//     // Acciones
//     login: store.login,
//     register: store.register,
//     logout: store.logout,
//     loginWithGoogle: store.loginWithGoogle,
//     loginWithFacebook: store.loginWithFacebook,
//     verifyEmail: store.verifyEmail,
//     resendVerification: store.resendVerification,
//     resetPassword: store.resetPassword,
//     updateUser: store.updateUser,
//     refreshUserData: store.refreshUserData,
//     clearError: store.clearError,
    
//     // Utilidades
//     isEmailVerified: store.user?.isVerified ?? false,
//     userFullName: store.user ? `${store.user.firstName} ${store.user.lastName}` : '',
//     userInitials: store.user ? `${store.user.firstName[0]}${store.user.lastName[0]}` : '',
//   };
// };





// // src/hooks/useAuth.ts (Frontend) - Versión Completa con OAuth
// import { useState, useEffect, useCallback } from 'react';
// import { AuthService } from '@/services/authService';
// import { toast } from 'react-hot-toast';

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

// interface AuthState {
//   isAuthenticated: boolean;
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface RegisterData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phone?: string;
//   userType: 'person' | 'company';
//   acceptTerms: boolean;
//   acceptPrivacy: boolean;
//   [key: string]: any;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   isLoading: true,
//   error: null,
// };

// export const useAuth = () => {
//   const [state, setState] = useState<AuthState>(initialState);

//   // Función para actualizar el estado
//   const updateState = useCallback((updates: Partial<AuthState>) => {
//     setState(prev => ({ ...prev, ...updates }));
//   }, []);

//   // Función para limpiar errores
//   const clearError = useCallback(() => {
//     updateState({ error: null });
//   }, [updateState]);

//   // Inicializar autenticación al cargar la página
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const token = AuthService.getAccessToken();
//         const user = AuthService.getCurrentUser();

//         if (token && user) {
//           updateState({
//             isAuthenticated: true,
//             user,
//             isLoading: false,
//             error: null,
//           });
//         } else {
//           updateState({
//             isAuthenticated: false,
//             user: null,
//             isLoading: false,
//             error: null,
//           });
//         }
//       } catch (error) {
//         console.error('Error initializing auth:', error);
//         updateState({
//           isAuthenticated: false,
//           user: null,
//           isLoading: false,
//           error: null,
//         });
//       }
//     };

//     initializeAuth();
//   }, [updateState]);

//   // Función de login
//   const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.login(credentials);

//       if (response.success) {
//         const { user, accessToken, refreshToken } = response.data;

//         // Almacenar datos de autenticación
//         authService.setAuthData(user, accessToken, refreshToken);

//         updateState({
//           isAuthenticated: true,
//           user,
//           isLoading: false,
//           error: null,
//         });

//         toast.success(`¡Bienvenido ${user.firstName}!`);
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función de registro
//   const register = useCallback(async (data: RegisterData): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.register(data);

//       if (response.success) {
//         updateState({
//           isLoading: false,
//           error: null,
//         });

//         toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función de login con Google
//   const loginWithGoogle = useCallback(async (credential: string): Promise<{ success: boolean; message: string; data?: any }> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.loginWithGoogle(credential);

//       if (response.success) {
//         const { user, accessToken, refreshToken, isNewUser } = response.data;

//         // Almacenar datos de autenticación
//         authService.setAuthData(user, accessToken, refreshToken);

//         updateState({
//           isAuthenticated: true,
//           user,
//           isLoading: false,
//           error: null,
//         });

//         const message = isNewUser 
//           ? `¡Bienvenido a Wiru, ${user.firstName}!` 
//           : `¡Bienvenido de vuelta, ${user.firstName}!`;

//         return { success: true, message, data: response.data };
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       return { success: false, message: error.message };
//     }
//   }, [updateState]);

//   // Función de login con Facebook
//   const loginWithFacebook = useCallback(async (accessToken: string): Promise<{ success: boolean; message: string; data?: any }> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.loginWithFacebook(accessToken);

//       if (response.success) {
//         const { user, accessToken: authToken, refreshToken, isNewUser } = response.data;

//         // Almacenar datos de autenticación
//         authService.setAuthData(user, authToken, refreshToken);

//         updateState({
//           isAuthenticated: true,
//           user,
//           isLoading: false,
//           error: null,
//         });

//         const message = isNewUser 
//           ? `¡Bienvenido a Wiru, ${user.firstName}!` 
//           : `¡Bienvenido de vuelta, ${user.firstName}!`;

//         return { success: true, message, data: response.data };
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       return { success: false, message: error.message };
//     }
//   }, [updateState]);

//   // Función de logout
//   const logout = useCallback(async (): Promise<void> => {
//     updateState({ isLoading: true });

//     try {
//       await authService.logout();
//     } catch (error) {
//       console.error('Error during logout:', error);
//     } finally {
//       updateState({
//         isAuthenticated: false,
//         user: null,
//         isLoading: false,
//         error: null,
//       });

//       toast.success('Sesión cerrada exitosamente');
//     }
//   }, [updateState]);

//   // Función para verificar email
//   const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.verifyEmail(token);

//       if (response.success) {
//         // Actualizar usuario actual si está logueado
//         const currentUser = authService.getCurrentUser();
//         if (currentUser) {
//           const updatedUser = { ...currentUser, isEmailVerified: true };
//           authService.setAuthData(
//             updatedUser,
//             authService.getAccessToken() || '',
//             authService.getRefreshToken() || ''
//           );
//           updateState({ user: updatedUser });
//         }

//         updateState({ isLoading: false });
//         toast.success('¡Email verificado exitosamente!');
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función para reenviar verificación
//   const resendVerification = useCallback(async (email: string): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.resendVerification(email);

//       if (response.success) {
//         updateState({ isLoading: false });
//         toast.success('Email de verificación reenviado');
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función para solicitar reset de contraseña
//   const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.forgotPassword(email);

//       if (response.success) {
//         updateState({ isLoading: false });
//         toast.success('Si el email existe, recibirás instrucciones para restablecer tu contraseña');
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función para confirmar reset de contraseña
//   const resetPassword = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.resetPassword(token, newPassword);

//       if (response.success) {
//         updateState({ isLoading: false });
//         toast.success('Contraseña restablecida exitosamente');
//         return true;
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       toast.error(error.message);
//       return false;
//     }
//   }, [updateState]);

//   // Función para cambiar contraseña
//   const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
//     updateState({ isLoading: true, error: null });

//     try {
//       const response = await authService.changePassword(currentPassword, newPassword);

//       if (response.success) {
//         // Logout automático ya que el backend invalida los tokens
//         updateState({
//           isAuthenticated: false,
//           user: null,
//           isLoading: false,
//           error: null,
//         });

//         return { success: true, message: response.message };
//       }

//       throw new Error(response.message);
//     } catch (error: any) {
//       updateState({ 
//         isLoading: false, 
//         error: error.message 
//       });
//       return { success: false, message: error.message };
//     }
//   }, [updateState]);

//   // Función para obtener cuentas OAuth
//   const getOAuthAccounts = useCallback(async (): Promise<{ google: boolean; facebook: boolean }> => {
//     try {
//       return await authService.getOAuthAccounts();
//     } catch (error: any) {
//       toast.error('Error al obtener cuentas OAuth');
//       throw error;
//     }
//   }, []);

//   // Función para desvincular cuenta OAuth
//   const unlinkOAuthAccount = useCallback(async (provider: 'google' | 'facebook'): Promise<void> => {
//     try {
//       await authService.unlinkOAuthAccount(provider);
//       toast.success(`Cuenta de ${provider} desvinculada exitosamente`);
//     } catch (error: any) {
//       toast.error(error.message);
//       throw error;
//     }
//   }, []);

//   // Función para renovar tokens
//   const refreshTokens = useCallback(async (): Promise<boolean> => {
//     try {
//       // const { accessToken, refreshToken } = await authService.refreshToken();
      
//       updateState({
//         // No cambiar isAuthenticated ni user, solo actualizar tokens internamente
//         isLoading: false,
//         error: null,
//       });

//       return true;
//     } catch (error) {
//       console.error('Token refresh failed:', error);
      
//       // Si falla el refresh, cerrar sesión
//       updateState({
//         isAuthenticated: false,
//         user: null,
//         isLoading: false,
//         error: 'Sesión expirada',
//       });

//       return false;
//     }
//   }, [updateState]);

//   // Helpers
//   const hasRole = useCallback((role: string): boolean => {
//     return state.user?.role === role;
//   }, [state.user]);

//   const isAdmin = useCallback((): boolean => {
//     return hasRole('ADMIN');
//   }, [hasRole]);

//   const isEmailVerified = useCallback((): boolean => {
//     return state.user?.isEmailVerified === true;
//   }, [state.user]);

//   const updateUser = useCallback((updates: Partial<User>) => {
//     if (state.user) {
//       const updatedUser = { ...state.user, ...updates };
//       authService.setAuthData(
//         updatedUser,
//         authService.getAccessToken() || '',
//         authService.getRefreshToken() || ''
//       );
//       updateState({ user: updatedUser });
//     }
//   }, [state.user, updateState]);

//   return {
//     // Estado
//     isAuthenticated: state.isAuthenticated,
//     user: state.user,
//     isLoading: state.isLoading,
//     error: state.error,
    
//     // Acciones básicas
//     login,
//     register,
//     logout,
    
//     // OAuth
//     loginWithGoogle,
//     loginWithFacebook,
//     getOAuthAccounts,
//     unlinkOAuthAccount,
    
//     // Verificación y recuperación
//     verifyEmail,
//     resendVerification,
//     forgotPassword,
//     resetPassword,
//     changePassword,
    
//     // Utilidades
//     refreshTokens,
//     clearError,
//     updateUser,
    
//     // Helpers
//     hasRole,
//     isAdmin,
//     isEmailVerified,
//   };
// };







// src/hooks/useAuth.ts - HOOK DE AUTENTICACIÓN CORREGIDO
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthService } from '@/services/authService';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Tipos
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

export const useAuth = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();

  // ✅ LOGIN
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const result = await AuthService.login(credentials);

      if (result.success) {
        // Guardar en localStorage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        // Actualizar contexto
        auth.setUser(result.data.user);
        auth.setAuthenticated(true);

        console.log('✅ Login successful in useAuth');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Login error in useAuth:', error);
      throw error;
    }
  }, [auth]);

  // ✅ REGISTER
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      const result = await AuthService.register(data);

      if (result.success) {
        console.log('✅ Registration successful in useAuth');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Registration error in useAuth:', error);
      throw error;
    }
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      // Intentar logout en el servidor
      try {
        await AuthService.logout();
      } catch (error) {
        console.error('⚠️ Server logout failed:', error);
        // Continuar con logout local aunque falle el servidor
      }

      // Limpiar estado local
      auth.clearAuth();

      console.log('✅ Logout successful');
      
      // Redirigir al login
      navigate('/login', { replace: true });

    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }, [auth, navigate]);

  // ✅ VERIFY EMAIL
  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      const result = await AuthService.verifyEmail(token);
      
      if (result.success) {
        // Actualizar usuario si está logueado
        if (auth.user) {
          const updatedUser = { ...auth.user, isEmailVerified: true };
          auth.setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        toast.success('Email verificado exitosamente');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Email verification error:', error);
      toast.error(error.message || 'Error al verificar email');
      return false;
    }
  }, [auth]);

  // ✅ RESEND VERIFICATION
  const resendVerification = useCallback(async (email: string): Promise<boolean> => {
    try {
      const result = await AuthService.resendVerification(email);
      
      if (result.success) {
        toast.success('Nuevo enlace de verificación enviado');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('❌ Resend verification error:', error);
      toast.error(error.message || 'Error al reenviar verificación');
      return false;
    }
  }, []);

  // ✅ LOGIN WITH GOOGLE (Future implementation)
  const loginWithGoogle = useCallback(async (credential: string) => {
    try {
      // TODO: Implementar OAuth con Google
      toast.error('Login con Google no implementado aún');
      return { success: false, message: 'No implementado' };
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      return { success: false, message: error.message };
    }
  }, []);

  // ✅ LOGIN WITH FACEBOOK (Future implementation)
  const loginWithFacebook = useCallback(async (accessToken: string) => {
    try {
      // TODO: Implementar OAuth con Facebook
      toast.error('Login con Facebook no implementado aún');
      return { success: false, message: 'No implementado' };
    } catch (error: any) {
      console.error('❌ Facebook login error:', error);
      return { success: false, message: error.message };
    }
  }, []);

  // ✅ RETURN - Combina contexto + hook
  return {
    // Estado del contexto
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    
    // Acciones del hook
    login,
    register,
    logout,
    
    // Email verification
    verifyEmail,
    resendVerification,
    
    // OAuth (future)
    loginWithGoogle,
    loginWithFacebook,
    
    // Helpers del contexto
    hasRole: auth.hasRole,
    isAdmin: auth.isAdmin,
    isEmailVerified: auth.isEmailVerified,
    getDisplayName: auth.getDisplayName,
  };
};