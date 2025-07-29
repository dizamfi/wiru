import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PhotoIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { 
  Button, 
  Card, 
  CardContent, 
  Badge, 
  Alert,
  Modal,
  ModalContent,
  ModalFooter
} from '@/components/ui';
import { PageHeader } from '@/components/layout';

// Mock order data
const mockOrderDetail = {
  id: 'ORD-1234',
  orderNumber: 'ORD-1234',
  device: 'MacBook Pro 13" 2019',
  brand: 'Apple',
  model: 'A2159',
  category: 'Laptops',
  status: 'in_transit',
  estimatedValue: 850,
  actualValue: null,
  estimatedWeight: 1.8,
  actualWeight: null,
  condition: 'good',
  description: 'MacBook Pro en muy buen estado, solo algunos rayones menores en la tapa. La batería mantiene buena duración y todos los puertos funcionan correctamente. Incluye cargador original.',
  hasCharger: true,
  hasBox: false,
  hasDocuments: true,
  images: [
    '/images/orders/macbook-1.jpg',
    '/images/orders/macbook-2.jpg',
    '/images/orders/macbook-3.jpg'
  ],
  createdAt: '2025-01-20T10:30:00Z',
  updatedAt: '2025-01-21T14:20:00Z',
  trackingNumber: 'TRK123456789',
  pickupAddress: {
    street: 'Calle 123 #45-67',
    city: 'Bogotá',
    state: 'Cundinamarca',
    zipCode: '110111'
  },
  pickupDate: '2025-01-22T09:00:00Z',
  timeline: [
    {
      status: 'created',
      timestamp: '2025-01-20T10:30:00Z',
      title: 'Orden creada',
      description: 'Tu orden ha sido creada exitosamente'
    },
    {
      status: 'confirmed',
      timestamp: '2025-01-20T11:15:00Z',
      title: 'Orden confirmada',
      description: 'Hemos confirmado tu orden y programado la recolección'
    },
    {
      status: 'pickup_scheduled',
      timestamp: '2025-01-20T11:15:00Z',
      title: 'Recolección programada',
      description: 'Recolección programada para el 22 de enero a las 9:00 AM'
    },
    {
      status: 'in_transit',
      timestamp: '2025-01-21T14:20:00Z',
      title: 'En tránsito',
      description: 'Tu dispositivo está en camino a nuestras instalaciones'
    }
  ]
};

const statusConfig = {
  pending: { label: 'Pendiente', variant: 'warning' as const, icon: ClockIcon },
  confirmed: { label: 'Confirmado', variant: 'default' as const, icon: CheckCircleIcon },
  in_transit: { label: 'En tránsito', variant: 'default' as const, icon: TruckIcon },
  verified: { label: 'Verificado', variant: 'success' as const, icon: CheckCircleIcon },
  paid: { label: 'Pagado', variant: 'success' as const, icon: CheckCircleIcon },
  cancelled: { label: 'Cancelado', variant: 'danger' as const, icon: XCircleIcon }
};

