// import { useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { AuthService } from '@/services/authService';
// import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// // Tipos
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

// export const useAuth = () => {
//   const navigate = useNavigate();
//   const auth = useAuthContext();

//   // ✅ LOGIN
//   const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
//     try {
//       const result = await AuthService.login(credentials);

//       if (result.success) {
//         // Guardar en localStorage
//         localStorage.setItem('accessToken', result.data.accessToken);
//         localStorage.setItem('refreshToken', result.data.refreshToken);
//         localStorage.setItem('user', JSON.stringify(result.data.user));

//         // Actualizar contexto
//         auth.setUser(result.data.user);
//         auth.setAuthenticated(true);

//         console.log('✅ Login successful in useAuth');
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error('❌ Login error in useAuth:', error);
//       throw error;
//     }
//   }, [auth]);

//   // ✅ REGISTER
//   const register = useCallback(async (data: RegisterData): Promise<boolean> => {
//     try {
//       const result = await AuthService.register(data);

//       if (result.success) {
//         console.log('✅ Registration successful in useAuth');
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error('❌ Registration error in useAuth:', error);
//       throw error;
//     }
//   }, []);

//   // ✅ LOGOUT
//   const logout = useCallback(async () => {
//     try {
//       // Intentar logout en el servidor
//       try {
//         await AuthService.logout();
//       } catch (error) {
//         console.error('⚠️ Server logout failed:', error);
//         // Continuar con logout local aunque falle el servidor
//       }

//       // Limpiar estado local
//       auth.clearAuth();

//       console.log('✅ Logout successful');
      
//       // Redirigir al login
//       navigate('/login', { replace: true });

//     } catch (error) {
//       console.error('❌ Logout error:', error);
//     }
//   }, [auth, navigate]);

//   // ✅ VERIFY EMAIL
//   const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
//     try {
//       const result = await AuthService.verifyEmail(token);
      
//       if (result.success) {
//         // Actualizar usuario si está logueado
//         if (auth.user) {
//           const updatedUser = { ...auth.user, isEmailVerified: true };
//           auth.setUser(updatedUser);
//           localStorage.setItem('user', JSON.stringify(updatedUser));
//         }
        
//         toast.success('Email verificado exitosamente');
//         return true;
//       }
      
//       return false;
//     } catch (error: any) {
//       console.error('❌ Email verification error:', error);
//       toast.error(error.message || 'Error al verificar email');
//       return false;
//     }
//   }, [auth]);

//   // ✅ RESEND VERIFICATION
//   const resendVerification = useCallback(async (email: string): Promise<boolean> => {
//     try {
//       const result = await AuthService.resendVerification(email);
      
//       if (result.success) {
//         toast.success('Nuevo enlace de verificación enviado');
//         return true;
//       }
      
//       return false;
//     } catch (error: any) {
//       console.error('❌ Resend verification error:', error);
//       toast.error(error.message || 'Error al reenviar verificación');
//       return false;
//     }
//   }, []);

//   // ✅ LOGIN WITH GOOGLE (Future implementation)
//   const loginWithGoogle = useCallback(async (credential: string) => {
//     try {
//       // TODO: Implementar OAuth con Google
//       toast.error('Login con Google no implementado aún');
//       return { success: false, message: 'No implementado' };
//     } catch (error: any) {
//       console.error('❌ Google login error:', error);
//       return { success: false, message: error.message };
//     }
//   }, []);

//   // ✅ LOGIN WITH FACEBOOK (Future implementation)
//   const loginWithFacebook = useCallback(async (accessToken: string) => {
//     try {
//       // TODO: Implementar OAuth con Facebook
//       toast.error('Login con Facebook no implementado aún');
//       return { success: false, message: 'No implementado' };
//     } catch (error: any) {
//       console.error('❌ Facebook login error:', error);
//       return { success: false, message: error.message };
//     }
//   }, []);

//   // ✅ RETURN - Combina contexto + hook
//   return {
//     // Estado del contexto
//     user: auth.user,
//     isAuthenticated: auth.isAuthenticated,
//     isLoading: auth.isLoading,
    
//     // Acciones del hook
//     login,
//     register,
//     logout,
    
//     // Email verification
//     verifyEmail,
//     resendVerification,
    
//     // OAuth (future)
//     loginWithGoogle,
//     loginWithFacebook,
    
//     // Helpers del contexto
//     hasRole: auth.hasRole,
//     isAdmin: auth.isAdmin,
//     isEmailVerified: auth.isEmailVerified,
//     getDisplayName: auth.getDisplayName,
//   };
// };




// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthService, LoginCredentials, RegisterData } from '@/services/authService';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();

  // ===== LOGIN =====
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      auth.setLoading(true);
      
      console.log('🚀 useAuth.login called with:', { email: credentials.email });
      
      const result = await AuthService.login(credentials);

      if (result.success && result.data) {
        // Actualizar contexto
        auth.setUser(result.data.user);
        auth.setAuthenticated(true);

        // Mostrar mensaje de éxito
        toast.success(result.message || `¡Bienvenido, ${result.data.user.firstName}!`);

        console.log('✅ Login successful, redirecting to dashboard');
        
        // Redirigir al dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Login error in useAuth:', error);
      
      // Mostrar error específico del backend
      toast.error(error.message || 'Error al iniciar sesión');
      
      // Re-lanzar el error para que el componente pueda manejarlo si es necesario
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, [auth, navigate]);

  // ===== REGISTER =====
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      auth.setLoading(true);
      
      console.log('🚀 useAuth.register called');
      
      const result = await AuthService.register(data);

      if (result.success) {
        // Mostrar mensaje de éxito
        toast.success(result.message || 'Registro exitoso. Verifica tu email para continuar.');

        console.log('✅ Register successful, redirecting to login');
        
        // Redirigir al login con mensaje
        navigate('/login?message=verify-email', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Register error in useAuth:', error);
      
      // Mostrar error específico del backend
      toast.error(error.message || 'Error en el registro');
      
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, [auth, navigate]);

  // ===== LOGOUT =====
  const logout = useCallback(async (): Promise<void> => {
    try {
      await auth.logout();
      
      toast.success('Sesión cerrada exitosamente');
      
      console.log('✅ Logout successful, redirecting to home');
      
      // Redirigir al home
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  }, [auth, navigate]);

  // ===== VERIFY EMAIL =====
  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    try {
      auth.setLoading(true);
      
      const result = await AuthService.verifyEmail(token);
      
      if (result.success) {
        toast.success(result.message || 'Email verificado exitosamente');
        
        // Si el usuario está logueado, actualizar su estado
        if (auth.user) {
          auth.setUser({ ...auth.user, isEmailVerified: true });
        }
        
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Email verification error:', error);
      toast.error(error.message || 'Error al verificar email');
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, [auth, navigate]);

  // ===== RESEND VERIFICATION =====
  const resendVerification = useCallback(async (email: string): Promise<void> => {
    try {
      const result = await AuthService.resendVerification(email);
      
      if (result.success) {
        toast.success(result.message || 'Email de verificación reenviado');
      }
    } catch (error: any) {
      console.error('❌ Resend verification error:', error);
      toast.error(error.message || 'Error al reenviar verificación');
      throw error;
    }
  }, []);

  // ===== FORGOT PASSWORD =====
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      const result = await AuthService.forgotPassword(email);
      
      if (result.success) {
        toast.success(result.message || 'Revisa tu email para las instrucciones');
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      toast.error(error.message || 'Error al solicitar reset de contraseña');
      throw error;
    }
  }, [navigate]);

  // ===== RESET PASSWORD =====
  const resetPassword = useCallback(async (token: string, password: string): Promise<void> => {
    try {
      const result = await AuthService.resetPassword(token, password);
      
      if (result.success) {
        toast.success(result.message || 'Contraseña actualizada exitosamente');
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      console.error('❌ Reset password error:', error);
      toast.error(error.message || 'Error al resetear contraseña');
      throw error;
    }
  }, [navigate]);

  // ===== UPDATE PROFILE =====
  const updateProfile = useCallback(async (data: any): Promise<void> => {
    try {
      auth.setLoading(true);
      
      const result = await AuthService.updateProfile(data);
      
      if (result.success) {
        auth.setUser(result.user);
        toast.success('Perfil actualizado exitosamente');
      }
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      toast.error(error.message || 'Error al actualizar perfil');
      throw error;
    } finally {
      auth.setLoading(false);
    }
  }, [auth]);

  // ===== RETURN OBJECT =====
  return {
    // Estado del contexto
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    
    // Acciones principales
    login,
    register,
    logout,
    
    // Verificación y recuperación
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    
    // Helpers del contexto
    hasRole: auth.hasRole,
    isAdmin: auth.isAdmin,
    isEmailVerified: auth.isEmailVerified,
    getDisplayName: auth.getDisplayName,
    getUserInitials: auth.getUserInitials,
  };
};