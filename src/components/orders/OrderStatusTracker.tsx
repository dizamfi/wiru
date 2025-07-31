// src/components/orders/OrderStatusTracker.tsx
import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  SparklesIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { OrderStatus, ORDER_STATUS_CONFIG, OrderUtils } from '@/types/order';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  showProgress?: boolean;
  showEstimatedTime?: boolean;
  showNextSteps?: boolean;
  compact?: boolean;
  className?: string;
  onStatusClick?: (status: OrderStatus) => void;
}

// Mapeo de iconos mejorado
const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DocumentIcon: ClockIcon,
  ClockIcon: ClockIcon,
  CheckCircleIcon: CheckCircleIcon,
  TruckIcon: TruckIcon,
  ArrowPathIcon: ArrowPathIcon,
  BuildingOfficeIcon: BuildingOfficeIcon,
  MagnifyingGlassIcon: MagnifyingGlassIcon,
  CheckBadgeIcon: CheckBadgeIcon,
  BanknotesIcon: BanknotesIcon,
  SparklesIcon: SparklesIcon,
  XCircleIcon: XCircleIcon,
  ExclamationTriangleIcon: ExclamationTriangleIcon
};

// Estados principales para mostrar en el tracker
const MAIN_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed', 
  'pickup_scheduled',
  'in_transit',
  'received',
  'in_verification',
  'verified',
  'payment_pending',
  'paid',
  'completed'
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  showProgress = true,
  showEstimatedTime = true,
  showNextSteps = true,
  compact = false,
  className = '',
  onStatusClick
}) => {
  const [hoveredStatus, setHoveredStatus] = useState<OrderStatus | null>(null);

  const currentConfig = ORDER_STATUS_CONFIG[currentStatus];
  const progress = OrderUtils.getStatusProgress(currentStatus);
  const progressColor = OrderUtils.getProgressColor(currentStatus);

  // Obtener estados para mostrar
  const statusesToShow = MAIN_STATUSES.filter(status => {
    // Siempre mostrar estados hasta el actual
    const currentIndex = MAIN_STATUSES.indexOf(currentStatus);
    const statusIndex = MAIN_STATUSES.indexOf(status);
    return statusIndex <= currentIndex + 2; // Mostrar hasta 2 estados adelante
  });

  const getStatusState = (status: OrderStatus): 'completed' | 'current' | 'upcoming' | 'skipped' => {
    const currentIndex = MAIN_STATUSES.indexOf(currentStatus);
    const statusIndex = MAIN_STATUSES.indexOf(status);
    
    if (currentStatus === 'cancelled' || currentStatus === 'rejected') {
      return statusIndex < MAIN_STATUSES.indexOf('pending') ? 'completed' : 'skipped';
    }
    
    if (statusIndex < currentIndex) return 'completed';
    if (statusIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: OrderStatus, state: string) => {
    const config = ORDER_STATUS_CONFIG[status];
    const IconComponent = STATUS_ICONS[config.icon] || ClockIcon;
    
    if (state === 'completed') {
      return <CheckCircleIconSolid className="h-5 w-5 text-white" />;
    }
    
    return <IconComponent className={`h-5 w-5 ${
      state === 'current' ? 'text-white' : 
      state === 'upcoming' ? 'text-gray-400' : 'text-gray-300'
    }`} />;
  };

  const getStatusStyles = (status: OrderStatus, state: string) => {
    const config = ORDER_STATUS_CONFIG[status];
    
    switch (state) {
      case 'completed':
        return {
          container: 'bg-green-500 border-green-500',
          text: 'text-green-700',
          bg: 'bg-green-50'
        };
      case 'current':
        return {
          container: `bg-primary-500 border-primary-500 ring-4 ring-primary-100`,
          text: 'text-primary-700',
          bg: 'bg-primary-50'
        };
      case 'upcoming':
        return {
          container: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          bg: 'bg-gray-50'
        };
      case 'skipped':
        return {
          container: 'bg-gray-100 border-gray-200',
          text: 'text-gray-400',
          bg: 'bg-gray-25'
        };
      default:
        return {
          container: 'bg-gray-200 border-gray-300',
          text: 'text-gray-500',
          bg: 'bg-gray-50'
        };
    }
  };

  const nextSteps = (() => {
    const nextStatuses = OrderUtils.getNextStatus(currentStatus);
    if (nextStatuses.length === 0) return [];
    
    return nextStatuses.map(status => ({
      status,
      label: ORDER_STATUS_CONFIG[status].label,
      description: ORDER_STATUS_CONFIG[status].userMessage || ORDER_STATUS_CONFIG[status].description
    }));
  })();

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentConfig.bgColor}`}>
          {getStatusIcon(currentStatus, 'current')}
        </div>
        <div>
          <Badge variant="outline" className={currentConfig.textColor}>
            {currentConfig.label}
          </Badge>
          {showProgress && (
            <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentConfig.bgColor}`}>
              {getStatusIcon(currentStatus, 'current')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estado Actual
              </h3>
              <Badge variant="outline" className={currentConfig.textColor}>
                {currentConfig.label}
              </Badge>
            </div>
          </div>
          
          {showProgress && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Progreso</p>
              <p className="text-2xl font-bold text-gray-900">{progress}%</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {currentConfig.userMessage || currentConfig.description}
            </p>
          </div>
        )}

        {/* Status steps */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Progreso de la orden</h4>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
            <div 
              className={`absolute top-5 left-0 h-0.5 transition-all duration-500 ${progressColor}`}
              style={{ width: `${(MAIN_STATUSES.indexOf(currentStatus) / (MAIN_STATUSES.length - 1)) * 100}%` }}
            ></div>

            {/* Status points */}
            <div className="relative flex justify-between">
              {statusesToShow.map((status, index) => {
                const state = getStatusState(status);
                const config = ORDER_STATUS_CONFIG[status];
                const styles = getStatusStyles(status, state);
                const isClickable = onStatusClick && state !== 'upcoming';

                return (
                  <Tooltip
                    key={status}
                    content={
                      <div className="text-center">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-gray-300">{config.description}</p>
                        {config.estimatedDuration && (
                          <p className="text-xs text-gray-400 mt-1">
                            Duración: {config.estimatedDuration}
                          </p>
                        )}
                      </div>
                    }
                  >
                    <div
                      className={`relative ${isClickable ? 'cursor-pointer' : ''}`}
                      onClick={() => isClickable && onStatusClick(status)}
                      onMouseEnter={() => setHoveredStatus(status)}
                      onMouseLeave={() => setHoveredStatus(null)}
                    >
                      <div 
                        className={`
                          w-10 h-10 border-2 rounded-full flex items-center justify-center
                          transition-all duration-200 ${styles.container}
                          ${hoveredStatus === status ? 'scale-110' : ''}
                          ${isClickable ? 'hover:scale-110' : ''}
                        `}
                      >
                        {getStatusIcon(status, state)}
                      </div>
                      
                      {/* Label */}
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                        <p className={`text-xs font-medium ${styles.text}`}>
                          {config.label}
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Estimated time */}
        {showEstimatedTime && currentConfig.estimatedDuration && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <ClockIcon className="h-4 w-4" />
            <span>Tiempo estimado: {currentConfig.estimatedDuration}</span>
          </div>
        )}

        {/* Next steps */}
        {showNextSteps && nextSteps.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <InformationCircleIcon className="h-4 w-4 mr-2" />
              Próximos pasos
            </h4>
            <div className="space-y-2">
              {nextSteps.map(({ status, label, description }) => (
                <div key={status} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terminal states message */}
        {OrderUtils.isTerminalStatus(currentStatus) && (
          <div className={`mt-4 p-3 rounded-lg ${
            currentStatus === 'completed' ? 'bg-green-50 text-green-800' :
            currentStatus === 'cancelled' ? 'bg-gray-50 text-gray-800' :
            'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              {currentStatus === 'completed' ? (
                <SparklesIcon className="h-5 w-5 mr-2" />
              ) : currentStatus === 'cancelled' ? (
                <XCircleIcon className="h-5 w-5 mr-2" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm font-medium">
                {currentConfig.userMessage}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusTracker;