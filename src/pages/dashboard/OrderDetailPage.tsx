// // import React, { useState } from 'react';
// // import { useParams, useLocation, Link } from 'react-router-dom';
// // import { 
// //   ArrowLeftIcon,
// //   TruckIcon,
// //   CheckCircleIcon,
// //   ClockIcon,
// //   XCircleIcon,
// //   PhotoIcon,
// //   DocumentTextIcon,
// //   PhoneIcon,
// //   EnvelopeIcon
// // } from '@heroicons/react/24/outline';
// // import { 
// //   Button, 
// //   Card, 
// //   CardContent, 
// //   Badge, 
// //   Alert,
// //   Modal,
// //   ModalContent,
// //   ModalFooter
// // } from '@/components/ui';
// // import { PageHeader } from '@/components/layout';

// // // Mock order data
// // const mockOrderDetail = {
// //   id: 'ORD-1234',
// //   orderNumber: 'ORD-1234',
// //   device: 'MacBook Pro 13" 2019',
// //   brand: 'Apple',
// //   model: 'A2159',
// //   category: 'Laptops',
// //   status: 'in_transit',
// //   estimatedValue: 850,
// //   actualValue: null,
// //   estimatedWeight: 1.8,
// //   actualWeight: null,
// //   condition: 'good',
// //   description: 'MacBook Pro en muy buen estado, solo algunos rayones menores en la tapa. La batería mantiene buena duración y todos los puertos funcionan correctamente. Incluye cargador original.',
// //   hasCharger: true,
// //   hasBox: false,
// //   hasDocuments: true,
// //   images: [
// //     '/images/orders/macbook-1.jpg',
// //     '/images/orders/macbook-2.jpg',
// //     '/images/orders/macbook-3.jpg'
// //   ],
// //   createdAt: '2025-01-20T10:30:00Z',
// //   updatedAt: '2025-01-21T14:20:00Z',
// //   trackingNumber: 'TRK123456789',
// //   pickupAddress: {
// //     street: 'Calle 123 #45-67',
// //     city: 'Bogotá',
// //     state: 'Cundinamarca',
// //     zipCode: '110111'
// //   },
// //   pickupDate: '2025-01-22T09:00:00Z',
// //   timeline: [
// //     {
// //       status: 'created',
// //       timestamp: '2025-01-20T10:30:00Z',
// //       title: 'Orden creada',
// //       description: 'Tu orden ha sido creada exitosamente'
// //     },
// //     {
// //       status: 'confirmed',
// //       timestamp: '2025-01-20T11:15:00Z',
// //       title: 'Orden confirmada',
// //       description: 'Hemos confirmado tu orden y programado la recolección'
// //     },
// //     {
// //       status: 'pickup_scheduled',
// //       timestamp: '2025-01-20T11:15:00Z',
// //       title: 'Recolección programada',
// //       description: 'Recolección programada para el 22 de enero a las 9:00 AM'
// //     },
// //     {
// //       status: 'in_transit',
// //       timestamp: '2025-01-21T14:20:00Z',
// //       title: 'En tránsito',
// //       description: 'Tu dispositivo está en camino a nuestras instalaciones'
// //     }
// //   ]
// // };

// // const statusConfig = {
// //   pending: { label: 'Pendiente', variant: 'warning' as const, icon: ClockIcon },
// //   confirmed: { label: 'Confirmado', variant: 'default' as const, icon: CheckCircleIcon },
// //   in_transit: { label: 'En tránsito', variant: 'default' as const, icon: TruckIcon },
// //   verified: { label: 'Verificado', variant: 'success' as const, icon: CheckCircleIcon },
// //   paid: { label: 'Pagado', variant: 'success' as const, icon: CheckCircleIcon },
// //   cancelled: { label: 'Cancelado', variant: 'danger' as const, icon: XCircleIcon }
// // };

// // const conditionLabels = {
// //   excellent: 'Excelente',
// //   good: 'Bueno',
// //   fair: 'Regular',
// //   poor: 'Malo'
// // };

// // const OrderDetailPage: React.FC = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const location = useLocation();
// //   const [showCancelModal, setShowCancelModal] = useState(false);
// //   const [showImageModal, setShowImageModal] = useState(false);
// //   const [selectedImage, setSelectedImage] = useState<string>('');

// //   // Check if we have success message from creation
// //   const successMessage = location.state?.message;
// //   const orderData = location.state?.orderData;

// //   const order = mockOrderDetail; // In real app, fetch by ID
// //   const status = statusConfig[order.status as keyof typeof statusConfig];
// //   const StatusIcon = status.icon;

