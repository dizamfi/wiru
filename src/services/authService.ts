// import { apiService } from './api';

// interface RegisterData {
//   firstName: string;    // ✅ Obligatorio para ambos tipos
//   lastName: string;     // ✅ Obligatorio para ambos tipos
//   email: string;
//   password: string;
//   confirmPassword?: string;
//   phone?: string;
//   userType: 'person' | 'company';
//   acceptTerms: boolean;
//   acceptPrivacy: boolean;
  
//   // Campos de persona natural
//   identificationNumber?: string;
//   identificationType?: string;
//   dateOfBirth?: string;
  
//   // Campos de empresa
//   companyName?: string;
//   legalName?: string;
//   taxId?: string;
//   industry?: string;
//   companySize?: string;
  
//   // Representante legal
//   legalRepFirstName?: string;
//   legalRepLastName?: string;
//   legalRepPosition?: string;
//   legalRepPhone?: string;
//   legalRepEmail?: string;
//   legalRepId?: string;
  
//   // Dirección comercial
//   businessStreet?: string;
//   businessCity?: string;
//   businessState?: string;
//   businessZipCode?: string;
//   businessCountry?: string;
  
//   referralCode?: string;
//   [key: string]: any;
// }

// export class AuthService {
//   private static readonly BASE_URL = '/auth';

//   /**
//    * ✅ REGISTRO CORREGIDO - Envía firstName y lastName para ambos tipos
//    */
//   static async register(frontendData: RegisterData) {
//     console.log('🔄 AuthService.register called with:', frontendData);
    
//     try {
//       // ✅ TRANSFORMAR DATOS - SIEMPRE INCLUIR firstName y lastName
//       const transformedData = this.transformRegisterData(frontendData);
      
//       console.log('📤 Sending to backend:', transformedData);
      
//       const response = await apiService.post(`${this.BASE_URL}/register`, transformedData);
      
//       console.log('✅ Registration successful:', response.data);
      
//       if (response.data.success) {
//         return {
//           success: true,
//           message: response.data.message || 'Registro exitoso. Revisa tu email para verificar tu cuenta.',
//           data: response.data.data || response.data
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
      
//       // Manejar mensaje de error del backend
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
      
//       // Error genérico
//       throw new Error(error.message || 'Error al registrar usuario');
//     }
//   }

//   /**
//    * ✅ TRANSFORMAR DATOS DEL FRONTEND AL FORMATO DEL BACKEND
//    */
//   private static transformRegisterData(frontendData: RegisterData) {
//     console.log('🔄 Transformando datos del frontend:', frontendData);
    
//     const {
//       userType,
//       confirmPassword,    // No enviar al backend
//       acceptTerms,        // No enviar al backend  
//       acceptPrivacy,      // No enviar al backend
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

//     // ✅ DATOS BASE SIEMPRE INCLUIDOS (firstName y lastName ahora obligatorios para ambos)
//     const transformedData: any = {
//       email: basicData.email,
//       password: basicData.password,
//       firstName: basicData.firstName,  // ✅ Siempre incluir
//       lastName: basicData.lastName,    // ✅ Siempre incluir
//       phone: basicData.phone,
//       userType: userType,
//     };

//     // ✅ DATOS ESPECÍFICOS PARA PERSONAS NATURALES
//     if (userType === 'person') {
//       // Datos de identificación personal (opcionales)
//       if (identificationNumber) {
//         transformedData.identificationNumber = identificationNumber;
//         transformedData.identificationType = identificationType;
//         transformedData.dateOfBirth = dateOfBirth;
//       }
//     }

//     // ✅ DATOS ESPECÍFICOS PARA EMPRESAS
//     if (userType === 'company') {
//       transformedData.companyName = basicData.companyName;
//       transformedData.legalName = legalName;
//       transformedData.taxId = taxId;
//       transformedData.industry = industry;
//       transformedData.companySize = companySize;
      
//       // Representante legal (si está presente)
//       if (legalRepFirstName) {
//         transformedData.legalRepFirstName = legalRepFirstName;
//         transformedData.legalRepLastName = legalRepLastName;
//         transformedData.legalRepPosition = legalRepPosition;
//         transformedData.legalRepPhone = legalRepPhone;
//         transformedData.legalRepEmail = legalRepEmail;
//         transformedData.legalRepId = legalRepId;
//       }
      
//       // Dirección comercial (si está presente)
//       if (businessStreet) {
//         transformedData.businessStreet = businessStreet;
//         transformedData.businessCity = businessCity;
//         transformedData.businessState = businessState;
//         transformedData.businessZipCode = businessZipCode;
//         transformedData.businessCountry = businessCountry || 'Ecuador';
//       }
//     }

//     // ✅ CÓDIGO DE REFERIDO (OPCIONAL)
//     if (basicData.referralCode) {
//       transformedData.referralCode = basicData.referralCode;
//     }

//     console.log('✅ Datos transformados:', transformedData);
//     return transformedData;
//   }

//   /**
//    * Login de usuario
//    */
//   static async login(credentials: { email: string; password: string }) {
//     try {
//       console.log('🚀 AuthService.login called with:', { email: credentials.email });
      
//       const response = await apiService.post(`${this.BASE_URL}/login`, credentials);
      
//       console.log('✅ Login successful:', response.data);
      
//       if (response.data.success && response.data.data) {
//         return {
//           success: true,
//           message: response.data.message,
//           data: response.data.data
//         };
//       }
      
//       throw new Error(response.data.message || 'Error al iniciar sesión');
//     } catch (error: any) {
//       console.error('❌ Error en login:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
      
//       throw new Error(error.message || 'Error al iniciar sesión');
//     }
//   }

//   /**
//    * Logout de usuario
//    */
//   static async logout() {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
      
//       if (refreshToken) {
//         await apiService.post(`${this.BASE_URL}/logout`, {
//           refreshToken
//         });
//       }
//     } catch (error) {
//       console.error('Error en logout:', error);
//     } finally {
//       // Limpiar tokens sin importar el resultado
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//     }
//   }

//   /**
//    * Verificar email
//    */
//   static async verifyEmail(token: string) {
//     try {
//       const response = await apiService.post(`${this.BASE_URL}/verify-email`, {
//         token
//       });
      
//       if (response.data.success) {
//         return {
//           success: true,
//           message: response.data.message
//         };
//       }
      
//       throw new Error(response.data.message || 'Error al verificar email');
//     } catch (error: any) {
//       console.error('Error verificando email:', error);
      
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
      
//       throw new Error(error.message || 'Error al verificar email');
//     }
//   }

//   /**
//    * Reenviar verificación de email
//    */
//   static async resendVerification(email: string) {
//     try {
//       const response = await apiService.post(`${this.BASE_URL}/resend-verification`, {
//         email
//       });
      
//       return {
//         success: response.data.success,
//         message: response.data.message
//       };
//     } catch (error: any) {
//       console.error('Error reenviando verificación:', error);
//       throw new Error(error.response?.data?.message || 'Error al reenviar verificación');
//     }
//   }
// }






// src/services/authService.ts
import { apiService } from './api';

// Tipos
export interface User {
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  userType: 'person' | 'company';
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  companyName?: string;
  companyDocument?: string;
  referralCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser?: boolean;
  };
}

export class AuthService {
  private static readonly BASE_URL = '/auth';

  // ===== MÉTODOS DE AUTENTICACIÓN =====

