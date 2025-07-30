// src/components/analytics/EarningsChart.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { Card, CardContent, Button, Select, Badge } from '@/components/ui';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { TimeSeriesDataPoint, DateRange, ChartProps } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface EarningsChartProps extends Omit<ChartProps, 'data'> {
  data: TimeSeriesDataPoint[];
  type: 'line' | 'bar' | 'area';
  period: DateRange;
  loading?: boolean;
  metric?: string;
  showComparison?: boolean;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({
  data,
  type,
  period,
  loading = false,
  metric = 'earnings',
  showComparison = false,
  height = 300
}) => {
  const [showTrendLine, setShowTrendLine] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(metric);

  // Format values based on metric type
  const formatValue = useCallback((value: number, metricType: string) => {
    switch (metricType) {
      case 'earnings':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'orders':
        return value.toString();
      case 'weight':
        return `${value.toFixed(1)} kg`;
      default:
        return value.toFixed(2);
    }
  }, []);

  // Get chart color based on metric
  const getChartColor = useCallback((metricType: string) => {
    const colors = {
      earnings: '#3B82F6', // blue
      orders: '#10B981',   // green
      weight: '#8B5CF6',   // purple
      referrals: '#F59E0B' // amber
    };
    return colors[metricType as keyof typeof colors] || '#6B7280';
  }, []);

  // Calculate trend line
  const calculateTrend = useCallback((points: TimeSeriesDataPoint[], index: number) => {
    if (points.length < 2) return null;
    
    const slope = (points[points.length - 1].value - points[0].value) / (points.length - 1);
    return points[0].value + slope * index;
  }, []);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((point, index) => ({
      ...point,
      index,
      trend: showTrendLine ? calculateTrend(data, index) : null,
      formatted: formatValue(point.value, selectedMetric),
      percentage: index > 0 ? 
        ((point.value - data[index - 1].value) / data[index - 1].value * 100) : 0
    }));
  }, [data, showTrendLine, selectedMetric, calculateTrend, formatValue]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    const values = chartData.map(d => d.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const latest = values[values.length - 1];
    const previous = values[values.length - 2] || latest;
    const change = previous > 0 ? ((latest - previous) / previous * 100) : 0;

    return {
      total: formatValue(total, selectedMetric),
      average: formatValue(average, selectedMetric),
      max: formatValue(max, selectedMetric),
      min: formatValue(min, selectedMetric),
      change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  }, [chartData, selectedMetric, formatValue]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Valor: <span className="font-semibold">{data.formatted}</span>
          </p>
          {data.percentage !== 0 && (
            <p className={`text-xs ${data.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.percentage > 0 ? '+' : ''}{data.percentage.toFixed(1)}% vs anterior
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const color = getChartColor(selectedMetric);

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${selectedMetric})`}
            />
            {showTrendLine && (
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={color}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            {showTrendLine && (
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        );
    }
  };

  const metricOptions = [
    { value: 'earnings', label: 'Ganancias' },
    { value: 'orders', label: 'Órdenes' },
    { value: 'weight', label: 'Peso' },
    { value: 'referrals', label: 'Referidos' }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton width={200} height={24} />
            <Skeleton width={100} height={32} />
          </div>
          <Skeleton height={height} />
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
              {selectedMetric === 'earnings' ? 'Ganancias' : 
               selectedMetric === 'orders' ? 'Órdenes' :
               selectedMetric === 'weight' ? 'Peso Reciclado' : 'Referidos'} por Período
            </h3>
            <p className="text-sm text-gray-500">
              {period.from} - {period.to}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select
              value={selectedMetric}
              onChange={(value) => setSelectedMetric(String(value))}
              options={metricOptions}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrendLine(!showTrendLine)}
              leftIcon={showTrendLine ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            >
              Tendencia
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="font-semibold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Promedio</p>
              <p className="font-semibold text-gray-900">{stats.average}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Máximo</p>
              <p className="font-semibold text-gray-900">{stats.max}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Cambio</p>
              <div className="flex items-center justify-center gap-1">
                <span className={`font-semibold ${
                  stats.trend === 'up' ? 'text-green-600' : 
                  stats.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}%
                </span>
                {stats.trend === 'up' && <ArrowTrendingUpIcon className="h-3 w-3 text-green-600" />}
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div style={{ height }}>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No hay datos disponibles</p>
                <p className="text-sm text-gray-400">
                  Selecciona un período diferente o verifica tus filtros
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Legend */}
        {showTrendLine && chartData && chartData.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-0.5 rounded"
                style={{ backgroundColor: getChartColor(selectedMetric) }}
              />
              <span className="text-xs text-gray-600">Datos reales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-400 rounded opacity-75" style={{ borderTop: '1px dashed' }} />
              <span className="text-xs text-gray-600">Línea de tendencia</span>
            </div>
          </div>
        )}

        {/* Comparison Banner */}
        {showComparison && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Rendimiento vs Período Anterior</h4>
                <p className="text-xs text-blue-700">
                  {stats && stats.change > 0 ? 
                    `Estás ${stats.change.toFixed(1)}% mejor que el período anterior` :
                    stats && stats.change < 0 ?
                    `Estás ${Math.abs(stats.change).toFixed(1)}% por debajo del período anterior` :
                    'Sin cambios respecto al período anterior'
                  }
                </p>
              </div>
              <Badge 
                className={
                  stats && stats.change > 0 ? 'bg-green-100 text-green-800' :
                  stats && stats.change < 0 ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {stats?.trend === 'up' ? 'Mejorando' : 
                 stats?.trend === 'down' ? 'Declinando' : 'Estable'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};