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




// src/stores/authStore.ts - ACTUALIZADO PARA NUEVO AuthService
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthService } from '@/services/authService';
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
  
  // OAuth (preparado para futuro)
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginWithFacebook: (accessToken: string) => Promise<boolean>;
  
  // Verificación y recuperación
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  
  // Utilidades
  initializeAuth: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmailVerified: () => boolean;
  getDisplayName: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ✅ ESTADO INICIAL
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      error: null,

      // ✅ INICIALIZAR AUTENTICACIÓN
      initializeAuth: () => {
        try {
          const token = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
          const userData = localStorage.getItem('user');

          if (token && refreshToken && userData) {
            const user = JSON.parse(userData);
            
            set({
              isAuthenticated: true,
              user,
              accessToken: token,
              refreshToken,
              isLoading: false,
              error: null,
            });

            console.log('✅ Auth initialized from localStorage');
          } else {
            set({
              isAuthenticated: false,
              user: null,
              accessToken: null,
              refreshToken: null,
              isLoading: false,
              error: null,
            });

            console.log('ℹ️ No auth data found');
          }
        } catch (error) {
          console.error('❌ Error initializing auth:', error);
          
          // Limpiar datos corruptos
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          
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

      // ✅ LOGIN
      login: async (credentials: LoginCredentials): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.login(credentials);
          
          if (response.success) {
            const { user, accessToken, refreshToken } = response.data;
            
            // Guardar en localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Actualizar estado
            set({
              isAuthenticated: true,
              user,
              accessToken,
              refreshToken,
              isLoading: false,
              error: null,
            });

            console.log('✅ Login successful in authStore');
            toast.success(response.message || 'Inicio de sesión exitoso');
            return true;
          }
          
          return false;
        } catch (error: any) {
          console.error('❌ Login error in authStore:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          // No mostrar toast aquí, lo hace el componente
          return false;
        }
      },

      // ✅ REGISTRO
      register: async (data: RegisterData): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.register(data);
          
          if (response.success) {
            set({
              isLoading: false,
              error: null,
            });

            console.log('✅ Registration successful in authStore');
            toast.success(response.message || 'Registro exitoso');
            return true;
          }
          
          return false;
        } catch (error: any) {
          console.error('❌ Registration error in authStore:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          return false;
        }
      },

      // ✅ LOGOUT
      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          // Intentar logout en servidor
          await AuthService.logout();
          console.log('✅ Server logout successful');
        } catch (error) {
          console.error('⚠️ Server logout failed:', error);
          // Continuar con logout local aunque falle el servidor
        }

        // Limpiar estado local siempre
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        });

        console.log('✅ Logout successful in authStore');
        toast.success('Sesión cerrada correctamente');
      },

      // ✅ VERIFICAR EMAIL
      verifyEmail: async (token: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.verifyEmail(token);
          
          if (response.success) {
            // Actualizar usuario si está logueado
            const currentUser = get().user;
            if (currentUser) {
              const updatedUser = { ...currentUser, isEmailVerified: true };
              
              set({ user: updatedUser });
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            set({ isLoading: false });
            toast.success('Email verificado exitosamente');
            return true;
          }
          
          return false;
        } catch (error: any) {
          console.error('❌ Email verification error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error(error.message || 'Error al verificar email');
          return false;
        }
      },

      // ✅ REENVIAR VERIFICACIÓN
      resendVerification: async (email: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.resendVerification(email);
          
          if (response.success) {
            set({ isLoading: false });
            toast.success('Nuevo enlace de verificación enviado');
            return true;
          }
          
          return false;
        } catch (error: any) {
          console.error('❌ Resend verification error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error(error.message || 'Error al reenviar verificación');
          return false;
        }
      },

      // ✅ OAUTH - GOOGLE (preparado para futuro)
      loginWithGoogle: async (credential: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implementar cuando esté listo el backend
          toast.error('Login con Google no implementado aún');
          
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          console.error('❌ Google login error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error('Error al iniciar sesión con Google');
          return false;
        }
      },

      // ✅ OAUTH - FACEBOOK (preparado para futuro)
      loginWithFacebook: async (accessToken: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implementar cuando esté listo el backend
          toast.error('Login con Facebook no implementado aún');
          
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          console.error('❌ Facebook login error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error('Error al iniciar sesión con Facebook');
          return false;
        }
      },

      // ✅ FORGOT PASSWORD (preparado para futuro)
      forgotPassword: async (email: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implementar cuando esté listo el backend
          toast.error('Recuperación de contraseña no implementada aún');
          
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          console.error('❌ Forgot password error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error('Error al enviar email de recuperación');
          return false;
        }
      },

      // ✅ RESET PASSWORD (preparado para futuro)
      resetPassword: async (token: string, newPassword: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Implementar cuando esté listo el backend
          toast.error('Reset de contraseña no implementado aún');
          
          set({ isLoading: false });
          return false;
        } catch (error: any) {
          console.error('❌ Reset password error:', error);
          
          set({
            isLoading: false,
            error: error.message,
          });

          toast.error('Error al restablecer contraseña');
          return false;
        }
      },

      // ✅ UTILIDADES
      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          
          set({ user: updatedUser });
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      },

      // ✅ HELPERS
      hasRole: (role: string): boolean => {
        const user = get().user;
        return user?.role === role;
      },

      isAdmin: (): boolean => {
        const user = get().user;
        return user?.role === 'ADMIN';
      },

      isEmailVerified: (): boolean => {
        const user = get().user;
        return user?.isEmailVerified === true;
      },

      getDisplayName: (): string => {
        const user = get().user;
        if (!user) return '';
        
        if (user.type === 'COMPANY' && user.companyName) {
          return user.companyName;
        }
        
        return `${user.firstName} ${user.lastName}`.trim();
      },
    }),
    {
      name: 'wiru-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Se ejecuta después de cargar desde localStorage
        if (state) {
          state.isLoading = false;
          console.log('✅ Auth state rehydrated from localStorage');
        }
      },
    }
  )
);

// ✅ SELECTORES PARA OPTIMIZAR RE-RENDERS
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// ✅ INICIALIZAR AUTH AL IMPORTAR EL STORE
// Esto se ejecuta automáticamente cuando se importa el store
if (typeof window !== 'undefined') {
  // Solo en el browser, no en SSR
  setTimeout(() => {
    useAuthStore.getState().initializeAuth();
  }, 0);
}