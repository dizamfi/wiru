// src/pages/dashboard/OrderDetailPage.tsx - VERSIÓN COMPLETA E INTEGRADA

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  EyeIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
  PrinterIcon,
  ShareIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  CameraIcon,
  ShieldCheckIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/use-toast';

// Order components
import OrderTimeline from '@/components/orders/OrderTimeline';
import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
import ShippingTracker from '@/components/orders/ShippingTracker';
import DocumentUploader from '@/components/orders/DocumentUploader';
import ValueAdjustmentModal from '@/components/orders/ValueAdjustmentModal';

// Types y hooks
import { 
  Order, 
  OrderStatus, 
  ORDER_STATUS_CONFIG, 
  DEVICE_CONDITION_CONFIG,
  VerificationInfo,
  OrderUtils
} from '@/types/order';
import { useAuth } from '@/hooks/useAuth';

// MOCK DATA COMPLETO PARA TESTING
const mockOrderDetail: Order = {
  id: 'order-123',
  orderNumber: 'ORD-2024-001234',
  userId: 'user-1',
  status: 'in_verification',
  paymentStatus: 'pending',
  items: [
    {
      id: 'item-1',
      orderId: 'order-123',
      categoryId: 'laptops',
      deviceName: 'MacBook Pro 13"',
      brand: 'Apple',
      model: 'MacBook Pro 2020',
      description: 'Laptop en excelente estado funcional. Batería mantiene buena capacidad. Ligeras marcas de uso normal en la carcasa que no afectan el funcionamiento.',
      condition: 'good',
      estimatedWeight: 1.4,
      actualWeight: 1.37,
      estimatedValue: 850.00,
      actualValue: 820.00,
      hasCharger: true,
      hasBox: false,
      hasDocuments: true,
      accessories: ['Cargador original MagSafe', 'Manual de usuario', 'Paño de limpieza'],
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
      ],
      verificationNotes: 'Dispositivo funcional al 100%. Batería en excelente estado (87% de capacidad). Ligeras marcas de uso en carcasa superior.',
      verifiedAt: '2024-01-17T18:00:00Z',
      verifiedBy: 'tech-specialist-1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-17T18:00:00Z'
    }
  ],
  estimatedTotal: 850.00,
  finalTotal: 820.00,
  estimatedWeight: 1.4,
  actualWeight: 1.37,
  contactInfo: {
    firstName: 'Juan Carlos',
    lastName: 'Pérez González',
    email: 'juan.perez@email.com',
    phone: '+593 99 123 4567'
  },
  shipping: {
    pickupAddress: {
      street: 'Av. 9 de Octubre 1234, Edificio Torre Azul',
      neighborhood: 'Centro Histórico',
      city: 'Guayaquil',
      state: 'Guayas',
      zipCode: '090313',
      country: 'Ecuador',
      instructions: 'Piso 3, oficina 301. Llamar al llegar. Disponible de 9AM a 6PM.'
    },
    deliveryAddress: {
      street: 'Zona Industrial Norte, Manzana 45, Solar 12',
      neighborhood: 'Parque Industrial',
      city: 'Guayaquil',
      state: 'Guayas',
      zipCode: '090514',
      country: 'Ecuador'
    },
    pickupScheduled: true,
    pickupDate: '2024-01-16T09:00:00Z',
    pickupTimeSlot: '9:00 AM - 12:00 PM',
    guideNumber: 'SRV240116001234',
    trackingNumber: 'TRK-SRV-001234',
    trackingUrl: 'https://servientrega.com/tracking/TRK-SRV-001234',
    status: 'delivered',
    estimatedDelivery: '2024-01-17T17:00:00Z',
    actualDelivery: '2024-01-17T16:45:00Z',
    shippingEvents: [
      {
        id: 'event-1',
        timestamp: '2024-01-16T09:15:00Z',
        status: 'Recolectado',
        location: 'Guayaquil Centro - Av. 9 de Octubre',
        description: 'Paquete recolectado exitosamente en la dirección indicada',
        isDelivered: false
      },
      {
        id: 'event-2',
        timestamp: '2024-01-16T14:30:00Z',
        status: 'En tránsito',
        location: 'Centro de Distribución Guayaquil',
        description: 'Paquete en proceso de clasificación y envío',
        isDelivered: false
      },
      {
        id: 'event-3',
        timestamp: '2024-01-17T16:45:00Z',
        status: 'Entregado',
        location: 'Bodega Wiru - Zona Industrial Norte',
        description: 'Paquete entregado exitosamente y recibido por personal autorizado',
        isDelivered: true
      }
    ],
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-17T16:45:00Z'
  },
  verification: {
    id: 'verification-1',
    orderId: 'order-123',
    verifiedBy: 'tech-specialist-1',
    verifiedAt: '2024-01-17T18:00:00Z',
    verifiedWeight: 1.37,
    verifiedValue: 820.00,
    photos: true,
    notes: 'Todas las especificaciones coinciden con lo declarado. Batería mantiene 87% de capacidad original.',
    adjustmentReason: 'Peso ligeramente inferior al estimado inicialmente debido a las especificaciones exactas del modelo específico.',
    requiresApproval: false,
    createdAt: '2024-01-17T17:00:00Z',
    updatedAt: '2024-01-17T18:30:00Z',
    status: 'pending',
    originalWeight: 0,
    weightVariance: 0,
    originalValue: 0,
    valueVariance: 0,
    verificationPhotos: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
    ],
    verificationNotes: ''
  },
  timeline: [
    {
      id: 'timeline-1',
      orderId: 'order-123',
      status: 'pending',
      title: 'Orden Creada',
      description: 'Tu orden ha sido creada exitosamente y está pendiente de confirmación',
      timestamp: '2024-01-15T10:00:00Z',
      actor: 'user',
      isVisible: true
    },
    {
      id: 'timeline-2',
      orderId: 'order-123',
      status: 'confirmed',
      title: 'Orden Confirmada',
      description: 'Tu orden ha sido confirmada por nuestro equipo',
      timestamp: '2024-01-15T12:30:00Z',
      actor: 'system',
      isVisible: true
    },
    {
      id: 'timeline-3',
      orderId: 'order-123',
      status: 'pickup_scheduled',
      title: 'Recolección Programada',
      description: 'Se ha programado la recolección con Servientrega',
      timestamp: '2024-01-15T14:00:00Z',
      actor: 'system',
      isVisible: true
    },
    {
      id: 'timeline-4',
      orderId: 'order-123',
      status: 'in_transit',
      title: 'En Tránsito',
      description: 'Tu orden está en camino a nuestras instalaciones',
      timestamp: '2024-01-16T09:15:00Z',
      actor: 'system',
      isVisible: true
    },
    {
      id: 'timeline-5',
      orderId: 'order-123',
      status: 'received',
      title: 'Recibido en Bodega',
      description: 'Tu orden ha llegado a nuestras instalaciones',
      timestamp: '2024-01-17T16:45:00Z',
      actor: 'system',
      isVisible: true
    },
    {
      id: 'timeline-6',
      orderId: 'order-123',
      status: 'in_verification',
      title: 'En Verificación',
      description: 'Nuestro equipo técnico está verificando tu dispositivo',
      timestamp: '2024-01-17T17:00:00Z',
      actor: 'tech-specialist-1',
      isVisible: true
    }
  ],
  notes: 'Dispositivo reportado en muy buen estado según fotos iniciales. Solicitud especial: manejar con cuidado por valor sentimental.',
  priority: 'normal',
  allowPartialValue: true,
  requirePhotos: true,
  autoAcceptVerification: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-17T18:30:00Z',
  confirmedAt: '2024-01-15T12:30:00Z'
};

