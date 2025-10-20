// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   PlusIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   EyeIcon,
//   TruckIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   XCircleIcon
// } from '@heroicons/react/24/outline';
// import { Button, Card, CardContent, Badge, Input } from '@/components/ui';
// import { PageHeader } from '@/components/layout';

// // Mock orders data
// const mockOrders = [
//   {
//     id: 'ORD-1234',
//     device: 'MacBook Pro 13" 2019',
//     category: 'Laptops',
//     status: 'in_transit',
//     estimatedValue: 850,
//     actualValue: null,
//     weight: 1.8,
//     images: ['/images/macbook.jpg'],
//     createdAt: '2025-01-20T10:30:00Z',
//     updatedAt: '2025-01-21T14:20:00Z',
//     trackingNumber: 'TRK123456789',
//     notes: 'Laptop en excelente estado, solo rayones menores en la tapa'
//   },
//   {
//     id: 'ORD-1233',
//     device: 'iPhone 12 Pro 128GB',
//     category: 'Smartphones',
//     status: 'paid',
//     estimatedValue: 450,
//     actualValue: 420,
//     weight: 0.2,
//     images: ['/images/iphone.jpg'],
//     createdAt: '2025-01-19T14:15:00Z',
//     updatedAt: '2025-01-20T09:30:00Z',
//     paymentDate: '2025-01-20T16:45:00Z',
//     notes: 'Pantalla perfecta, batería al 85%'
//   },
//   {
//     id: 'ORD-1232',
//     device: 'Samsung Galaxy Tab S7',
//     category: 'Tablets',
//     status: 'verified',
//     estimatedValue: 200,
//     actualValue: 185,
//     weight: 0.5,
//     images: ['/images/tablet.jpg'],
//     createdAt: '2025-01-18T09:45:00Z',
//     updatedAt: '2025-01-19T11:20:00Z',
//     notes: 'Tablet con S Pen incluido'
//   },
//   {
//     id: 'ORD-1231',
//     device: 'Nintendo Switch',
//     category: 'Gaming',
//     status: 'pending',
//     estimatedValue: 180,
//     actualValue: null,
//     weight: 0.7,
//     images: ['/images/switch.jpg'],
//     createdAt: '2025-01-17T16:20:00Z',
//     updatedAt: '2025-01-17T16:20:00Z',
//     notes: 'Consola con Joy-Cons, sin dock'
//   },
//   {
//     id: 'ORD-1230',
//     device: 'Dell XPS 15',
//     category: 'Laptops',
//     status: 'cancelled',
//     estimatedValue: 650,
//     actualValue: null,
//     weight: 2.2,
//     images: ['/images/dell.jpg'],
//     createdAt: '2025-01-15T08:30:00Z',
//     updatedAt: '2025-01-16T10:15:00Z',
//     notes: 'Cancelado por el usuario - dispositivo no disponible'
//   }
// ];

// const statusConfig = {
//   pending: {
//     label: 'Pendiente',
//     variant: 'warning' as const,
//     icon: ClockIcon,
//     description: 'Esperando recolección'
//   },
//   in_transit: {
//     label: 'En tránsito',
//     variant: 'default' as const,
//     icon: TruckIcon,
//     description: 'En camino a verificación'
//   },
//   verified: {
//     label: 'Verificado',
//     variant: 'success' as const,
//     icon: CheckCircleIcon,
//     description: 'Verificado, procesando pago'
//   },
//   paid: {
//     label: 'Pagado',
//     variant: 'success' as const,
//     icon: CheckCircleIcon,
//     description: 'Pago completado'
//   },
//   cancelled: {
//     label: 'Cancelado',
//     variant: 'danger' as const,
//     icon: XCircleIcon,
//     description: 'Orden cancelada'
//   }
// };

// const OrderCard: React.FC<{ order: typeof mockOrders[0] }> = ({ order }) => {
//   const status = statusConfig[order.status as keyof typeof statusConfig];
//   const StatusIcon = status.icon;

