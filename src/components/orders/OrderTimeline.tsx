// src/components/orders/OrderTimeline.tsx
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
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { OrderTimelineEvent, OrderStatus, ORDER_STATUS_CONFIG } from '@/types/order';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface OrderTimelineProps {
  timeline: OrderTimelineEvent[];
  currentStatus: OrderStatus;
  showAllEvents?: boolean;
  className?: string;
}

// Mapeo de iconos para estados
const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DocumentIcon: ComputerDesktopIcon,
  ClockIcon: ClockIcon,
  CheckCircleIcon: CheckCircleIcon,
  TruckIcon: TruckIcon,
  ArrowPathIcon: ClockIcon,
  BuildingOfficeIcon: BuildingOfficeIcon,
  MagnifyingGlassIcon: MagnifyingGlassIcon,
  CheckBadgeIcon: CheckBadgeIcon,
  BanknotesIcon: BanknotesIcon,
  SparklesIcon: SparklesIcon,
  XCircleIcon: XCircleIcon,
  ExclamationTriangleIcon: ExclamationTriangleIcon
};

// Mapeo de iconos para actores
const ACTOR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  user: UserIcon,
  system: ComputerDesktopIcon,
  admin: CheckBadgeIcon,
  driver: TruckIcon,
  verification: MagnifyingGlassIcon
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timeline,
  currentStatus,
  showAllEvents = false,
  className = ''
}) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(showAllEvents);

  // Filtrar eventos visibles
  const visibleEvents = timeline.filter(event => event.isVisible);
  const displayEvents = showAll ? visibleEvents : visibleEvents.slice(0, 5);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const formatTimelineDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "d 'de' MMMM, HH:mm", { locale: es });
    } catch (error) {
      return timestamp;
    }
  };

  const getEventIcon = (event: OrderTimelineEvent) => {
    const statusConfig = ORDER_STATUS_CONFIG[event.status];
    const IconComponent = STATUS_ICONS[statusConfig?.icon] || ClockIcon;
    return IconComponent;
  };

  const getActorIcon = (actor?: string) => {
    if (!actor) return UserIcon;
    const IconComponent = ACTOR_ICONS[actor] || UserIcon;
    return IconComponent;
  };

  const getEventColor = (event: OrderTimelineEvent, index: number) => {
    const statusConfig = ORDER_STATUS_CONFIG[event.status];
    const isCurrentOrPast = index <= displayEvents.findIndex(e => e.status === currentStatus);
    
    if (isCurrentOrPast) {
      return {
        iconBg: statusConfig?.bgColor || 'bg-gray-100',
        iconText: statusConfig?.textColor || 'text-gray-800',
        lineBg: 'bg-primary-200'
      };
    }
    
    return {
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-400',
      lineBg: 'bg-gray-200'
    };
  };

  if (!timeline || timeline.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay eventos en el timeline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Timeline de la Orden
          </h3>
          <Badge variant="outline">
            {displayEvents.length} de {visibleEvents.length} eventos
          </Badge>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline events */}
          <div className="space-y-6">
            {displayEvents.map((event, index) => {
              const isExpanded = expandedEvents.has(event.id);
              const isLast = index === displayEvents.length - 1;
              const colors = getEventColor(event, index);
              const EventIcon = getEventIcon(event);
              const ActorIcon = getActorIcon(event.actor);

              return (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 ${colors.iconBg} rounded-full border-4 border-white shadow-sm`}>
                    <EventIcon className={`h-5 w-5 ${colors.iconText}`} />
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          </div>
                          
                          {/* Time and actor */}
                          <div className="flex items-center space-x-2 text-xs text-gray-500 ml-4">
                            <ActorIcon className="h-3 w-3" />
                            <span>{formatTimelineDate(event.timestamp)}</span>
                          </div>
                        </div>

                        {/* Metadata expandible */}
                        {event.metadata && (
                          <div className="mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleEventExpansion(event.id)}
                              className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUpIcon className="h-3 w-3 mr-1" />
                                  Menos detalles
                                </>
                              ) : (
                                <>
                                  <ChevronDownIcon className="h-3 w-3 mr-1" />
                                  Más detalles
                                </>
                              )}
                            </Button>

                            {isExpanded && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="space-y-2 text-xs">
                                  {event.metadata.previousValue && (
                                    <div>
                                      <span className="font-medium text-gray-700">Valor anterior:</span>
                                      <span className="text-gray-600 ml-2">
                                        {JSON.stringify(event.metadata.previousValue)}
                                      </span>
                                    </div>
                                  )}
                                  {event.metadata.newValue && (
                                    <div>
                                      <span className="font-medium text-gray-700">Nuevo valor:</span>
                                      <span className="text-gray-600 ml-2">
                                        {JSON.stringify(event.metadata.newValue)}
                                      </span>
                                    </div>
                                  )}
                                  {event.metadata.estimatedDuration && (
                                    <div>
                                      <span className="font-medium text-gray-700">Duración estimada:</span>
                                      <span className="text-gray-600 ml-2">
                                        {event.metadata.estimatedDuration}
                                      </span>
                                    </div>
                                  )}
                                  {event.metadata.automaticAction && (
                                    <div className="flex items-center">
                                      <ComputerDesktopIcon className="h-3 w-3 text-blue-500 mr-1" />
                                      <span className="text-blue-600">Acción automática del sistema</span>
                                    </div>
                                  )}
                                  {event.metadata.nextActions && (
                                    <div>
                                      <span className="font-medium text-gray-700">Próximas acciones:</span>
                                      <ul className="mt-1 ml-2">
                                        {event.metadata.nextActions.map((action, actionIndex) => (
                                          <li key={actionIndex} className="text-gray-600">
                                            • {action}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more/less button */}
          {visibleEvents.length > 5 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                leftIcon={showAll ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              >
                {showAll ? 'Mostrar menos' : `Mostrar ${visibleEvents.length - 5} eventos más`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;