  /**
   * Iniciar sesión
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🚀 AuthService.login called with:', { email: credentials.email });
      
      const response = await apiService.post(`${this.BASE_URL}/login`, credentials);
      
      console.log('✅ Login response:', response);
      
      if (response.success && response.data) {
        // Guardar datos en localStorage
        this.setAuthData(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        return {
          success: true,
          message: response.message || 'Inicio de sesión exitoso',
          data: response.data
        };
      }
      
      throw new Error(response.message || 'Error al iniciar sesión');
    } catch (error: any) {
      console.error('❌ Error en login:', {
        status: error.status,
        message: error.message,
        errors: error.errors
      });
      
      // Lanzar el error con el mensaje del backend
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🚀 AuthService.register called');
      
      // Transformar datos para el backend
      const transformedData = this.transformRegisterData(data);
      
      const response = await apiService.post(`${this.BASE_URL}/register`, transformedData);
      
      console.log('✅ Register response:', response);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Registro exitoso',
          data: response.data
        };
      }
      
      throw new Error(response.message || 'Error en el registro');
    } catch (error: any) {
      console.error('❌ Error en register:', {
        status: error.status,
        message: error.message,
        errors: error.errors
      });
      
      throw new Error(error.message || 'Error en el registro');
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await apiService.post(`${this.BASE_URL}/logout`, {
          refreshToken
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales siempre
      this.clearAuthData();
    }
  }

  /**
 * Verificar email con token
 */
static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  console.log('🔍 AuthService.verifyEmail called with token:', token);
  try {
    console.log('🔍 AuthService.verifyEmail called with token:', token.substring(0, 10) + '...');
    
    const response = await apiService.post(`${this.BASE_URL}/verify-email`, { 
      token 
    });
    
    console.log('✅ Verify email response:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Email verificado exitosamente'
      };
    }
    
    throw new Error(response.message || 'Error al verificar email');
  } catch (error: any) {
    console.error('❌ Error en verifyEmail:', {
      status: error.status,
      message: error.message,
      errors: error.errors
    });
    
    // Lanzar el error con el mensaje del backend
    throw new Error(error.message || 'Error al verificar email');
  }
}

 /**
 * Reenviar email de verificación
 */
static async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('📧 AuthService.resendVerification called for:', email);
    
    const response = await apiService.post(`${this.BASE_URL}/resend-verification`, { 
      email 
    });
    
    console.log('✅ Resend verification response:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.message || 'Email de verificación enviado'
      };
    }
    
    throw new Error(response.message || 'Error al reenviar verificación');
  } catch (error: any) {
    console.error('❌ Error en resendVerification:', {
      status: error.status,
      message: error.message,
      errors: error.errors
    });
    
    throw new Error(error.message || 'Error al reenviar verificación');
  }
}

  /**
   * Solicitar reset de contraseña
   */
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post(`${this.BASE_URL}/forgot-password`, { email });
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al solicitar reset de contraseña');
    }
  }

  /**
   * Reset de contraseña
   */
  static async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post(`${this.BASE_URL}/reset-password`, {
        token,
        password
      });
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al resetear contraseña');
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User }> {
    try {
      const response = await apiService.put('/users/profile', data);
      
      if (response.success) {
        // Actualizar usuario en localStorage
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return {
        success: response.success,
        user: response.data.user
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  }

  // ===== MÉTODOS DE GESTIÓN DE DATOS =====

  /**
   * Guardar datos de autenticación
   */
  static setAuthData(user: User, accessToken: string, refreshToken: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Limpiar datos de autenticación
   */
  static clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Obtener usuario actual
   */
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  /**
   * Obtener access token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Obtener refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // ===== MÉTODOS AUXILIARES =====

  /**
   * Transformar datos de registro para el backend
   */
  private static transformRegisterData(data: RegisterData): any {
    const transformedData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      type: data.userType === 'person' ? 'PERSON' : 'COMPANY',
      acceptTerms: data.acceptTerms,
      acceptPrivacy: data.acceptPrivacy
    };

    // Campos opcionales
    if (data.phone) {
      transformedData.phone = data.phone;
    }

    if (data.userType === 'company') {
      if (data.companyName) {
        transformedData.companyName = data.companyName;
      }
      if (data.companyDocument) {
        transformedData.companyDocument = data.companyDocument;
      }
    }

    if (data.referralCode) {
      transformedData.referralCode = data.referralCode;
    }

    return transformedData;
  }

  /**
   * Obtener headers de autorización
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  static hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  }

  /**
   * Verificar si el usuario es admin
   */
  static isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Verificar si el email está verificado
   */
  static isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.isEmailVerified === true;
  }
}