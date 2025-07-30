// src/services/analyticsApi.ts
import {
  AnalyticsDashboard,
  ComparisonData,
  AdvancedAnalytics,
  DateRange,
  ExportOptions,
  AnalyticsInsight,
  AnalyticsPrediction,
  EarningsMetrics,
  OrdersMetrics,
  EnvironmentalMetrics,
  ReferralMetrics,
  ChartData,
  DeviceCategory,
  TopPerformance,
  GoalsProgress,
  TimeSeriesDataPoint
} from '@/types/analytics';

// Mock data para desarrollo
const generateTimeSeriesData = (days: number, baseValue: number, variance: number): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = Math.max(0, baseValue + randomVariance);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      label: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

const mockEarningsMetrics: EarningsMetrics = {
  total: 1247.50,
  previousPeriod: 980.25,
  growthRate: 27.3,
  averageOrderValue: 45.80,
  projection: 1580.00,
  breakdown: {
    sales: 1050.00,
    referrals: 135.50,
    bonuses: 62.00
  }
};

const mockOrdersMetrics: OrdersMetrics = {
  total: 28,
  previousPeriod: 22,
  growthRate: 27.3,
  averageValue: 45.80,
  completed: 26,
  pending: 2,
  cancelled: 0,
  conversionRate: 92.9
};

const mockEnvironmentalMetrics: EnvironmentalMetrics = {
  totalWeight: 84.5,
  previousWeight: 72.3,
  co2Saved: 126.8,
  treesEquivalent: 5.2,
  energySaved: 890.4,
  waterSaved: 1245.7,
  impactScore: 85.5,
  categoryBreakdown: [
    { category: 'Smartphones', weight: 12.4, percentage: 14.7 },
    { category: 'Laptops', weight: 28.9, percentage: 34.2 },
    { category: 'Tablets', weight: 18.7, percentage: 22.1 },
    { category: 'Accessories', weight: 24.5, percentage: 29.0 }
  ]
};

const mockReferralMetrics: ReferralMetrics = {
  totalReferrals: 12,
  activeReferrals: 8,
  earnings: 185.50,
  previousEarnings: 125.00,
  conversionRate: 66.7,
  tier: 'silver'
};

const mockDeviceCategories: DeviceCategory[] = [
  {
    id: 'smartphones',
    name: 'Smartphones',
    count: 15,
    totalWeight: 12.4,
    earnings: 450.75,
    averageValue: 30.05,
    growthRate: 15.2,
    topBrands: ['Apple', 'Samsung', 'Huawei']
  },
  {
    id: 'laptops',
    name: 'Laptops',
    count: 8,
    totalWeight: 28.9,
    earnings: 520.00,
    averageValue: 65.00,
    growthRate: 22.1,
    topBrands: ['Dell', 'HP', 'Lenovo']
  },
  {
    id: 'tablets',
    name: 'Tablets',
    count: 5,
    totalWeight: 18.7,
    earnings: 276.75,
    averageValue: 55.35,
    growthRate: -5.3,
    topBrands: ['iPad', 'Samsung', 'Huawei']
  }
];

const mockTopPerformance: TopPerformance = {
  bestDay: {
    date: '2024-03-15',
    earnings: 125.50,
    orders: 4
  },
  bestWeek: {
    weekStart: '2024-03-11',
    earnings: 380.25,
    orders: 11
  },
  bestMonth: {
    month: '2024-03',
    earnings: 1247.50,
    orders: 28
  },
  bestCategory: mockDeviceCategories[1] // Laptops
};

const mockGoalsProgress: GoalsProgress = {
  monthly: {
    target: 1500.00,
    current: 1247.50,
    percentage: 83.2,
    remainingDays: 8,
    onTrack: true
  },
  quarterly: {
    target: 4000.00,
    current: 3125.75,
    percentage: 78.1,
    remainingDays: 35,
    onTrack: true
  },
  yearly: {
    target: 15000.00,
    current: 8950.25,
    percentage: 59.7,
    remainingDays: 245,
    onTrack: false
  }
};

