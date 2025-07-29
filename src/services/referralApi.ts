// src/services/referralApi.ts
import {
  ReferralDashboardData,
  ReferralStats,
  ReferralCode,
  ReferralLink,
  ReferralUser,
  ReferralEarning,
  ReferralInvitation,
  ReferralCampaign,
  ShareTemplate,
  ReferralLeaderboard,
  SendInvitationRequest,
  SendInvitationResponse,
  ReferralAnalytics
} from '@/types/referral';

// Mock data para desarrollo
const mockStats: ReferralStats = {
  totalReferrals: 12,
  activeReferrals: 8,
  pendingInvitations: 3,
  totalEarnings: 485.50,
  pendingEarnings: 75.00,
  paidEarnings: 410.50,
  conversionRate: 65.2, // % de invitados que se registran
  activationRate: 78.5,  // % de registrados que hacen primera venta
  currentTier: 'silver',
  nextTierProgress: {
    current: 12,
    required: 20,
    percentage: 60
  },
  monthlyStats: [
    { month: '2024-01', referrals: 3, earnings: 125.00, orders: 8 },
    { month: '2024-02', referrals: 5, earnings: 180.50, orders: 12 },
    { month: '2024-03', referrals: 4, earnings: 180.00, orders: 10 }
  ]
};

const mockReferralCode: ReferralCode = {
  code: 'DIEGO2024',
  userId: 'user_123',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  usageCount: 12,
  maxUsage: 100
};

const mockReferralLink: ReferralLink = {
  code: 'DIEGO2024',
  fullUrl: 'https://wiru.app/register?ref=DIEGO2024',
  shortUrl: 'https://wiru.app/r/DIEGO2024',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wiru.app/r/DIEGO2024',
  isActive: true,
  clickCount: 45,
  conversionCount: 12
};

const mockReferrals: ReferralUser[] = [
  {
    id: 'ref_001',
    email: 'maria.gonzalez@email.com',
    firstName: 'María',
    lastName: 'González',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b15d6cac?w=150',
    registeredAt: '2024-01-15T10:30:00Z',
    firstSaleAt: '2024-01-16T14:20:00Z',
    totalEarnings: 156.50,
    totalOrders: 4,
    status: 'active',
    tier: 'bronze'
  },
  {
    id: 'ref_002',
    email: 'carlos.rodriguez@email.com',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    registeredAt: '2024-01-20T09:15:00Z',
    firstSaleAt: '2024-01-22T11:45:00Z',
    totalEarnings: 89.25,
    totalOrders: 2,
    status: 'active',
    tier: 'bronze'
  },
  {
    id: 'ref_003',
    email: 'ana.martinez@email.com',
    firstName: 'Ana',
    lastName: 'Martínez',
    registeredAt: '2024-02-01T16:45:00Z',
    totalEarnings: 0,
    totalOrders: 0,
    status: 'registered',
    tier: 'bronze'
  }
];

const mockEarnings: ReferralEarning[] = [
  {
    id: 'earn_001',
    referralUserId: 'ref_001',
    amount: 25.00,
    currency: 'USD',
    type: 'registration_bonus',
    description: 'Bono por registro de María González',
    earnedAt: '2024-01-15T10:30:00Z',
    paidAt: '2024-01-20T00:00:00Z',
    status: 'paid'
  },
  {
    id: 'earn_002',
    referralUserId: 'ref_001',
    amount: 15.65,
    currency: 'USD',
    type: 'commission',
    description: 'Comisión por venta de iPhone 12',
    orderId: 'ORD-2024-001',
    earnedAt: '2024-01-16T14:20:00Z',
    paidAt: '2024-01-25T00:00:00Z',
    status: 'paid'
  },
  {
    id: 'earn_003',
    referralUserId: 'ref_002',
    amount: 25.00,
    currency: 'USD',
    type: 'first_sale_bonus',
    description: 'Bono por primera venta de Carlos Rodríguez',
    orderId: 'ORD-2024-002',
    earnedAt: '2024-01-22T11:45:00Z',
    status: 'pending'
  }
];

