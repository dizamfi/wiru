// src/components/analytics/AnalyticsOverview.tsx
import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ScaleIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PresentationChartBarIcon,
  LightBulbIcon,
  FireIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { AnalyticsDashboard, ComparisonData } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface AnalyticsOverviewProps {
  dashboard: AnalyticsDashboard | null;
  comparison: ComparisonData | null;
  loading: boolean;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  dashboard,
  comparison,
  loading
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} ton`;
    }
    return `${weight.toFixed(1)} kg`;
  };

  const getTrendIcon = (growthRate: number) => {
    if (growthRate > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (growthRate < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return <ChartBarIcon className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (growthRate: number) => {
    if (growthRate > 0) return 'text-green-600';
    if (growthRate < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getPercentileText = (percentile: number) => {
    if (percentile >= 90) return 'Top 10%';
    if (percentile >= 75) return 'Top 25%';
    if (percentile >= 50) return 'Top 50%';
    return 'En crecimiento';
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-purple-100 text-purple-800';
    if (percentile >= 75) return 'bg-blue-100 text-blue-800';
    if (percentile >= 50) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading && !dashboard) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton height={20} className="mb-2" />
              <Skeleton height={32} className="mb-2" />
              <Skeleton height={16} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dashboard) return null;

  const overviewCards = [
    {
      title: 'Ganancias Totales',
      value: formatCurrency(dashboard.earnings.total),
      trend: dashboard.earnings.growthRate,
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      color: 'primary',
      subtitle: `Promedio: ${formatCurrency(dashboard.earnings.averageOrderValue)}`
    },
    {
      title: 'Órdenes Completadas',
      value: dashboard.orders.completed,
      trend: dashboard.orders.growthRate,
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      color: 'blue',
      subtitle: `${dashboard.orders.total} total este período`
    },
    {
      title: 'Peso Reciclado',
      value: formatWeight(dashboard.environmental.totalWeight),
      trend: dashboard.environmental.previousWeight ? 
        ((dashboard.environmental.totalWeight - dashboard.environmental.previousWeight) / dashboard.environmental.previousWeight * 100) : 0,
      icon: <ScaleIcon className="h-6 w-6" />,
      color: 'green',
      subtitle: `CO₂ ahorrado: ${dashboard.environmental.co2Saved.toFixed(1)} kg`
    },
    {
      title: 'Referidos Activos',
      value: dashboard.referrals.activeReferrals,
      trend: dashboard.referrals.previousEarnings > 0 ? 
        ((dashboard.referrals.earnings - dashboard.referrals.previousEarnings) / dashboard.referrals.previousEarnings * 100) : 0,
      icon: <UserGroupIcon className="h-6 w-6" />,
      color: 'purple',
      subtitle: `${dashboard.referrals.totalReferrals} total referidos`
    }
  ];

  const environmentalCards = [
    {
      title: 'Árboles Equivalentes',
      value: dashboard.environmental.treesEquivalent.toFixed(1),
      icon: <PresentationChartBarIcon className="h-6 w-6 text-green-600" />,
      subtitle: 'árboles plantados'
    },
    {
      title: 'Energía Ahorrada',
      value: `${dashboard.environmental.energySaved.toFixed(0)} kWh`,
      icon: <LightBulbIcon className="h-6 w-6 text-yellow-600" />,
      subtitle: 'equivalente en electricidad'
    },
    {
      title: 'Puntuación de Impacto',
      value: `${dashboard.environmental.impactScore}/100`,
      icon: <FireIcon className="h-6 w-6 text-orange-600" />,
      subtitle: 'tu huella ambiental'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Main Metrics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Métricas Principales</h2>
          {comparison && (
            <Badge className={getPercentileColor(comparison.userRank.percentile)}>
              {getPercentileText(comparison.userRank.percentile)}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${card.color}-100`}>
                    <div className={`text-${card.color}-600`}>
                      {card.icon}
                    </div>
                  </div>
                  {getTrendIcon(card.trend)}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                    <span className={`text-xs font-medium ${getTrendColor(card.trend)}`}>
                      {card.trend > 0 ? '+' : ''}{card.trend.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Impacto Ambiental</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {environmentalCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Comparison */}
      {comparison && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Comparativa de Rendimiento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">vs. Promedio Industrial</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ganancias por kg</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(dashboard.earnings.total / dashboard.environmental.totalWeight)}
                      </span>
                      <span className="text-xs text-gray-500">
                        (vs {formatCurrency(comparison.industry.averageEarningsPerKg)})
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Órdenes/mes</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dashboard.orders.total}</span>
                      <span className="text-xs text-gray-500">
                        (vs {comparison.industry.averageOrdersPerMonth})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Ranking Nacional</h3>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600 mb-2">
                    #{comparison.userRank.earningsRank}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    de {comparison.userRank.totalUsers.toLocaleString()} usuarios
                  </p>
                  <Badge className={getPercentileColor(comparison.userRank.percentile)}>
                    Percentil {comparison.userRank.percentile.toFixed(0)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Región: {comparison.regional.region}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tu promedio</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(dashboard.earnings.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Promedio regional</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(comparison.regional.averageEarnings)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-center text-gray-500">
                      {comparison.regional.userCount} usuarios activos en la región
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};