const conditionLabels = {
  excellent: 'Excelente',
  good: 'Bueno',
  fair: 'Regular',
  poor: 'Malo'
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Check if we have success message from creation
  const successMessage = location.state?.message;
  const orderData = location.state?.orderData;

  const order = mockOrderDetail; // In real app, fetch by ID
  const status = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const handleCancelOrder = () => {
    // In real app, make API call to cancel
    console.log('Cancelling order', id);
    setShowCancelModal(false);
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const showTracking = ['in_transit', 'verified', 'paid'].includes(order.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Orden ${order.orderNumber}`}
        description={order.device}
        action={
          <div className="flex gap-3">
            <Link to="/orders">
              <Button variant="outline" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
                Volver a órdenes
              </Button>
            </Link>
            {canCancel && (
              <Button 
                variant="danger" 
                onClick={() => setShowCancelModal(true)}
              >
                Cancelar orden
              </Button>
            )}
          </div>
        }
      />

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success">
          <CheckCircleIcon className="h-4 w-4" />
          <div>
            <p className="font-medium">¡Orden creada exitosamente!</p>
            <p className="text-sm">{successMessage}</p>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <StatusIcon className="h-8 w-8 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold">Estado actual</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                </div>
                
                {showTracking && order.trackingNumber && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Número de seguimiento</p>
                    <p className="font-mono text-sm">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Seguimiento de la orden</h4>
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString('es', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detalles del dispositivo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Dispositivo</p>
                    <p className="font-medium">{order.device}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marca</p>
                    <p className="font-medium">{order.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modelo</p>
                    <p className="font-medium">{order.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoría</p>
                    <p className="font-medium">{order.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-medium">{conditionLabels[order.condition as keyof typeof conditionLabels]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Peso estimado</p>
                    <p className="font-medium">{order.estimatedWeight} kg</p>
                  </div>
                  {order.actualWeight && (
                    <div>
                      <p className="text-sm text-gray-600">Peso real</p>
                      <p className="font-medium">{order.actualWeight} kg</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Accesorios</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {order.hasCharger && <Badge size="sm" variant="outline">Cargador</Badge>}
                      {order.hasBox && <Badge size="sm" variant="outline">Caja</Badge>}
                      {order.hasDocuments && <Badge size="sm" variant="outline">Documentos</Badge>}
                      {!order.hasCharger && !order.hasBox && !order.hasDocuments && (
                        <span className="text-sm text-gray-500">Ninguno</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Descripción</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fotos del dispositivo</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {order.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSelectedImage(image);
                      setShowImageModal(true);
                    }}
                  >
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Haz clic en una imagen para verla en tamaño completo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Value Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Valor de la orden</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor estimado</span>
                  <span className="font-semibold text-lg">${order.estimatedValue}</span>
                </div>
                
                {order.actualValue && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Valor final</span>
                      <span className="font-semibold text-lg text-success-600">
                        ${order.actualValue}
                      </span>
                    </div>
                    
                    {order.actualValue !== order.estimatedValue && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Diferencia</span>
                        <span className={order.actualValue > order.estimatedValue ? 'text-success-600' : 'text-warning-600'}>
                          {order.actualValue > order.estimatedValue ? '+' : ''}
                          ${order.actualValue - order.estimatedValue}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {order.status === 'verified' && !order.actualValue && (
                <Alert variant="default" className="mt-4">
                  <ClockIcon className="h-4 w-4" />
                  <div>
                    <p className="text-sm">
                      Tu dispositivo ha sido verificado. El pago se procesará dentro de 24 horas.
                    </p>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Pickup Info */}
          {order.pickupAddress && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información de recolección</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{order.pickupAddress.street}</p>
                    <p className="font-medium">
                      {order.pickupAddress.city}, {order.pickupAddress.state}
                    </p>
                    <p className="font-medium">{order.pickupAddress.zipCode}</p>
                  </div>
                  
                  {order.pickupDate && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha programada</p>
                      <p className="font-medium">
                        {new Date(order.pickupDate).toLocaleDateString('es', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  fullWidth 
                  leftIcon={<PhoneIcon className="h-4 w-4" />}
                >
                  Llamar soporte
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                >
                  Enviar email
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth 
                  leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                >
                  Ver términos
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Horario de atención: Lunes a Viernes 8:00 AM - 6:00 PM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar orden"
        size="sm"
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que quieres cancelar esta orden?
            </p>
            
            <Alert variant="warning">
              <XCircleIcon className="h-4 w-4" />
              <div>
                <p className="text-sm">
                  Esta acción no se puede deshacer. Si tu dispositivo ya fue recolectado, 
                  contacta a soporte para procesar la cancelación.
                </p>
              </div>
            </Alert>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setShowCancelModal(false)}
          >
            No, mantener orden
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelOrder}
          >
            Sí, cancelar orden
          </Button>
        </ModalFooter>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Foto del dispositivo"
        size="lg"
      >
        <ModalContent>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-24 w-24 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            {selectedImage}
          </p>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;