//   return (
//     <Card className="hover:shadow-md transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-start space-x-4">
//             <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//               <StatusIcon className="h-8 w-8 text-gray-600" />
//             </div>
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-900 mb-1">{order.device}</h3>
//               <p className="text-sm text-gray-600 mb-2">
//                 Orden {order.id} • {order.category}
//               </p>
//               <div className="flex items-center space-x-4 text-xs text-gray-500">
//                 <span>{order.weight} kg</span>
//                 <span>•</span>
//                 <span>{new Date(order.createdAt).toLocaleDateString('es')}</span>
//                 {order.trackingNumber && (
//                   <>
//                     <span>•</span>
//                     <span>#{order.trackingNumber}</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="text-right">
//             <Badge variant={status.variant} className="mb-2">
//               {status.label}
//             </Badge>
//             <p className="text-lg font-bold text-gray-900">
//               {order.actualValue ? `$${order.actualValue}` : `~$${order.estimatedValue}`}
//             </p>
//             {order.actualValue && order.actualValue !== order.estimatedValue && (
//               <p className="text-xs text-gray-500">
//                 Est. ${order.estimatedValue}
//               </p>
//             )}
//           </div>
//         </div>

//         <p className="text-sm text-gray-600 mb-4">{status.description}</p>
        
//         {order.notes && (
//           <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
//             {order.notes}
//           </p>
//         )}

//         <div className="flex items-center justify-between">
//           <div className="text-xs text-gray-500">
//             Actualizado: {new Date(order.updatedAt).toLocaleDateString('es')}
//             {order.paymentDate && (
//               <span> • Pagado: {new Date(order.paymentDate).toLocaleDateString('es')}</span>
//             )}
//           </div>
          
//           <Link to={`/orders/${order.id}`}>
//             <Button variant="outline" size="sm" leftIcon={<EyeIcon className="h-4 w-4" />}>
//               Ver detalles
//             </Button>
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const OrdersPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [categoryFilter, setCategoryFilter] = useState<string>('all');

//   const filteredOrders = mockOrders.filter(order => {
//     const matchesSearch = order.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
//     const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;
    
//     return matchesSearch && matchesStatus && matchesCategory;
//   });

//   const orderStats = {
//     total: mockOrders.length,
//     pending: mockOrders.filter(o => o.status === 'pending').length,
//     inTransit: mockOrders.filter(o => o.status === 'in_transit').length,
//     completed: mockOrders.filter(o => ['verified', 'paid'].includes(o.status)).length,
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Mis Órdenes"
//         description="Gestiona y da seguimiento a todas tus órdenes de reciclaje"
//         action={
//           <Link to="/sell">
//             <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
//               Nueva Orden
//             </Button>
//           </Link>
//         }
//       />

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4 text-center">
//             <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
//             <p className="text-sm text-gray-600">Total</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <p className="text-2xl font-bold text-warning-600">{orderStats.pending}</p>
//             <p className="text-sm text-gray-600">Pendientes</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <p className="text-2xl font-bold text-primary-600">{orderStats.inTransit}</p>
//             <p className="text-sm text-gray-600">En tránsito</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 text-center">
//             <p className="text-2xl font-bold text-success-600">{orderStats.completed}</p>
//             <p className="text-sm text-gray-600">Completadas</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <Input
//                 placeholder="Buscar por dispositivo o número de orden..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
//               />
//             </div>
            
//             <div className="flex gap-4">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="all">Todos los estados</option>
//                 <option value="pending">Pendiente</option>
//                 <option value="in_transit">En tránsito</option>
//                 <option value="verified">Verificado</option>
//                 <option value="paid">Pagado</option>
//                 <option value="cancelled">Cancelado</option>
//               </select>

//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               >
//                 <option value="all">Todas las categorías</option>
//                 <option value="Laptops">Laptops</option>
//                 <option value="Smartphones">Smartphones</option>
//                 <option value="Tablets">Tablets</option>
//                 <option value="Gaming">Gaming</option>
//                 <option value="Accessories">Accesorios</option>
//               </select>

//               <Button variant="outline" leftIcon={<FunnelIcon className="h-4 w-4" />}>
//                 Filtros
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Orders List */}
//       <div className="space-y-4">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order) => (
//             <OrderCard key={order.id} order={order} />
//           ))
//         ) : (
//           <Card>
//             <CardContent className="p-12 text-center">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <ClockIcon className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No se encontraron órdenes
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
//                   ? 'Intenta ajustar los filtros de búsqueda'
//                   : 'Aún no tienes ninguna orden. ¡Crea tu primera orden de reciclaje!'
//                 }
//               </p>
//               <Link to="/sell">
//                 <Button>
//                   Crear primera orden
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Load More */}
//       {filteredOrders.length > 0 && (
//         <div className="text-center">
//           <Button variant="outline">
//             Cargar más órdenes
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersPage;








