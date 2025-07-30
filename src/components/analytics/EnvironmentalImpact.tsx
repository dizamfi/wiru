// src/components/analytics/EnvironmentalImpact.tsx
import React, { useState } from 'react';
import { Card, CardContent, Button, ProgressBar } from '@/components/ui';
import {
  SparklesIcon,

  LightBulbIcon,
  FireIcon,
  GlobeAltIcon,
  // DropletIcon, // Removed because it's not exported
  ScaleIcon,
  ShareIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { EnvironmentalMetrics, TimeSeriesDataPoint } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface EnvironmentalImpactProps {
  metrics: EnvironmentalMetrics | undefined;
  chartData: TimeSeriesDataPoint[];
  loading: boolean;
}

export const EnvironmentalImpact: React.FC<EnvironmentalImpactProps> = ({
  metrics,
  chartData,
  loading
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'breakdown' | 'trends'>('overview');

  const impactColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  const getImpactLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 60) return { level: 'Bueno', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 40) return { level: 'Regular', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { level: 'Mejorable', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const shareImpact = () => {
    if (!metrics) return;
    
    const message = `¡He reciclado ${metrics.totalWeight.toFixed(1)}kg de electrónicos con @WiruApp! 🌱 Equivale a ${metrics.treesEquivalent.toFixed(1)} árboles plantados y ${metrics.co2Saved.toFixed(1)}kg de CO₂ ahorrado. #Reciclaje #Sostenibilidad`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi impacto ambiental con Wiru',
        text: message,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(message);
      // Toast notification would go here
    }
  };

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton height={24} className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton height={48} width={48} className="mx-auto mb-2" />
                  <Skeleton height={20} className="mb-1" />
                  <Skeleton height={16} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const impactLevel = getImpactLevel(metrics.impactScore);

  const impactCards = [
    {
      title: 'Peso Total Reciclado',
      value: `${metrics.totalWeight.toFixed(1)} kg`,
      icon: <ScaleIcon className="h-8 w-8 text-green-600" />,
      description: 'Electrónicos procesados',
      color: 'green'
    },
    {
      title: 'CO₂ Ahorrado',
      value: `${metrics.co2Saved.toFixed(1)} kg`,
      icon: <GlobeAltIcon className="h-8 w-8 text-blue-600" />,
      description: 'Emisiones evitadas',
      color: 'blue'
    },
    {
      title: 'Árboles Equivalentes',
      value: metrics.treesEquivalent.toFixed(1),
      icon: <SparklesIcon className="h-8 w-8 text-green-700" />,
      description: 'Árboles plantados equiv.',
      color: 'emerald'
    },
    {
      title: 'Energía Ahorrada',
      value: `${metrics.energySaved.toFixed(0)} kWh`,
      icon: <LightBulbIcon className="h-8 w-8 text-yellow-600" />,
      description: 'Energía conservada',
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Impact Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tu Impacto Ambiental</h2>
              <p className="text-gray-600">Contribución al medio ambiente a través del reciclaje</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {metrics.impactScore}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white ${impactLevel.textColor}`}>
                    {impactLevel.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso de Impacto</span>
              <span className="text-sm text-gray-500">{metrics.impactScore}/100</span>
            </div>
            <ProgressBar
              value={metrics.impactScore}
              max={100}
              variant={metrics.impactScore >= 80 ? 'success' : metrics.impactScore >= 60 ? 'default' : 'warning'}
              className="h-3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={shareImpact}
              leftIcon={<ShareIcon className="h-4 w-4" />}
            >
              Compartir Impacto
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Descargar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setSelectedView('breakdown')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'breakdown'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Por Categoría
          </button>
          <button
            onClick={() => setSelectedView('trends')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'trends'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tendencias
          </button>
        </div>
      </div>

      {/* Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Environmental Comparison */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Equivalencias Ambientales</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <SparklesIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      {metrics.treesEquivalent.toFixed(1)} árboles plantados
                    </p>
                    <p className="text-sm text-green-600">
                      Basado en {metrics.totalWeight.toFixed(1)}kg reciclados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <GlobeAltIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">
                      {metrics.waterSaved.toFixed(0)} litros de agua ahorrados
                    </p>
                    <p className="text-sm text-blue-600">
                      En procesos de fabricación evitados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                  <LightBulbIcon className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      {metrics.energySaved.toFixed(0)} kWh ahorrados
                    </p>
                    <p className="text-sm text-yellow-600">
                      Energía suficiente para 30 días de TV
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Progreso Mensual</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
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
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium text-gray-900">{label}</p>
                              <p className="text-sm text-green-600">
                                Peso: <span className="font-semibold">{payload[0].value?.toFixed(1)} kg</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'breakdown' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Desglose por Categoría</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Distribución de Peso</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="weight"
                      >
                        {metrics.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={impactColors[index % impactColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value.toFixed(1)} kg`, 'Peso']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Detalles por Categoría</h4>
                <div className="space-y-3">
                  {metrics.categoryBreakdown.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: impactColors[index % impactColors.length] }}
                        />
                        <span className="font-medium text-gray-900">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{category.weight.toFixed(1)} kg</p>
                        <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Trend */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tendencia de Reciclaje</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
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
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium text-gray-900">{label}</p>
                              <p className="text-sm text-green-600">
                                Peso: <span className="font-semibold">{payload[0].value?.toFixed(1)} kg</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Goals */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Metas Ambientales</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Meta de CO₂ Mensual</span>
                    <span className="text-sm text-gray-500">{metrics.co2Saved.toFixed(1)}/150 kg</span>
                  </div>
                  <ProgressBar
                    value={(metrics.co2Saved / 150) * 100}
                    max={100}
                    variant="success"
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(150 - metrics.co2Saved).toFixed(1)} kg para alcanzar la meta
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Meta de Peso Mensual</span>
                    <span className="text-sm text-gray-500">{metrics.totalWeight.toFixed(1)}/100 kg</span>
                  </div>
                  <ProgressBar
                    value={(metrics.totalWeight / 100) * 100}
                    max={100}
                    variant={metrics.totalWeight >= 80 ? 'success' : 'default'}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(100 - metrics.totalWeight).toFixed(1)} kg para alcanzar la meta
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Árboles Objetivo</span>
                    <span className="text-sm text-gray-500">{metrics.treesEquivalent.toFixed(1)}/10 árboles</span>
                  </div>
                  <ProgressBar
                    value={(metrics.treesEquivalent / 10) * 100}
                    max={100}
                    variant="success"
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(10 - metrics.treesEquivalent).toFixed(1)} árboles para alcanzar la meta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Impact Achievements */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Logros Ambientales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-green-800">Eco Warrior</span>
              </div>
              <p className="text-sm text-green-700">Has reciclado más de 50kg de electrónicos</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <GlobeAltIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-blue-800">Carbon Saver</span>
              </div>
              <p className="text-sm text-blue-700">Has evitado más de 100kg de CO₂</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <FireIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-yellow-800">Impact Champion</span>
              </div>
              <p className="text-sm text-yellow-700">Puntuación de impacto superior a 80</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};