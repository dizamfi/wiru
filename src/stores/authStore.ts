// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { immer } from 'zustand/middleware/immer';
// import { authService } from '@/services/authService';
// import { 
//   AuthState, 
//   LoginCredentials, 
//   RegisterData, 
//   ResetPasswordData 
// } from '@/types/auth.types';
// import { User } from '@/types';
// import toast from 'react-hot-toast';

// interface AuthActions {
//   // Autenticación
//   login: (credentials: LoginCredentials) => Promise<boolean>;
//   register: (data: RegisterData) => Promise<boolean>;
//   logout: () => Promise<void>;
  
//   // Gestión de usuario
//   updateUser: (user: Partial<User>) => void;
//   refreshUserData: () => Promise<void>;
  
//   // Verificación y recuperación
//   verifyEmail: (token: string) => Promise<boolean>;
//   resendVerification: (email: string) => Promise<boolean>;
//   resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  
//   // OAuth
//   loginWithGoogle: (credential: string) => Promise<boolean>;
//   loginWithFacebook: (accessToken: string) => Promise<boolean>;
  
//   // Estado
//   setLoading: (loading: boolean) => void;
//   clearError: () => void;
//   initializeAuth: () => void;
// }

// interface AuthStore extends AuthState, AuthActions {
//   error: string | null;
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     immer((set, get) => ({
//       // Estado inicial
//       isAuthenticated: false,
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isLoading: false,
//       error: null,

//       // Inicializar autenticación desde localStorage
//       initializeAuth: () => {
//         const token = authService.getAccessToken();
//         const user = authService.getStoredUser();
//         const refreshToken = authService.getRefreshToken();
        
//         if (token && user) {
//           set((state) => {
//             state.isAuthenticated = true;
//             state.user = user;
//             state.accessToken = token;
//             state.refreshToken = refreshToken;
//           });
//         }
//       },

//       // Login
//       login: async (credentials: LoginCredentials): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.login(credentials);
          
//           if (response.success) {
//             const { user, accessToken, refreshToken } = response.data;
            
//             // Guardar tokens
//             authService.saveTokens(accessToken, refreshToken, user);
            
//             // Actualizar estado
//             set((state) => {
//               state.isAuthenticated = true;
//               state.user = user;
//               state.accessToken = accessToken;
//               state.refreshToken = refreshToken;
//               state.isLoading = false;
//               state.error = null;
//             });

//             toast.success(`¡Bienvenido ${user.firstName}!`);
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Registro
//       register: async (data: RegisterData): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.register(data);
          
//           if (response.success) {
//             set((state) => {
//               state.isLoading = false;
//               state.error = null;
//             });

//             toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al crear la cuenta';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Logout
//       logout: async (): Promise<void> => {
//         set((state) => {
//           state.isLoading = true;
//         });

//         try {
//           await authService.logout();
//         } catch (error) {
//           console.error('Error durante logout:', error);
//         } finally {
//           // Limpiar estado siempre, incluso si falla la llamada a la API
//           set((state) => {
//             state.isAuthenticated = false;
//             state.user = null;
//             state.accessToken = null;
//             state.refreshToken = null;
//             state.isLoading = false;
//             state.error = null;
//           });

//           toast.success('Sesión cerrada correctamente');
//         }
//       },

//       // Login con Google
//       loginWithGoogle: async (credential: string): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.loginWithGoogle(credential);
          
//           if (response.success) {
//             const { user, accessToken, refreshToken, isNewUser } = response.data;
            
//             authService.saveTokens(accessToken, refreshToken, user);
            
//             set((state) => {
//               state.isAuthenticated = true;
//               state.user = user;
//               state.accessToken = accessToken;
//               state.refreshToken = refreshToken;
//               state.isLoading = false;
//               state.error = null;
//             });

//             const message = isNewUser 
//               ? `¡Bienvenido ${user.firstName}! Tu cuenta ha sido creada.`
//               : `¡Bienvenido de nuevo ${user.firstName}!`;
            
//             toast.success(message);
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión con Google';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Login con Facebook
//       loginWithFacebook: async (accessToken: string): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.loginWithFacebook(accessToken);
          
//           if (response.success) {
//             const { user, accessToken: authToken, refreshToken, isNewUser } = response.data;
            
//             authService.saveTokens(authToken, refreshToken, user);
            
//             set((state) => {
//               state.isAuthenticated = true;
//               state.user = user;
//               state.accessToken = authToken;
//               state.refreshToken = refreshToken;
//               state.isLoading = false;
//               state.error = null;
//             });

//             const message = isNewUser 
//               ? `¡Bienvenido ${user.firstName}! Tu cuenta ha sido creada.`
//               : `¡Bienvenido de nuevo ${user.firstName}!`;
            
//             toast.success(message);
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión con Facebook';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Verificar email
//       verifyEmail: async (token: string): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.verifyEmail(token);
          
//           if (response.success) {
//             // Si el usuario ya está logueado, actualizar su estado
//             const currentUser = get().user;
//             if (currentUser) {
//               set((state) => {
//                 if (state.user) {
//                   state.user.isVerified = true;
//                 }
//               });
//             }

//             set((state) => {
//               state.isLoading = false;
//             });

//             toast.success('¡Email verificado exitosamente!');
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al verificar el email';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Reenviar verificación
//       resendVerification: async (email: string): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.resendVerification(email);
          
//           if (response.success) {
//             set((state) => {
//               state.isLoading = false;
//             });

//             toast.success('Email de verificación enviado. Revisa tu bandeja de entrada.');
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el email';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Reset password
//       resetPassword: async (data: ResetPasswordData): Promise<boolean> => {
//         set((state) => {
//           state.isLoading = true;
//           state.error = null;
//         });

//         try {
//           const response = await authService.resetPassword(data);
          
//           if (response.success) {
//             set((state) => {
//               state.isLoading = false;
//             });

//             toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.');
//             return true;
//           }
          
//           throw new Error(response.message);
//         } catch (error: any) {
//           const errorMessage = error.response?.data?.message || error.message || 'Error al enviar email de recuperación';
          
//           set((state) => {
//             state.isLoading = false;
//             state.error = errorMessage;
//           });

//           toast.error(errorMessage);
//           return false;
//         }
//       },

//       // Actualizar usuario
//       updateUser: (userData: Partial<User>) => {
//         set((state) => {
//           if (state.user) {
//             state.user = { ...state.user, ...userData };
//             // Actualizar también en localStorage
//             authService.saveTokens(
//               state.accessToken!, 
//               state.refreshToken!, 
//               state.user
//             );
//           }
//         });
//       },

//       // Refrescar datos del usuario
//       refreshUserData: async (): Promise<void> => {
//         // Esta función se implementará cuando tengamos el endpoint del backend
//         // Por ahora solo es un placeholder
//         console.log('Refreshing user data...');
//       },

//       // Utilidades
//       setLoading: (loading: boolean) => {
//         set((state) => {
//           state.isLoading = loading;
//         });
//       },

//       clearError: () => {
//         set((state) => {
//           state.error = null;
//         });
//       },
//     })),
//     {
//       name: 'auth-storage',
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         isAuthenticated: state.isAuthenticated,
//         user: state.user,
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//       }),
//     }
//   )
// );

// // Selectores para optimizar re-renders
// export const useAuthUser = () => useAuthStore((state) => state.user);
// export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
// export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
// export const useAuthError = () => useAuthStore((state) => state.error);





// src/stores/authStore.ts - Versión Corregida
import { create } from 'zustand';
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

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Acciones básicas
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // OAuth
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginWithFacebook: (accessToken: string) => Promise<boolean>;
  
  // Verificación y recuperación
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // Utilidades
  initializeAuth: () => void;
  clearError: () => void;
  refreshTokens: () => Promise<boolean>;
  
  // Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmailVerified: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  error: null,

  // Inicializar autenticación
  initializeAuth: () => {
    try {
      const token = authService.getAccessToken();
      const user = authService.getCurrentUser(); // ✅ Método correcto
      const refreshToken = authService.getRefreshToken();

      if (token && user) {
        set({
          isAuthenticated: true,
          user,
          accessToken: token,
          refreshToken,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, accessToken, refreshToken);

        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          isLoading: false,
          error: null,
        });

        toast.success(`¡Bienvenido ${user.firstName}!`);
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Registro
  register: async (data: RegisterData): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.register(data);
      
      if (response.success) {
        set({
          isLoading: false,
          error: null,
        });

        toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
        return true;
      }
      
      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar usuario';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Login con Google
  loginWithGoogle: async (credential: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.loginWithGoogle(credential);

      if (response.success) {
        const { user, accessToken, refreshToken, isNewUser } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, accessToken, refreshToken);

        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          isLoading: false,
          error: null,
        });

        const message = isNewUser 
          ? `¡Bienvenido a Wiru, ${user.firstName}!` 
          : `¡Bienvenido de vuelta, ${user.firstName}!`;

        toast.success(message);
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al autenticar con Google';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Login con Facebook
  loginWithFacebook: async (accessToken: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.loginWithFacebook(accessToken);

      if (response.success) {
        const { user, accessToken: authToken, refreshToken, isNewUser } = response.data;

        // Almacenar datos de autenticación
        authService.setAuthData(user, authToken, refreshToken);

        set({
          isAuthenticated: true,
          user,
          accessToken: authToken,
          refreshToken,
          isLoading: false,
          error: null,
        });

        const message = isNewUser 
          ? `¡Bienvenido a Wiru, ${user.firstName}!` 
          : `¡Bienvenido de vuelta, ${user.firstName}!`;

        toast.success(message);
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al autenticar con Facebook';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      });

      toast.success('Sesión cerrada exitosamente');
    }
  },

  // Verificar email
  verifyEmail: async (token: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.verifyEmail(token);

      if (response.success) {
        // Actualizar usuario actual si está logueado
        const currentUser = authService.getCurrentUser(); // ✅ Método correcto
        if (currentUser) {
          const updatedUser = { ...currentUser, isEmailVerified: true };
          authService.setAuthData(
            updatedUser,
            authService.getAccessToken() || '',
            authService.getRefreshToken() || ''
          );
          set({ user: updatedUser });
        }

        set({ isLoading: false });
        toast.success('¡Email verificado exitosamente!');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al verificar email';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Reenviar verificación
  resendVerification: async (email: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.resendVerification(email);

      if (response.success) {
        set({ isLoading: false });
        toast.success('Email de verificación reenviado');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al reenviar verificación';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.forgotPassword(email);

      if (response.success) {
        set({ isLoading: false });
        toast.success('Si el email existe, recibirás instrucciones para restablecer tu contraseña');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al solicitar restablecimiento';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.resetPassword(token, newPassword);

      if (response.success) {
        set({ isLoading: false });
        toast.success('Contraseña restablecida exitosamente');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al restablecer contraseña';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.changePassword(currentPassword, newPassword);

      if (response.success) {
        // Logout automático ya que el backend invalida los tokens
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        });

        toast.success('Contraseña cambiada exitosamente. Por favor inicia sesión nuevamente.');
        return true;
      }

      throw new Error(response.message);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return false;
    }
  },

  // Refresh tokens
  refreshTokens: async (): Promise<boolean> => {
    try {
      const { accessToken, refreshToken } = await authService.refreshToken();
      
      set({
        accessToken,
        refreshToken,
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Si falla el refresh, cerrar sesión
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: 'Sesión expirada',
      });

      return false;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Helpers
  hasRole: (role: string): boolean => {
    const { user } = get();
    return user?.role === role;
  },

  isAdmin: (): boolean => {
    const { hasRole } = get();
    return hasRole('ADMIN');
  },

  isEmailVerified: (): boolean => {
    const { user } = get();
    return user?.isEmailVerified === true;
  },
}));