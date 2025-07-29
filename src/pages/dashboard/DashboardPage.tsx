import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  EyeIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardContent, Badge, ProgressBar } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/layout';

// Mock data - en producción vendría de la API
const mockStats = {
  activeOrders: 3,
  totalEarned: 1234,
  kgRecycled: 45.6,
  completedOrders: 12,
  pendingPayments: 2,
  monthlyGrowth: 15.3,
};

const mockRecentOrders = [
  {
    id: '1234',
    device: 'Laptop HP Pavilion',
    status: 'in_transit' as const,
    estimatedValue: 180,
    weight: 2.1,
    createdAt: '2025-01-20T10:30:00Z',
  },
  {
    id: '1233',
    device: 'iPhone 12',
    status: 'paid' as const,
    estimatedValue: 450,
    actualValue: 420,
    weight: 0.2,
    createdAt: '2025-01-19T14:15:00Z',
  },
  {
    id: '1232',
    device: 'Samsung Galaxy Tab',
    status: 'verified' as const,
    estimatedValue: 200,
    actualValue: 185,
    weight: 0.5,
    createdAt: '2025-01-18T09:45:00Z',
  },
];

const mockMonthlyData = [
  { month: 'Ago', earnings: 650, orders: 8 },
  { month: 'Sep', earnings: 820, orders: 10 },
  { month: 'Oct', earnings: 920, orders: 12 },
  { month: 'Nov', earnings: 1150, orders: 14 },
  { month: 'Dic', earnings: 1234, orders: 15 },
];

const getStatusInfo = (status: string) => {
  const statusMap = {
    pending: { label: 'Pendiente', variant: 'warning' as const, icon: ClockIcon },
    in_transit: { label: 'En tránsito', variant: 'default' as const, icon: TruckIcon },
    verified: { label: 'Verificado', variant: 'success' as const, icon: CheckCircleIcon },
    paid: { label: 'Pagado', variant: 'success' as const, icon: CheckCircleIcon },
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}> = ({ title, value, change, trend, color, icon: Icon, onClick }) => (
  <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
    <CardContent className="p-6" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend && (
                trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 text-success-600 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-danger-600 mr-1" />
                )
              )}
              <p className={`text-xs ${trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-gray-500'}`}>
                {change}
              </p>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const stats = [
    {
      title: 'Órdenes Activas',
      value: mockStats.activeOrders,
      change: '+2 esta semana',
      trend: 'up' as const,
      color: 'text-primary-600',
      icon: EyeIcon,
      onClick: () => window.location.href = '/orders'
    },
    {
      title: 'Total Ganado',
      value: `$${mockStats.totalEarned.toLocaleString()}`,
      change: `+${mockStats.monthlyGrowth}% este mes`,
      trend: 'up' as const,
      color: 'text-success-600',
      icon: CurrencyDollarIcon,
      onClick: () => window.location.href = '/payments'
    },
    {
      title: 'Kg Reciclados',
      value: `${mockStats.kgRecycled} kg`,
      change: '+12.3 kg este mes',
      trend: 'up' as const,
      color: 'text-gray-900',
      icon: ScaleIcon,
      onClick: () => window.location.href = '/stats'
    },
    {
      title: 'Órdenes Completadas',
      value: mockStats.completedOrders,
      change: '85% tasa de éxito',
      color: 'text-purple-600',
      icon: CheckCircleIcon,
    }
  ];

  const currentMonth = new Date().toLocaleDateString('es', { month: 'long' });
  const recyclingGoal = 50; // kg
  const currentProgress = (mockStats.kgRecycled / recyclingGoal) * 100;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`¡Hola ${user?.firstName}! 👋`}
        description="Bienvenido a tu dashboard. Aquí puedes gestionar todas tus órdenes y ver tus estadísticas."
        action={
          <Link to="/sell">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Vender Chatarra
            </Button>
          </Link>
        }
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Tu impacto ambiental 🌱
            </h2>
            <p className="text-primary-100 mb-4">
              Has reciclado <span className="font-bold">{mockStats.kgRecycled} kg</span> de chatarra electrónica.
              ¡Equivale a evitar <span className="font-bold">91 kg</span> de CO₂!
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/stats">
                <Button variant="secondary" size="sm">
                  Ver Estadísticas
                </Button>
              </Link>
              <Link to="/referrals">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary-600">
                  Invitar Amigos
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ScaleIcon className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recycling Goal */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Meta de Reciclaje - {currentMonth}</h3>
              <Badge variant="outline">{Math.round(currentProgress)}%</Badge>
            </div>
            <ProgressBar
              value={currentProgress}
              max={100}
              variant={currentProgress >= 80 ? 'success' : currentProgress >= 50 ? 'default' : 'warning'}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{mockStats.kgRecycled} kg reciclados</span>
              <span>Meta: {recyclingGoal} kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {recyclingGoal - mockStats.kgRecycled > 0 
                ? `Te faltan ${(recyclingGoal - mockStats.kgRecycled).toFixed(1)} kg para alcanzar tu meta`
                : '¡Felicidades! Has superado tu meta de reciclaje'
              }
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resumen Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pagos pendientes</span>
                <Badge variant="warning">{mockStats.pendingPayments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Promedio por orden</span>
                <span className="font-medium">${Math.round(mockStats.totalEarned / mockStats.completedOrders)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mejor categoría</span>
                <span className="font-medium">Smartphones</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nivel actual</span>
                <Badge variant="success">Reciclador Pro</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Órdenes Recientes</h3>
                <Link to="/orders">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockRecentOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <StatusIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">Orden #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.device}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('es')} • {order.weight} kg
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant={statusInfo.variant} className="mb-2">
                          {statusInfo.label}
                        </Badge>
                        <p className="text-sm font-medium">
                          {order.status === 'paid' && order.actualValue 
                            ? `$${order.actualValue}` 
                            : `~$${order.estimatedValue}`
                          }
                        </p>
                        {order.status === 'paid' && order.actualValue && order.actualValue !== order.estimatedValue && (
                          <p className="text-xs text-gray-500">
                            Est. ${order.estimatedValue}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ganancias</h3>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="week">Semana</option>
                <option value="month">Mes</option>
                <option value="year">Año</option>
              </select>
            </div>
            
            <div className="space-y-3">
              {mockMonthlyData.slice(-3).map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="text-sm font-medium">{data.month}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${data.earnings}</p>
                    <p className="text-xs text-gray-500">{data.orders} órdenes</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/stats">
                <Button variant="outline" size="sm" fullWidth leftIcon={<ChartBarIcon className="h-4 w-4" />}>
                  Ver análisis completo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/sell">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <PlusIcon className="h-5 w-5 mb-1" />
                <span className="text-xs">Vender</span>
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <EyeIcon className="h-5 w-5 mb-1" />
                <span className="text-xs">Órdenes</span>
              </Button>
            </Link>
            <Link to="/payments">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <CurrencyDollarIcon className="h-5 w-5 mb-1" />
                <span className="text-xs">Pagos</span>
              </Button>
            </Link>
            <Link to="/stats">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <ChartBarIcon className="h-5 w-5 mb-1" />
                <span className="text-xs">Estadísticas</span>
              </Button>
            </Link>
            <Link to="/referrals">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <span className="text-lg mb-1">👥</span>
                <span className="text-xs">Referidos</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
                <span className="text-lg mb-1">⚙️</span>
                <span className="text-xs">Perfil</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;