// src/pages/dashboard/OrdersPage.tsx - RESPONSIVE Y SIN DESBORDES

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import orderService, { Order } from '@/services/orderService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: ClockIcon,
  },
  CONFIRMED: {
    label: 'Confirmada',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircleIcon,
  },
  IN_TRANSIT: {
    label: 'En Tránsito',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: TruckIcon,
  },
  DELIVERED: {
    label: 'Entregada',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: CheckCircleIcon,
  },
  VERIFIED: {
    label: 'Verificada',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon,
  },
  PAID: {
    label: 'Pagada',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon,
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon,
  },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
  CANCELLED: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
};

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [page, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const params: any = {
        page,
        limit: 10,
      };

      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await orderService.getUserOrders(params);

      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error(error.message || 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta orden?')) return;

    try {
      await orderService.cancelOrder(orderId);
      toast.success('Orden cancelada exitosamente');
      loadOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Error al cancelar la orden');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (searchTerm) {
      return (
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number | string) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                Mis Órdenes
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">
                {orders.length > 0
                  ? `${orders.length} orden${orders.length !== 1 ? 'es' : ''} encontrada${orders.length !== 1 ? 's' : ''}`
                  : 'No tienes órdenes aún'}
              </p>
            </div>
            <Button
              onClick={() => navigate('/dashboard/sell')}
              className="bg-[#a8c241] hover:bg-[#719428] text-white whitespace-nowrap w-full sm:w-auto"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Nueva Venta</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
          </div>

          {/* Búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a8c241] focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Botón de filtros */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Filtros</span>
            </Button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus('')}
                  className={cn(
                    'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                    selectedStatus === ''
                      ? 'bg-[#a8c241] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  )}
                >
                  Todas
                </button>
                {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                      selectedStatus === status
                        ? 'bg-[#a8c241] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          /* Loading */
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#a8c241]"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Cargando órdenes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Estado vacío */
          <Card className="p-8 sm:p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No hay órdenes
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                {searchTerm || selectedStatus
                  ? 'No se encontraron órdenes con los filtros seleccionados'
                  : 'Aún no has realizado ninguna venta'}
              </p>
              <Button
                onClick={() => navigate('/dashboard/sell')}
                className="bg-[#a8c241] hover:bg-[#719428] text-white w-full sm:w-auto"
              >
                Crear Primera Venta
              </Button>
            </div>
          </Card>
        ) : (
          /* Lista de órdenes */
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = ORDER_STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];

              return (
                <Card key={order.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Header de la orden */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {order.orderNumber}
                        </h3>
                        <Badge className={cn('border text-xs whitespace-nowrap', statusConfig.color)}>
                          <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        <Badge className={cn('border text-xs whitespace-nowrap', paymentConfig.color)}>
                          {paymentConfig.label}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOrder(order.id)}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Ver</span>
                      </Button>
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Cancelar</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Grid de información */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Método</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {order.deliveryMethod === 'PICKUP_POINT'
                          ? 'Punto Servientrega'
                          : 'Recolección'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Items</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {order.orderItems.length}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Peso</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {parseFloat(order.estimatedWeight.toString()).toFixed(2)} kg
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-sm sm:text-lg font-bold text-[#719428] truncate">
                        {formatCurrency(order.estimatedTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Preview de items */}
                  <div className="border-t pt-3 sm:pt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">ARTÍCULOS:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg max-w-full"
                        >
                          <span className="text-xs sm:text-sm text-gray-700 truncate">
                            {item.category.name}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            ({parseFloat(item.estimatedWeight.toString()).toFixed(2)} kg)
                          </span>
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-lg">
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            +{order.orderItems.length - 3} más
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tracking info */}
                  {order.trackingNumber && (
                    <div className="mt-3 sm:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                      <p className="text-xs font-medium text-blue-900 mb-1">
                        N° Seguimiento
                      </p>
                      <p className="text-xs sm:text-sm font-mono text-blue-700 truncate">
                        {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap px-2">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;