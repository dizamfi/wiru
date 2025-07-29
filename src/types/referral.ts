// src/types/referral.ts

export interface ReferralUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  registeredAt: string;
  firstSaleAt?: string;
  totalEarnings: number;
  totalOrders: number;
  status: ReferralStatus;
  tier: ReferralTier;
}

export type ReferralStatus = 
  | 'pending'    // Invitado pero no registrado
  | 'registered' // Registrado pero sin venta
  | 'active'     // Con al menos una venta
  | 'inactive'   // Sin actividad por 30+ días
  | 'churned';   // Sin actividad por 90+ días

export type ReferralTier = 
  | 'bronze'   // 1-4 referidos
  | 'silver'   // 5-9 referidos  
  | 'gold'     // 10-19 referidos
  | 'platinum' // 20+ referidos
  | 'diamond'; // 50+ referidos

export interface ReferralInvitation {
  id: string;
  email: string;
  invitedAt: string;
  registeredAt?: string;
  status: 'sent' | 'opened' | 'registered' | 'expired';
  source: InvitationSource;
  customMessage?: string;
}

export type InvitationSource = 
  | 'email'
  | 'whatsapp'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'copy_link'
  | 'qr_code'
  | 'direct';

export interface ReferralEarning {
  id: string;
  referralUserId: string;
  amount: number;
  currency: string;
  type: EarningType;
  description: string;
  orderId?: string;
  earnedAt: string;
  paidAt?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
}

export type EarningType =
  | 'registration_bonus'  // Bono por registro exitoso
  | 'first_sale_bonus'    // Bono por primera venta
  | 'commission'          // Comisión por venta
  | 'milestone_bonus'     // Bono por alcanzar milestone
  | 'tier_bonus'          // Bono por subir de tier
  | 'activity_bonus';     // Bono por actividad

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingInvitations: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  conversionRate: number; // % de invitados que se registran
  activationRate: number; // % de registrados que hacen primera venta
  currentTier: ReferralTier;
  nextTierProgress: {
    current: number;
    required: number;
    percentage: number;
  };
  monthlyStats: MonthlyReferralStats[];
}

export interface MonthlyReferralStats {
  month: string;
  referrals: number;
  earnings: number;
  orders: number;
}

export interface ReferralCode {
  code: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  usageCount: number;
  maxUsage?: number;
}

export interface ReferralLink {
  code: string;
  fullUrl: string;
  shortUrl: string;
  qrCodeUrl: string;
  isActive: boolean;
  clickCount: number;
  conversionCount: number;
}

export interface ReferralReward {
  id: string;
  name: string;
  description: string;
  type: 'fixed_amount' | 'percentage' | 'product' | 'points';
  value: number;
  currency?: string;
  trigger: RewardTrigger;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
}

export type RewardTrigger =
  | 'referral_registration'
  | 'referral_first_sale'
  | 'referral_milestone'
  | 'tier_upgrade'
  | 'monthly_target'
  | 'special_event';

export interface ReferralCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  bonusMultiplier: number;
  targetAudience: 'all' | 'new_users' | 'active_users' | 'vip_users';
  rewards: ReferralReward[];
  participantCount: number;
  conversionRate: number;
}

export interface ShareTemplate {
  id: string;
  name: string;
  platform: InvitationSource;
  subject?: string;
  message: string;
  imageUrl?: string;
  isDefault: boolean;
  isActive: boolean;
}

// API Request/Response types
export interface SendInvitationRequest {
  emails: string[];
  source: InvitationSource;
  customMessage?: string;
  templateId?: string;
}

export interface SendInvitationResponse {
  sentCount: number;
  failedCount: number;
  invitations: ReferralInvitation[];
  errors?: string[];
}

export interface ReferralDashboardData {
  stats: ReferralStats;
  referralCode: ReferralCode;
  referralLink: ReferralLink;
  recentReferrals: ReferralUser[];
  recentEarnings: ReferralEarning[];
  pendingInvitations: ReferralInvitation[];
  availableRewards: ReferralReward[];
  activeCampaigns: ReferralCampaign[];
}

