// import { User } from './index';

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   phone?: string;
//   referralCode?: string;
// }

// export interface ResetPasswordData {
//   email: string;
// }

// export interface ChangePasswordData {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export interface AuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//   };
// }

// export interface AuthState {
//   isAuthenticated: boolean;
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isLoading: boolean;
// }

// export interface OAuthResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: User;
//     accessToken: string;
//     refreshToken: string;
//     isNewUser: boolean;
//   };
// }

// export interface VerifyEmailResponse {
//   success: boolean;
//   message: string;
//   data: {
//     isVerified: boolean;
//   };
// }



// src/types/auth.types.ts (Frontend)
import { User } from './index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  // Datos básicos
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  userType: 'person' | 'company';
  
  // Campos de términos y condiciones
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
  
  // Datos de identificación personal
  identificationNumber?: string;
  identificationType?: 'cedula' | 'passport' | 'license';
  dateOfBirth?: string;
  
  // Datos de empresa
  companyName?: string;
  legalName?: string;
  taxId?: string;
  companyDocument?: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Representante legal
  legalRepFirstName?: string;
  legalRepLastName?: string;
  legalRepPosition?: string;
  legalRepPhone?: string;
  legalRepEmail?: string;
  legalRepId?: string;
  
  // Dirección comercial
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessZipCode?: string;
  businessCountry?: string;
  
  // Referidos
  referralCode?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface OAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    isVerified: boolean;
  };
}

// Formulario de login
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Esquemas de validación para formularios
export interface RegisterPersonFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  identificationNumber?: string;
  identificationType?: 'cedula' | 'passport' | 'license';
  dateOfBirth?: string;
  referralCode?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface RegisterCompanyFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  
  // Datos de empresa
  companyName: string;
  legalName?: string;
  taxId: string;
  industry?: string;
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Representante legal
  legalRepFirstName?: string;
  legalRepLastName?: string;
  legalRepPosition?: string;
  legalRepPhone?: string;
  legalRepEmail?: string;
  legalRepId?: string;
  
  // Dirección comercial
  businessStreet?: string;
  businessCity?: string;
  businessState?: string;
  businessZipCode?: string;
  businessCountry?: string;
  
  referralCode?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

// Estados del proceso de registro
export type RegistrationStep = 'type' | 'form' | 'verification';

export interface RegistrationState {
  currentStep: RegistrationStep;
  selectedType: 'person' | 'company' | null;
  formData: Partial<RegisterData>;
  isLoading: boolean;
  error: string | null;
}

// Contexto de autenticación
export interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
  
  // Helpers
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isEmailVerified: () => boolean;
}

// Eventos de autenticación
export interface AuthEvents {
  onLogin?: (user: User) => void;
  onLogout?: () => void;
  onRegister?: (user: User) => void;
  onEmailVerified?: (user: User) => void;
  onError?: (error: string) => void;
}

// Configuración de autenticación
export interface AuthConfig {
  enableOAuth?: boolean;
  enableRegistration?: boolean;
  requireEmailVerification?: boolean;
  autoRefreshTokens?: boolean;
  redirectAfterLogin?: string;
  redirectAfterLogout?: string;
  sessionTimeout?: number; // en minutos
}

// Errores de autenticación
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: any;
}

// OAuth providers
export type OAuthProvider = 'google' | 'facebook';

export interface OAuthConfig {
  google?: {
    clientId: string;
    enabled: boolean;
  };
  facebook?: {
    appId: string;
    enabled: boolean;
  };
}

// Tokens
export interface TokenInfo {
  token: string;
  expiresAt: Date;
  isExpired: boolean;
}

export interface TokenPair {
  accessToken: TokenInfo;
  refreshToken: TokenInfo;
}

// Sesión del usuario
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo?: {
    userAgent: string;
    ip: string;
    location?: string;
  };
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

// Historial de autenticación
export interface AuthHistory {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'register' | 'password_reset' | 'email_verified';
  timestamp: Date;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: any;
}

// Políticas de contraseña
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  prohibitCommonPasswords: boolean;
  maxAge?: number; // días
}

// Configuración de seguridad
export interface SecurityConfig {
  passwordPolicy: PasswordPolicy;
  maxLoginAttempts: number;
  lockoutDuration: number; // minutos
  requireTwoFactor: boolean;
  sessionTimeout: number; // minutos
  forcePasswordChange: boolean;
}