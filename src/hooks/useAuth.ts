import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  // Inicializar autenticación al montar el hook
  useEffect(() => {
    store.initializeAuth();
  }, []);

  return {
    // Estado
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    isLoading: store.isLoading,
    error: store.error,
    
    // Acciones
    login: store.login,
    register: store.register,
    logout: store.logout,
    loginWithGoogle: store.loginWithGoogle,
    loginWithFacebook: store.loginWithFacebook,
    verifyEmail: store.verifyEmail,
    resendVerification: store.resendVerification,
    resetPassword: store.resetPassword,
    updateUser: store.updateUser,
    refreshUserData: store.refreshUserData,
    clearError: store.clearError,
    
    // Utilidades
    isEmailVerified: store.user?.isVerified ?? false,
    userFullName: store.user ? `${store.user.firstName} ${store.user.lastName}` : '',
    userInitials: store.user ? `${store.user.firstName[0]}${store.user.lastName[0]}` : '',
  };
};