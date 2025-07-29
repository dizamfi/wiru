import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authService } from '@/services/authService';
import { 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  ResetPasswordData 
} from '@/types/auth.types';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthActions {
  // Autenticación
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Gestión de usuario
  updateUser: (user: Partial<User>) => void;
  refreshUserData: () => Promise<void>;
  
  // Verificación y recuperación
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  
  // OAuth
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginWithFacebook: (accessToken: string) => Promise<boolean>;
  
  // Estado
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

interface AuthStore extends AuthState, AuthActions {
  error: string | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Inicializar autenticación desde localStorage
      initializeAuth: () => {
        const token = authService.getAccessToken();
        const user = authService.getStoredUser();
        const refreshToken = authService.getRefreshToken();
        
        if (token && user) {
          set((state) => {
            state.isAuthenticated = true;
            state.user = user;
            state.accessToken = token;
            state.refreshToken = refreshToken;
          });
        }
      },

      // Login
      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.login(credentials);
          
          if (response.success) {
            const { user, accessToken, refreshToken } = response.data;
            
            // Guardar tokens
            authService.saveTokens(accessToken, refreshToken, user);
            
            // Actualizar estado
            set((state) => {
              state.isAuthenticated = true;
              state.user = user;
              state.accessToken = accessToken;
              state.refreshToken = refreshToken;
              state.isLoading = false;
              state.error = null;
            });

            toast.success(`¡Bienvenido ${user.firstName}!`);
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Registro
      register: async (data: RegisterData): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.register(data);
          
          if (response.success) {
            set((state) => {
              state.isLoading = false;
              state.error = null;
            });

            toast.success('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.');
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al crear la cuenta';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Logout
      logout: async (): Promise<void> => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          await authService.logout();
        } catch (error) {
          console.error('Error durante logout:', error);
        } finally {
          // Limpiar estado siempre, incluso si falla la llamada a la API
          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isLoading = false;
            state.error = null;
          });

          toast.success('Sesión cerrada correctamente');
        }
      },

      // Login con Google
      loginWithGoogle: async (credential: string): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.loginWithGoogle(credential);
          
          if (response.success) {
            const { user, accessToken, refreshToken, isNewUser } = response.data;
            
            authService.saveTokens(accessToken, refreshToken, user);
            
            set((state) => {
              state.isAuthenticated = true;
              state.user = user;
              state.accessToken = accessToken;
              state.refreshToken = refreshToken;
              state.isLoading = false;
              state.error = null;
            });

            const message = isNewUser 
              ? `¡Bienvenido ${user.firstName}! Tu cuenta ha sido creada.`
              : `¡Bienvenido de nuevo ${user.firstName}!`;
            
            toast.success(message);
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión con Google';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Login con Facebook
      loginWithFacebook: async (accessToken: string): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.loginWithFacebook(accessToken);
          
          if (response.success) {
            const { user, accessToken: authToken, refreshToken, isNewUser } = response.data;
            
            authService.saveTokens(authToken, refreshToken, user);
            
            set((state) => {
              state.isAuthenticated = true;
              state.user = user;
              state.accessToken = authToken;
              state.refreshToken = refreshToken;
              state.isLoading = false;
              state.error = null;
            });

            const message = isNewUser 
              ? `¡Bienvenido ${user.firstName}! Tu cuenta ha sido creada.`
              : `¡Bienvenido de nuevo ${user.firstName}!`;
            
            toast.success(message);
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión con Facebook';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Verificar email
      verifyEmail: async (token: string): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.verifyEmail(token);
          
          if (response.success) {
            // Si el usuario ya está logueado, actualizar su estado
            const currentUser = get().user;
            if (currentUser) {
              set((state) => {
                if (state.user) {
                  state.user.isVerified = true;
                }
              });
            }

            set((state) => {
              state.isLoading = false;
            });

            toast.success('¡Email verificado exitosamente!');
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al verificar el email';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Reenviar verificación
      resendVerification: async (email: string): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.resendVerification(email);
          
          if (response.success) {
            set((state) => {
              state.isLoading = false;
            });

            toast.success('Email de verificación enviado. Revisa tu bandeja de entrada.');
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el email';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Reset password
      resetPassword: async (data: ResetPasswordData): Promise<boolean> => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.resetPassword(data);
          
          if (response.success) {
            set((state) => {
              state.isLoading = false;
            });

            toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.');
            return true;
          }
          
          throw new Error(response.message);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Error al enviar email de recuperación';
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
          });

          toast.error(errorMessage);
          return false;
        }
      },

      // Actualizar usuario
      updateUser: (userData: Partial<User>) => {
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...userData };
            // Actualizar también en localStorage
            authService.saveTokens(
              state.accessToken!, 
              state.refreshToken!, 
              state.user
            );
          }
        });
      },

      // Refrescar datos del usuario
      refreshUserData: async (): Promise<void> => {
        // Esta función se implementará cuando tengamos el endpoint del backend
        // Por ahora solo es un placeholder
        console.log('Refreshing user data...');
      },

      // Utilidades
      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// Selectores para optimizar re-renders
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);