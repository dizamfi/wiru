
// // src/services/authService.ts (Frontend) - Versión Completa
// import { apiService } from './api';

// // Tipos básicos
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
//   [key: string]: any; // Para campos adicionales
// }

// interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//     isNewUser?: boolean;
//   };
// }

// interface OAuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//     isNewUser: boolean;
//   };
// }

// export class AuthService {
//   /**
//    * Iniciar sesión
//    */
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     try {
//       console.log('🚀 Intentando login con:', { email: credentials.email });
      
//       const response = await apiService.post('/auth/login', credentials);
      
//       console.log('✅ Login exitoso:', {
//         status: response.status,
//         data: response.data
//       });
      
//       if (response.status === 200) {
//         return {
//           success: true,
//           message: response.data.message || 'Inicio de sesión exitoso',
//           data: response.data.data
//         };
//       }
      
//       throw new Error(response.data.message || 'Error en el login');
//     } catch (error: any) {
//       console.error('❌ Error en login:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.errors || 
//                           'Error de conexión con el servidor';
      
//       throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Error en el login');
//     }
//   }

//   /**
//    * Registrar nuevo usuario
//    */
//   async register(data: RegisterData): Promise<AuthResponse> {
//     try {
//       // Transformar datos del frontend al formato del backend
//       const backendData = this.transformRegisterData(data);
      
//       console.log('🚀 Enviando datos al backend:', backendData);
      
//       const response = await apiService.post('/auth/register', backendData);
      
//       console.log('✅ Registro exitoso:', {
//         status: response.status,
//         data: response.data
//       });
      
//       if (response.status === 201 || response.status === 200) {
//         return {
//           success: true,
//           message: response.data.message || '¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.',
//           data: {
//             user: response.data.data.user,
//             accessToken: '', // Backend no devuelve tokens en register
//             refreshToken: '',
//           }
//         };
//       }
      
//       throw new Error(response.data.message || 'Error al registrar usuario');
//     } catch (error: any) {
//       console.error('❌ Error en registro:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       // Manejar errores de validación específicos
//       if (error.response?.data?.errors) {
//         const errors = error.response.data.errors;
//         const firstError = Object.values(errors)[0];
//         const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
//         throw new Error(String(errorMessage));
//       }
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al registrar usuario';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Login con Google OAuth
//    */
//   async loginWithGoogle(credential: string): Promise<OAuthResponse> {
//     try {
//       console.log('🚀 Intentando login con Google...');
      
//       const response = await apiService.post('/auth/google', { credential });
      
//       console.log('✅ Login con Google exitoso:', response.data);
      
//       return {
//         success: true,
//         message: response.data.message,
//         data: response.data.data
//       };
//     } catch (error: any) {
//       console.error('❌ Error en login con Google:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al autenticar con Google';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Login con Facebook OAuth
//    */
//   async loginWithFacebook(accessToken: string): Promise<OAuthResponse> {
//     try {
//       console.log('🚀 Intentando login con Facebook...');
      
//       const response = await apiService.post('/auth/facebook', { accessToken });
      
//       console.log('✅ Login con Facebook exitoso:', response.data);
      
//       return {
//         success: true,
//         message: response.data.message,
//         data: response.data.data
//       };
//     } catch (error: any) {
//       console.error('❌ Error en login con Facebook:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al autenticar con Facebook';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Verificar email
//    */
//   async verifyEmail(token: string): Promise<any> {
//     try {
//       console.log('🔍 Verificando email con token...');
      
//       const response = await apiService.post('/auth/verify-email', { token });
      
//       console.log('✅ Email verificado exitosamente');
      
//       return {
//         success: true,
//         message: response.data.message || 'Email verificado exitosamente',
//         data: response.data.data
//       };
//     } catch (error: any) {
//       console.error('❌ Error al verificar email:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al verificar email';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Reenviar verificación de email
//    */
//   async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
//     try {
//       console.log('📧 Reenviando verificación para:', email);
      
//       const response = await apiService.post('/auth/resend-verification', { email });
      
//       console.log('✅ Verificación reenviada');
      
//       return {
//         success: true,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       console.error('❌ Error al reenviar verificación:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al reenviar verificación';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Solicitar restablecimiento de contraseña
//    */
//   async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
//     try {
//       console.log('🔑 Solicitando reset de contraseña para:', email);
      
//       const response = await apiService.post('/auth/forgot-password', { email });
      
//       console.log('✅ Reset de contraseña solicitado');
      
//       return {
//         success: true,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       console.error('❌ Error al solicitar reset:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al solicitar restablecimiento';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Confirmar restablecimiento de contraseña
//    */
//   async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
//     try {
//       console.log('🔑 Confirmando reset de contraseña...');
      
//       const response = await apiService.post('/auth/reset-password', {
//         token,
//         newPassword,
//         confirmPassword: newPassword,
//       });
      
//       console.log('✅ Contraseña restablecida');
      
//       return {
//         success: true,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       console.error('❌ Error al restablecer contraseña:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al restablecer contraseña';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Cambiar contraseña (usuario autenticado)
//    */
//   async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
//     try {
//       console.log('🔑 Cambiando contraseña...');
      
//       const response = await apiService.post('/auth/change-password', {
//         currentPassword,
//         newPassword,
//         confirmPassword: newPassword,
//       });
      
//       console.log('✅ Contraseña cambiada');
      
//       // Limpiar tokens ya que el backend los invalida
//       this.clearTokens();
      
//       return {
//         success: true,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       console.error('❌ Error al cambiar contraseña:', error.response?.data || error.message);
      
//       const errorMessage = error.response?.data?.message || 
//                           'Error al cambiar contraseña';
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Obtener cuentas OAuth vinculadas
//    */
//   async getOAuthAccounts(): Promise<{ google: boolean; facebook: boolean }> {
//     try {
//       const response = await apiService.get('/auth/oauth-accounts');
//       return response.data.data;
//     } catch (error: any) {
//       console.error('❌ Error al obtener cuentas OAuth:', error);
//       throw new Error('Error al obtener cuentas OAuth');
//     }
//   }

//   /**
//    * Desvincular cuenta OAuth
//    */
//   async unlinkOAuthAccount(provider: 'google' | 'facebook'): Promise<{ success: boolean; message: string }> {
//     try {
//       const response = await apiService.delete(`/auth/oauth/${provider}`);
      
//       return {
//         success: true,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 
//                           `Error al desvincular cuenta de ${provider}`;
      
//       throw new Error(errorMessage);
//     }
//   }

//   /**
//    * Renovar access token usando refresh token
//    */
//   async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
      
//       if (!refreshToken) {
//         throw new Error('No refresh token disponible');
//       }
      
//       console.log('🔄 Renovando tokens...');
      
//       const response = await apiService.post('/auth/refresh', { refreshToken });
      
//       const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
      
//       // Actualizar tokens en localStorage
//       localStorage.setItem('accessToken', newAccessToken);
//       localStorage.setItem('refreshToken', newRefreshToken);
      
//       console.log('✅ Tokens renovados');
      
//       return {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//       };
//     } catch (error: any) {
//       console.error('❌ Error al renovar tokens:', error.response?.data || error.message);
      
//       // Si falla el refresh, limpiar tokens
//       this.clearTokens();
//       throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
//     }
//   }

//   /**
//    * Cerrar sesión
//    */
//   async logout(): Promise<void> {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
      
//       if (refreshToken) {
//         console.log('🚪 Cerrando sesión...');
//         await apiService.post('/auth/logout', { refreshToken });
//       }
      
//       this.clearTokens();
//       console.log('✅ Sesión cerrada');
//     } catch (error: any) {
//       console.error('❌ Error al cerrar sesión:', error);
      
//       // Limpiar tokens localmente aunque falle el logout en servidor
//       this.clearTokens();
//     }
//   }

//   /**
//    * Transformar datos del frontend al formato del backend
//    */
//   private transformRegisterData(frontendData: RegisterData) {
//     console.log('🔄 Transformando datos del frontend:', frontendData);
    
//     const {
//       userType,
//       confirmPassword,
//       acceptTerms,
//       acceptPrivacy,
//       identificationNumber,
//       identificationType,
//       dateOfBirth,
//       legalName,
//       taxId,
//       industry,
//       companySize,
//       legalRepFirstName,
//       legalRepLastName,
//       legalRepPosition,
//       legalRepPhone,
//       legalRepEmail,
//       legalRepId,
//       businessStreet,
//       businessCity,
//       businessState,
//       businessZipCode,
//       businessCountry,
//       ...basicData
//     } = frontendData;

//     const transformedData = {
//       ...basicData,
//       type: userType === 'person' ? 'PERSON' : 'COMPANY',
//       userType: userType,
      
//       // Campos adicionales
//       identificationNumber,
//       identificationType,
//       dateOfBirth,
//       legalName,
//       taxId,
//       industry,
//       companySize,
//       legalRepFirstName,
//       legalRepLastName,
//       legalRepPosition,
//       legalRepPhone,
//       legalRepEmail,
//       legalRepId,
//       businessStreet,
//       businessCity,
//       businessState,
//       businessZipCode,
//       businessCountry,
//     };

//     console.log('🔄 Datos transformados:', transformedData);
//     return transformedData;
//   }

//   /**
//    * Obtener usuario actual almacenado
//    */
//   getCurrentUser(): User | null {
//     try {
//       const userStr = localStorage.getItem('user');
//       return userStr ? JSON.parse(userStr) : null;
//     } catch (error) {
//       console.error('Error al obtener usuario actual:', error);
//       return null;
//     }
//   }

//   /**
//    * Obtener access token
//    */
//   getAccessToken(): string | null {
//     return localStorage.getItem('accessToken');
//   }

//   /**
//    * Obtener refresh token
//    */
//   getRefreshToken(): string | null {
//     return localStorage.getItem('refreshToken');
//   }

//   /**
//    * Verificar si el usuario está autenticado
//    */
//   isAuthenticated(): boolean {
//     const token = this.getAccessToken();
//     const user = this.getCurrentUser();
    
//     return !!(token && user);
//   }

//   /**
//    * Verificar si el usuario tiene un rol específico
//    */
//   hasRole(role: string): boolean {
//     const user = this.getCurrentUser();
//     return user?.role === role;
//   }

//   /**
//    * Verificar si el usuario es admin
//    */
//   isAdmin(): boolean {
//     return this.hasRole('ADMIN');
//   }

//   /**
//    * Verificar si el email está verificado
//    */
//   isEmailVerified(): boolean {
//     const user = this.getCurrentUser();
//     return user?.isEmailVerified === true;
//   }

//   /**
//    * Almacenar datos de autenticación
//    */
//   setAuthData(user: User, accessToken: string, refreshToken: string): void {
//     localStorage.setItem('user', JSON.stringify(user));
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//     console.log('💾 Datos de autenticación almacenados');
//   }

//   /**
//    * Limpiar tokens y datos del usuario
//    */
//   clearTokens(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     console.log('🧹 Tokens y datos de usuario limpiados');
//   }
// }

// export const authService = new AuthService();





import { apiService } from './api';

// Tipos básicos
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
  [key: string]: any; // Para campos adicionales
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser?: boolean;
  };
}