// //   const handleCancelOrder = () => {
// //     // In real app, make API call to cancel
// //     console.log('Cancelling order', id);
// //     setShowCancelModal(false);
// //   };

// //   const canCancel = ['pending', 'confirmed'].includes(order.status);
// //   const showTracking = ['in_transit', 'verified', 'paid'].includes(order.status);

// //   return (
// //     <div className="space-y-6">
// //       <PageHeader
// //         title={`Orden ${order.orderNumber}`}
// //         description={order.device}
// //         action={
// //           <div className="flex gap-3">
// //             <Link to="/orders">
// //               <Button variant="outline" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
// //                 Volver a órdenes
// //               </Button>
// //             </Link>
// //             {canCancel && (
// //               <Button 
// //                 variant="danger" 
// //                 onClick={() => setShowCancelModal(true)}
// //               >
// //                 Cancelar orden
// //               </Button>
// //             )}
// //           </div>
// //         }
// //       />

// //       {/* Success Message */}
// //       {successMessage && (
// //         <Alert variant="success">
// //           <CheckCircleIcon className="h-4 w-4" />
// //           <div>
// //             <p className="font-medium">¡Orden creada exitosamente!</p>
// //             <p className="text-sm">{successMessage}</p>
// //           </div>
// //         </Alert>
// //       )}

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Main Content */}
// //         <div className="lg:col-span-2 space-y-6">
// //           {/* Order Status */}
// //           <Card>
// //             <CardContent className="p-6">
// //               <div className="flex items-center justify-between mb-6">
// //                 <div className="flex items-center space-x-3">
// //                   <StatusIcon className="h-8 w-8 text-gray-600" />
// //                   <div>
// //                     <h3 className="text-lg font-semibold">Estado actual</h3>
// //                     <Badge variant={status.variant}>{status.label}</Badge>
// //                   </div>
// //                 </div>
                
// //                 {showTracking && order.trackingNumber && (
// //                   <div className="text-right">
// //                     <p className="text-sm text-gray-600">Número de seguimiento</p>
// //                     <p className="font-mono text-sm">{order.trackingNumber}</p>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Timeline */}
// //               <div className="space-y-4">
// //                 <h4 className="font-medium text-gray-900">Seguimiento de la orden</h4>
// //                 <div className="space-y-3">
// //                   {order.timeline.map((event, index) => (
// //                     <div key={index} className="flex items-start space-x-3">
// //                       <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
// //                       <div className="flex-1">
// //                         <div className="flex items-center justify-between">
// //                           <p className="font-medium text-gray-900">{event.title}</p>
// //                           <p className="text-xs text-gray-500">
// //                             {new Date(event.timestamp).toLocaleDateString('es', {
// //                               day: 'numeric',
// //                               month: 'short',
// //                               hour: '2-digit',
// //                               minute: '2-digit'
// //                             })}
// //                           </p>
// //                         </div>
// //                         <p className="text-sm text-gray-600">{event.description}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Device Details */}
// //           <Card>
// //             <CardContent className="p-6">
// //               <h3 className="text-lg font-semibold mb-4">Detalles del dispositivo</h3>
              
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 <div className="space-y-3">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Dispositivo</p>
// //                     <p className="font-medium">{order.device}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-600">Marca</p>
// //                     <p className="font-medium">{order.brand}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-600">Modelo</p>
// //                     <p className="font-medium">{order.model}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-600">Categoría</p>
// //                     <p className="font-medium">{order.category}</p>
// //                   </div>
// //                 </div>
                
// //                 <div className="space-y-3">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Estado</p>
// //                     <p className="font-medium">{conditionLabels[order.condition as keyof typeof conditionLabels]}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm text-gray-600">Peso estimado</p>
// //                     <p className="font-medium">{order.estimatedWeight} kg</p>
// //                   </div>
// //                   {order.actualWeight && (
// //                     <div>
// //                       <p className="text-sm text-gray-600">Peso real</p>
// //                       <p className="font-medium">{order.actualWeight} kg</p>
// //                     </div>
// //                   )}
// //                   <div>
// //                     <p className="text-sm text-gray-600">Accesorios</p>
// //                     <div className="flex flex-wrap gap-1 mt-1">
// //                       {order.hasCharger && <Badge size="sm" variant="outline">Cargador</Badge>}
// //                       {order.hasBox && <Badge size="sm" variant="outline">Caja</Badge>}
// //                       {order.hasDocuments && <Badge size="sm" variant="outline">Documentos</Badge>}
// //                       {!order.hasCharger && !order.hasBox && !order.hasDocuments && (
// //                         <span className="text-sm text-gray-500">Ninguno</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="mt-6">
// //                 <p className="text-sm text-gray-600 mb-2">Descripción</p>
// //                 <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.description}</p>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Images */}
// //           <Card>
// //             <CardContent className="p-6">
// //               <h3 className="text-lg font-semibold mb-4">Fotos del dispositivo</h3>
              
