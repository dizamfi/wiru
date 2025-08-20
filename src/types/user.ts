// src/types/user.ts - Actualizado con tipos de perfil

export type UserType = 'person' | 'company';

export type UserStatus = 
  | 'pending'     // Pendiente de verificación
  | 'active'      // Activo
  | 'suspended'   // Suspendido
  | 'banned';     // Baneado

export interface BaseUser {
  id: string;
  email: string;
  emailVerified: boolean;
  userType: UserType;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface PersonProfile extends BaseUser {
  userType: 'person';
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  identificationNumber: string;
  identificationType: 'cedula' | 'passport' | 'license';
  
  // Dirección personal
  address?: {
    street: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Configuraciones específicas para personas
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      showProfile: boolean;
      shareReferralStats: boolean;
    };
  };
  
  // Datos de billetera virtual (solo personas)
  wallet: {
    balance: number;
    currency: string;
    isActive: boolean;
    withdrawalLimit: number;
    totalEarnings: number;
    totalWithdrawals: number;
  };
  
  // Sistema de puntos y recompensas (solo personas)
  rewards: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    nextTierPoints: number;
  };
  
  // Sistema de referidos (solo personas)
  referrals: {
    code: string;
    totalReferrals: number;
    activeReferrals: number;
    totalEarningsFromReferrals: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  };
}

export interface CompanyProfile extends BaseUser {
  userType: 'company';
  companyName: string;
  legalName: string;
  taxId: string; // RUC o número de identificación fiscal
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Representante legal
  legalRepresentative: {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
    identificationNumber: string;
  };
  
  // Dirección comercial
  businessAddress: {
    street: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Información de facturación
  billingInfo: {
    legalName: string;
    taxId: string;
    address: string;
    email: string;
    phone: string;
  };
  
  // Configuraciones específicas para empresas
  businessSettings: {
    preferredPickupDays: string[];
    minimumWeight: number;
    specialRequirements?: string;
    contractType: 'standard' | 'custom' | 'volume';
    paymentTerms: 'immediate' | 'net15' | 'net30';
  };
  
  // No tienen billetera virtual - pagos directos
  // No tienen sistema de puntos/recompensas
  // No tienen sistema de referidos
}

export type User = PersonProfile | CompanyProfile;

// Type guards
export const isPersonProfile = (user: User): user is PersonProfile => {
  return user.userType === 'person';
};

export const isCompanyProfile = (user: User): user is CompanyProfile => {
  return user.userType === 'company';
};

// Interfaces para la gestión de cuentas bancarias (solo personas)
export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  bankCode: string;
  accountType: 'savings' | 'checking';
  accountNumber: string;
  accountHolder: string;
  identificationType: 'cedula' | 'passport';
  identificationNumber: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  verifiedAt?: string;
}

// Interfaces para métodos de retiro
export interface WithdrawalMethod {
  id: string;
  type: 'bank_transfer' | 'digital_wallet' | 'cash_pickup';
  name: string;
  details: any; // Específico según el tipo
  isDefault: boolean;
  isActive: boolean;
  fee: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string; // "1-3 business days"
}

// Configuración de notificaciones
export interface NotificationSettings {
  orderUpdates: boolean;
  paymentConfirmations: boolean;
  referralUpdates: boolean;
  promotions: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Estados de verificación
export interface VerificationStatus {
  email: boolean;
  phone: boolean;
  identity: boolean;
  address: boolean;
  bankAccount: boolean;
}