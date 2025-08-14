// src/components/dashboard/EnhancedStatsGrid.tsx
import React from 'react';
import { Card, CardContent, Badge } from '@/components/ui';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClipboardDocumentListIcon,
  ScaleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    text: string;
    icon: string;
  };
  onClick?: () => void;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'secondary';
  };
  description?: string;
}

interface EnhancedStatsGridProps {
  stats: StatItem[];
  className?: string;
}

export const EnhancedStatsGrid: React.FC<EnhancedStatsGridProps> = ({ 
  stats, 
  className = '' 
}) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className={`transition-all duration-200 hover:shadow-lg group ${
            stat.onClick ? 'cursor-pointer hover:scale-105' : ''
          }`}
          onClick={stat.onClick}
        >
          <CardContent className="p-6">
            {/* Header con icono y badge */}
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color.bg} transition-transform group-hover:scale-110`}>
                <stat.icon className={`h-6 w-6 ${stat.color.icon}`} />
              </div>
              {stat.badge && (
                <Badge variant={stat.badge.variant} className="text-xs">
                  {stat.badge.text}
                </Badge>
              )}
            </div>

            {/* Título */}
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </h3>

            {/* Valor principal */}
            <p className={`text-3xl font-bold ${stat.color.text} mb-2`}>
              {stat.value}
            </p>

            {/* Descripción adicional */}
            {stat.description && (
              <p className="text-xs text-gray-500 mb-3">
                {stat.description}
              </p>
            )}

            {/* Cambio/Tendencia */}
            {stat.change && (
              <div className="flex items-center">
                {getTrendIcon(stat.change.trend)}
                <span className={`text-sm ml-1 ${getTrendColor(stat.change.trend)}`}>
                  {stat.change.value}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {stat.change.period}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Hook para generar estadísticas del dashboard
export const useDashboardStats = (userStats: any) => {
  const stats: StatItem[] = [
    {
      id: 'active_orders',
      title: 'Órdenes Activas',
      value: userStats?.activeOrders || 0,
      change: {
        value: '+2',
        trend: 'up',
        period: 'esta semana'
      },
      icon: ClipboardDocumentListIcon,
      color: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        icon: 'text-blue-600'
      },
      onClick: () => window.location.href = '/orders',
      badge: userStats?.activeOrders > 0 ? {
        text: 'Activo',
        variant: 'warning' as const
      } : undefined
    },
    {
      id: 'kg_recycled',
      title: 'Kg Reciclados',
      value: `${userStats?.kgRecycled || 0} kg`,
      change: {
        value: '+12.3 kg',
        trend: 'up',
        period: 'este mes'
      },
      icon: ScaleIcon,
      color: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: 'text-green-600'
      },
      onClick: () => window.location.href = '/stats',
      description: 'Contribuyendo al medio ambiente'
    },
    {
      id: 'completed_orders',
      title: 'Órdenes Completadas',
      value: userStats?.completedOrders || 0,
      change: {
        value: '85% tasa de éxito',
        trend: 'neutral',
        period: ''
      },
      icon: CheckCircleIcon,
      color: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        icon: 'text-purple-600'
      },
      badge: {
        text: 'Excelente',
        variant: 'success' as const
      }
    },
    {
      id: 'referrals',
      title: 'Referidos Activos',
      value: userStats?.referrals || 0,
      change: {
        value: '+3',
        trend: 'up',
        period: 'este mes'
      },
      icon: UsersIcon,
      color: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        icon: 'text-orange-600'
      },
      onClick: () => window.location.href = '/referrals',
      description: 'Gana puntos extra invitando amigos'
    }
  ];

  return stats;
};