// //               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //                 {order.images.map((image, index) => (
// //                   <div
// //                     key={index}
// //                     className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
// //                     onClick={() => {
// //                       setSelectedImage(image);
// //                       setShowImageModal(true);
// //                     }}
// //                   >
// //                     <PhotoIcon className="h-12 w-12 text-gray-400" />
// //                   </div>
// //                 ))}
// //               </div>
              
// //               <p className="text-xs text-gray-500 mt-2">
// //                 Haz clic en una imagen para verla en tamaño completo
// //               </p>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Sidebar */}
// //         <div className="space-y-6">
// //           {/* Value Card */}
// //           <Card>
// //             <CardContent className="p-6">
// //               <h3 className="text-lg font-semibold mb-4">Valor de la orden</h3>
              
// //               <div className="space-y-3">
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-gray-600">Valor estimado</span>
// //                   <span className="font-semibold text-lg">${order.estimatedValue}</span>
// //                 </div>
                
// //                 {order.actualValue && (
// //                   <>
// //                     <div className="flex justify-between items-center">
// //                       <span className="text-gray-600">Valor final</span>
// //                       <span className="font-semibold text-lg text-success-600">
// //                         ${order.actualValue}
// //                       </span>
// //                     </div>
                    
// //                     {order.actualValue !== order.estimatedValue && (
// //                       <div className="flex justify-between items-center text-sm">
// //                         <span className="text-gray-500">Diferencia</span>
// //                         <span className={order.actualValue > order.estimatedValue ? 'text-success-600' : 'text-warning-600'}>
// //                           {order.actualValue > order.estimatedValue ? '+' : ''}
// //                           ${order.actualValue - order.estimatedValue}
// //                         </span>
// //                       </div>
// //                     )}
// //                   </>
// //                 )}
// //               </div>
              
// //               {order.status === 'verified' && !order.actualValue && (
// //                 <Alert variant="default" className="mt-4">
// //                   <ClockIcon className="h-4 w-4" />
// //                   <div>
// //                     <p className="text-sm">
// //                       Tu dispositivo ha sido verificado. El pago se procesará dentro de 24 horas.
// //                     </p>
// //                   </div>
// //                 </Alert>
// //               )}
// //             </CardContent>
// //           </Card>

// //           {/* Pickup Info */}
// //           {order.pickupAddress && (
// //             <Card>
// //               <CardContent className="p-6">
// //                 <h3 className="text-lg font-semibold mb-4">Información de recolección</h3>
                
// //                 <div className="space-y-3">
// //                   <div>
// //                     <p className="text-sm text-gray-600">Dirección</p>
// //                     <p className="font-medium">{order.pickupAddress.street}</p>
// //                     <p className="font-medium">
// //                       {order.pickupAddress.city}, {order.pickupAddress.state}
// //                     </p>
// //                     <p className="font-medium">{order.pickupAddress.zipCode}</p>
// //                   </div>
                  
// //                   {order.pickupDate && (
// //                     <div>
// //                       <p className="text-sm text-gray-600">Fecha programada</p>
// //                       <p className="font-medium">
// //                         {new Date(order.pickupDate).toLocaleDateString('es', {
// //                           weekday: 'long',
// //                           year: 'numeric',
// //                           month: 'long',
// //                           day: 'numeric',
// //                           hour: '2-digit',
// //                           minute: '2-digit'
// //                         })}
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           )}

// //           {/* Contact Info */}
// //           <Card>
// //             <CardContent className="p-6">
// //               <h3 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h3>
              
// //               <div className="space-y-3">
// //                 <Button 
// //                   variant="outline" 
// //                   fullWidth 
// //                   leftIcon={<PhoneIcon className="h-4 w-4" />}
// //                 >
// //                   Llamar soporte
// //                 </Button>
                
// //                 <Button 
// //                   variant="outline" 
// //                   fullWidth 
// //                   leftIcon={<EnvelopeIcon className="h-4 w-4" />}
// //                 >
// //                   Enviar email
// //                 </Button>
                