export interface ReferralLeaderboard {
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all_time';
  entries: ReferralLeaderboardEntry[];
  userPosition?: number;
  totalParticipants: number;
}

export interface ReferralLeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  referralCount: number;
  earnings: number;
  tier: ReferralTier;
  badge?: string;
}

// Store types
export interface ReferralState {
  // Dashboard data
  stats: ReferralStats | null;
  referralCode: ReferralCode | null;
  referralLink: ReferralLink | null;
  
  // Lists
  referrals: ReferralUser[];
  earnings: ReferralEarning[];
  invitations: ReferralInvitation[];
  campaigns: ReferralCampaign[];
  shareTemplates: ShareTemplate[];
  
  // Leaderboard
  leaderboard: ReferralLeaderboard | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Filters
  referralFilters: {
    status?: ReferralStatus;
    tier?: ReferralTier;
    dateRange?: {
      from: string;
      to: string;
    };
    searchTerm?: string;
  };
  
  earningFilters: {
    type?: EarningType;
    status?: 'pending' | 'approved' | 'paid' | 'cancelled';
    dateRange?: {
      from: string;
      to: string;
    };
  };
}

export interface ReferralActions {
  // Dashboard
  fetchDashboardData: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Referral Code & Link
  generateNewCode: () => Promise<string>;
  regenerateLink: () => Promise<ReferralLink>;
  
  // Invitations
  sendInvitations: (request: SendInvitationRequest) => Promise<SendInvitationResponse>;
  resendInvitation: (invitationId: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  
  // Referrals management
  fetchReferrals: (filters?: ReferralState['referralFilters']) => Promise<void>;
  fetchReferralDetails: (referralId: string) => Promise<ReferralUser>;
  
  // Earnings
  fetchEarnings: (filters?: ReferralState['earningFilters']) => Promise<void>;
  requestEarningPayout: (earningIds: string[]) => Promise<void>;
  
  // Share templates
  fetchShareTemplates: () => Promise<void>;
  createShareTemplate: (template: Omit<ShareTemplate, 'id'>) => Promise<ShareTemplate>;
  updateShareTemplate: (id: string, template: Partial<ShareTemplate>) => Promise<ShareTemplate>;
  
  // Leaderboard
  fetchLeaderboard: (period: ReferralLeaderboard['period']) => Promise<void>;
  
  // Campaigns
  fetchCampaigns: () => Promise<void>;
  joinCampaign: (campaignId: string) => Promise<void>;
  
  // Filters
  setReferralFilters: (filters: Partial<ReferralState['referralFilters']>) => void;
  setEarningFilters: (filters: Partial<ReferralState['earningFilters']>) => void;
  clearFilters: () => void;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

// Form types
export interface InviteFriendsForm {
  emails: string[];
  customMessage?: string;
  source: InvitationSource;
  templateId?: string;
}

export interface ShareLinkForm {
  platform: InvitationSource;
  customMessage?: string;
}

// Analytics types
export interface ReferralAnalytics {
  period: string;
  totalInvites: number;
  successfulRegistrations: number;
  activeUsers: number;
  totalEarnings: number;
  conversionFunnel: {
    invited: number;
    clicked: number;
    registered: number;
    firstSale: number;
    active: number;
  };
  topSources: Array<{
    source: InvitationSource;
    count: number;
    conversionRate: number;
  }>;
  earningsByType: Array<{
    type: EarningType;
    amount: number;
    count: number;
  }>;
}

// Notification types
export interface ReferralNotification {
  id: string;
  type: 'new_referral' | 'referral_sale' | 'earning_paid' | 'tier_upgrade' | 'milestone_reached';
  title: string;
  message: string;
  data?: {
    referralId?: string;
    earningId?: string;
    amount?: number;
    tier?: ReferralTier;
  };
  createdAt: string;
  read: boolean;
}