const mockInvitations: ReferralInvitation[] = [
  {
    id: 'inv_001',
    email: 'pending1@email.com',
    invitedAt: '2024-03-01T10:00:00Z',
    status: 'sent',
    source: 'email',
    customMessage: '¡Únete y empieza a reciclar!'
  },
    {
      id: 'inv_002',
      email: 'pending2@email.com',
      invitedAt: '2024-03-02T15:30:00Z',
      status: 'opened',
      source: 'whatsapp'
    },
    {
      id: 'inv_003',
      email: 'pending3@email.com',
      invitedAt: '2024-03-03T09:15:00Z',
      status: 'sent',
      source: 'copy_link'
    }
  ];

  const mockCampaigns: ReferralCampaign[] = [
    {
      id: 'camp_001',
      name: 'Campaña de Primavera 2024',
      description: 'Doble bonos por referidos durante marzo',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T23:59:59Z',
      isActive: true,
      bonusMultiplier: 2.0,
      targetAudience: 'all',
      rewards: [],
      participantCount: 156,
      conversionRate: 42.3
    }
  ];

  const mockShareTemplates: ShareTemplate[] = [
    {
      id: 'tpl_001',
      name: 'Plantilla por defecto',
      platform: 'email',
      subject: '¡Únete a Wiru y convierte tu chatarra en dinero!',
      message: 'Hola! Te invito a unirte a Wiru, la plataforma donde puedes convertir tu chatarra electrónica en dinero de forma fácil y segura. Usa mi código {REFERRAL_CODE} y obtén un bono de bienvenida.',
      isDefault: true,
      isActive: true
    },
    {
      id: 'tpl_002',
      name: 'WhatsApp casual',
      platform: 'whatsapp',
      message: '¡Hola! 👋 ¿Sabías que puedes ganar dinero con tu chatarra electrónica? Te invito a probar Wiru: {REFERRAL_LINK} ¡Es súper fácil!',
      isDefault: true,
      isActive: true
    }
  ];

  const mockLeaderboard: ReferralLeaderboard = {
    period: 'monthly',
    entries: [
      {
        rank: 1,
        userId: 'user_top1',
        userName: 'Ana García',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        referralCount: 25,
        earnings: 1250.00,
        tier: 'gold',
        badge: '🏆'
      },
      {
        rank: 2,
        userId: 'user_top2',
        userName: 'Roberto Silva',
        referralCount: 18,
        earnings: 890.50,
        tier: 'silver'
      },
      {
        rank: 3,
        userId: 'user_123', // Usuario actual
        userName: 'Diego Z.',
        referralCount: 12,
        earnings: 485.50,
        tier: 'silver'
      }
    ],
    userPosition: 3,
    totalParticipants: 156
  };

  // Simulador de delay de red
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  class ReferralApiService {
    private baseUrl = '/referrals';

    // Dashboard
    async getDashboardData(): Promise<ReferralDashboardData> {
      await delay(600);
      
      return {
        stats: mockStats,
        referralCode: mockReferralCode,
        referralLink: mockReferralLink,
        recentReferrals: mockReferrals.slice(0, 3),
        recentEarnings: mockEarnings.slice(0, 5),
        pendingInvitations: mockInvitations,
        availableRewards: [],
        activeCampaigns: mockCampaigns
      };
    }

    async getStats(): Promise<ReferralStats> {
      await delay(300);
      return mockStats;
    }

    // Referral Code & Link
    async generateNewCode(): Promise<string> {
      await delay(800);
      const newCode = 'DIEGO' + Math.random().toString(36).substring(2, 6).toUpperCase();
      mockReferralCode.code = newCode;
      return newCode;
    }

    async getReferralLink(): Promise<ReferralLink> {
      await delay(300);
      return {
        ...mockReferralLink,
        fullUrl: `https://wiru.app/register?ref=${mockReferralCode.code}`,
        shortUrl: `https://wiru.app/r/${mockReferralCode.code}`
      };
    }

    async regenerateLink(): Promise<ReferralLink> {
      await delay(500);
      const newCode = await this.generateNewCode();
      return {
        ...mockReferralLink,
        code: newCode,
        fullUrl: `https://wiru.app/register?ref=${newCode}`,
        shortUrl: `https://wiru.app/r/${newCode}`,
        clickCount: 0,
        conversionCount: 0
      };
    }

    // Invitations
    async sendInvitations(request: SendInvitationRequest): Promise<SendInvitationResponse> {
      await delay(1000);
      
      const newInvitations: ReferralInvitation[] = request.emails.map(email => ({
        id: 'inv_' + Date.now() + Math.random().toString(36).substring(2, 5),
        email,
        invitedAt: new Date().toISOString(),
        status: 'sent',
        source: request.source,
        customMessage: request.customMessage
      }));

      // Simular algunos fallos
      const failedCount = Math.floor(request.emails.length * 0.1); // 10% de fallos
      const sentCount = request.emails.length - failedCount;

      return {
        sentCount,
        failedCount,
        invitations: newInvitations.slice(0, sentCount),
        errors: failedCount > 0 ? ['Algunos emails no son válidos'] : undefined
      };
    }

    async resendInvitation(invitationId: string): Promise<void> {
      await delay(500);
      // Mock success
    }

    async cancelInvitation(invitationId: string): Promise<void> {
      await delay(400);
      // Mock success
    }

    // Referrals
    async getReferrals(filters?: any): Promise<ReferralUser[]> {
      await delay(500);
      
      let filtered = [...mockReferrals];
      
      if (filters?.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
      
      if (filters?.tier) {
        filtered = filtered.filter(r => r.tier === filters.tier);
      }
      
      if (filters?.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(r =>
          r.firstName.toLowerCase().includes(term) ||
          r.lastName.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term)
        );
      }
      
      return filtered;
    }

    async getReferralDetails(referralId: string): Promise<ReferralUser> {
      await delay(400);
      const referral = mockReferrals.find(r => r.id === referralId);
      if (!referral) throw new Error('Referido no encontrado');
      return referral;
    }

    // Earnings
    async getEarnings(filters?: any): Promise<ReferralEarning[]> {
      await delay(400);
      
      let filtered = [...mockEarnings];
      
      if (filters?.type) {
        filtered = filtered.filter(e => e.type === filters.type);
      }
      
      if (filters?.status) {
        filtered = filtered.filter(e => e.status === filters.status);
      }
      
      return filtered.sort((a, b) => 
        new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
      );
    }

    async requestEarningPayout(earningIds: string[]): Promise<void> {
      await delay(800);
      // Mock success
    }

    // Share Templates
    async getShareTemplates(): Promise<ShareTemplate[]> {
      await delay(300);
      return mockShareTemplates;
    }

    async createShareTemplate(template: Omit<ShareTemplate, 'id'>): Promise<ShareTemplate> {
      await delay(600);
      const newTemplate: ShareTemplate = {
        ...template,
        id: 'tpl_' + Date.now()
      };
      mockShareTemplates.push(newTemplate);
      return newTemplate;
    }

    async updateShareTemplate(id: string, template: Partial<ShareTemplate>): Promise<ShareTemplate> {
      await delay(500);
      const index = mockShareTemplates.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Plantilla no encontrada');
      
      mockShareTemplates[index] = { ...mockShareTemplates[index], ...template };
      return mockShareTemplates[index];
    }

    // Leaderboard
    async getLeaderboard(period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all_time'): Promise<ReferralLeaderboard> {
      await delay(600);
      return {
        ...mockLeaderboard,
        period
      };
    }

    // Campaigns
    async getCampaigns(): Promise<ReferralCampaign[]> {
      await delay(400);
      return mockCampaigns;
    }

    async joinCampaign(campaignId: string): Promise<void> {
      await delay(500);
      // Mock success
    }

    // Analytics
    async getAnalytics(period: string): Promise<ReferralAnalytics> {
      await delay(800);
      
      return {
        period,
        totalInvites: 45,
        successfulRegistrations: 12,
        activeUsers: 8,
        totalEarnings: 485.50,
        conversionFunnel: {
          invited: 45,
          clicked: 32,
          registered: 12,
          firstSale: 10,
          active: 8
        },
        topSources: [
          { source: 'whatsapp', count: 18, conversionRate: 72.2 },
          { source: 'email', count: 15, conversionRate: 60.0 },
          { source: 'copy_link', count: 12, conversionRate: 58.3 }
        ],
        earningsByType: [
          { type: 'commission', amount: 285.50, count: 15 },
          { type: 'registration_bonus', amount: 125.00, count: 5 },
          { type: 'first_sale_bonus', amount: 75.00, count: 3 }
        ]
      };
    }

    // Social sharing
    async generateShareContent(platform: string, customMessage?: string): Promise<{ message: string; url: string }> {
      await delay(200);
      
      const baseMessage = customMessage || mockShareTemplates.find(t => t.platform === platform)?.message || 
        '¡Únete a Wiru y convierte tu chatarra en dinero! Usa mi código {REFERRAL_CODE}';
      
      const message = baseMessage
        .replace('{REFERRAL_CODE}', mockReferralCode.code)
        .replace('{REFERRAL_LINK}', mockReferralLink.shortUrl);
      
      return {
        message,
        url: mockReferralLink.shortUrl
      };
    }

    // Utility methods
    async trackLinkClick(code: string, source?: string): Promise<void> {
      await delay(100);
      mockReferralLink.clickCount++;
    }

    async validateReferralCode(code: string): Promise<boolean> {
      await delay(200);
      return code === mockReferralCode.code;
    }
  }

  export const referralApi = new ReferralApiService();