// //                 <Button 
// //                   variant="outline" 
// //                   fullWidth 
// //                   leftIcon={<DocumentTextIcon className="h-4 w-4" />}
// //                 >
// //                   Ver términos
// //                 </Button>
// //               </div>
              
// //               <p className="text-xs text-gray-500 mt-4">
// //                 Horario de atención: Lunes a Viernes 8:00 AM - 6:00 PM
// //               </p>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>

// //       {/* Cancel Order Modal */}
// //       <Modal
// //         isOpen={showCancelModal}
// //         onClose={() => setShowCancelModal(false)}
// //         title="Cancelar orden"
// //         size="sm"
// //       >
// //         <ModalContent>
// //           <div className="space-y-4">
// //             <p className="text-gray-600">
// //               ¿Estás seguro de que quieres cancelar esta orden?
// //             </p>
            
// //             <Alert variant="warning">
// //               <XCircleIcon className="h-4 w-4" />
// //               <div>
// //                 <p className="text-sm">
// //                   Esta acción no se puede deshacer. Si tu dispositivo ya fue recolectado, 
// //                   contacta a soporte para procesar la cancelación.
// //                 </p>
// //               </div>
// //             </Alert>
// //           </div>
// //         </ModalContent>
        
// //         <ModalFooter>
// //           <Button
// //             variant="outline"
// //             onClick={() => setShowCancelModal(false)}
// //           >
// //             No, mantener orden
// //           </Button>
// //           <Button
// //             variant="danger"
// //             onClick={handleCancelOrder}
// //           >
// //             Sí, cancelar orden
// //           </Button>
// //         </ModalFooter>
// //       </Modal>

// //       {/* Image Modal */}
// //       <Modal
// //         isOpen={showImageModal}
// //         onClose={() => setShowImageModal(false)}
// //         title="Foto del dispositivo"
// //         size="lg"
// //       >
// //         <ModalContent>
// //           <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
// //             <PhotoIcon className="h-24 w-24 text-gray-400" />
// //           </div>
// //           <p className="text-sm text-gray-500 text-center mt-2">
// //             {selectedImage}
// //           </p>
// //         </ModalContent>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default OrderDetailPage;











// // src/pages/dashboard/OrderDetailPage.tsx - PARTE 1: IMPORTS Y MOCK DATA

// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeftIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   PencilIcon,
//   EyeIcon,
//   TruckIcon,
//   PhoneIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   ScaleIcon,
//   ClockIcon,
//   ExclamationTriangleIcon,
//   ArrowPathIcon,
//   DocumentDuplicateIcon,
//   ChatBubbleLeftRightIcon,
//   PrinterIcon,
//   ShareIcon,
//   SparklesIcon,
//   BuildingOfficeIcon,
//   UserIcon
// } from '@heroicons/react/24/outline';
// import { format } from 'date-fns';
// import { es } from 'date-fns/locale';

// // Components
// import { PageHeader } from '@/components/layout/PageHeader';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { Alert } from '@/components/ui/Alert';
// import { Modal } from '@/components/ui/Modal';
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { toast } from '@/components/ui/use-toast';

// // Order components
// import OrderTimeline from '@/components/orders/OrderTimeline';
// import OrderStatusTracker from '@/components/orders/OrderStatusTracker';
// import ShippingTracker from '@/components/orders/ShippingTracker';
// import DocumentUploader from '@/components/orders/DocumentUploader';
// import ValueAdjustmentModal from '@/components/orders/ValueAdjustmentModal';

// // Types and hooks
// import { 
//   Order, 
//   OrderStatus, 
//   ORDER_STATUS_CONFIG, 
//   DEVICE_CONDITION_CONFIG,
//   VerificationInfo,
//   OrderUtils
// } from '@/types/order';
// import { useAuth } from '@/hooks/useAuth';