const mockInsights: AnalyticsInsight[] = [
  {
    id: 'insight_001',
    type: 'positive',
    title: 'Crecimiento en laptops',
    description: 'Las ventas de laptops han aumentado 22% este mes',
    metric: 'earnings_laptops',
    value: 22.1,
    impact: 'high',
    actionable: true,
    recommendations: [
      'Considera aumentar el stock de laptops',
      'Promociona más esta categoría'
    ],
    icon: 'trending-up'
  },
  {
    id: 'insight_002',
    type: 'warning',
    title: 'Declive en tablets',
    description: 'Las ventas de tablets han disminuido 5.3%',
    metric: 'earnings_tablets',
    value: -5.3,
    impact: 'medium',
    actionable: true,
    recommendations: [
      'Revisa los precios de tablets',
      'Considera ofertas especiales'
    ],
    icon: 'trending-down'
  },
  {
    id: 'insight_003',
    type: 'positive',
    title: 'Meta mensual en camino',
    description: 'Vas por buen camino para alcanzar tu meta mensual',
    metric: 'monthly_goal',
    value: 83.2,
    impact: 'high',
    actionable: false,
    icon: 'target'
  }
];

const mockPredictions: AnalyticsPrediction[] = [
  {
    id: 'pred_001',
    type: 'earnings',
    title: 'Proyección de ganancias',
    description: 'Basado en tendencias actuales, podrías ganar $1,580 este mes',
    predictedValue: 1580.00,
    confidence: 78,
    timeframe: 'fin de mes',
    methodology: 'Regresión lineal basada en últimas 4 semanas'
  },
  {
    id: 'pred_002',
    type: 'environmental',
    title: 'Impacto ambiental',
    description: 'Podrías reciclar 95kg más este mes',
    predictedValue: 95.0,
    confidence: 72,
    timeframe: 'fin de mes',
    methodology: 'Análisis de patrones estacionales'
  }
];

const mockComparison: ComparisonData = {
  industry: {
    averageEarningsPerKg: 14.75,
    averageOrdersPerMonth: 18,
    averageUserRetention: 67.5
  },
  userRank: {
    earningsRank: 245,
    ordersRank: 189,
    environmentalRank: 156,
    totalUsers: 1500,
    percentile: 83.7
  },
  regional: {
    region: 'Ecuador',
    averageEarnings: 890.50,
    averageOrders: 15,
    userCount: 450
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsApi = {
  // Dashboard
  getDashboard: async (period: DateRange): Promise<AnalyticsDashboard> => {
    await delay(800);
    
    const days = Math.ceil((new Date(period.to).getTime() - new Date(period.from).getTime()) / (24 * 60 * 60 * 1000));
    
    const charts: ChartData = {
      earnings: generateTimeSeriesData(Math.min(days, 90), 45, 20),
      orders: generateTimeSeriesData(Math.min(days, 90), 1.2, 0.8),
      weight: generateTimeSeriesData(Math.min(days, 90), 3.2, 1.5),
      referrals: generateTimeSeriesData(Math.min(days, 90), 0.4, 0.3)
    };

    return {
      period,
      lastUpdated: new Date().toISOString(),
      earnings: mockEarningsMetrics,
      orders: mockOrdersMetrics,
      environmental: mockEnvironmentalMetrics,
      referrals: mockReferralMetrics,
      charts,
      deviceCategories: mockDeviceCategories,
      topPerformance: mockTopPerformance,
      goalsProgress: mockGoalsProgress,
      insights: mockInsights,
      predictions: mockPredictions
    };
  },

  // Comparison data
  getComparison: async (): Promise<ComparisonData> => {
    await delay(500);
    return mockComparison;
  },

  // Advanced analytics
  getAdvancedAnalytics: async (period: DateRange): Promise<AdvancedAnalytics> => {
    await delay(1000);
    
    return {
      cohortAnalysis: {
        cohorts: [
          { month: '2024-01', size: 125, retentionRates: [100, 78, 65, 52] },
          { month: '2024-02', size: 156, retentionRates: [100, 82, 68, 55] },
          { month: '2024-03', size: 189, retentionRates: [100, 85, 72] }
        ],
        averageRetention: [100, 82, 68, 54]
      },
      retention: {
        daily: [100, 45, 32, 28, 25, 23, 21],
        weekly: [100, 78, 65, 58, 52],
        monthly: [100, 82, 68, 54],
        currentStreak: 15,
        longestStreak: 28
      },
      seasonality: {
        monthlyPattern: [
          { month: 'Ene', avgEarnings: 950, avgOrders: 18, index: 0.95 },
          { month: 'Feb', avgEarnings: 1100, avgOrders: 22, index: 1.1 },
          { month: 'Mar', avgEarnings: 1250, avgOrders: 28, index: 1.25 }
        ],
        weeklyPattern: [
          { dayOfWeek: 'Lun', avgEarnings: 35, avgOrders: 1.2, index: 0.8 },
          { dayOfWeek: 'Mar', avgEarnings: 42, avgOrders: 1.5, index: 1.0 },
          { dayOfWeek: 'Mié', avgEarnings: 48, avgOrders: 1.8, index: 1.2 },
          { dayOfWeek: 'Jue', avgEarnings: 52, avgOrders: 1.9, index: 1.3 },
          { dayOfWeek: 'Vie', avgEarnings: 45, avgOrders: 1.6, index: 1.1 },
          { dayOfWeek: 'Sáb', avgEarnings: 38, avgOrders: 1.3, index: 0.9 },
          { dayOfWeek: 'Dom', avgEarnings: 28, avgOrders: 0.9, index: 0.7 }
        ],
        trends: {
          peakSeason: 'Marzo',
          lowSeason: 'Enero',
          growthRate: 15.8
        }
      },
      profitability: {
        grossProfit: 1247.50,
        netProfit: 1185.25,
        profitMargin: 95.0,
        breakdownByCategory: [
          { category: 'Smartphones', revenue: 450.75, costs: 22.50, profit: 428.25, margin: 95.0 },
          { category: 'Laptops', revenue: 520.00, costs: 26.00, profit: 494.00, margin: 95.0 },
          { category: 'Tablets', revenue: 276.75, costs: 13.84, profit: 262.91, margin: 95.0 }
        ],
        trends: generateTimeSeriesData(30, 40, 15)
      }
    };
  },

  // Insights
  generateInsights: async (period: DateRange): Promise<AnalyticsInsight[]> => {
    await delay(1200);
    return mockInsights;
  },

  // Predictions
  generatePredictions: async (type: AnalyticsPrediction['type']): Promise<AnalyticsPrediction[]> => {
    await delay(1500);
    return mockPredictions.filter(p => p.type === type);
  },

  // Goals
  setGoal: async (type: 'monthly' | 'quarterly' | 'yearly', target: number): Promise<void> => {
    await delay(300);
    console.log(`Setting ${type} goal to ${target}`);
  },

  getGoalsProgress: async (): Promise<GoalsProgress> => {
    await delay(200);
    return mockGoalsProgress;
  },

  // Export
  exportData: async (options: ExportOptions): Promise<string> => {
    await delay(2000);
    
    // Simulate file generation and return download URL
    const filename = `analytics_${options.format}_${Date.now()}`;
    return `https://api.wiru.app/exports/${filename}.${options.format}`;
  },

  exportChart: async (chartId: string, format: 'png' | 'jpg' | 'svg'): Promise<string> => {
    await delay(1000);
    
    const filename = `chart_${chartId}_${Date.now()}`;
    return `https://api.wiru.app/exports/${filename}.${format}`;
  }
};