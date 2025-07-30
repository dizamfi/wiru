// src/components/analytics/AdvancedAnalyticsModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import {
  ChartBarIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
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
  Legend,
//   HeatMap
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import Skeleton from 'react-loading-skeleton';

interface AdvancedAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedAnalyticsModal: React.FC<AdvancedAnalyticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { fetchAdvancedAnalytics, advanced, loading } = useAnalytics();
  const [activeTab, setActiveTab] = useState('cohort');

  useEffect(() => {
    if (isOpen && !advanced) {
      fetchAdvancedAnalytics();
    }
  }, [isOpen, advanced, fetchAdvancedAnalytics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading && !advanced) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Análisis Avanzado" size="xl">
        <ModalContent>
          <div className="space-y-6">
            <Skeleton height={40} />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton height={300} />
              <Skeleton height={300} />
            </div>
            <Skeleton height={200} />
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Análisis Avanzado" size="xl">
      <ModalContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Análisis Avanzado</h2>
              <p className="text-gray-600">Insights profundos sobre tu actividad de reciclaje</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAdvancedAnalytics}
                leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              >
                Actualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                leftIcon={<XMarkIcon className="h-4 w-4" />}
              >
                Cerrar
              </Button>
            </div>
          </div>

          {advanced && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="cohort">Cohortes</TabsTrigger>
                <TabsTrigger value="retention">Retención</TabsTrigger>
                <TabsTrigger value="seasonality">Estacionalidad</TabsTrigger>
                <TabsTrigger value="profitability">Rentabilidad</TabsTrigger>
              </TabsList>

              {/* Cohort Analysis */}
              <TabsContent value="cohort" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cohort Chart */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-blue-600" />
                      Análisis de Cohortes
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={advanced.cohortAnalysis.cohorts}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="size" 
                            stroke="#3B82F6" 
                            name="Usuarios nuevos"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Retention Rates */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Retención Promedio</h3>
                    <div className="space-y-3">
                      {advanced.cohortAnalysis.averageRetention.map((rate, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Mes {index + 1}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{rate.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cohort Table */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Tabla de Cohortes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Cohorte
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tamaño
                          </th>
                          {[1, 2, 3, 4].map(month => (
                            <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Mes {month}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {advanced.cohortAnalysis.cohorts.map((cohort) => (
                          <tr key={cohort.month}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {cohort.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cohort.size}
                            </td>
                            {cohort.retentionRates.map((rate, index) => (
                              <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  rate >= 80 ? 'bg-green-100 text-green-800' :
                                  rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {rate.toFixed(1)}%
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* Retention Analysis */}
              <TabsContent value="retention" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Daily Retention */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Retención Diaria</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={advanced.retention.daily.map((rate, index) => ({ day: index, rate }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Retención']} />
                          <Bar dataKey="rate" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Weekly Retention */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Retención Semanal</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={advanced.retention.weekly.map((rate, index) => ({ week: index + 1, rate }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Retención']} />
                          <Bar dataKey="rate" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Streaks */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Rachas de Actividad</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FireIcon className="h-8 w-8 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {advanced.retention.currentStreak}
                          </p>
                          <p className="text-sm text-gray-600">Racha actual</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {advanced.retention.longestStreak}
                          </p>
                          <p className="text-sm text-gray-600">Racha más larga</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Seasonality Analysis */}
              <TabsContent value="seasonality" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Patterns */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Patrones Mensuales</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={advanced.seasonality.monthlyPattern}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="avgEarnings" 
                            stroke="#8B5CF6" 
                            fill="#8B5CF6" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Weekly Patterns */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Patrones Semanales</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={advanced.seasonality.weeklyPattern}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="dayOfWeek" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="avgEarnings" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Seasonal Insights */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Insights Estacionales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CalendarDaysIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-700">
                        {advanced.seasonality.trends.peakSeason}
                      </p>
                      <p className="text-sm text-green-600">Temporada alta</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-blue-700">
                        {advanced.seasonality.trends.lowSeason}
                      </p>
                      <p className="text-sm text-blue-600">Temporada baja</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-purple-700">
                        +{advanced.seasonality.trends.growthRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-purple-600">Crecimiento anual</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Profitability Analysis */}
              <TabsContent value="profitability" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profitability Overview */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Rentabilidad General</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ganancia Bruta:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(advanced.profitability.grossProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ganancia Neta:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(advanced.profitability.netProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Margen de Ganancia:</span>
                        <span className="font-semibold text-blue-600">
                          {formatPercentage(advanced.profitability.profitMargin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profitability Trends */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">Tendencia de Rentabilidad</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={advanced.profitability.trends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10B981" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Rentabilidad por Categoría</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Ingresos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Costos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Ganancia
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Margen
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {advanced.profitability.breakdownByCategory.map((category) => (
                          <tr key={category.category}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(category.revenue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(category.costs)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {formatCurrency(category.profit)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                category.margin >= 90 ? 'bg-green-100 text-green-800' :
                                category.margin >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {formatPercentage(category.margin)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};