// // MOCK DATA COMPLETO PARA TESTING
// const mockOrderDetail: Order = {
//   id: 'order-123',
//   orderNumber: 'ORD-2024-001234',
//   userId: 'user-1',
//   status: 'in_verification',
//   paymentStatus: 'pending',
//   items: [
//     {
//       id: 'item-1',
//       orderId: 'order-123',
//       categoryId: 'laptops',
//       deviceName: 'MacBook Pro 13"',
//       brand: 'Apple',
//       model: 'MacBook Pro 2020',
//       description: 'Laptop en excelente estado funcional. Batería mantiene buena capacidad. Ligeras marcas de uso normal en la carcasa que no afectan el funcionamiento.',
//       condition: 'good',
//       estimatedWeight: 1.4,
//       actualWeight: 1.37,
//       estimatedValue: 850.00,
//       actualValue: 820.00,
//       hasCharger: true,
//       hasBox: false,
//       hasDocuments: true,
//       accessories: ['Cargador original MagSafe', 'Manual de usuario', 'Paño de limpieza'],
//       images: [
//         'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
//         'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
//         'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
//       ],
//       verificationNotes: 'Dispositivo funcional al 100%. Batería en excelente estado (87% de capacidad). Ligeras marcas de uso en carcasa superior.',
//       verifiedAt: '2024-01-17T18:00:00Z',
//       verifiedBy: 'tech-specialist-1',
//       createdAt: '2024-01-15T10:00:00Z',
//       updatedAt: '2024-01-17T18:00:00Z'
//     }
//   ],
//   estimatedTotal: 850.00,
//   finalTotal: 820.00,
//   estimatedWeight: 1.4,
//   actualWeight: 1.37,
//   contactInfo: {
//     firstName: 'Juan Carlos',
//     lastName: 'Pérez González',
//     email: 'juan.perez@email.com',
//     phone: '+593 99 123 4567'
//   },
//   shipping: {
//     // [SHIPPING DATA COMPLETO - continúa en siguiente parte]
//     pickupAddress: {
//       street: 'Av. 9 de Octubre 1234, Edificio Torre Azul',
//       neighborhood: 'Centro Histórico',
//       city: 'Guayaquil',
//       state: 'Guayas',
//       zipCode: '090313',
//       country: 'Ecuador',
//       instructions: 'Piso 3, oficina 301. Llamar al llegar. Disponible de 9AM a 6PM.'
//     },
//     deliveryAddress: {
//       street: 'Zona Industrial Norte, Manzana 45, Solar 12',
//       neighborhood: 'Parque Industrial',
//       city: 'Guayaquil',
//       state: 'Guayas',
//       zipCode: '090514',
//       country: 'Ecuador'
//     },
//     pickupScheduled: true,
//     pickupDate: '2024-01-16T09:00:00Z',
//     pickupTimeSlot: '9:00 AM - 12:00 PM',
//     guideNumber: 'SRV240116001234',
//     trackingNumber: 'TRK-SRV-001234',
//     trackingUrl: 'https://servientrega.com/tracking/TRK-SRV-001234',
//     status: 'delivered',
//     estimatedDelivery: '2024-01-17T17:00:00Z',
//     actualDelivery: '2024-01-17T16:45:00Z',
//     shippingEvents: [
//       {
//         id: 'event-1',
//         timestamp: '2024-01-16T09:15:00Z',
//         status: 'Recolectado',
//         location: 'Guayaquil Centro - Av. 9 de Octubre',
//         description: 'Paquete recolectado exitosamente por el conductor asignado',
//         isDelivered: false,
//         metadata: {
//           driverName: 'Carlos Mendoza',
//           receivedBy: 'Juan Carlos Pérez'
//         }
//       },
//       {
//         id: 'event-2',
//         timestamp: '2024-01-16T14:30:00Z',
//         status: 'En tránsito',
//         location: 'Centro de Distribución Norte',
//         description: 'Paquete procesado y despachado desde centro de distribución',
//         isDelivered: false
//       },
//       {
//         id: 'event-3',
//         timestamp: '2024-01-17T10:20:00Z',
//         status: 'En ruta de entrega',
//         location: 'Vehículo de reparto - Zona Industrial',
//         description: 'Paquete en vehículo para entrega final',
//         isDelivered: false,
//         metadata: {
//           driverName: 'María González'
//         }
//       },
//       {
//         id: 'event-4',
//         timestamp: '2024-01-17T16:45:00Z',
//         status: 'Entregado',
//         location: 'Instalaciones Wiru - Zona Industrial Norte',
//         description: 'Paquete entregado exitosamente en instalaciones de destino',
//         isDelivered: true,
//         metadata: {
//           driverName: 'María González',
//           receivedBy: 'Supervisor de Recepción - Wiru',
//           signature: 'signature-received-url'
//         }
//       }
//     ],
//     driverInfo: {
//       name: 'Carlos Mendoza',
//       phone: '+593 99 876 5432',
//       vehicleInfo: 'Motocicleta Yamaha FZ150 - Placa ABC-1234'
//     },
//     cost: 15.50,
//     weight: 1.4,
//     createdAt: '2024-01-15T10:00:00Z',
//     updatedAt: '2024-01-17T16:45:00Z'
//   },
//   verification: {
//     // [VERIFICATION DATA COMPLETO - continúa en siguiente parte]
//     id: 'verification-1',
//     orderId: 'order-123',
//     status: 'in_progress',
//     originalWeight: 1.4,
//     verifiedWeight: 1.37,
//     weightVariance: -0.03,
//     originalValue: 850.00,
//     verifiedValue: 820.00,
//     valueVariance: -30.00,
//     verificationPhotos: [
//       'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
//       'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
//       'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
//       'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400'
//     ],
//     verificationNotes: 'Dispositivo recibido en excelentes condiciones funcionales. Todas las especificaciones coinciden con lo declarado. Batería mantiene 87% de capacidad original. Pantalla sin daños ni rayones. Teclado y trackpad funcionan perfectamente. Puertos USB-C y jack de audio operativos. Ligeras marcas de uso normal en la carcasa superior que no afectan la funcionalidad del equipo.',
//     adjustmentReason: 'Peso ligeramente inferior al estimado inicialmente debido a las especificaciones exactas del modelo específico (M1 vs Intel). Valor ajustado por las marcas menores de uso detectadas en la inspección física, aunque no comprometen la funcionalidad del dispositivo.',
//     requiresApproval: false,
//     createdAt: '2024-01-17T17:00:00Z',
//     updatedAt: '2024-01-17T18:30:00Z'
//   },
//   timeline: [
//     // [TIMELINE DATA COMPLETO - continúa en siguiente parte]
//     {
//       id: 'timeline-1',
//       orderId: 'order-123',
//       status: 'pending',
//       title: 'Orden Creada',
//       description: 'Tu orden ha sido creada exitosamente y está pendiente de confirmación por nuestro equipo técnico',
//       timestamp: '2024-01-15T10:00:00Z',
//       actor: 'user',
//       isVisible: true,
//       metadata: {
//         automaticAction: false,
//         estimatedDuration: '2-4 horas',
//         nextActions: ['Revisión técnica inicial', 'Verificación de disponibilidad', 'Confirmación del precio estimado']
//       }
//     },
//     {
//       id: 'timeline-2',
//       orderId: 'order-123',
//       status: 'confirmed',
//       title: 'Orden Confirmada',
//       description: 'Tu orden ha sido confirmada por nuestro equipo. Los valores estimados han sido aprobados y se inicia el proceso de recolección',
//       timestamp: '2024-01-15T12:30:00Z',
//       actor: 'system',
//       isVisible: true,
//       metadata: {
//         automaticAction: true,
//         nextActions: ['Programación de recolección con Servientrega', 'Generación de número de guía', 'Notificación al cliente'],
//         previousValue: 'pending',
//         newValue: 'confirmed'
//       }
//     },
//     {
//       id: 'timeline-3',
//       orderId: 'order-123',
//       status: 'pickup_scheduled',
//       title: 'Recolección Programada',
//       description: 'Se ha programado la recolección con Servientrega para el martes 16 de enero entre 9:00 AM - 12:00 PM. Se generó la guía de envío.',
//       timestamp: '2024-01-15T15:45:00Z',
//       actor: 'system',
//       isVisible: true,
//       metadata: {
//         automaticAction: true,
//         nextActions: ['Preparar equipo para recolección', 'Estar disponible en el horario programado', 'Tener documento de identidad listo'],
//         previousValue: null,
//         newValue: { 
//           pickupDate: '2024-01-16', 
//           timeSlot: '9:00 AM - 12:00 PM',
//           guideNumber: 'SRV240116001234'
//         }
//       }
//     },
//     {
//       id: 'timeline-4',
//       orderId: 'order-123',
//       status: 'in_transit',
//       title: 'Equipo Recolectado',
//       description: 'Tu equipo ha sido recolectado exitosamente por Carlos Mendoza y está en tránsito hacia nuestras instalaciones de verificación',
//       timestamp: '2024-01-16T09:15:00Z',
//       actor: 'driver',
//       isVisible: true,
//       metadata: {
//         estimatedDuration: '1-2 días',
//         nextActions: ['Transporte seguro a instalaciones', 'Notificación de llegada', 'Inicio de proceso de verificación'],
//         driverInfo: {
//           name: 'Carlos Mendoza',
//           phone: '+593 99 876 5432'
//         }
//       }
//     },
//     {
//       id: 'timeline-5',
//       orderId: 'order-123',
//       status: 'received',
//       title: 'Recibido en Instalaciones',
//       description: 'Tu equipo ha llegado a nuestras instalaciones y ha sido registrado en el sistema. Está listo para el proceso de verificación técnica',
//       timestamp: '2024-01-17T16:45:00Z',
//       actor: 'verification',
//       isVisible: true,
//       metadata: {
//         nextActions: ['Inspección visual inicial', 'Pruebas de funcionalidad', 'Verificación de especificaciones técnicas'],
//         receivedBy: 'Supervisor de Recepción'
//       }
//     },
//     {
//       id: 'timeline-6',
//       orderId: 'order-123',
//       status: 'in_verification',
//       title: 'Verificación en Proceso',
//       description: 'Nuestro equipo de especialistas técnicos está realizando la verificación completa del estado, funcionalidad y valor de tu MacBook Pro',
//       timestamp: '2024-01-17T17:00:00Z',
//       actor: 'verification',
//       isVisible: true,
//       metadata: {
//         estimatedDuration: '1-2 días hábiles',
//         nextActions: ['Inspección técnica detallada', 'Pruebas de rendimiento', 'Evaluación final de valor', 'Ajustes si son necesarios'],
//         verifierInfo: {
//           name: 'Especialista Técnico',
//           department: 'Verificación de Laptops'
//         }
//       }
//     }
//   ],
//   notes: 'Cliente prefiere recolección en horario de oficina (9AM-6PM). Dispositivo reportado en muy buen estado según fotos iniciales. Solicitud especial: manejar con cuidado por valor sentimental.',
//   priority: 'normal',
//   allowPartialValue: true,
//   requirePhotos: true,
//   autoAcceptVerification: false,
//   createdAt: '2024-01-15T10:00:00Z',
//   updatedAt: '2024-01-17T18:30:00Z',
//   confirmedAt: '2024-01-15T12:30:00Z'
// };

