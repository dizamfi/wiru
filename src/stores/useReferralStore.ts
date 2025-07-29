// src/stores/useReferralStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ReferralState,
  ReferralActions,
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
  SendInvitationResponse
} from '@/types/referral';
import { referralApi } from '@/services/referralApi';

interface ReferralStore extends ReferralState, ReferralActions {}

const initialState: ReferralState = {
  // Dashboard data
  stats: null,
  referralCode: null,
  referralLink: null,
  
  // Lists
  referrals: [],
  earnings: [],
  invitations: [],
  campaigns: [],
  shareTemplates: [],
  
  // Leaderboard
  leaderboard: null,
  
  // UI state
  loading: false,
  error: null,
  
  // Filters
  referralFilters: {},
  earningFilters: {}
};

export const useReferralStore = create<ReferralStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Dashboard
      fetchDashboardData: async () => {
        try {
          set({ loading: true, error: null });
          
          const dashboardData = await referralApi.getDashboardData();
          
          set({
            stats: dashboardData.stats,
            referralCode: dashboardData.referralCode,
            referralLink: dashboardData.referralLink,
            referrals: dashboardData.recentReferrals,
            earnings: dashboardData.recentEarnings,
            invitations: dashboardData.pendingInvitations,
            campaigns: dashboardData.activeCampaigns,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar datos del dashboard',
            loading: false
          });
        }
      },

      refreshStats: async () => {
        try {
          const stats = await referralApi.getStats();
          set({ stats });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar estadísticas'
          });
        }
      },

      // Referral Code & Link
      generateNewCode: async () => {
        try {
          set({ loading: true, error: null });
          
          const newCode = await referralApi.generateNewCode();
          const updatedLink = await referralApi.getReferralLink();
          
          set({
            referralCode: { ...get().referralCode!, code: newCode },
            referralLink: updatedLink,
            loading: false
          });
          
          return newCode;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al generar nuevo código',
            loading: false
          });
          throw error;
        }
      },

      regenerateLink: async () => {
        try {
          set({ loading: true, error: null });
          
          const newLink = await referralApi.regenerateLink();
          
          set({
            referralLink: newLink,
            loading: false
          });
          
          return newLink;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al regenerar enlace',
            loading: false
          });
          throw error;
        }
      },

      // Invitations
      sendInvitations: async (request: SendInvitationRequest) => {
        try {
          set({ loading: true, error: null });
          
          const response = await referralApi.sendInvitations(request);
          
          // Actualizar lista de invitaciones
          const currentInvitations = get().invitations;
          set({
            invitations: [...response.invitations, ...currentInvitations],
            loading: false
          });
          
          // Refrescar stats
          get().refreshStats();
          
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al enviar invitaciones',
            loading: false
          });
          throw error;
        }
      },

      resendInvitation: async (invitationId: string) => {
        try {
          set({ loading: true, error: null });
          
          await referralApi.resendInvitation(invitationId);
          
          // Actualizar estado de la invitación
          const invitations = get().invitations.map(inv =>
            inv.id === invitationId
              ? { ...inv, status: 'sent' as const, invitedAt: new Date().toISOString() }
              : inv
          );
          
          set({ invitations, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al reenviar invitación',
            loading: false
          });
        }
      },

      cancelInvitation: async (invitationId: string) => {
        try {
          set({ loading: true, error: null });
          
          await referralApi.cancelInvitation(invitationId);
          
          // Remover invitación de la lista
          const invitations = get().invitations.filter(inv => inv.id !== invitationId);
          
          set({ invitations, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cancelar invitación',
            loading: false
          });
        }
      },

      // Referrals management
      fetchReferrals: async (filters) => {
        try {
          set({ loading: true, error: null });
          
          if (filters) {
            set({ referralFilters: { ...get().referralFilters, ...filters } });
          }
          
          const referrals = await referralApi.getReferrals(get().referralFilters);
          
          set({ referrals, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar referidos',
            loading: false
          });
        }
      },

      fetchReferralDetails: async (referralId: string) => {
        try {
          set({ loading: true, error: null });
          
          const referralDetails = await referralApi.getReferralDetails(referralId);
          
          set({ loading: false });
          return referralDetails;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar detalles del referido',
            loading: false
          });
          throw error;
        }
      },

      // Earnings
      fetchEarnings: async (filters) => {
        try {
          set({ loading: true, error: null });
          
          if (filters) {
            set({ earningFilters: { ...get().earningFilters, ...filters } });
          }
          
          const earnings = await referralApi.getEarnings(get().earningFilters);
          
          set({ earnings, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar ganancias',
            loading: false
          });
        }
      },

      requestEarningPayout: async (earningIds: string[]) => {
        try {
          set({ loading: true, error: null });
          
          await referralApi.requestEarningPayout(earningIds);
          
          // Actualizar estado de earnings
          const earnings = get().earnings.map(earning =>
            earningIds.includes(earning.id)
              ? { ...earning, status: 'pending' as const }
              : earning
          );
          
          set({ earnings, loading: false });
          
          // Refrescar stats
          get().refreshStats();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al solicitar pago',
            loading: false
          });
        }
      },

      // Share templates
      fetchShareTemplates: async () => {
        try {
          set({ loading: true, error: null });
          
          const templates = await referralApi.getShareTemplates();
          
          set({ shareTemplates: templates, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar plantillas',
            loading: false
          });
        }
      },

      createShareTemplate: async (template) => {
        try {
          set({ loading: true, error: null });
          
          const newTemplate = await referralApi.createShareTemplate(template);
          
          const shareTemplates = [...get().shareTemplates, newTemplate];
          set({ shareTemplates, loading: false });
          
          return newTemplate;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al crear plantilla',
            loading: false
          });
          throw error;
        }
      },

      updateShareTemplate: async (id: string, template) => {
        try {
          set({ loading: true, error: null });
          
          const updatedTemplate = await referralApi.updateShareTemplate(id, template);
          
          const shareTemplates = get().shareTemplates.map(t =>
            t.id === id ? updatedTemplate : t
          );
          set({ shareTemplates, loading: false });
          
          return updatedTemplate;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar plantilla',
            loading: false
          });
          throw error;
        }
      },

      // Leaderboard
      fetchLeaderboard: async (period) => {
        try {
          set({ loading: true, error: null });
          
          const leaderboard = await referralApi.getLeaderboard(period);
          
          set({ leaderboard, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar ranking',
            loading: false
          });
        }
      },

      // Campaigns
      fetchCampaigns: async () => {
        try {
          set({ loading: true, error: null });
          
          const campaigns = await referralApi.getCampaigns();
          
          set({ campaigns, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar campañas',
            loading: false
          });
        }
      },

      joinCampaign: async (campaignId: string) => {
        try {
          set({ loading: true, error: null });
          
          await referralApi.joinCampaign(campaignId);
          
          // Actualizar estado de la campaña
          const campaigns = get().campaigns.map(campaign =>
            campaign.id === campaignId
              ? { ...campaign, participantCount: campaign.participantCount + 1 }
              : campaign
          );
          
          set({ campaigns, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al unirse a la campaña',
            loading: false
          });
        }
      },

      // Filters
      setReferralFilters: (filters) => {
        set({ 
          referralFilters: { ...get().referralFilters, ...filters }
        });
        
        // Auto-fetch with new filters
        get().fetchReferrals();
      },

      setEarningFilters: (filters) => {
        set({ 
          earningFilters: { ...get().earningFilters, ...filters }
        });
        
        // Auto-fetch with new filters
        get().fetchEarnings();
      },

      clearFilters: () => {
        set({
          referralFilters: {},
          earningFilters: {}
        });
        
        // Refetch data
        get().fetchReferrals();
        get().fetchEarnings();
      },

      // Utility
      clearError: () => set({ error: null }),

      reset: () => set(initialState)
    }),
    {
      name: 'referral-store'
    }
  )
);