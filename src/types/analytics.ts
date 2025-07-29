// src/types/analytics.ts

export interface AnalyticsPeriod {
  value: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  label: string;
  days: number;
}

export interface DateRange {
  from: string;
  to: string;
  preset?: AnalyticsPeriod['value'];
}

export interface BaseMetric {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EarningsMetrics extends BaseMetric {
  totalEarnings: number;
  averagePerOrder: number;
  averagePerKg: number;
  projectedMonthly: number;
  currency: string;
}

export interface OrdersMetrics extends BaseMetric {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  completionRate: number;
  averageOrderValue: number;
}

export interface EnvironmentalMetrics extends BaseMetric {
  totalWeight: number; // kg reciclados
  co2Saved: number; // kg CO2 equivalente
  treesEquivalent: number; // árboles plantados equivalente
  energySaved: number; // kWh ahorrados
  waterSaved: number; // litros de agua ahorrados
}

export interface ReferralMetrics extends BaseMetric {
  totalReferrals: number;
  activeReferrals: number;
  referralEarnings: number;
  conversionRate: number;
  activationRate: number;
}

export interface DeviceCategory {
  category: string;
  count: number;
  weight: number;
  earnings: number;
  percentage: number;
  avgPricePerKg: number;
  color: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  secondaryValue?: number;
  category?: string;
}

export interface ChartData {
  earnings: TimeSeriesDataPoint[];
  orders: TimeSeriesDataPoint[];
  weight: TimeSeriesDataPoint[];
  referrals: TimeSeriesDataPoint[];
}

export interface TopPerformance {
  bestDay: {
    date: string;
    earnings: number;
    orders: number;
  };
  bestWeek: {
    weekStart: string;
    earnings: number;
    orders: number;
  };
  bestMonth: {
    month: string;
    earnings: number;
    orders: number;
  };
  bestCategory: DeviceCategory;
}

export interface GoalsProgress {
  monthly: {
    target: number;
    current: number;
    percentage: number;
    remainingDays: number;
    onTrack: boolean;
  };
  quarterly: {
    target: number;
    current: number;
    percentage: number;
    remainingDays: number;
    onTrack: boolean;
  };
  yearly: {
    target: number;
    current: number;
    percentage: number;
    remainingDays: number;
    onTrack: boolean;
  };
}

export interface AnalyticsDashboard {
  period: DateRange;
  lastUpdated: string;
  
  // Core metrics
  earnings: EarningsMetrics;
  orders: OrdersMetrics;
  environmental: EnvironmentalMetrics;
  referrals: ReferralMetrics;
  
  // Charts data
  charts: ChartData;
  
  // Breakdowns
  deviceCategories: DeviceCategory[];
  topPerformance: TopPerformance;
  goalsProgress: GoalsProgress;
  
  // Trends and insights
  insights: AnalyticsInsight[];
  predictions: AnalyticsPrediction[];
}

export interface AnalyticsInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric: string;
  value: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations?: string[];
  icon?: string;
}

export interface AnalyticsPrediction {
  id: string;
  type: 'earnings' | 'orders' | 'environmental' | 'referrals';
  title: string;
  description: string;
  predictedValue: number;
  confidence: number; // 0-100
  timeframe: string;
  methodology: string;
}

export interface ComparisonData {
  industry: {
    averageEarningsPerKg: number;
    averageOrdersPerMonth: number;
    averageUserRetention: number;
  };
  userRank: {
    earningsRank: number;
    ordersRank: number;
    environmentalRank: number;
    totalUsers: number;
    percentile: number;
  };
  regional: {
    region: string;
    averageEarnings: number;
    averageOrders: number;
    userCount: number;
  };
}

export interface AdvancedAnalytics {
  cohortAnalysis: CohortData;
  retention: RetentionData;
  seasonality: SeasonalityData;
  profitability: ProfitabilityData;
}

export interface CohortData {
  cohorts: Array<{
    month: string;
    size: number;
    retentionRates: number[]; // por mes
  }>;
  averageRetention: number[];
}

export interface RetentionData {
  daily: number[];
  weekly: number[];
  monthly: number[];
  currentStreak: number;
  longestStreak: number;
}

export interface SeasonalityData {
  monthlyPattern: Array<{
    month: string;
    avgEarnings: number;
    avgOrders: number;
    index: number; // 1.0 = average
  }>;
  weeklyPattern: Array<{
    dayOfWeek: string;
    avgEarnings: number;
    avgOrders: number;
    index: number;
  }>;
  trends: {
    peakSeason: string;
    lowSeason: string;
    growthRate: number;
  };
}

export interface ProfitabilityData {
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  breakdownByCategory: Array<{
    category: string;
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
  }>;
  trends: TimeSeriesDataPoint[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'png' | 'jpg';
  sections: string[];
  dateRange: DateRange;
  includeCharts: boolean;
  includeRawData: boolean;
  includeInsights: boolean;
}

export interface AnalyticsFilter {
  dateRange: DateRange;
  categories?: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  includeReferrals?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'quarter';
}

// Store types
export interface AnalyticsState {
  // Dashboard data
  dashboard: AnalyticsDashboard | null;
  comparison: ComparisonData | null;
  advanced: AdvancedAnalytics | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Filters
  currentPeriod: DateRange;
  selectedMetrics: string[];
  chartType: 'line' | 'bar' | 'area' | 'pie';
  
  // Cache
  cachedData: Map<string, any>;
  lastFetch: string | null;
}

export interface AnalyticsActions {
  // Data fetching
  fetchDashboard: (period?: DateRange) => Promise<void>;
  fetchComparison: () => Promise<void>;
  fetchAdvanced: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Period management
  setPeriod: (period: DateRange) => void;
  setPresetPeriod: (preset: AnalyticsPeriod['value']) => void;
  
  // Chart configuration
  setChartType: (type: AnalyticsState['chartType']) => void;
  toggleMetric: (metric: string) => void;
  setSelectedMetrics: (metrics: string[]) => void;
  
  // Export functionality
  exportData: (options: ExportOptions) => Promise<string>;
  exportChart: (chartId: string, format: 'png' | 'jpg' | 'svg') => Promise<string>;
  
  // Insights and predictions
  generateInsights: () => Promise<AnalyticsInsight[]>;
  generatePredictions: (type: AnalyticsPrediction['type']) => Promise<AnalyticsPrediction[]>;
  
  // Goals management
  setGoal: (type: 'monthly' | 'quarterly' | 'yearly', target: number) => Promise<void>;
  updateGoalProgress: () => Promise<void>;
  
  // Utility
  clearCache: () => void;
  clearError: () => void;
  reset: () => void;
}

// Chart configuration types
export interface ChartConfig {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'doughnut' | 'radar';
  data: any;
  options: any;
  responsive: boolean;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'insight' | 'goal' | 'comparison';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  config: any;
  visible: boolean;
}

// API response types
export interface AnalyticsResponse<T = any> {
  data: T;
  meta: {
    period: DateRange;
    generatedAt: string;
    version: string;
    cacheKey?: string;
  };
}

export interface InsightResponse {
  insights: AnalyticsInsight[];
  meta: {
    algorithmsUsed: string[];
    confidence: number;
    generatedAt: string;
  };
}

export interface PredictionResponse {
  predictions: AnalyticsPrediction[];
  meta: {
    model: string;
    accuracy: number;
    lastTrained: string;
    dataPoints: number;
  };
}