// // PARTE 2: COMPONENTE PRINCIPAL Y MANEJO DE ESTADO

// const OrderDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // STATE MANAGEMENT
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showVerificationModal, setShowVerificationModal] = useState(false);
//   const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'shipping' | 'verification' | 'documents'>('overview');
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Get success message from navigation state
//   const successMessage = location.state?.message;

//   // LOAD ORDER DATA ON MOUNT
//   useEffect(() => {
//     const loadOrder = async () => {
//       if (!id) {
//         setError('ID de orden no válido');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         // Simulate API call with delay
//         await new Promise(resolve => setTimeout(resolve, 1200));
        
//         // In real implementation: const fetchedOrder = await orderApi.getOrderById(id);
//         if (id === 'order-123' || id === mockOrderDetail.id) {
//           setOrder(mockOrderDetail);
//         } else {
//           throw new Error(`Orden con ID ${id} no encontrada`);
//         }
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Error al cargar la orden';
//         setError(errorMessage);
//         console.error('Error loading order:', err);
        
//         toast({
//           title: 'Error al cargar orden',
//           description: errorMessage,
//           variant: 'destructive'
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrder();
//   }, [id]);

//   // EVENT HANDLERS
//   const handleCancelOrder = async () => {
//     if (!order) return;

//     try {
//       // In real implementation: await orderApi.cancelOrder(order.id, reason);
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       toast({
//         title: 'Orden cancelada',
//         description: 'Tu orden ha sido cancelada exitosamente. Se ha notificado al equipo correspondiente.',
//         variant: 'success'
//       });
      
//       setShowCancelModal(false);
//       navigate('/orders');
//     } catch (error) {
//       toast({
//         title: 'Error al cancelar',
//         description: 'No se pudo cancelar la orden. Intenta nuevamente o contacta soporte.',
//         variant: 'destructive'
//       });
//     }
//   };

//   const handleVerificationComplete = async (verification: VerificationInfo) => {
//     if (!order) return;

//     try {
//       // In real implementation: await orderApi.submitVerification(order.id, verification);
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       const updatedOrder = {
//         ...order,
//         verification,
//         status: verification.requiresApproval ? 'verified' : 'payment_pending' as OrderStatus,
//         finalTotal: verification.verifiedValue,
//         actualWeight: verification.verifiedWeight,
//         updatedAt: new Date().toISOString()
//       };
      
//       setOrder(updatedOrder);
//       setShowVerificationModal(false);
      
//       toast({
//         title: 'Verificación completada',
//         description: verification.requiresApproval 
//           ? 'La verificación ha sido enviada para aprobación del supervisor'
//           : 'Los valores han sido actualizados y la orden procederá al pago',
//         variant: 'success'
//       });
//     } catch (error) {
//       // Re-throw error to let the modal handle it
//       throw error;
//     }
//   };

//   const handleRefreshOrder = async () => {
//     if (!id || isRefreshing) return;

//     setIsRefreshing(true);
//     try {
//       // In real implementation: const refreshedOrder = await orderApi.getOrderById(id);
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Simulate small updates to the order
//       if (order) {
//         const updatedOrder = {
//           ...order,
//           updatedAt: new Date().toISOString()
//         };
//         setOrder(updatedOrder);
//       }
      
//       toast({
//         title: 'Orden actualizada',
//         description: 'La información ha sido actualizada exitosamente',
//         variant: 'success'
//       });
//     } catch (error) {
//       toast({
//         title: 'Error al actualizar',
//         description: 'No se pudo actualizar la información. Verifica tu conexión.',
//         variant: 'destructive'
//       });
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const handleTrackingUpdate = async () => {
//     if (!order) return;
    
//     try {
//       // In real implementation: await shippingApi.updateTracking(order.id);
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // Simulate adding a new shipping event
//       const newEvent = {
//         id: `event-auto-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//         status: 'Actualización de sistema',
//         location: 'Sistema de seguimiento automático',
//         description: 'Información sincronizada con Servientrega',
//         isDelivered: false,
//         metadata: {
//           automaticUpdate: true
//         }
//       };
      
//       setOrder(prev => prev ? {
//         ...prev,
//         shipping: {
//           ...prev.shipping,
//           shippingEvents: [newEvent, ...prev.shipping.shippingEvents],
//           updatedAt: new Date().toISOString()
//         },
//         updatedAt: new Date().toISOString()
//       } : null);
      
//     } catch (error) {
//       throw error; // Let the ShippingTracker component handle the error
//     }
//   };

//   const handleDuplicateOrder = () => {
//     if (!order) return;
    
//     const duplicateData = {
//       items: order.items.map(item => ({
//         ...item,
//         id: undefined,
//         orderId: undefined,
//         actualWeight: undefined,
//         actualValue: undefined,
//         verificationNotes: undefined,
//         verifiedAt: undefined,
//         verifiedBy: undefined
//       })),
//       shipping: {
//         pickupAddress: order.shipping.pickupAddress
//       }
//     };
    
//     navigate('/sell', { 
//       state: { 
//         duplicateFrom: order.id,
//         orderData: duplicateData,
//         message: `Duplicando orden ${order.orderNumber}`
//       }
//     });
//   };

//   const handlePrintOrder = () => {
//     // Add print-specific styles
//     const printStyles = `
//       @media print {
//         .no-print { display: none !important; }
//         .print-only { display: block !important; }
//         body { font-size: 12px; }
//       }
//     `;
    
//     const styleSheet = document.createElement('style');
//     styleSheet.innerText = printStyles;
//     document.head.appendChild(styleSheet);
    
//     window.print();
    
//     // Clean up
//     document.head.removeChild(styleSheet);
//   };

//   const handleShareOrder = async () => {
//     if (!order) return;
    
//     const shareData = {
//       title: `Orden ${order.orderNumber} - Wiru`,
//       text: `Mi orden de reciclaje está en estado: ${ORDER_STATUS_CONFIG[order.status].label}`,
//       url: window.location.href
//     };

//     try {
//       if (navigator.share && navigator.canShare?.(shareData)) {
//         await navigator.share(shareData);
//         toast({
//           title: 'Orden compartida',
//           description: 'La información de la orden ha sido compartida exitosamente',
//           variant: 'success'
//         });
//       } else {
//         // Fallback to clipboard
//         await navigator.clipboard.writeText(window.location.href);
//         toast({
//           title: 'Enlace copiado',
//           description: 'El enlace de la orden se ha copiado al portapapeles',
//           variant: 'success'
//         });
//       }
//     } catch (error) {
//       // Final fallback
//       try {
//         await navigator.clipboard.writeText(window.location.href);
//         toast({
//           title: 'Enlace copiado',
//           description: 'El enlace de la orden se ha copiado al portapapeles',
//           variant: 'success'
//         });
//       } catch (clipboardError) {
//         toast({
//           title: 'Error al compartir',
//           description: 'No se pudo compartir la orden. Intenta copiar el enlace manualmente.',
//           variant: 'destructive'
//         });
//       }
//     }
//   };

//   // HELPER FUNCTIONS
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('es-ES', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatWeight = (weight: number) => {
//     return `${weight.toFixed(2)} kg`;
//   };

//   const formatDate = (date: string) => {
//     try {
//       return format(new Date(date), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
//     } catch (error) {
//       return date;
//     }
//   };

//   const formatShortDate = (date: string) => {
//     try {
//       return format(new Date(date), "d MMM yyyy", { locale: es });
//     } catch (error) {
//       return date;
//     }
//   };