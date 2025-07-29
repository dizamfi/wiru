// src/hooks/useReferrals.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useReferralStore } from '@/stores/useReferralStore';
import { ReferralTier, InvitationSource, SendInvitationRequest } from '@/types/referral';
import { toast } from '@/components/ui/use-toast';

export const useReferrals = (autoFetch = true) => {
  const store = useReferralStore();

  // Auto-fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchDashboardData();
    }
  }, [autoFetch, store.fetchDashboardData]);

  // Helper function to get next tier name
  const getNextTierName = useCallback((currentTier: ReferralTier): string => {
    const tierMap: Record<ReferralTier, string> = {
      bronze: 'Silver',
      silver: 'Gold',
      gold: 'Platinum',
      platinum: 'Diamond',
      diamond: 'Diamond'
    };
    return tierMap[currentTier] || 'Silver';
  }, []);

  // Tier benefits and requirements
  const tierInfo = useMemo(() => ({
    bronze: { 
      name: 'Bronze', 
      minReferrals: 1, 
      maxReferrals: 4, 
      bonus: '5%', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: '🥉'
    },
    silver: { 
      name: 'Silver', 
      minReferrals: 5, 
      maxReferrals: 9, 
      bonus: '10%', 
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '🥈'
    },
    gold: { 
      name: 'Gold', 
      minReferrals: 10, 
      maxReferrals: 19, 
      bonus: '15%', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: '🥇'
    },
    platinum: { 
      name: 'Platinum', 
      minReferrals: 20, 
      maxReferrals: 49, 
      bonus: '20%', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: '💎'
    },
    diamond: { 
      name: 'Diamond', 
      minReferrals: 50, 
      maxReferrals: Infinity, 
      bonus: '25%', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: '💍'
    }
  }), []);

  // Memoized computed values
  const stats = useMemo(() => {
    const rawStats = store.stats;
    if (!rawStats) return null;

    return {
      ...rawStats,
      averageEarningsPerReferral: rawStats.totalReferrals > 0 
        ? rawStats.totalEarnings / rawStats.totalReferrals 
        : 0,
      conversionRateFormatted: `${rawStats.conversionRate.toFixed(1)}%`,
      activationRateFormatted: `${rawStats.activationRate.toFixed(1)}%`,
      nextTierName: getNextTierName(rawStats.currentTier),
      nextTierReferralsNeeded: rawStats.nextTierProgress.required - rawStats.nextTierProgress.current
    };
  }, [store.stats, getNextTierName]);

  // Get current tier info
  const currentTierInfo = useMemo(() => {
    if (!stats?.currentTier) return tierInfo.bronze;
    return tierInfo[stats.currentTier];
  }, [stats?.currentTier, tierInfo]);

  // Invitation functions
  const sendInvitations = useCallback(async (
    emails: string[], 
    source: InvitationSource = 'email', 
    customMessage?: string
  ) => {
    try {
      const request: SendInvitationRequest = {
        emails,
        source,
        customMessage
      };

      const result = await store.sendInvitations(request);
      
      toast({
        title: 'Invitaciones enviadas',
        description: `Se enviaron ${result.sentCount} invitaciones exitosamente`,
        variant: 'success'
      });

      if (result.failedCount > 0) {
        toast({
          title: 'Algunas invitaciones fallaron',
          description: `${result.failedCount} invitaciones no pudieron ser enviadas`,
          variant: 'warning'
        });
      }

      return result;
    } catch (error) {
      toast({
        title: 'Error al enviar invitaciones',
        description: 'No se pudieron enviar las invitaciones',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.sendInvitations]);

  // Copy referral link to clipboard
  const copyReferralLink = useCallback(async () => {
    const shortUrl = store.referralLink?.shortUrl;
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: 'Enlace copiado',
        description: 'El enlace de referido se copió al portapapeles',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al copiar',
        description: 'No se pudo copiar el enlace',
        variant: 'destructive'
      });
    }
  }, [store.referralLink?.shortUrl]);

  // Copy referral code to clipboard
  const copyReferralCode = useCallback(async () => {
    const code = store.referralCode?.code;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Código copiado',
        description: 'El código de referido se copió al portapapeles',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al copiar',
        description: 'No se pudo copiar el código',
        variant: 'destructive'
      });
    }
  }, [store.referralCode?.code]);

  // Share on social platforms
  const shareOnPlatform = useCallback((platform: InvitationSource, customMessage?: string) => {
    const shortUrl = store.referralLink?.shortUrl;
    if (!shortUrl) return;

    const defaultMessages: Record<InvitationSource, string> = {
      whatsapp: `¡Hola! 👋 Te invito a unirte a Wiru y ganar dinero con tu chatarra electrónica. Usa mi enlace: ${shortUrl}`,
      facebook: `¿Sabías que puedes ganar dinero reciclando? ¡Únete a Wiru conmigo! ${shortUrl}`,
      twitter: `💰 Convierte tu chatarra electrónica en dinero con @WiruApp. ¡Únete usando mi enlace! ${shortUrl} #Reciclaje #DineroExtra`,
      instagram: `¡Gana dinero reciclando con Wiru! 📱💰 Link en bio: ${shortUrl}`,
      linkedin: `Descubre cómo monetizar el reciclaje de electrónicos con Wiru. Una oportunidad sostenible de generar ingresos: ${shortUrl}`,
      email: `Te invito a conocer Wiru, donde puedes convertir tu chatarra electrónica en dinero de forma segura y sostenible.`,
      copy_link: shortUrl,
      qr_code: shortUrl,
      direct: shortUrl
    };

    const message = customMessage || defaultMessages[platform];
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(shortUrl);

    const shareUrls: Record<InvitationSource, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      instagram: `https://www.instagram.com/`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=Te invito a unirte a Wiru&body=${encodedMessage}%0A%0A${encodedUrl}`,
      copy_link: shortUrl,
      qr_code: shortUrl,
      direct: shortUrl
    };

    if (platform === 'copy_link') {
      copyReferralLink();
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  }, [store.referralLink?.shortUrl, copyReferralLink]);

  // Generate new referral code
  const generateNewCode = useCallback(async () => {
    try {
      const newCode = await store.generateNewCode();
      toast({
        title: 'Código regenerado',
        description: `Tu nuevo código es: ${newCode}`,
        variant: 'success'
      });
      return newCode;
    } catch (error) {
      toast({
        title: 'Error al generar código',
        description: 'No se pudo generar un nuevo código',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.generateNewCode]);

  // Filter functions
  const filterReferralsByStatus = useCallback((status: string) => {
    const statusValue = status === 'all' ? undefined : status;
    store.setReferralFilters({ status: statusValue as any });
  }, [store.setReferralFilters]);

  const searchReferrals = useCallback((searchTerm: string) => {
    store.setReferralFilters({ searchTerm });
  }, [store.setReferralFilters]);

  // Format currency
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  }, []);

  // Get status display info
  const getStatusInfo = useCallback((status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      pending: { label: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      registered: { label: 'Registrado', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      active: { label: 'Activo', color: 'text-green-600', bgColor: 'bg-green-100' },
      inactive: { label: 'Inactivo', color: 'text-gray-600', bgColor: 'bg-gray-100' },
      churned: { label: 'Perdido', color: 'text-red-600', bgColor: 'bg-red-100' }
    };

    return statusMap[status] || statusMap.pending;
  }, []);

  // Refresh functions
  const refreshDashboard = useCallback(() => {
    store.fetchDashboardData();
  }, [store.fetchDashboardData]);

  const refreshStats = useCallback(() => {
    store.refreshStats();
  }, [store.refreshStats]);

  // Clear error
  const clearError = useCallback(() => {
    store.clearError();
  }, [store.clearError]);

  return {
    // State from store
    loading: store.loading,
    error: store.error,
    referralCode: store.referralCode,
    referralLink: store.referralLink,
    referrals: store.referrals,
    earnings: store.earnings,
    invitations: store.invitations,
    campaigns: store.campaigns,
    shareTemplates: store.shareTemplates,
    leaderboard: store.leaderboard,
    
    // Computed values
    stats,
    currentTierInfo,
    tierInfo,
    
    // Actions
    sendInvitations,
    copyReferralLink,
    copyReferralCode,
    shareOnPlatform,
    generateNewCode,
    
    // Filters
    filterReferralsByStatus,
    searchReferrals,
    
    // Utilities
    formatCurrency,
    formatDate,
    getStatusInfo,
    
    // Refresh
    refreshDashboard,
    refreshStats,
    clearError
  };
};