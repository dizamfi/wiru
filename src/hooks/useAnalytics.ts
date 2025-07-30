// src/hooks/useAnalytics.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useAnalyticsStore } from '@/stores/useAnalyticsStore';
import { DateRange, AnalyticsPeriod, ExportOptions, AnalyticsFilter } from '@/types/analytics';
import { toast } from '@/components/ui/use-toast';

export const useAnalytics = (autoFetch = true) => {
  const store = useAnalyticsStore();

  // Auto-fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchDashboard();
    }
  }, [autoFetch, store.fetchDashboard]);

  // Memoized computed values
  const stats = useMemo(() => {
    const dashboard = store.dashboard;
    if (!dashboard) return null;

    return {
      // Earnings stats
      totalEarnings: dashboard.earnings.total,
      averageOrderValue: dashboard.earnings.averageOrderValue,
      bestMonth: dashboard.topPerformance.bestMonth,
      
      // Growth rates
      earningsGrowth: dashboard.earnings.growthRate,
      ordersGrowth: dashboard.orders.growthRate,
      
      // Environmental impact
      totalWeight: dashboard.environmental.totalWeight,
      co2Saved: dashboard.environmental.co2Saved,
      
      // Comparative data
      userRank: store.comparison?.userRank.percentile || 0,
      industryComparison: store.comparison?.industry || null
    };
  }, [store.dashboard, store.comparison]);

  // Format currency helper
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  // Format weight helper
  const formatWeight = useCallback((weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} ton`;
    }
    return `${weight.toFixed(1)} kg`;
  }, []);

  // Format percentage helper
  const formatPercentage = useCallback((value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  }, []);

  // Format date helper
  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Period management
  const setPresetPeriod = useCallback((preset: AnalyticsPeriod['value']) => {
    store.setPresetPeriod(preset);
  }, [store.setPresetPeriod]);

  const setPeriod = useCallback((period: DateRange) => {
    store.setPeriod(period);
  }, [store.setPeriod]);

  // Chart configuration
  const setChartType = useCallback((type: 'line' | 'bar' | 'area') => {
    store.setChartType(type);
  }, [store.setChartType]);

  const toggleMetric = useCallback((metric: string) => {
    store.toggleMetric(metric);
  }, [store.toggleMetric]);

  // Data refresh
  const refreshData = useCallback(async () => {
    try {
      await store.refreshDashboard();
      toast({
        title: 'Datos actualizados',
        description: 'Las estadísticas se han actualizado correctamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudieron actualizar las estadísticas',
        variant: 'destructive'
      });
    }
  }, [store.refreshDashboard]);

  // Export functionality
  const exportData = useCallback(async (options: ExportOptions) => {
    try {
      const downloadUrl = await store.exportData(options);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `analytics_${options.format}_${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportación exitosa',
        description: `Datos exportados en formato ${options.format.toUpperCase()}`,
        variant: 'success'
      });
      
      return downloadUrl;
    } catch (error) {
      toast({
        title: 'Error al exportar',
        description: 'No se pudieron exportar los datos',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.exportData]);

  // Advanced analytics
  const fetchAdvancedAnalytics = useCallback(async () => {
    try {
      await store.fetchAdvancedAnalytics();
      return store.advanced;
    } catch (error) {
      toast({
        title: 'Error al cargar análisis avanzado',
        description: 'No se pudo cargar el análisis avanzado',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.fetchAdvancedAnalytics, store.advanced]);

  // Insights and predictions
  const generateInsights = useCallback(async () => {
    try {
      const insights = await store.generateInsights();
      toast({
        title: 'Insights generados',
        description: 'Se han generado nuevos insights para tus datos',
        variant: 'success'
      });
      return insights;
    } catch (error) {
      toast({
        title: 'Error al generar insights',
        description: 'No se pudieron generar insights',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.generateInsights]);

  const generatePredictions = useCallback(async (type: 'earnings' | 'orders' | 'environmental' | 'referrals') => {
    try {
      const predictions = await store.generatePredictions(type);
      toast({
        title: 'Predicciones generadas',
        description: `Se han generado predicciones para ${type}`,
        variant: 'success'
      });
      return predictions;
    } catch (error) {
      toast({
        title: 'Error al generar predicciones',
        description: 'No se pudieron generar predicciones',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.generatePredictions]);

  // Goals management
  const setGoal = useCallback(async (type: 'monthly' | 'quarterly' | 'yearly', target: number) => {
    try {
      await store.setGoal(type, target);
      toast({
        title: 'Meta establecida',
        description: `Meta ${type} establecida en ${formatCurrency(target)}`,
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al establecer meta',
        description: 'No se pudo establecer la meta',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.setGoal, formatCurrency]);

  // Filters
  const applyFilters = useCallback((filters: AnalyticsFilter) => {
    store.setPeriod(filters.dateRange);
    // Additional filter logic here
  }, [store.setPeriod]);

  // Get trend info
  const getTrendInfo = useCallback((current: number, previous: number) => {
    if (previous === 0) return { trend: 'neutral', percentage: 0, isPositive: false };
    
    const percentage = ((current - previous) / previous) * 100;
    const isPositive = percentage > 0;
    const trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';
    
    return {
      trend,
      percentage: Math.abs(percentage),
      isPositive,
      formatted: `${isPositive ? '+' : '-'}${Math.abs(percentage).toFixed(1)}%`
    };
  }, []);

  // Get period comparison
  const getPeriodComparison = useCallback((currentPeriod: string) => {
    const dashboard = store.dashboard;
    if (!dashboard) return null;

    return {
      earnings: getTrendInfo(
        dashboard.earnings.total,
        dashboard.earnings.previousPeriod
      ),
      orders: getTrendInfo(
        dashboard.orders.total,
        dashboard.orders.previousPeriod
      ),
      weight: getTrendInfo(
        dashboard.environmental.totalWeight,
        dashboard.environmental.previousWeight || 0
      )
    };
  }, [store.dashboard, getTrendInfo]);

  // Get insights by category
  const getInsightsByCategory = useCallback((category: string) => {
    return store.dashboard?.insights.filter(insight => 
      insight.metric.toLowerCase().includes(category.toLowerCase())
    ) || [];
  }, [store.dashboard?.insights]);

  // Get top performing categories
  const getTopCategories = useCallback((limit = 5) => {
    return store.dashboard?.deviceCategories
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, limit) || [];
  }, [store.dashboard?.deviceCategories]);

  return {
    // State
    dashboard: store.dashboard,
    comparison: store.comparison,
    advanced: store.advanced,
    loading: store.loading,
    error: store.error,
    
    // Configuration
    currentPeriod: store.currentPeriod,
    selectedMetrics: store.selectedMetrics,
    chartType: store.chartType,
    
    // Computed values
    stats,
    
    // Period management
    setPresetPeriod,
    setPeriod,
    
    // Chart configuration
    setChartType,
    toggleMetric,
    
    // Data operations
    refreshData,
    exportData,
    fetchAdvancedAnalytics,
    generateInsights,
    generatePredictions,
    
    // Goals
    setGoal,
    
    // Filters
    applyFilters,
    
    // Utilities
    formatCurrency,
    formatWeight,
    formatPercentage,
    formatDate,
    getTrendInfo,
    getPeriodComparison,
    getInsightsByCategory,
    getTopCategories,
    
    // Actions
    clearError: store.clearError,
    clearCache: store.clearCache
  };
};