// COMPONENTE PRINCIPAL
const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE MANAGEMENT
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showValueAdjustmentModal, setShowValueAdjustmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'shipping' | 'verification' | 'documents'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get success message from navigation state
  const successMessage = location.state?.message;

  // LOAD ORDER DATA ON MOUNT
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError('ID de orden no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // In real implementation: const fetchedOrder = await orderApi.getOrderById(id);
        if (id === 'order-123' || id === mockOrderDetail.id) {
          setOrder(mockOrderDetail);
        } else {
          throw new Error(`Orden con ID ${id} no encontrada`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la orden';
        setError(errorMessage);
        console.error('Error loading order:', err);
        
        toast({
          title: 'Error al cargar orden',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // EVENT HANDLERS
  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      // In real implementation: await orderApi.cancelOrder(order.id, reason);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: 'Orden cancelada',
        description: 'Tu orden ha sido cancelada exitosamente.',
        variant: 'success'
      });
      
      setShowCancelModal(false);
      navigate('/dashboard/orders');
    } catch (error) {
      toast({
        title: 'Error al cancelar',
        description: 'No se pudo cancelar la orden. Intenta nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleVerificationComplete = async (verification: VerificationInfo) => {
    if (!order) return;

    try {
      // In real implementation: await orderApi.submitVerification(order.id, verification);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedOrder = {
        ...order,
        verification,
        status: verification.requiresApproval ? 'verified' : 'payment_pending' as OrderStatus,
        finalTotal: verification.verifiedValue,
        actualWeight: verification.verifiedWeight,
        updatedAt: new Date().toISOString()
      };
      
      setOrder(updatedOrder);
      setShowVerificationModal(false);
      
      toast({
        title: 'Verificación completada',
        description: verification.requiresApproval 
          ? 'La verificación ha sido enviada para aprobación'
          : 'Los valores han sido actualizados',
        variant: 'success'
      });
    } catch (error) {
      throw error;
    }
  };

  const handleRefreshOrder = async () => {
    if (!id || isRefreshing) return;

    setIsRefreshing(true);
    try {
      // In real implementation: const refreshedOrder = await orderApi.getOrderById(id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (order) {
        const updatedOrder = {
          ...order,
          updatedAt: new Date().toISOString()
        };
        setOrder(updatedOrder);
      }
      
      toast({
        title: 'Orden actualizada',
        description: 'La información ha sido sincronizada',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar la información',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!order) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newEvent = {
        id: `event-auto-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'Actualización de sistema',
        location: 'Sistema automático',
        description: 'Información sincronizada con Servientrega',
        isDelivered: false
      };
      
      setOrder(prev => prev ? {
        ...prev,
        shipping: {
          ...prev.shipping,
          shippingEvents: [newEvent, ...prev.shipping.shippingEvents],
          updatedAt: new Date().toISOString()
        }
      } : null);
      
    } catch (error) {
      throw error;
    }
  };

  const handleDuplicateOrder = () => {
    if (!order) return;
    
    const duplicateData = {
      items: order.items.map(item => ({
        ...item,
        id: undefined,
        orderId: undefined,
        actualWeight: undefined,
        actualValue: undefined
      })),
      shipping: {
        pickupAddress: order.shipping.pickupAddress
      }
    };
    
    navigate('/sell', { 
      state: { 
        duplicateFrom: order.id,
        orderData: duplicateData,
        message: `Duplicando orden ${order.orderNumber}`
      }
    });
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleShareOrder = async () => {
    if (!order) return;
    
    const shareData = {
      title: `Orden ${order.orderNumber} - Wiru`,
      text: `Mi orden de reciclaje está en estado: ${ORDER_STATUS_CONFIG[order.status].label}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copiado',
          description: 'El enlace ha sido copiado al portapapeles',
          variant: 'success'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // RENDER HELPERS
  const renderStatusIcon = (status: OrderStatus) => {
    const config = ORDER_STATUS_CONFIG[status];
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="h-8 w-8 text-red-600" />;
      case 'in_transit':
        return <TruckIcon className="h-8 w-8 text-blue-600" />;
      case 'in_verification':
        return <ShieldCheckIcon className="h-8 w-8 text-orange-600" />;
      case 'payment_pending':
        return <BanknotesIcon className="h-8 w-8 text-purple-600" />;
      default:
        return <ClockIcon className="h-8 w-8 text-gray-600" />;
    }
  };

  const renderItemImages = (images: string[]) => (
    <div className="grid grid-cols-3 gap-2">
      {images.slice(0, 3).map((image, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={`Device ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );

  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'overview', label: 'Resumen', icon: EyeIcon },
          { id: 'timeline', label: 'Timeline', icon: ClockIcon },
          { id: 'shipping', label: 'Envío', icon: TruckIcon },
          { id: 'verification', label: 'Verificación', icon: ShieldCheckIcon },
          { id: 'documents', label: 'Documentos', icon: DocumentTextIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // LOADING STATE
  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error || !order) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="danger" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <div>
              <h3 className="font-medium">Error al cargar la orden</h3>
              <p className="text-sm mt-1">{error || 'Orden no encontrada'}</p>
            </div>
          </Alert>
          
          <div className="text-center">
            <Button onClick={() => navigate('/dashboard/orders')} variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a mis órdenes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  // MAIN RENDER
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* Breadcrumbs (rendered manually) */}
        <nav className="mb-2 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/dashboard/orders" className="hover:underline">Órdenes</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center text-gray-700">
              {order.orderNumber}
            </li>
          </ol>
        </nav>
        <PageHeader
          title={`Orden ${order.orderNumber}`}
          action={
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshOrder}
                disabled={isRefreshing}
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicateOrder}
                >
                  <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintOrder}
                  className="no-print"
                >
                  <PrinterIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareOrder}
                >
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          }
        >
          <div className="text-gray-500 text-sm mt-1">
            Creada el {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: es })}
          </div>
        </PageHeader>

        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mb-6">
            <CheckCircleIcon className="h-4 w-4" />
            <div>
              <p className="font-medium">¡Operación exitosa!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </Alert>
        )}

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Order Status Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        {renderStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-semibold">Estado Actual</h3>
                          <Badge variant={statusConfig.color as any}>
                            {statusConfig.label}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {statusConfig.description}
                          </p>
                        </div>
                      </div>
                      
                      {order.shipping.trackingNumber && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Número de seguimiento</p>
                          <p className="font-mono text-sm font-medium">
                            {order.shipping.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso</span>
                        <span>{OrderUtils.getStatusProgress(order.status)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${OrderUtils.getProgressColor(order.status)}`}
                          style={{ width: `${OrderUtils.getStatusProgress(order.status)}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'in_verification' && (
                        <Button 
                          size="sm" 
                          onClick={() => setShowVerificationModal(true)}
                        >
                          <ShieldCheckIcon className="h-4 w-4 mr-2" />
                          Ver Verificación
                        </Button>
                      )}
                      
                      {order.verification && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowValueAdjustmentModal(true)}
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Ajustar Valores
                        </Button>
                      )}
                      
                      {OrderUtils.canTransitionTo(order.status, 'cancelled') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowCancelModal(true)}
                        >
                          <XCircleIcon className="h-4 w-4 mr-2" />
                          Cancelar Orden
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Items Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Dispositivos</h3>
                    
                    {order.items.map((item, index) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 mb-4 last:mb-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Item Info */}
                          <div className="md:col-span-2">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.brand} {item.deviceName}
                                </h4>
                                <p className="text-sm text-gray-600">{item.model}</p>
                              </div>
                              <Badge variant={DEVICE_CONDITION_CONFIG[item.condition].color as any}>
                                {DEVICE_CONDITION_CONFIG[item.condition].label}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                            
                            {/* Item Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Peso estimado:</span>
                                <span className="ml-2 font-medium">{item.estimatedWeight} kg</span>
                                {item.actualWeight && (
                                  <>
                                    <br />
                                    <span className="text-gray-600">Peso real:</span>
                                    <span className="ml-2 font-medium text-green-600">
                                      {item.actualWeight} kg
                                    </span>
                                  </>
                                )}
                              </div>
                              <div>
                                <span className="text-gray-600">Valor estimado:</span>
                                <span className="ml-2 font-medium">${item.estimatedValue.toFixed(2)}</span>
                                {item.actualValue && (
                                  <>
                                    <br />
                                    <span className="text-gray-600">Valor real:</span>
                                    <span className="ml-2 font-medium text-green-600">
                                      ${item.actualValue.toFixed(2)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Accessories */}
                            {item.accessories && item.accessories.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-1">Accesorios incluidos:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.accessories.map((accessory, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {accessory}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Verification Notes */}
                            {item.verificationNotes && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Notas de verificación:</strong> {item.verificationNotes}
                                </p>
                                {item.verifiedAt && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    Verificado el {format(new Date(item.verifiedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Item Images */}
                          <div>
                            {item.images && item.images.length > 0 && renderItemImages(item.images)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Value Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Resumen de Valores</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Valor estimado total:</span>
                        <span className="font-medium">${order.estimatedTotal.toFixed(2)}</span>
                      </div>
                      
                      {order.finalTotal && (
                        <div className="flex justify-between items-center text-green-600">
                          <span>Valor final verificado:</span>
                          <span className="font-semibold text-lg">${order.finalTotal.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Peso estimado total:</span>
                        <span>{order.estimatedWeight} kg</span>
                      </div>
                      
                      {order.actualWeight && (
                        <div className="flex justify-between items-center text-sm text-green-600">
                          <span>Peso real total:</span>
                          <span className="font-medium">{order.actualWeight} kg</span>
                        </div>
                      )}
                      
                      {order.finalTotal && order.estimatedTotal !== order.finalTotal && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Diferencia:</span>
                            <span className={order.finalTotal > order.estimatedTotal ? 'text-green-600' : 'text-red-600'}>
                              {order.finalTotal > order.estimatedTotal ? '+' : ''}
                              ${(order.finalTotal - order.estimatedTotal).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Timeline de la Orden</h3>
                  <OrderTimeline 
                    timeline={order.timeline}
                    currentStatus={order.status}
                    showAllEvents={true}
                  />
                </CardContent>
              </Card>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Información de Envío</h3>
                  <ShippingTracker 
                    shipping={order.shipping}
                    orderId={order.id}
                    onTrackingUpdate={handleTrackingUpdate} orderStatus={'in_verification'}                  />
                </CardContent>
              </Card>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Verificación Técnica</h3>
                  
                  {order.verification ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Información de Verificación</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Verificado por:</span>
                              <span className="ml-2 font-medium">{order.verification.verifiedBy}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Fecha:</span>
                              <span className="ml-2">
                                {order.verification.verifiedAt
                                  ? format(new Date(order.verification.verifiedAt), 'dd/MM/yyyy HH:mm', { locale: es })
                                  : 'Fecha no disponible'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Peso verificado:</span>
                              <span className="ml-2 font-medium">{order.verification.verifiedWeight} kg</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Valor verificado:</span>
                              <span className="ml-2 font-medium text-green-600">
                                ${order.verification.verifiedValue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {Array.isArray(order.verification.photos) && order.verification.photos.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Fotos de Verificación</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {order.verification.photos.map((photo, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                  <img 
                                    src={photo} 
                                    alt={`Verificación ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {order.verification.notes && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Notas del Técnico</h4>
                          <p className="text-sm text-blue-800">{order.verification.notes}</p>
                        </div>
                      )}
                      
                      {order.verification.adjustmentReason && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-900 mb-2">Razón de Ajuste</h4>
                          <p className="text-sm text-yellow-800">{order.verification.adjustmentReason}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShieldCheckIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Pendiente de Verificación
                      </h4>
                      <p className="text-gray-600">
                        Tu orden aún no ha sido verificada por nuestro equipo técnico.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Documentos y Archivos</h3>
                  <DocumentUploader 
                    orderId={order.id}
                    allowedTypes={['pdf', 'jpg', 'png', 'jpeg']}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información Rápida</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">
                        {order.contactInfo.firstName} {order.contactInfo.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{order.contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Dirección</p>
                      <p className="font-medium text-sm">
                        {order.shipping.pickupAddress.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping.pickupAddress.city}, {order.shipping.pickupAddress.state}
                      </p>
                    </div>
                  </div>
                  
                  {order.shipping.pickupScheduled && (
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Recolección programada</p>
                        <p className="font-medium">
                          {format(new Date(order.shipping.pickupDate!), 'dd/MM/yyyy', { locale: es })}
                        </p>
                        <p className="text-sm text-gray-600">{order.shipping.pickupTimeSlot}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Tracker */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Seguimiento de Estado</h3>
                <OrderStatusTracker 
                  currentStatus={order.status}
                />
              </CardContent>
            </Card>

            {/* Notes Card */}
            {order.notes && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Notas Adicionales</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Priority Badge */}
            {order.priority && order.priority !== 'normal' && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Prioridad</p>
                      <Badge variant={order.priority === 'high' ? 'warning' : 'danger'}>
                        {order.priority === 'high' ? 'Alta' : 
                         order.priority === 'urgent' ? 'Urgente' : 'Baja'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Acciones</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => window.open(`tel:${order.contactInfo.phone}`)}
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Llamar Cliente
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => window.open(`mailto:${order.contactInfo.email}`)}
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Enviar Email
                  </Button>
                  
                  {order.shipping.trackingUrl && (
                    <Button 
                      variant="outline" 
                      fullWidth
                      onClick={() => window.open(order.shipping.trackingUrl, '_blank')}
                    >
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Rastrear Envío
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        {showCancelModal && (
          <Modal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            title="Cancelar Orden"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                >
                  Confirmar Cancelación
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {showValueAdjustmentModal && order && (
          <ValueAdjustmentModal
            order={order}
            isOpen={showValueAdjustmentModal}
            onClose={() => setShowValueAdjustmentModal(false)}
            // onAdjustmentComplete={(updatedOrder) => {
            //   setOrder(updatedOrder);
            //   toast({
            //     title: 'Valores actualizados',
            //     description: 'Los valores de la orden han sido ajustados exitosamente',
            //     variant: 'success'
            //   });
            // }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;