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





// src/hooks/useAuth.ts (Frontend) - Versión Completa con OAuth
import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';

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

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  // Función para actualizar el estado
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Inicializar autenticación al cargar la página
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getAccessToken();
        const user = authService.getCurrentUser();

        if (token && user) {
          updateState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null,
          });
        } else {
          updateState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        updateState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, [updateState]);

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, accessToken, refreshToken);

        updateState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });

        toast.success(`¡Bienvenido ${user.firstName}!`);
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función de registro
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.register(data);

      if (response.success) {
        updateState({
          isLoading: false,
          error: null,
        });

        toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función de login con Google
  const loginWithGoogle = useCallback(async (credential: string): Promise<{ success: boolean; message: string; data?: any }> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.loginWithGoogle(credential);

      if (response.success) {
        const { user, accessToken, refreshToken, isNewUser } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, accessToken, refreshToken);

        updateState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });

        const message = isNewUser 
          ? `¡Bienvenido a Wiru, ${user.firstName}!` 
          : `¡Bienvenido de vuelta, ${user.firstName}!`;

        return { success: true, message, data: response.data };
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      return { success: false, message: error.message };
    }
  }, [updateState]);

  // Función de login con Facebook
  const loginWithFacebook = useCallback(async (accessToken: string): Promise<{ success: boolean; message: string; data?: any }> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.loginWithFacebook(accessToken);

      if (response.success) {
        const { user, accessToken: authToken, refreshToken, isNewUser } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, authToken, refreshToken);

        updateState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });

        const message = isNewUser 
          ? `¡Bienvenido a Wiru, ${user.firstName}!` 
          : `¡Bienvenido de vuelta, ${user.firstName}!`;

        return { success: true, message, data: response.data };
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      return { success: false, message: error.message };
    }
  }, [updateState]);

  // Función de logout
  const logout = useCallback(async (): Promise<void> => {
    updateState({ isLoading: true });

    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });

      toast.success('Sesión cerrada exitosamente');
    }
  }, [updateState]);

  // Función para verificar email
  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.verifyEmail(token);

      if (response.success) {
        // Actualizar usuario actual si está logueado
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, isEmailVerified: true };
          authService.setAuthData(
            updatedUser,
            authService.getAccessToken() || '',
            authService.getRefreshToken() || ''
          );
          updateState({ user: updatedUser });
        }

        updateState({ isLoading: false });
        toast.success('¡Email verificado exitosamente!');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función para reenviar verificación
  const resendVerification = useCallback(async (email: string): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.resendVerification(email);

      if (response.success) {
        updateState({ isLoading: false });
        toast.success('Email de verificación reenviado');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función para solicitar reset de contraseña
  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.forgotPassword(email);

      if (response.success) {
        updateState({ isLoading: false });
        toast.success('Si el email existe, recibirás instrucciones para restablecer tu contraseña');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función para confirmar reset de contraseña
  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.resetPassword(token, newPassword);

      if (response.success) {
        updateState({ isLoading: false });
        toast.success('Contraseña restablecida exitosamente');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      toast.error(error.message);
      return false;
    }
  }, [updateState]);

  // Función para cambiar contraseña
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    updateState({ isLoading: true, error: null });

    try {
      const response = await authService.changePassword(currentPassword, newPassword);

      if (response.success) {
        // Logout automático ya que el backend invalida los tokens
        updateState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });

        return { success: true, message: response.message };
      }

      throw new Error(response.message);
    } catch (error: any) {
      updateState({ 
        isLoading: false, 
        error: error.message 
      });
      return { success: false, message: error.message };
    }
  }, [updateState]);

  // Función para obtener cuentas OAuth
  const getOAuthAccounts = useCallback(async (): Promise<{ google: boolean; facebook: boolean }> => {
    try {
      return await authService.getOAuthAccounts();
    } catch (error: any) {
      toast.error('Error al obtener cuentas OAuth');
      throw error;
    }
  }, []);

  // Función para desvincular cuenta OAuth
  const unlinkOAuthAccount = useCallback(async (provider: 'google' | 'facebook'): Promise<void> => {
    try {
      await authService.unlinkOAuthAccount(provider);
      toast.success(`Cuenta de ${provider} desvinculada exitosamente`);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  }, []);

  // Función para renovar tokens
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      // const { accessToken, refreshToken } = await authService.refreshToken();
      
      updateState({
        // No cambiar isAuthenticated ni user, solo actualizar tokens internamente
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Si falla el refresh, cerrar sesión
      updateState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Sesión expirada',
      });

      return false;
    }
  }, [updateState]);

  // Helpers
  const hasRole = useCallback((role: string): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const isAdmin = useCallback((): boolean => {
    return hasRole('ADMIN');
  }, [hasRole]);

  const isEmailVerified = useCallback((): boolean => {
    return state.user?.isEmailVerified === true;
  }, [state.user]);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      authService.setAuthData(
        updatedUser,
        authService.getAccessToken() || '',
        authService.getRefreshToken() || ''
      );
      updateState({ user: updatedUser });
    }
  }, [state.user, updateState]);

  return {
    // Estado
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones básicas
    login,
    register,
    logout,
    
    // OAuth
    loginWithGoogle,
    loginWithFacebook,
    getOAuthAccounts,
    unlinkOAuthAccount,
    
    // Verificación y recuperación
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    
    // Utilidades
    refreshTokens,
    clearError,
    updateUser,
    
    // Helpers
    hasRole,
    isAdmin,
    isEmailVerified,
  };
};