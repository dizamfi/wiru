// src/components/analytics/InsightsPanel.tsx
import React, { useState } from 'react';
import { Card, CardContent, Button, Badge, Tabs , TabsContent, TabsList, TabsTrigger } from '@/components/ui';

import {
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { AnalyticsInsight, AnalyticsPrediction } from '@/types/analytics';
import Skeleton from 'react-loading-skeleton';

interface InsightsPanelProps {
  insights: AnalyticsInsight[];
  predictions: AnalyticsPrediction[];
  loading: boolean;
  onRefreshInsights?: () => void;
  onRefreshPredictions?: (type: AnalyticsPrediction['type']) => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  predictions,
  loading,
  onRefreshInsights,
  onRefreshPredictions
}) => {
  const [activeTab, setActiveTab] = useState('insights');

  const getInsightIcon = (type: AnalyticsInsight['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'positive':
        return <ArrowTrendingUpIcon className={`${iconClass} text-green-500`} />;
      case 'negative':
        return <ArrowTrendingDownIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  const getInsightColor = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getImpactBadge = (impact: AnalyticsInsight['impact']) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[impact]}>
        {impact === 'high' ? 'Alto' : impact === 'medium' ? 'Medio' : 'Bajo'} impacto
      </Badge>
    );
  };

  const getConfidenceBadge = (confidence: number) => {
    let variant = 'bg-gray-100 text-gray-800';
    if (confidence >= 80) variant = 'bg-green-100 text-green-800';
    else if (confidence >= 60) variant = 'bg-yellow-100 text-yellow-800';
    else if (confidence >= 40) variant = 'bg-orange-100 text-orange-800';
    else variant = 'bg-red-100 text-red-800';

    return (
      <Badge className={variant}>
        {confidence}% confianza
      </Badge>
    );
  };

  const formatPredictionValue = (value: number, type: AnalyticsPrediction['type']) => {
    switch (type) {
      case 'earnings':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'environmental':
        return `${value.toFixed(1)} kg`;
      case 'orders':
        return Math.round(value).toString();
      default:
        return value.toFixed(1);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton height={24} className="mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton height={20} className="mb-2" />
                <Skeleton height={16} className="mb-2" />
                <Skeleton height={12} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary-600" />
            Insights y Predicciones
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshInsights}
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
          >
            Actualizar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">
              Insights ({insights.length})
            </TabsTrigger>
            <TabsTrigger value="predictions">
              Predicciones ({predictions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-6">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <LightBulbIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay insights disponibles</p>
                <p className="text-sm text-gray-400">
                  Los insights se generan automáticamente basados en tus datos
                </p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {insight.title}
                        </h4>
                        {getImpactBadge(insight.impact)}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {insight.description}
                      </p>

                      {insight.actionable && insight.recommendations && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-600 mb-2">
                            Recomendaciones:
                          </p>
                          <ul className="space-y-1">
                            {insight.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ChevronRightIcon className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4 mt-6">
            {predictions.length === 0 ? (
              <div className="text-center py-8">
                <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay predicciones disponibles</p>
                <p className="text-sm text-gray-400">
                  Las predicciones se generan con datos históricos suficientes
                </p>
              </div>
            ) : (
              predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="p-4 rounded-lg border border-purple-200 bg-purple-50"
                >
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {prediction.title}
                        </h4>
                        {getConfidenceBadge(prediction.confidence)}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">
                        {prediction.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Valor predicho</p>
                          <p className="text-lg font-bold text-purple-700">
                            {formatPredictionValue(prediction.predictedValue, prediction.type)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Plazo</p>
                          <p className="text-sm font-medium text-gray-700">
                            {prediction.timeframe}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <p className="text-xs text-gray-500">
                          <strong>Metodología:</strong> {prediction.methodology}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefreshPredictions?.('earnings')}
              className="text-xs"
            >
              Predicción de Ganancias
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefreshPredictions?.('environmental')}
              className="text-xs"
            >
              Predicción Ambiental
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefreshPredictions?.('orders')}
              className="text-xs"
            >
              Predicción de Órdenes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};