interface OAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  };
}

export class AuthService {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🚀 Intentando login con:', { email: credentials.email });
      
      const response = await apiService.post('/auth/login', credentials);
      
      console.log('✅ Login exitoso:', {
        status: response.status,
        data: response.data
      });
      
      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || 'Inicio de sesión exitoso',
          data: response.data.data
        };
      }
      
      throw new Error(response.data.message || 'Error en el login');
    } catch (error: any) {
      console.error('❌ Error en login:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors || 
                          'Error de conexión con el servidor';
      
      throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Error en el login');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Transformar datos del frontend al formato del backend
      const backendData = this.transformRegisterData(data);
      
      console.log('🚀 Enviando datos al backend:', backendData);
      
      const response = await apiService.post('/auth/register', backendData);
      
      console.log('✅ Registro exitoso:', {
        status: response.status,
        data: response.data
      });
      
      if (response.status === 201 || response.status === 200) {
        return {
          success: true,
          message: response.data.message || '¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.',
          data: response.data.data || response.data
        };
      }
      
      throw new Error(response.data.message || 'Error al registrar usuario');
    } catch (error: any) {
      console.error('❌ Error en registro:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Manejar errores de validación específicos
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        throw new Error(String(errorMessage));
      }
      
      // Manejar mensaje de error del backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Error genérico
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  /**
   * Transformar datos del frontend al formato del backend
   * ✨ NUEVA VERSIÓN: Solo incluye campos que el usuario realmente llenó
   */
  private transformRegisterData(frontendData: any) {
    console.log('🔄 Transformando datos del frontend:', frontendData);
    
    const {
      userType,           // Frontend usa userType
      confirmPassword,    // No enviar al backend
      acceptTerms,        // No enviar al backend  
      acceptPrivacy,      // No enviar al backend
      identificationNumber,
      identificationType,
      dateOfBirth,
      legalName,
      taxId,
      industry,
      companySize,
      legalRepFirstName,
      legalRepLastName,
      legalRepPosition,
      legalRepPhone,
      legalRepEmail,
      legalRepId,
      businessStreet,
      businessCity,
      businessState,
      businessZipCode,
      businessCountry,
      ...basicData
    } = frontendData;

    // Función helper para verificar si un valor está presente y no está vacío
    const hasValue = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return !isNaN(value) && value !== 0;
      if (typeof value === 'boolean') return true;
      return false;
    };

    // Datos base que siempre se envían (campos requeridos)
    const transformedData: any = {
      email: basicData.email,
      password: basicData.password,
      firstName: basicData.firstName,
      lastName: basicData.lastName,
      type: userType === 'person' ? 'PERSON' : 'COMPANY',
    };

    // Agregar campos opcionales solo si tienen valor
    if (hasValue(basicData.phone)) {
      transformedData.phone = basicData.phone;
    }

    if (hasValue(basicData.referralCode)) {
      transformedData.referralCode = basicData.referralCode;
    }

    // Campos específicos para empresas
    if (userType === 'company') {
      // Priorizar companyName o usar legalName como fallback
      if (hasValue(basicData.companyName)) {
        transformedData.companyName = basicData.companyName;
      } else if (hasValue(legalName)) {
        transformedData.companyName = legalName;
      }

      // Priorizar taxId o usar companyDocument como fallback
      if (hasValue(taxId)) {
        transformedData.companyDocument = taxId;
      } else if (hasValue(basicData.companyDocument)) {
        transformedData.companyDocument = basicData.companyDocument;
      }
    }

    // Campos adicionales opcionales (solo si están presentes)
    const optionalFields = {
      identificationNumber,
      identificationType,
      dateOfBirth,
      industry,
      companySize,
      legalRepFirstName,
      legalRepLastName,
      legalRepPosition,
      legalRepPhone,
      legalRepEmail,
      legalRepId,
      businessStreet,
      businessCity,
      businessState,
      businessZipCode,
      businessCountry,
    };

    // Solo agregar campos opcionales si tienen valor
    Object.entries(optionalFields).forEach(([key, value]) => {
      if (hasValue(value)) {
        transformedData[key] = value;
      }
    });

    console.log('✅ Datos transformados para backend (solo campos con valor):', transformedData);
    console.log('📊 Campos enviados:', Object.keys(transformedData).length);
    console.log('📋 Campos omitidos (vacíos):', 
      Object.keys(optionalFields).filter(key => !hasValue(optionalFields[key as keyof typeof optionalFields]))
    );

    return transformedData;
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await apiService.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Verificar email con token
   */
  async verifyEmail(token: string): Promise<any> {
    try {
      const response = await apiService.post('/auth/verify-email', { token });
      
      return {
        success: true,
        message: response.data.message || 'Email verificado exitosamente',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error en verificación de email:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Error al verificar email';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Reenviar email de verificación
   */
  async resendVerification(email: string): Promise<any> {
    try {
      const response = await apiService.post('/auth/resend-verification', { email });
      
      return {
        success: true,
        message: response.data.message || 'Email de verificación enviado',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error al reenviar verificación:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Error al reenviar email de verificación';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Solicitar reset de contraseña
   */
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      
      return {
        success: true,
        message: response.data.message || 'Email de reset enviado',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error en forgot password:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Error al solicitar reset de contraseña';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Login con Google OAuth
   */
  async loginWithGoogle(tokenData: any): Promise<OAuthResponse> {
    try {
      const response = await apiService.post('/auth/google', tokenData);
      
      console.log('✅ Google login exitoso:', response.data);
      
      return {
        success: true,
        message: response.data.message || 'Login con Google exitoso',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error en Google login:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Error al iniciar sesión con Google';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Login con Facebook OAuth
   */
  async loginWithFacebook(accessToken: string): Promise<OAuthResponse> {
    try {
      const response = await apiService.post('/auth/facebook', { accessToken });
      
      console.log('✅ Facebook login exitoso:', response.data);
      
      return {
        success: true,
        message: response.data.message || 'Login con Facebook exitoso',
        data: response.data.data
      };
    } catch (error: any) {
      console.error('❌ Error en Facebook login:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          'Error al iniciar sesión con Facebook';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  /**
   * Obtener access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    
    return !!(token && user);
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Verificar si el email está verificado
   */
  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.isEmailVerified === true;
  }

  /**
   * Almacenar datos de autenticación
   */
  setAuthData(user: User, accessToken: string, refreshToken: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('💾 Datos de autenticación almacenados');
  }

  /**
   * Limpiar tokens y datos del usuario
   */
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    console.log('🧹 Tokens y datos de usuario limpiados');
  }
}

export const authService = new AuthService();