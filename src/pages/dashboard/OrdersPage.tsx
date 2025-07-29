import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, Badge, Input } from '@/components/ui';
import { PageHeader } from '@/components/layout';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-1234',
    device: 'MacBook Pro 13" 2019',
    category: 'Laptops',
    status: 'in_transit',
    estimatedValue: 850,
    actualValue: null,
    weight: 1.8,
    images: ['/images/macbook.jpg'],
    createdAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-21T14:20:00Z',
    trackingNumber: 'TRK123456789',
    notes: 'Laptop en excelente estado, solo rayones menores en la tapa'
  },
  {
    id: 'ORD-1233',
    device: 'iPhone 12 Pro 128GB',
    category: 'Smartphones',
    status: 'paid',
    estimatedValue: 450,
    actualValue: 420,
    weight: 0.2,
    images: ['/images/iphone.jpg'],
    createdAt: '2025-01-19T14:15:00Z',
    updatedAt: '2025-01-20T09:30:00Z',
    paymentDate: '2025-01-20T16:45:00Z',
    notes: 'Pantalla perfecta, batería al 85%'
  },
  {
    id: 'ORD-1232',
    device: 'Samsung Galaxy Tab S7',
    category: 'Tablets',
    status: 'verified',
    estimatedValue: 200,
    actualValue: 185,
    weight: 0.5,
    images: ['/images/tablet.jpg'],
    createdAt: '2025-01-18T09:45:00Z',
    updatedAt: '2025-01-19T11:20:00Z',
    notes: 'Tablet con S Pen incluido'
  },
  {
    id: 'ORD-1231',
    device: 'Nintendo Switch',
    category: 'Gaming',
    status: 'pending',
    estimatedValue: 180,
    actualValue: null,
    weight: 0.7,
    images: ['/images/switch.jpg'],
    createdAt: '2025-01-17T16:20:00Z',
    updatedAt: '2025-01-17T16:20:00Z',
    notes: 'Consola con Joy-Cons, sin dock'
  },
  {
    id: 'ORD-1230',
    device: 'Dell XPS 15',
    category: 'Laptops',
    status: 'cancelled',
    estimatedValue: 650,
    actualValue: null,
    weight: 2.2,
    images: ['/images/dell.jpg'],
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-16T10:15:00Z',
    notes: 'Cancelado por el usuario - dispositivo no disponible'
  }
];

const statusConfig = {
  pending: {
    label: 'Pendiente',
    variant: 'warning' as const,
    icon: ClockIcon,
    description: 'Esperando recolección'
  },
  in_transit: {
    label: 'En tránsito',
    variant: 'default' as const,
    icon: TruckIcon,
    description: 'En camino a verificación'
  },
  verified: {
    label: 'Verificado',
    variant: 'success' as const,
    icon: CheckCircleIcon,
    description: 'Verificado, procesando pago'
  },
  paid: {
    label: 'Pagado',
    variant: 'success' as const,
    icon: CheckCircleIcon,
    description: 'Pago completado'
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'danger' as const,
    icon: XCircleIcon,
    description: 'Orden cancelada'
  }
};

const OrderCard: React.FC<{ order: typeof mockOrders[0] }> = ({ order }) => {
  const status = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <StatusIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{order.device}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Orden {order.id} • {order.category}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{order.weight} kg</span>
                <span>•</span>
                <span>{new Date(order.createdAt).toLocaleDateString('es')}</span>
                {order.trackingNumber && (
                  <>
                    <span>•</span>
                    <span>#{order.trackingNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant={status.variant} className="mb-2">
              {status.label}
            </Badge>
            <p className="text-lg font-bold text-gray-900">
              {order.actualValue ? `$${order.actualValue}` : `~$${order.estimatedValue}`}
            </p>
            {order.actualValue && order.actualValue !== order.estimatedValue && (
              <p className="text-xs text-gray-500">
                Est. ${order.estimatedValue}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{status.description}</p>
        
        {order.notes && (
          <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
            {order.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Actualizado: {new Date(order.updatedAt).toLocaleDateString('es')}
            {order.paymentDate && (
              <span> • Pagado: {new Date(order.paymentDate).toLocaleDateString('es')}</span>
            )}
          </div>
          
          <Link to={`/orders/${order.id}`}>
            <Button variant="outline" size="sm" leftIcon={<EyeIcon className="h-4 w-4" />}>
              Ver detalles
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || order.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const orderStats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
    inTransit: mockOrders.filter(o => o.status === 'in_transit').length,
    completed: mockOrders.filter(o => ['verified', 'paid'].includes(o.status)).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Órdenes"
        description="Gestiona y da seguimiento a todas tus órdenes de reciclaje"
        action={
          <Link to="/sell">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Nueva Orden
            </Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning-600">{orderStats.pending}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{orderStats.inTransit}</p>
            <p className="text-sm text-gray-600">En tránsito</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success-600">{orderStats.completed}</p>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por dispositivo o número de orden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_transit">En tránsito</option>
                <option value="verified">Verificado</option>
                <option value="paid">Pagado</option>
                <option value="cancelled">Cancelado</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="Laptops">Laptops</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Tablets">Tablets</option>
                <option value="Gaming">Gaming</option>
                <option value="Accessories">Accesorios</option>
              </select>

              <Button variant="outline" leftIcon={<FunnelIcon className="h-4 w-4" />}>
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron órdenes
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Aún no tienes ninguna orden. ¡Crea tu primera orden de reciclaje!'
                }
              </p>
              <Link to="/sell">
                <Button>
                  Crear primera orden
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load More */}
      {filteredOrders.length > 0 && (
        <div className="text-center">
          <Button variant="outline">
            Cargar más órdenes
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;