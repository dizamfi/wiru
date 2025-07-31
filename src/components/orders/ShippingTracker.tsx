// src/components/orders/ShippingTracker.tsx
import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShippingInfo, ShippingEvent, OrderStatus } from '@/types/order';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';

interface ShippingTrackerProps {
  shipping: ShippingInfo;
  orderId: string;
  orderStatus: OrderStatus;
  onTrackingUpdate?: () => void;
  showFullDetails?: boolean;
  className?: string;
}

// Configuración de estados de envío
const SHIPPING_STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: ClockIcon,
    description: 'Esperando programación de recolección'
  },
  scheduled: {
    label: 'Programado',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: ClockIcon,
    description: 'Recolección programada'
  },
  picked_up: {
    label: 'Recolectado',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    icon: TruckIcon,
    description: 'Paquete recolectado exitosamente'
  },
  in_transit: {
    label: 'En Tránsito',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: ArrowPathIcon,
    description: 'En camino al destino'
  },
  delivered: {
    label: 'Entregado',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: CheckCircleIcon,
    description: 'Entregado exitosamente'
  },
  failed: {
    label: 'Fallido',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: ExclamationTriangleIcon,
    description: 'Error en la entrega'
  }
};

const ShippingTracker: React.FC<ShippingTrackerProps> = ({
  shipping,
  orderId,
  orderStatus,
  onTrackingUpdate,
  showFullDetails = true,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showAllEvents, setShowAllEvents] = useState(false);

  const statusConfig = SHIPPING_STATUS_CONFIG[shipping.status];
  const StatusIcon = statusConfig.icon;

  // Auto-refresh cada 30 segundos si está en tránsito
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (shipping.status === 'in_transit' && onTrackingUpdate) {
      interval = setInterval(() => {
        handleRefreshTracking();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shipping.status, onTrackingUpdate]);

  const handleRefreshTracking = async () => {
    if (!onTrackingUpdate || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onTrackingUpdate();
      setLastUpdate(new Date());
      toast({
        title: 'Tracking actualizado',
        description: 'Información de envío actualizada',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el tracking',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyTrackingNumber = async () => {
    if (!shipping.guideNumber) return;
    
    try {
      await navigator.clipboard.writeText(shipping.guideNumber);
      toast({
        title: 'Copiado',
        description: 'Número de guía copiado al portapapeles',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar el número',
        variant: 'destructive'
      });
    }
  };

  const openTrackingUrl = () => {
    if (shipping.trackingUrl) {
      window.open(shipping.trackingUrl, '_blank');
    }
  };

  const formatEventDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "d MMM, HH:mm", { locale: es });
    } catch (error) {
      return timestamp;
    }
  };

  const getEventIcon = (event: ShippingEvent) => {
    if (event.isDelivered) return CheckCircleIcon;
    if (event.status.toLowerCase().includes('transit')) return ArrowPathIcon;
    if (event.status.toLowerCase().includes('recolect') || event.status.toLowerCase().includes('picked')) return TruckIcon;
    return MapPinIcon;
  };

  // Compact version for order cards
  if (!showFullDetails) {
    return (
      <div className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg ${className}`}>
        <StatusIcon className={`h-5 w-5 ${statusConfig.textColor}`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{statusConfig.label}</p>
          {shipping.guideNumber && (
            <p className="text-xs text-gray-600">Guía: {shipping.guideNumber}</p>
          )}
        </div>
        {shipping.trackingUrl && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openTrackingUrl}
            className="p-2"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Eventos visibles (mostrar últimos 5 o todos)
  const eventsToShow = showAllEvents 
    ? shipping.shippingEvents 
    : shipping.shippingEvents.slice(0, 5);

  return (
    <Card className={className}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.textColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información de Envío
              </h3>
              <Badge variant="outline" className={statusConfig.textColor}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onTrackingUpdate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshTracking}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                {isRefreshing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ArrowPathIcon className="h-4 w-4" />
                )}
                <span>Actualizar</span>
              </Button>
            )}
            
            {shipping.trackingUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={openTrackingUrl}
                className="flex items-center space-x-2"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                <span>Ver en Servientrega</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status message */}
        <Alert className="mb-6">
          <StatusIcon className="h-4 w-4" />
          <div>
            <p className="font-medium">{statusConfig.description}</p>
            {shipping.estimatedDelivery && (
              <p className="text-sm text-gray-600 mt-1">
                Entrega estimada: {format(new Date(shipping.estimatedDelivery), "d 'de' MMMM", { locale: es })}
              </p>
            )}
          </div>
        </Alert>

        {/* Tracking info grid */}
        {shipping.guideNumber && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Número de Guía</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono font-medium text-gray-900">{shipping.guideNumber}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyTrackingNumber}
                    className="p-1 h-auto"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {shipping.pickupDate && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Recolección</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(shipping.pickupDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                  {shipping.pickupTimeSlot && (
                    <p className="text-sm text-gray-600">Franja: {shipping.pickupTimeSlot}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {shipping.weight && (
                <div>
                  <p className="text-sm text-gray-600">Peso del Paquete</p>
                  <p className="font-medium text-gray-900">{shipping.weight} kg</p>
                </div>
              )}
              
              {shipping.cost && (
                <div>
                  <p className="text-sm text-gray-600">Costo de Envío</p>
                  <p className="font-medium text-gray-900">${shipping.cost.toLocaleString()}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="font-medium text-gray-900">
                  {format(lastUpdate, "d MMM, HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Driver info */}
        {shipping.driverInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              Información del Conductor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium text-gray-900">{shipping.driverInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{shipping.driverInfo.phone}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`tel:${shipping.driverInfo?.phone}`)}
                    className="p-1 h-auto"
                  >
                    <PhoneIcon className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </div>
              {shipping.driverInfo.vehicleInfo && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Vehículo</p>
                  <p className="font-medium text-gray-900">{shipping.driverInfo.vehicleInfo}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2" />
              Dirección de Recolección
            </h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>{shipping.pickupAddress.street}</p>
              {shipping.pickupAddress.neighborhood && (
                <p>{shipping.pickupAddress.neighborhood}</p>
              )}
              <p>{shipping.pickupAddress.city}, {shipping.pickupAddress.state}</p>
              <p>{shipping.pickupAddress.zipCode}</p>
              {shipping.pickupAddress.instructions && (
                <p className="text-xs text-blue-600 mt-2">
                  <strong>Instrucciones:</strong> {shipping.pickupAddress.instructions}
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-3 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-2" />
              Dirección de Entrega
            </h4>
            <div className="space-y-1 text-sm text-green-800">
              <p>{shipping.deliveryAddress.street}</p>
              {shipping.deliveryAddress.neighborhood && (
                <p>{shipping.deliveryAddress.neighborhood}</p>
              )}
              <p>{shipping.deliveryAddress.city}, {shipping.deliveryAddress.state}</p>
              <p>{shipping.deliveryAddress.zipCode}</p>
            </div>
          </div>
        </div>

        {/* Shipping events timeline */}
        {shipping.shippingEvents && shipping.shippingEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Historial de Seguimiento
              </h4>
              {shipping.shippingEvents.length > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllEvents(!showAllEvents)}
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {showAllEvents ? 'Mostrar menos' : `Ver todos (${shipping.shippingEvents.length})`}
                </Button>
              )}
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-4">
                {eventsToShow
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((event, index) => {
                    const EventIcon = getEventIcon(event);
                    const isLatest = index === 0;
                    
                    return (
                      <div key={event.id} className="relative flex items-start">
                        {/* Event dot */}
                        <div className={`
                          relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-sm
                          ${event.isDelivered ? 'bg-green-500' : 
                            isLatest ? 'bg-blue-500' : 'bg-gray-300'}
                        `}>
                          <EventIcon className={`h-4 w-4 ${
                            event.isDelivered || isLatest ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>

                        {/* Event content */}
                        <div className="ml-4 flex-1 min-w-0">
                          <div className={`
                            p-3 rounded-lg border
                            ${isLatest ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
                          `}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  isLatest ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {event.status}
                                </p>
                                <p className={`text-sm mt-1 ${
                                  isLatest ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                  {event.description}
                                </p>
                                {event.location && (
                                  <p className={`text-xs mt-1 flex items-center ${
                                    isLatest ? 'text-blue-600' : 'text-gray-500'
                                  }`}>
                                    <MapPinIcon className="h-3 w-3 mr-1" />
                                    {event.location}
                                  </p>
                                )}
                              </div>
                              
                              <div className={`text-xs ${
                                isLatest ? 'text-blue-600' : 'text-gray-500'
                              }`}>
                                {formatEventDate(event.timestamp)}
                              </div>
                            </div>

                            {/* Event metadata */}
                            {event.metadata && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                  {event.metadata.driverName && (
                                    <div>
                                      <span className="font-medium">Conductor:</span>
                                      <span className="ml-1">{event.metadata.driverName}</span>
                                    </div>
                                  )}
                                  {event.metadata.receivedBy && (
                                    <div>
                                      <span className="font-medium">Recibido por:</span>
                                      <span className="ml-1">{event.metadata.receivedBy}</span>
                                    </div>
                                  )}
                                  {event.metadata.signature && (
                                    <div className="md:col-span-2">
                                      <span className="font-medium">Firma disponible</span>
                                      <CheckCircleIcon className="h-3 w-3 text-green-500 ml-1 inline" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Status-specific actions */}
        {shipping.status === 'scheduled' && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Recolección Programada
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Prepara tu equipo para la recolección. El conductor llegará en la fecha y hora programada.
                </p>
                {shipping.driverInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${shipping.driverInfo?.phone}`)}
                    className="mt-3"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Llamar al conductor
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {shipping.status === 'failed' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Error en la Entrega
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Hubo un problema con la recolección. Contacta con soporte para reprogramar.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {/* Abrir chat de soporte */}}
                >
                  Contactar Soporte
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingTracker;