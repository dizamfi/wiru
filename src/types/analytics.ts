// src/types/analytics.ts

// Base types
export interface DateRange {
  from: string;
  to: string;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

export interface AnalyticsPeriod {
  label: string;
  value: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  days: number;
}

// Core metrics interfaces
export interface EarningsMetrics {
  total: number;
  previousPeriod: number;
  growthRate: number;
  averageOrderValue: number;
  projection: number;
  breakdown: {
    sales: number;
    referrals: number;
    bonuses: number;
  };
}

export interface OrdersMetrics {
  total: number;
  previousPeriod: number;
  growthRate: number;
  averageValue: number;
  completed: number;
  pending: number;
  cancelled: number;
  conversionRate: number;
}

export interface EnvironmentalMetrics {
  totalWeight: number;
  previousWeight?: number;
  co2Saved: number;
  treesEquivalent: number;
  energySaved: number; // kWh
  waterSaved: number; // liters
  impactScore: number; // 0-100
  categoryBreakdown: Array<{
    category: string;
    weight: number;
    percentage: number;
  }>;
}

export interface ReferralMetrics {
  totalReferrals: number;
  activeReferrals: number;
  earnings: number;
  previousEarnings: number;
  conversionRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

// Device and category types
export interface DeviceCategory {
  id: string;
  name: string;
  count: number;
  totalWeight: number;
  earnings: number;
  averageValue: number;
  growthRate: number;
  topBrands: string[];
}

// Chart and visualization types
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
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

// Goals and progress
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

// Main dashboard interface
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

// Insights and predictions
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

// Comparison and benchmarking
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

// Advanced analytics
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

// Export and filtering
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
  chartType: 'line' | 'bar' | 'area';
  
  // Cache
  cachedData: Map<string, any>;
  lastFetch: string | null;
}

export interface AnalyticsActions {
  // Data fetching
  fetchDashboard: (period?: DateRange) => Promise<void>;
  fetchComparison: () => Promise<void>;
  fetchAdvancedAnalytics: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  
  // Period management
  setPeriod: (period: DateRange) => void;
  setPresetPeriod: (preset: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom') => void;
  
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

// Component props types
export interface ChartProps {
  data: TimeSeriesDataPoint[];
  type: 'line' | 'bar' | 'area';
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  loading?: boolean;
  period?: DateRange;
  metric?: string;
  showComparison?: boolean;
}

export interface OverviewCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

export interface InsightCardProps {
  insight: AnalyticsInsight;
  onAction?: (insight: AnalyticsInsight) => void;
}

export interface PredictionCardProps {
  prediction: AnalyticsPrediction;
  onRefresh?: (type: AnalyticsPrediction['type']) => void;
}

export interface GoalCardProps {
  type: 'monthly' | 'quarterly' | 'yearly';
  goal: GoalsProgress['monthly'] | GoalsProgress['quarterly'] | GoalsProgress['yearly'];
  onUpdateGoal?: (type: string, target: number) => void;
}

// Form types
export interface AnalyticsFiltersForm {
  dateRange: DateRange;
  categories: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  includeReferrals: boolean;
  groupBy: 'day' | 'week' | 'month' | 'quarter';
}

export interface ExportForm {
  format: ExportOptions['format'];
  sections: string[];
  includeCharts: boolean;
  includeRawData: boolean;
  includeInsights: boolean;
  dateRange: DateRange;
}

export interface GoalForm {
  type: 'monthly' | 'quarterly' | 'yearly';
  target: number;
  description?: string;
}

// Notification and alert types
export interface AnalyticsNotification {
  id: string;
  type: 'goal_achieved' | 'insight_generated' | 'prediction_updated' | 'milestone_reached';
  title: string;
  message: string;
  data?: {
    goalType?: string;
    insightId?: string;
    predictionId?: string;
    milestone?: string;
    value?: number;
  };
  createdAt: string;
  read: boolean;
}

// Trend analysis types
export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  strength: 'strong' | 'moderate' | 'weak';
  confidence: number;
  description: string;
  factors: string[];
}

// Anomaly detection
export interface Anomaly {
  id: string;
  type: 'spike' | 'dip' | 'pattern_break' | 'outlier';
  metric: string;
  date: string;
  expectedValue: number;
  actualValue: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  possibleCauses: string[];
}

// Forecast types
export interface Forecast {
  metric: string;
  timeframe: string;
  predictions: Array<{
    date: string;
    value: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }>;
  accuracy: number;
  methodology: string;
}

// Report types
export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'executive' | 'custom';
  period: DateRange;
  sections: string[];
  generatedAt: string;
  downloadUrl?: string;
  status: 'generating' | 'ready' | 'expired';
  format: 'pdf' | 'excel' | 'html';
}

// Widget configuration for dashboard
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'calendar';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: {
    metric?: string;
    chartType?: 'line' | 'bar' | 'pie' | 'area';
    timeframe?: string;
    filters?: AnalyticsFilter;
    customization?: Record<string, any>;
  };
  isVisible: boolean;
}

// Dashboard layout
export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Performance metrics
export interface PerformanceMetrics {
  pageLoadTime: number;
  chartRenderTime: number;
  dataFetchTime: number;
  totalMemoryUsage: number;
  cacheHitRate: number;
}

// API response wrappers
export interface AnalyticsApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  metadata?: {
    requestId: string;
    timestamp: string;
    version: string;
    cacheable: boolean;
    ttl?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error types
export interface AnalyticsError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
}

// Theme and styling
export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    neutral: string[];
  };
  fonts: {
    family: string;
    sizes: {
      small: number;
      medium: number;
      large: number;
    };
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}