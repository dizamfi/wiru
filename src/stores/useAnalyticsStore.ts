// src/stores/useAnalyticsStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  AnalyticsState,
  AnalyticsActions,
  AnalyticsDashboard,
  ComparisonData,
  AdvancedAnalytics,
  DateRange,
  ExportOptions,
  AnalyticsInsight,
  AnalyticsPrediction
} from '@/types/analytics';
import { analyticsApi } from '@/services/analyticsApi';

interface AnalyticsStore extends AnalyticsState, AnalyticsActions {}

const getDefaultPeriod = (): DateRange => {
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    from: monthAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
    preset: 'month'
  };
};

const initialState: AnalyticsState = {
  // Dashboard data
  dashboard: null,
  comparison: null,
  advanced: null,
  
  // UI state
  loading: false,
  error: null,
  
  // Filters
  currentPeriod: getDefaultPeriod(),
  selectedMetrics: ['earnings', 'orders', 'weight'],
  chartType: 'line',
  
  // Cache
  cachedData: new Map(),
  lastFetch: null
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Data fetching
      fetchDashboard: async (period?: DateRange) => {
        try {
          set({ loading: true, error: null });
          
          const targetPeriod = period || get().currentPeriod;
          const cacheKey = `dashboard_${targetPeriod.from}_${targetPeriod.to}`;
          
          // Check cache first
          const cached = get().cachedData.get(cacheKey);
          if (cached && get().lastFetch) {
            const lastFetchTime = new Date(get().lastFetch!).getTime();
            const now = new Date().getTime();
            const fiveMinutes = 5 * 60 * 1000;
            
            if (now - lastFetchTime < fiveMinutes) {
              set({ 
                dashboard: cached,
                loading: false 
              });
              return;
            }
          }
          
          const dashboard = await analyticsApi.getDashboard(targetPeriod);
          
          // Update cache
          const newCache = new Map(get().cachedData);
          newCache.set(cacheKey, dashboard);
          
          set({
            dashboard,
            currentPeriod: targetPeriod,
            cachedData: newCache,
            lastFetch: new Date().toISOString(),
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar dashboard',
            loading: false
          });
        }
      },

      fetchComparison: async () => {
        try {
          const comparison = await analyticsApi.getComparison();
          set({ comparison });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar comparación'
          });
        }
      },

      fetchAdvancedAnalytics: async () => {
        try {
          set({ loading: true, error: null });
          
          const advanced = await analyticsApi.getAdvancedAnalytics(get().currentPeriod);
          
          set({
            advanced,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al cargar análisis avanzado',
            loading: false
          });
        }
      },

      refreshDashboard: async () => {
        try {
          set({ loading: true, error: null });
          
          // Clear cache for current period
          const targetPeriod = get().currentPeriod;
          const cacheKey = `dashboard_${targetPeriod.from}_${targetPeriod.to}`;
          const newCache = new Map(get().cachedData);
          newCache.delete(cacheKey);
          
          set({ cachedData: newCache });
          
          // Fetch fresh data
          await get().fetchDashboard(targetPeriod);
          await get().fetchComparison();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar datos',
            loading: false
          });
        }
      },

      // Period management
      setPeriod: (period: DateRange) => {
        set({ currentPeriod: period });
        get().fetchDashboard(period);
      },

      setPresetPeriod: (preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom') => {
        const today = new Date();
        let from: Date;
        let to: Date = today;

        switch (preset) {
          case 'today':
            from = new Date(today);
            break;
          case 'week':
            from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'quarter':
            from = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            from = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const period: DateRange = {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
          preset
        };

        get().setPeriod(period);
      },

      // Chart configuration
      setChartType: (type: AnalyticsState['chartType']) => {
        set({ chartType: type });
      },

      toggleMetric: (metric: string) => {
        const current = get().selectedMetrics;
        const updated = current.includes(metric)
          ? current.filter(m => m !== metric)
          : [...current, metric];
        
        set({ selectedMetrics: updated });
      },

      setSelectedMetrics: (metrics: string[]) => {
        set({ selectedMetrics: metrics });
      },

      // Export functionality
      exportData: async (options: ExportOptions) => {
        try {
          set({ loading: true, error: null });
          
          const downloadUrl = await analyticsApi.exportData(options);
          
          set({ loading: false });
          return downloadUrl;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al exportar datos',
            loading: false
          });
          throw error;
        }
      },

      exportChart: async (chartId: string, format: 'png' | 'jpg' | 'svg') => {
        try {
          set({ loading: true, error: null });
          
          const downloadUrl = await analyticsApi.exportChart(chartId, format);
          
          set({ loading: false });
          return downloadUrl;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al exportar gráfico',
            loading: false
          });
          throw error;
        }
      },

      // Insights and predictions
      generateInsights: async () => {
        try {
          set({ loading: true, error: null });
          
          const insights = await analyticsApi.generateInsights(get().currentPeriod);
          
          // Update dashboard with new insights
          const dashboard = get().dashboard;
          if (dashboard) {
            set({
              dashboard: { ...dashboard, insights },
              loading: false
            });
          } else {
            set({ loading: false });
          }
          
          return insights;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al generar insights',
            loading: false
          });
          throw error;
        }
      },

      generatePredictions: async (type: AnalyticsPrediction['type']) => {
        try {
          set({ loading: true, error: null });
          
          const predictions = await analyticsApi.generatePredictions(type);
          
          // Update dashboard with new predictions
          const dashboard = get().dashboard;
          if (dashboard) {
            const updatedPredictions = [
              ...dashboard.predictions.filter(p => p.type !== type),
              ...predictions
            ];
            
            set({
              dashboard: { ...dashboard, predictions: updatedPredictions },
              loading: false
            });
          } else {
            set({ loading: false });
          }
          
          return predictions;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al generar predicciones',
            loading: false
          });
          throw error;
        }
      },

      // Goals management
      setGoal: async (type: 'monthly' | 'quarterly' | 'yearly', target: number) => {
        try {
          set({ loading: true, error: null });
          
          await analyticsApi.setGoal(type, target);
          
          // Refresh dashboard to get updated goals
          await get().fetchDashboard();
          
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al establecer meta',
            loading: false
          });
        }
      },

      updateGoalProgress: async () => {
        try {
          const goalsProgress = await analyticsApi.getGoalsProgress();
          
          const dashboard = get().dashboard;
          if (dashboard) {
            set({
              dashboard: { ...dashboard, goalsProgress }
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar progreso de metas'
          });
        }
      },

      // Utility
      clearCache: () => {
        set({ 
          cachedData: new Map(),
          lastFetch: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'analytics-store'
    }
  )
);