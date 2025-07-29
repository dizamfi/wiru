// import { apiService } from './api';
// import { 
//   LoginCredentials, 
//   RegisterData, 
//   ResetPasswordData, 
//   AuthResponse,
//   OAuthResponse,
//   VerifyEmailResponse 
// } from '@/types/auth.types';
// import { User } from '@/types';

// export class AuthService {
//   async login(credentials: LoginCredentials): Promise<AuthResponse> {
//     const response = await apiService.post('/auth/login', credentials);
//     return response.data;
//   }

//   async register(data: RegisterData): Promise<AuthResponse> {
//     const response = await apiService.post('/auth/register', data);
//     return response.data;
//   }

//   async logout(): Promise<void> {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (refreshToken) {
//       await apiService.post('/auth/logout', { refreshToken });
//     }
//     this.clearTokens();
//   }

//   async resetPassword(data: ResetPasswordData) {
//     const response = await apiService.post('/auth/reset-password', data);
//     return response.data;
//   }

//   async verifyEmail(token: string): Promise<VerifyEmailResponse> {
//     const response = await apiService.post('/auth/verify-email', { token });
//     return response.data;
//   }

//   async resendVerification(email: string) {
//     const response = await apiService.post('/auth/resend-verification', { email });
//     return response.data;
//   }

//   // OAuth methods
//   async loginWithGoogle(credential: string): Promise<OAuthResponse> {
//     const response = await apiService.post('/auth/google', { credential });
//     return response.data;
//   }

//   async loginWithFacebook(accessToken: string): Promise<OAuthResponse> {
//     const response = await apiService.post('/auth/facebook', { accessToken });
//     return response.data;
//   }

//   // Token management
//   saveTokens(accessToken: string, refreshToken: string, user: User): void {
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   clearTokens(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//   }

//   getStoredUser(): User | null {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   }

//   getAccessToken(): string | null {
//     return localStorage.getItem('accessToken');
//   }

//   getRefreshToken(): string | null {
//     return localStorage.getItem('refreshToken');
//   }

//   isAuthenticated(): boolean {
//     return !!this.getAccessToken();
//   }
// }

// export const authService = new AuthService();












// src/services/authService.ts
import { apiService } from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  ResetPasswordData, 
  AuthResponse,
  OAuthResponse,
  VerifyEmailResponse 
} from '@/types/auth.types';
import { User } from '@/types';
import { env } from '@/utils/env';

// Mock responses para testing
const createMockUser = (email: string, isOAuth = false): User => ({
  id: 'mock-user-id',
  email,
  firstName: isOAuth ? email.split('@')[0] : 'Usuario',
  lastName: 'Prueba',
  phone: '+57 300 123 4567',
  isVerified: true,
  role: (role: any) => role === 'USER',
  avatar: isOAuth ? `https://ui-avatars.com/api/?name=${email}&background=3b82f6&color=fff` : undefined,
  referralCode: 'ABC123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createMockAuthResponse = (user: User): AuthResponse => ({
  success: true,
  message: 'Login exitoso',
  data: {
    user,
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
  }
});

export class AuthService {
  private isBackendAvailable = async (): Promise<boolean> => {
    try {
      // Intentar hacer ping al backend
      await fetch(`${env.API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      return true;
    } catch {
      return false;
    }
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      // Mock response para testing
      console.log('🔄 Usando mock de backend para login');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular validación básica
      if (credentials.email === 'admin@test.com' && credentials.password === 'password') {
        const user = createMockUser(credentials.email);
        return createMockAuthResponse(user);
      } else {
        throw new Error('Credenciales incorrectas. Usa: admin@test.com / password');
      }
    }

    // Usar API real si está disponible
    const response = await apiService.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para registro');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user = createMockUser(data.email);
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.phone = data.phone;
      user.isVerified = false; // Requiere verificación
      
      return createMockAuthResponse(user);
    }

    const response = await apiService.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para logout');
      await new Promise(resolve => setTimeout(resolve, 500));
      this.clearTokens();
      return;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiService.post('/auth/logout', { refreshToken });
    }
    this.clearTokens();
  }

  async resetPassword(data: ResetPasswordData) {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para reset password');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Email de recuperación enviado a ${data.email}`,
        data: null
      };
    }

    const response = await apiService.post('/auth/reset-password', data);
    return response.data;
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para verify email');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular tokens válidos e inválidos
      if (token === 'valid-token' || token.length > 10) {
        return {
          success: true,
          message: 'Email verificado correctamente',
          data: { isVerified: true }
        };
      } else {
        throw new Error('Token de verificación inválido o expirado');
      }
    }

    const response = await apiService.post('/auth/verify-email', { token });
    return response.data;
  }

  async resendVerification(email: string) {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para resend verification');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: `Email de verificación reenviado a ${email}`,
        data: null
      };
    }

    const response = await apiService.post('/auth/resend-verification', { email });
    return response.data;
  }

  // OAuth methods con mock
  async loginWithGoogle(credential: string): Promise<OAuthResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para Google OAuth');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Decodificar JWT básico para obtener email (solo para demo)
      let email = 'usuario.google@test.com';
      try {
        const payload = JSON.parse(atob(credential.split('.')[1]));
        email = payload.email || email;
      } catch {
        // Si no se puede decodificar, usar email por defecto
      }
      
      const user = createMockUser(email, true);
      
      return {
        success: true,
        message: 'Login con Google exitoso',
        data: {
          user,
          accessToken: 'mock-google-access-token-' + Date.now(),
          refreshToken: 'mock-google-refresh-token-' + Date.now(),
          isNewUser: Math.random() > 0.5, // 50% probabilidad de ser nuevo usuario
        }
      };
    }

    const response = await apiService.post('/auth/google', { credential });
    return response.data;
  }

  async loginWithFacebook(accessToken: string): Promise<OAuthResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log('🔄 Usando mock de backend para Facebook OAuth');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const user = createMockUser('usuario.facebook@test.com', true);
      
      return {
        success: true,
        message: 'Login con Facebook exitoso',
        data: {
          user,
          accessToken: 'mock-facebook-access-token-' + Date.now(),
          refreshToken: 'mock-facebook-refresh-token-' + Date.now(),
          isNewUser: false,
        }
      };
    }

    const response = await apiService.post('/auth/facebook', { accessToken });
    return response.data;
  }

  // Token management methods (sin cambios)
  saveTokens(accessToken: string, refreshToken: string, user: User): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();