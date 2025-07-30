// src/components/analytics/DeviceBreakdown.tsx
import React, { useState } from 'react';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DeviceCategory } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface DeviceBreakdownProps {
  categories: DeviceCategory[];
  loading: boolean;
}

export const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({
  categories,
  loading
}) => {
  const [viewType, setViewType] = useState<'chart' | 'list'>('chart');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getDeviceIcon = (categoryId: string) => {
    const iconClass = "h-6 w-6";
    switch (categoryId) {
      case 'smartphones':
        return <DevicePhoneMobileIcon className={`${iconClass} text-blue-600`} />;
      case 'laptops':
        return <ComputerDesktopIcon className={`${iconClass} text-green-600`} />;
      case 'tablets':
        return <DeviceTabletIcon className={`${iconClass} text-purple-600`} />;
      default:
        return <CpuChipIcon className={`${iconClass} text-gray-600`} />;
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Prepare data for charts
  const chartData = categories.map((category, index) => ({
    ...category,
    fill: colors[index % colors.length]
  }));

  // Calculate totals
  const totals = categories.reduce((acc, category) => ({
    totalEarnings: acc.totalEarnings + category.earnings,
    totalWeight: acc.totalWeight + category.totalWeight,
    totalCount: acc.totalCount + category.count
  }), { totalEarnings: 0, totalWeight: 0, totalCount: 0 });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton width={200} height={24} />
            <Skeleton width={100} height={32} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton height={300} />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={80} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Desglose por Dispositivos
            </h3>
            <p className="text-sm text-gray-500">
              Análisis detallado por categoría de dispositivos
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewType === 'chart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('chart')}
            >
              Gráfico
            </Button>
            <Button
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('list')}
            >
              Lista
            </Button>
            {viewType === 'chart' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
                leftIcon={<EyeIcon className="h-4 w-4" />}
              >
                {chartType === 'bar' ? 'Circular' : 'Barras'}
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 mb-1">Total Ganancias</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(totals.totalEarnings)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 mb-1">Total Peso</p>
            <p className="text-xl font-bold text-green-700">
              {totals.totalWeight.toFixed(1)} kg
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-600 mb-1">Total Dispositivos</p>
            <p className="text-xl font-bold text-purple-700">
              {totals.totalCount}
            </p>
          </div>
        </div>

        {/* Content */}
        {viewType === 'chart' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                {chartType === 'bar' ? 'Ganancias por Categoría' : 'Distribución de Ganancias'}
              </h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-sm text-blue-600">
                                  Ganancias: <span className="font-semibold">{formatCurrency(data.earnings)}</span>
                                </p>
                                <p className="text-sm text-green-600">
                                  Peso: <span className="font-semibold">{data.totalWeight.toFixed(1)} kg</span>
                                </p>
                                <p className="text-sm text-purple-600">
                                  Dispositivos: <span className="font-semibold">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="earnings" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => 
                          `${name}: ${formatCurrency(value ?? 0)} (${((percent ?? 0) * 100).toFixed(1)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="earnings"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [formatCurrency(value), 'Ganancias']}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Brands */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Marcas Más Populares</h4>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getDeviceIcon(category.id)}
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.topBrands.map((brand, index) => (
                        <Badge key={brand} variant="secondary">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Category Info */}
                  <div className="flex items-center gap-4">
                    {getDeviceIcon(category.id)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.count} dispositivos</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Ganancias</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(category.earnings)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Promedio: {formatCurrency(category.averageValue)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Peso Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      {category.totalWeight.toFixed(1)} kg
                    </p>
                    <p className="text-xs text-gray-400">
                      Promedio: {(category.totalWeight / category.count).toFixed(1)} kg/dispositivo
                    </p>
                  </div>

                  {/* Growth */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Crecimiento</p>
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(category.growthRate)}
                      <span className={`font-semibold ${getTrendColor(category.growthRate)}`}>
                        {category.growthRate > 0 ? '+' : ''}{category.growthRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center mt-2">
                      {category.topBrands.slice(0, 2).map((brand) => (
                        <Badge key={brand} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Insights */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Insights de Rendimiento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.length > 0 && (
              <>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Mejor Categoría
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {categories.reduce((prev, current) => 
                      (prev.earnings > current.earnings) ? prev : current
                    ).name}
                  </p>
                  <p className="text-xs text-green-600">
                    {formatCurrency(categories.reduce((prev, current) => 
                      (prev.earnings > current.earnings) ? prev : current
                    ).earnings)} en ganancias
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Mayor Crecimiento
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {categories.reduce((prev, current) => 
                      (prev.growthRate > current.growthRate) ? prev : current
                    ).name}
                  </p>
                  <p className="text-xs text-blue-600">
                    +{categories.reduce((prev, current) => 
                      (prev.growthRate > current.growthRate) ? prev : current
                    ).growthRate.toFixed(1)}% de crecimiento
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};