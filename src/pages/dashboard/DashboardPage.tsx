// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   PlusIcon, 
//   EyeIcon,
//   CurrencyDollarIcon,
//   ScaleIcon,
//   TruckIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   ArrowUpIcon,
//   ArrowDownIcon,
//   ChartBarIcon
// } from '@heroicons/react/24/outline';
// import { Button, Card, CardContent, Badge, ProgressBar } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';
// import { PageHeader } from '@/components/layout';

// // Mock data - en producción vendría de la API
// const mockStats = {
//   activeOrders: 3,
//   totalEarned: 1234,
//   kgRecycled: 45.6,
//   completedOrders: 12,
//   pendingPayments: 2,
//   monthlyGrowth: 15.3,
// };

// const mockRecentOrders = [
//   {
//     id: '1234',
//     device: 'Laptop HP Pavilion',
//     status: 'in_transit' as const,
//     estimatedValue: 180,
//     weight: 2.1,
//     createdAt: '2025-01-20T10:30:00Z',
//   },
//   {
//     id: '1233',
//     device: 'iPhone 12',
//     status: 'paid' as const,
//     estimatedValue: 450,
//     actualValue: 420,
//     weight: 0.2,
//     createdAt: '2025-01-19T14:15:00Z',
//   },
//   {
//     id: '1232',
//     device: 'Samsung Galaxy Tab',
//     status: 'verified' as const,
//     estimatedValue: 200,
//     actualValue: 185,
//     weight: 0.5,
//     createdAt: '2025-01-18T09:45:00Z',
//   },
// ];

// const mockMonthlyData = [
//   { month: 'Ago', earnings: 650, orders: 8 },
//   { month: 'Sep', earnings: 820, orders: 10 },
//   { month: 'Oct', earnings: 920, orders: 12 },
//   { month: 'Nov', earnings: 1150, orders: 14 },
//   { month: 'Dic', earnings: 1234, orders: 15 },
// ];

// const getStatusInfo = (status: string) => {
//   const statusMap = {
//     pending: { label: 'Pendiente', variant: 'warning' as const, icon: ClockIcon },
//     in_transit: { label: 'En tránsito', variant: 'default' as const, icon: TruckIcon },
//     verified: { label: 'Verificado', variant: 'success' as const, icon: CheckCircleIcon },
//     paid: { label: 'Pagado', variant: 'success' as const, icon: CheckCircleIcon },
//   };
//   return statusMap[status as keyof typeof statusMap] || statusMap.pending;
// };

// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   change?: string;
//   trend?: 'up' | 'down';
//   color: string;
//   icon: React.ComponentType<{ className?: string }>;
//   onClick?: () => void;
// }> = ({ title, value, change, trend, color, icon: Icon, onClick }) => (
//   <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}>
//     <CardContent className="p-6" onClick={onClick}>
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
//           {change && (
//             <div className="flex items-center mt-2">
//               {trend && (
//                 trend === 'up' ? (
//                   <ArrowUpIcon className="h-4 w-4 text-success-600 mr-1" />
//                 ) : (
//                   <ArrowDownIcon className="h-4 w-4 text-danger-600 mr-1" />
//                 )
//               )}
//               <p className={`text-xs ${trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-gray-500'}`}>
//                 {change}
//               </p>
//             </div>
//           )}
//         </div>
//         <div className="flex-shrink-0">
//           <Icon className="h-8 w-8 text-gray-400" />
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

//   const stats = [
//     {
//       title: 'Órdenes Activas',
//       value: mockStats.activeOrders,
//       change: '+2 esta semana',
//       trend: 'up' as const,
//       color: 'text-primary-600',
//       icon: EyeIcon,
//       onClick: () => window.location.href = '/orders'
//     },
//     {
//       title: 'Total Ganado',
//       value: `$${mockStats.totalEarned.toLocaleString()}`,
//       change: `+${mockStats.monthlyGrowth}% este mes`,
//       trend: 'up' as const,
//       color: 'text-success-600',
//       icon: CurrencyDollarIcon,
//       onClick: () => window.location.href = '/payments'
//     },
//     {
//       title: 'Kg Reciclados',
//       value: `${mockStats.kgRecycled} kg`,
//       change: '+12.3 kg este mes',
//       trend: 'up' as const,
//       color: 'text-gray-900',
//       icon: ScaleIcon,
//       onClick: () => window.location.href = '/stats'
//     },
//     {
//       title: 'Órdenes Completadas',
//       value: mockStats.completedOrders,
//       change: '85% tasa de éxito',
//       color: 'text-purple-600',
//       icon: CheckCircleIcon,
//     }
//   ];

//   const currentMonth = new Date().toLocaleDateString('es', { month: 'long' });
//   const recyclingGoal = 50; // kg
//   const currentProgress = (mockStats.kgRecycled / recyclingGoal) * 100;

//   return (
//     <div className="space-y-8">
//       <PageHeader
//         title={`¡Hola ${user?.firstName}! 👋`}
//         description="Bienvenido a tu dashboard. Aquí puedes gestionar todas tus órdenes y ver tus estadísticas."
//         action={
//           <Link to="/sell">
//             <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
//               Vender Chatarra
//             </Button>
//           </Link>
//         }
//       />

//       {/* Welcome Banner */}
//       <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold mb-2">
//               Tu impacto ambiental 🌱
//             </h2>
//             <p className="text-primary-100 mb-4">
//               Has reciclado <span className="font-bold">{mockStats.kgRecycled} kg</span> de chatarra electrónica.
//               ¡Equivale a evitar <span className="font-bold">91 kg</span> de CO₂!
//             </p>
//             <div className="flex items-center space-x-4">
//               <Link to="/stats">
//                 <Button variant="secondary" size="sm">
//                   Ver Estadísticas
//                 </Button>
//               </Link>
//               <Link to="/referrals">
//                 <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary-600">
//                   Invitar Amigos
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div className="hidden md:block">
//             <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <ScaleIcon className="h-12 w-12 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>

//       {/* Progress Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recycling Goal */}
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Meta de Reciclaje - {currentMonth}</h3>
//               <Badge variant="outline">{Math.round(currentProgress)}%</Badge>
//             </div>
//             <ProgressBar
//               value={currentProgress}
//               max={100}
//               variant={currentProgress >= 80 ? 'success' : currentProgress >= 50 ? 'default' : 'warning'}
//               className="mb-2"
//             />
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>{mockStats.kgRecycled} kg reciclados</span>
//               <span>Meta: {recyclingGoal} kg</span>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               {recyclingGoal - mockStats.kgRecycled > 0 
//                 ? `Te faltan ${(recyclingGoal - mockStats.kgRecycled).toFixed(1)} kg para alcanzar tu meta`
//                 : '¡Felicidades! Has superado tu meta de reciclaje'
//               }
//             </p>
//           </CardContent>
//         </Card>

//         {/* Quick Stats */}
//         <Card>
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Resumen Rápido</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Pagos pendientes</span>
//                 <Badge variant="warning">{mockStats.pendingPayments}</Badge>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Promedio por orden</span>
//                 <span className="font-medium">${Math.round(mockStats.totalEarned / mockStats.completedOrders)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Mejor categoría</span>
//                 <span className="font-medium">Smartphones</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Nivel actual</span>
//                 <Badge variant="success">Reciclador Pro</Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity & Chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Orders */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold">Órdenes Recientes</h3>
//                 <Link to="/orders">
//                   <Button variant="outline" size="sm">
//                     Ver todas
//                   </Button>
//                 </Link>
//               </div>
              
//               <div className="space-y-4">
//                 {mockRecentOrders.map((order) => {
//                   const statusInfo = getStatusInfo(order.status);
//                   const StatusIcon = statusInfo.icon;
                  
//                   return (
//                     <div
//                       key={order.id}
//                       className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                           <StatusIcon className="h-5 w-5 text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Orden #{order.id}</p>
//                           <p className="text-sm text-gray-600">{order.device}</p>
//                           <p className="text-xs text-gray-500">
//                             {new Date(order.createdAt).toLocaleDateString('es')} • {order.weight} kg
//                           </p>
//                         </div>
//                       </div>
                      
//                       <div className="text-right">
//                         <Badge variant={statusInfo.variant} className="mb-2">
//                           {statusInfo.label}
//                         </Badge>
//                         <p className="text-sm font-medium">
//                           {order.status === 'paid' && order.actualValue 
//                             ? `$${order.actualValue}` 
//                             : `~$${order.estimatedValue}`
//                           }
//                         </p>
//                         {order.status === 'paid' && order.actualValue && order.actualValue !== order.estimatedValue && (
//                           <p className="text-xs text-gray-500">
//                             Est. ${order.estimatedValue}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monthly Chart */}
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Ganancias</h3>
//               <select 
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
//                 className="text-sm border border-gray-300 rounded px-2 py-1"
//               >
//                 <option value="week">Semana</option>
//                 <option value="month">Mes</option>
//                 <option value="year">Año</option>
//               </select>
//             </div>
            
//             <div className="space-y-3">
//               {mockMonthlyData.slice(-3).map((data, index) => (
//                 <div key={data.month} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
//                     <span className="text-sm font-medium">{data.month}</span>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium">${data.earnings}</p>
//                     <p className="text-xs text-gray-500">{data.orders} órdenes</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <Link to="/stats">
//                 <Button variant="outline" size="sm" fullWidth leftIcon={<ChartBarIcon className="h-4 w-4" />}>
//                   Ver análisis completo
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <Card>
//         <CardContent className="p-6">
//           <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             <Link to="/sell">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <PlusIcon className="h-5 w-5 mb-1" />
//                 <span className="text-xs">Vender</span>
//               </Button>
//             </Link>
//             <Link to="/orders">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <EyeIcon className="h-5 w-5 mb-1" />
//                 <span className="text-xs">Órdenes</span>
//               </Button>
//             </Link>
//             <Link to="/payments">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <CurrencyDollarIcon className="h-5 w-5 mb-1" />
//                 <span className="text-xs">Pagos</span>
//               </Button>
//             </Link>
//             <Link to="/stats">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <ChartBarIcon className="h-5 w-5 mb-1" />
//                 <span className="text-xs">Estadísticas</span>
//               </Button>
//             </Link>
//             <Link to="/referrals">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <span className="text-lg mb-1">👥</span>
//                 <span className="text-xs">Referidos</span>
//               </Button>
//             </Link>
//             <Link to="/profile">
//               <Button variant="outline" fullWidth className="h-auto py-3 flex-col">
//                 <span className="text-lg mb-1">⚙️</span>
//                 <span className="text-xs">Perfil</span>
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DashboardPage;









// // src/pages/dashboard/DashboardPage.tsx - INSPIRADO EN DISEÑOS PROFESIONALES
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Card, 
//   CardContent, 
//   Button,
//   Badge,
//   ProgressBar
// } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';
// import {
//   PlusIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowUpIcon,
//   ClipboardDocumentListIcon,
//   CheckCircleIcon,
//   ScaleIcon,
//   BanknotesIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   SparklesIcon,
//   ArrowTrendingUpIcon
// } from '@heroicons/react/24/outline';

// // Datos mock
// const mockUserData = {
//   activeOrders: 3,
//   completedOrders: 24,
//   totalEarned: 569548,
//   kgRecycled: 45.6,
//   monthlyGrowth: 18.5,
//   referrals: 7,
//   balance: {
//     available: 569548,
//     pending: 87000,
//     total: 656548
//   }
// };

// // Hero Banner - Impacto Ambiental (inspirado en la primera imagen)
// const HeroBanner: React.FC = () => {
//   return (
//     <div className="bg-gradient-to-t from-[#99bb44] to-[#7fa836] rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
//       {/* Elementos decorativos sutiles */}
//       <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
//       <div className="absolute bottom-4 right-16 w-8 h-8 bg-white bg-opacity-10 rounded-full"></div>
      
//       <div className="relative z-10">
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <h2 className="text-3xl font-bold mb-3">
//               Tu Impacto Ambiental 🌱
//             </h2>
//             <p className="text-xl text-white/90 mb-6 max-w-2xl">
//               Has reciclado <span className="font-bold">{mockUserData.kgRecycled} kg</span> de chatarra electrónica. 
//               ¡Equivale a evitar <span className="font-bold">91 kg</span> de CO₂!
//             </p>
            
//             <div className="flex items-center space-x-4">
//               <Link to="/sell">
//                 <Button 
//                   className="bg-white text-[#2d5016] hover:bg-white/90 font-semibold px-6 py-3"
//                 >
//                   <PlusIcon className="h-4 w-4 mr-2" />
//                   Vender Chatarra
//                 </Button>
//               </Link>
//               <Link to="/stats">
//                 <Button 
//                   className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 font-medium border-0 px-6 py-3"
//                 >
//                   <ChartBarIcon className="h-4 w-4 mr-2" />
//                   Ver Estadísticas
//                 </Button>
//               </Link>
//             </div>
//           </div>
          
//           {/* Ilustración lateral */}
//           <div className="hidden lg:block">
//             <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <ScaleIcon className="h-16 w-16 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [showBalance, setShowBalance] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-pulse">
//           <div className="h-48 bg-gray-200 rounded-2xl"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Header minimalista */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-1">
//             ¡Hola {user?.firstName || 'diego.z.f99'}! 👋
//           </h1>
//           <p className="text-gray-600">
//             Bienvenido a tu dashboard. Aquí puedes gestionar todas tus órdenes y ver tus estadísticas.
//           </p>
//         </div>

//         {/* Hero Banner - Impacto Ambiental */}
//         <HeroBanner />

//         {/* Features Section - Layout Original */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Estadísticas Principales</h2>
//             <Button variant="outline" size="sm" className="text-[#a8c241] border-[#a8c241]">
//               Ver Todo
//             </Button>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Wallet Card con degradado verde oscuro a verde Wiru */}
//             <Card className="bg-gradient-to-r from-[#99bb44] to-[#7fa836] text-white border-0 shadow-lg">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-2">
//                     <BanknotesIcon className="h-5 w-5 text-white opacity-90" />
//                     <span className="text-sm font-medium opacity-90">Saldo Disponible</span>
//                   </div>
                  
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setShowBalance(!showBalance)}
//                     className="text-white hover:bg-white hover:bg-opacity-20 p-1.5"
//                   >
//                     {showBalance ? (
//                       <EyeSlashIcon className="h-4 w-4" />
//                     ) : (
//                       <EyeIcon className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>

//                 <div className="mb-6">
//                   <div className="text-4xl font-bold mb-1">
//                     {showBalance ? `${mockUserData.balance.available.toLocaleString('es-CO')}` : '••••••••'}
//                   </div>
//                 </div>

//                 <Button
//                   onClick={() => window.location.href = '/payments?action=withdraw'}
//                   className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30 font-medium border-0"
//                   disabled={mockUserData.balance.available < 50000}
//                 >
//                   <ArrowUpIcon className="h-4 w-4 mr-2 rotate-45" />
//                   Retirar
//                 </Button>
//               </CardContent>
//             </Card>
            
//             {/* Kg Reciclados */}
//             <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" onClick={() => window.location.href = '/stats'}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <ScaleIcon className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">Kg Reciclados</p>
//                   <p className="text-3xl font-bold text-gray-900 mb-1">{mockUserData.kgRecycled} kg</p>
//                   <p className="text-xs text-gray-500">Contribuyendo al medio ambiente</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             {/* Órdenes Completadas */}
//             <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" onClick={() => window.location.href = '/orders'}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <CheckCircleIcon className="h-6 w-6 text-gray-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600 mb-1">Órdenes Completadas</p>
//                   <p className="text-3xl font-bold text-gray-900 mb-1">{mockUserData.completedOrders}</p>
//                   <p className="text-xs text-gray-500">Exitosamente procesadas</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Earnings Overview Section - Stats Adicionales */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-900">Estadísticas Adicionales</h2>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" onClick={() => window.location.href = '/orders'}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-medium text-gray-600">Órdenes Activas</h3>
//                   <ClipboardDocumentListIcon className="h-6 w-6 text-gray-400" />
//                 </div>
                
//                 <div className="mb-4">
//                   <div className="flex items-baseline space-x-1 mb-2">
//                     <span className="text-3xl font-bold text-gray-900">
//                       {mockUserData.activeOrders}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
//                     <span>En proceso de verificación</span>
//                   </div>
//                 </div>
                
//                 <p className="text-xs text-gray-500">Órdenes pendientes de procesar</p>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" onClick={() => window.location.href = '/payments'}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-medium text-gray-600">Total Ganado</h3>
//                   <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
//                 </div>
                
//                 <div className="mb-4">
//                   <div className="flex items-baseline space-x-1 mb-2">
//                     <span className="text-3xl font-bold text-gray-900">
//                       {mockUserData.totalEarned.toLocaleString('es-CO')}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
//                     <span>+{mockUserData.monthlyGrowth}% este mes</span>
//                   </div>
//                 </div>
                
//                 <p className="text-xs text-gray-500">Ganancias acumuladas totales</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Progress Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="bg-white border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Meta de Reciclaje</h3>
//                 <Badge className="bg-[#a8c241] text-white">91%</Badge>
//               </div>
//               <ProgressBar
//                 value={91}
//                 max={100}
//                 variant="success"
//                 className="mb-3"
//               />
//               <div className="flex justify-between text-sm text-gray-600 mb-2">
//                 <span>{mockUserData.kgRecycled} kg reciclados</span>
//                 <span>Meta: 50 kg</span>
//               </div>
//               <p className="text-xs text-gray-500">
//                 Faltan 4.4 kg para completar tu meta mensual
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white border border-gray-100">
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <div className="bg-[#a8c241]/10 rounded-full p-2">
//                   <SparklesIcon className="h-6 w-6 text-[#a8c241]" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Nivel Gold</h3>
//                   <p className="text-sm text-gray-600">2,450 puntos</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 text-center">
//                 <div>
//                   <p className="text-2xl font-bold text-[#a8c241]">91.2 kg</p>
//                   <p className="text-xs text-gray-500">CO₂ evitado</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-[#a8c241]">7</p>
//                   <p className="text-xs text-gray-500">Referidos activos</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;






// // src/pages/dashboard/DashboardPage.tsx - SIN MATERIAL-UI
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Card, 
//   CardContent, 
//   Button,
//   Badge,
//   ProgressBar
// } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';
// import {
//   PlusIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   ArrowUpIcon,
//   ClipboardDocumentListIcon,
//   CheckCircleIcon,
//   ScaleIcon,
//   BanknotesIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   SparklesIcon,
//   ArrowTrendingUpIcon,
//   ArrowDownIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserGroupIcon,
//   ShoppingBagIcon,
//   UserIcon
// } from '@heroicons/react/24/outline';
// import { PageHeader } from '@/components/layout';

// // Datos mock empresariales actualizados
// const mockUserData = {
//   ordersCompleted: 347,
//   ordersPending: 23, // Nuevos datos para órdenes pendientes
//   totalEarned: 2847650,
//   walletBalance: 200.030,
//   newClients: 128,
//   trafficReceived: 1325134,
//   kgRecycled: 1248.7,
//   monthlyGrowth: 34.7,
//   weeklyGrowth: 12.3,
//   todayEarnings: 59342.32,
//   balance: {
//     available: 1458900,
//     pending: 328450,
//     total: 1703900
//   },
//   co2Impact: 2497.4,
//   treeEquivalent: 112
// };

// // Datos reales para el gráfico de ingresos mensuales
// const monthlyRevenueData = [
//   { month: 'Ene', revenue: 185000, orders: 28 },
//   { month: 'Feb', revenue: 220000, orders: 34 },
//   { month: 'Mar', revenue: 195000, orders: 31 },
//   { month: 'Abr', revenue: 280000, orders: 42 },
//   { month: 'May', revenue: 245000, orders: 38 },
//   { month: 'Jun', revenue: 310000, orders: 47 },
//   { month: 'Jul', revenue: 335000, orders: 52 },
//   { month: 'Ago', revenue: 285000, orders: 45 },
//   { month: 'Sep', revenue: 320000, orders: 49 },
//   { month: 'Oct', revenue: 350000, orders: 55 },
//   { month: 'Nov', revenue: 385000, orders: 62 },
//   { month: 'Dic', revenue: 420000, orders: 68 }
// ];

// // Datos de órdenes recientes
// const recentOrders = [
//   {
//     id: 'ORD-001',
//     type: 'Smartphones',
//     date: '2024-08-12',
//     amount: 125.50,
//     status: 'completada',
//     weight: '2.5kg'
//   },
//   {
//     id: 'ORD-002',
//     type: 'Laptops',
//     date: '2024-08-11',
//     amount: 485.30,
//     status: 'en_curso',
//     weight: '5.2kg'
//   },
//   {
//     id: 'ORD-003',
//     type: 'Tablets',
//     date: '2024-08-10',
//     amount: 89.75,
//     status: 'completada',
//     weight: '1.8kg'
//   },
//   {
//     id: 'ORD-004',
//     type: 'Accesorios',
//     date: '2024-08-09',
//     amount: 45.20,
//     status: 'en_curso',
//     weight: '0.8kg'
//   }
// ];

// // WALLET CARD SIMPLIFICADA SIN TEXTOS INNECESARIOS
// const WalletCard: React.FC<{
//   value: string;
// }> = ({ value }) => {
//   const [showBalance, setShowBalance] = useState(true);
  
//   return (
//     <Card className="bg-white border border-gray-200 transition-colors duration-200">
//       <CardContent className="p-0">
//         {/* Header con icono y toggle */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="p-2.5 rounded-xl flex-shrink-0 bg-emerald-50 border border-emerald-100">
//             <BanknotesIcon className="h-5 w-5 text-emerald-600" />
//           </div>
          
//           {/* Toggle mejorado */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowBalance(!showBalance)}
//             className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2.5 rounded-xl transition-all duration-200 border border-gray-200"
//           >
//             {showBalance ? (
//               <EyeSlashIcon className="h-5 w-5" />
//             ) : (
//               <EyeIcon className="h-5 w-5" />
//             )}
//           </Button>
//         </div>

//         {/* Valor principal */}
//         <div className="mb-6">
//           <div className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
//             {showBalance ? value : '••••••••'}
//           </div>
//         </div>

//         {/* Hipervínculo de retirar */}
//         <Link 
//           to="/payments" 
//           className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 text-sm"
//         >
//           💸 Retirar
//         </Link>
//       </CardContent>
//     </Card>
//   );
// };

// // METRIC CARD SIN TEXTO "ESTE MES"
// const MetricCard: React.FC<{
//   value: string;
//   label: string;
//   change: string;
//   color: string;
//   icon: React.ComponentType<{ className?: string }>;
// }> = ({ value, label, change, color, icon: Icon }) => {
//   return (
//     <Card className="bg-white border border-gray-200 transition-colors duration-200">
//       <CardContent className="p-0">
//         {/* Header con icono */}
//         <div className="flex items-center justify-between mb-4">
//           <div className={`p-2.5 rounded-xl flex-shrink-0 ${
//             color === 'blue' ? 'bg-blue-50 border border-blue-100' : 
//             color === 'purple' ? 'bg-purple-50 border border-purple-100' : 
//             color === 'orange' ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 border border-gray-100'
//           }`}>
//             <Icon className={`h-5 w-5 ${
//               color === 'blue' ? 'text-blue-600' : 
//               color === 'purple' ? 'text-purple-600' : 
//               color === 'orange' ? 'text-orange-600' : 'text-gray-600'
//             }`} />
//           </div>
//         </div>

//         {/* Valor principal */}
//         <div className="mb-3">
//           <div className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
//             {value}
//           </div>
//           <div className="text-sm font-medium text-gray-600">
//             {label}
//           </div>
//         </div>

//         {/* Indicador de cambio SIN "este mes" */}
//         <div className="flex items-center justify-start">
//           <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
//             change.startsWith('+') ? 'bg-green-50 text-green-700 border border-green-200' :
//             change.startsWith('-') ? 'bg-red-50 text-red-700 border border-red-200' :
//             'bg-gray-50 text-gray-700 border border-gray-200'
//           }`}>
//             {change.startsWith('+') && (
//               <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
//             )}
//             {change.startsWith('-') && (
//               <ArrowDownIcon className="h-3 w-3 mr-1" />
//             )}
//             {change}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Componente del gráfico de ingresos - COLOR WIRU Y SIMPLIFICADO
// const RevenueChart: React.FC = () => {
//   return (
//     <Card className="bg-white border border-gray-200">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <ChartBarIcon className="h-5 w-5 text-gray-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h3>
//           </div>
//         </div>
        
//         {/* Contenedor del gráfico con fondo blanco */}
//         <div className="h-64 bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-end justify-between h-full space-x-2">
//             {monthlyRevenueData.map((data, index) => {
//               // Calcular altura como porcentaje del contenedor
//               const maxRevenue = 420000; // Valor máximo conocido
//               const heightPercent = (data.revenue / maxRevenue) * 90; // 90% máximo para dejar espacio
              
//               return (
//                 <div key={index} className="flex flex-col items-center h-full justify-end flex-1">
//                   {/* Barra con color verde Wiru */}
//                   <div 
//                     className="bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-colors duration-200 w-full max-w-8 cursor-pointer relative group"
//                     style={{ 
//                       height: `${Math.max(heightPercent, 10)}%`,
//                       minHeight: '20px'
//                     }}
//                   >
//                     {/* Tooltip */}
//                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
//                       ${(data.revenue / 1000).toFixed(0)}k
//                     </div>
//                   </div>
                  
//                   {/* Etiqueta del mes */}
//                   <span className="text-xs text-gray-600 mt-2 font-medium">
//                     {data.month}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
        
//         <div className="flex justify-between items-center mt-4 text-sm">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-3 h-3 bg-emerald-500 rounded"></div>
//               <span className="text-gray-600">Ingresos</span>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="font-medium text-gray-900">
//               $3,532,000
//             </p>
//             <p className="text-xs text-gray-500">Total este año</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Componente de órdenes recientes
// const RecentOrders: React.FC = () => {
//   return (
//     <Card className="bg-white border border-gray-200">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
//             <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
//           </div>
//           <Link to="/orders">
//             <Button variant="outline" size="sm">Ver todas</Button>
//           </Link>
//         </div>
        
//         <div className="space-y-4">
//           {recentOrders.map((order) => (
//             <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
//                   <ShoppingBagIcon className="h-4 w-4 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{order.type}</p>
//                   <p className="text-xs text-gray-500">{order.id} • {order.weight}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <Badge variant={order.status === 'completada' ? 'success' : 'warning'}>
//                   {order.status === 'completada' ? 'Completada' : 'En Curso'}
//                 </Badge>
//                 <p className="text-xs font-medium text-gray-900">${order.amount}</p>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="flex justify-between text-sm text-gray-600">
//             <span>Total órdenes:</span>
//             <span className="font-medium text-gray-900">347</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Componente principal
// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   // if (isLoading) {
//   //   return (
//   //     <div className="space-y-8 animate-pulse">
//   //       <div className="h-16 bg-gray-200 rounded-lg"></div>
//   //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//   //         {[1, 2, 3, 4].map((i) => (
//   //           <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
//   //         ))}
//   //       </div>
//   //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//   //         <div className="h-80 bg-gray-200 rounded-lg"></div>
//   //         <div className="h-80 bg-gray-200 rounded-lg"></div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="space-y-8  min-h-screen">
//       {/* Header */}
//       <PageHeader
//               title="Dashboard"
//               description="Convierte tus dispositivos electrónicos en dinero de forma fácil y segura"
//             />

//       {/* Métricas principales */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Wallet Card simplificada */}
//         <WalletCard
//           value={`$${mockUserData.walletBalance.toLocaleString()}`}
//         />
        
//         {/* Otras métricas */}
//         <MetricCard
//           value="347"
//           label="Órdenes Completadas"
//           change="+14%"
//           color="blue"
//           icon={CheckCircleIcon}
//         />
//         <MetricCard
//           value={`${mockUserData.kgRecycled.toFixed(1)}kg`}
//           label="Kg Reciclados"
//           change="+8.2kg"
//           color="purple"
//           icon={ScaleIcon}
//         />
//         <MetricCard
//           value={mockUserData.ordersPending.toString()}
//           label="Órdenes Pendientes"
//           change="+3"
//           color="orange"
//           icon={ClockIcon}
//         />
//       </div>

//       {/* Sección media: Gráfico + Órdenes */}
//       <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
//         <RevenueChart />
//         <RecentOrders />
//       </div>

//       {/* Sección inferior: Gráficos adicionales */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
//         {/* Impacto Ambiental - MEJORADO */}
//         <Card className="bg-white border border-gray-200">
//           <CardContent className="p-2">
//             <div className="flex items-center space-x-2 mb-6">
//               <SparklesIcon className="h-5 w-5 text-emerald-600" />
//               <h3 className="text-lg font-semibold text-gray-900">Impacto Ambiental</h3>
//             </div>
            
//             {/* Contenido principal más grande */}
//             <div className="space-y-6">
//               {/* CO₂ Evitado */}
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100">
//                   <div className="text-center">
//                     <p className="text-3xl font-bold text-emerald-600">{mockUserData.co2Impact.toFixed(0)}</p>
//                     <p className="text-xs text-emerald-600 font-medium">kg CO₂</p>
//                   </div>
//                 </div>
//                 <p className="text-lg font-semibold text-gray-900 mb-2">CO₂ Evitado</p>
//                 <p className="text-sm text-gray-600">
//                   Equivale a {mockUserData.treeEquivalent} árboles plantados 🌱
//                 </p>
//               </div>

//             </div>
//           </CardContent>
//         </Card>

//         {/* Órdenes por Mes */}
//         <Card className="bg-white border border-gray-200">
//           <CardContent className="p-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <ChartBarIcon className="h-5 w-5 text-gray-600" />
//               <h3 className="text-lg font-semibold text-gray-900">Órdenes por Mes</h3>
//             </div>
//             <div className="h-20 bg-gray-50 rounded-lg flex items-end justify-center p-4">
//               <div className="flex items-end space-x-2 h-full">
//                 {[65, 45, 80, 55, 70, 90, 75].map((height, index) => (
//                   <div key={index} className="flex flex-col items-center">
//                     <div 
//                       className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t w-4 transition-all duration-300"
//                       style={{ height: `${height}%` }}
//                     ></div>
//                     <span className="text-xs text-gray-500 mt-1">
//                       {['E', 'F', 'M', 'A', 'M', 'J', 'J'][index]}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-center space-x-4 mt-4 text-xs">
//               <div className="flex items-center space-x-1">
//                 <div className="w-2 h-2 bg-emerald-500 rounded"></div>
//                 <span className="text-gray-600">Completadas</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <div className="w-2 h-2 bg-orange-500 rounded"></div>
//                 <span className="text-gray-600">En Curso</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

       
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;







// src/pages/dashboard/DashboardPage.tsx - Actualizado con colores de Wiru
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Button,
  Badge,
  ProgressBar
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import {
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ScaleIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout';

// Datos mock empresariales actualizados
const mockUserData = {
  ordersCompleted: 347,
  ordersPending: 23,
  totalEarned: 2847650,
  walletBalance: 200.03,
  newClients: 128,
  trafficReceived: 1325134,
  kgRecycled: 1248.7,
  monthlyGrowth: 34.7,
  weeklyGrowth: 12.3,
  todayEarnings: 59342.32,
  balance: {
    available: 1458900,
    pending: 328450,
    total: 1703900
  },
  co2Impact: 2497.4,
  treeEquivalent: 112
};

// Datos para el gráfico de ingresos mensuales
const monthlyEarningsData = [
  { month: 'Ene', revenue: 0 },
  { month: 'Feb', revenue: 0 },
  { month: 'Mar', revenue: 0 },
  { month: 'Abr', revenue: 0 },
  { month: 'May', revenue: 0 },
  { month: 'Jun', revenue: 0 },
  { month: 'Jul', revenue: 10 },
  { month: 'Ago', revenue: 0 },
  { month: 'Sep', revenue: 0 },
  { month: 'Oct', revenue: 0 },
  { month: 'Nov', revenue: 0 },
  { month: 'Dic', revenue: 0 }
];

// Órdenes recientes mock
const recentOrders = [
  {
    id: 'ORD-001',
    item: 'Smartphones',
    weight: 2.5,
    status: 'Completada',
    amount: 125.5
  },
  {
    id: 'ORD-002',
    item: 'Laptops',
    weight: 5.2,
    status: 'En Curso',
    amount: 485.3
  },
  {
    id: 'ORD-003',
    item: 'Tablets',
    weight: 1.8,
    status: 'Completada',
    amount: 89.75
  },
  {
    id: 'ORD-004',
    item: 'Accesorios',
    weight: 0.8,
    status: 'En Curso',
    amount: 45.2
  }
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('Buenos días');
    } else if (hour < 18) {
      setTimeOfDay('Buenas tardes');
    } else {
      setTimeOfDay('Buenas noches');
    }
  }, []);

  const getMaxRevenue = () => {
    return Math.max(...monthlyEarningsData.map(data => data.revenue));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header personalizado */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {timeOfDay}, {user?.firstName || 'Usuario'} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Convierte tus dispositivos electrónicos en dinero de forma fácil y segura
            </p>
          </div>
          
          <Link to="/sell">
            <Button className="bg-gradient-to-r from-[#a8c241] to-[#8ea635] hover:from-[#8ea635] hover:to-[#719428] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <PlusIcon className="h-5 w-5 mr-2" />
              Vender Ahora
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tarjetas principales de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Saldo disponible */}
          <Card className="bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-50"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BanknotesIcon className="h-6 w-6 text-white opacity-90" />
                  <span className="text-sm font-medium opacity-90">Saldo Disponible</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1.5"
                >
                  {showBalance ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold mb-1">
                  {showBalance ? `${mockUserData.walletBalance.toLocaleString()}` : '****'}
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowUpIcon className="h-4 w-4 text-[#c5d96f]" />
                  <span className="text-sm text-[#c5d96f]">+14% este mes</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-20"
              >
                Retirar Fondos
              </Button>
            </CardContent>
          </Card>

          {/* Órdenes completadas */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-6 w-6 text-[#a8c241]" />
                  <span className="text-sm font-medium text-gray-600">Órdenes Completadas</span>
                </div>
                <Badge className="bg-[#a8c241] bg-opacity-10 text-[#719428] border-0">
                  +14%
                </Badge>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">
                {mockUserData.ordersCompleted.toLocaleString()}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ArrowTrendingUpIcon className="h-4 w-4 text-[#a8c241]" />
                <span>+{mockUserData.weeklyGrowth}% vs semana anterior</span>
              </div>
            </CardContent>
          </Card>

          {/* Kg reciclados */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ScaleIcon className="h-6 w-6 text-[#8ea635]" />
                  <span className="text-sm font-medium text-gray-600">Kg Reciclados</span>
                </div>
                <Badge className="bg-[#8ea635] bg-opacity-10 text-[#5d7a1c] border-0">
                  +8.2kg
                </Badge>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">
                {mockUserData.kgRecycled}kg
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SparklesIcon className="h-4 w-4 text-[#8ea635]" />
                <span>Impacto ambiental positivo</span>
              </div>
            </CardContent>
          </Card>

          {/* Órdenes pendientes */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-6 w-6 text-[#c5d96f]" />
                  <span className="text-sm font-medium text-gray-600">Órdenes Pendientes</span>
                </div>
                <Badge className="bg-[#c5d96f] bg-opacity-10 text-[#719428] border-0">
                  +3
                </Badge>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">
                {mockUserData.ordersPending}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ClipboardDocumentListIcon className="h-4 w-4 text-[#c5d96f]" />
                <span>En proceso</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de gráficos y datos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de ingresos mensuales */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h3>
                  <p className="text-sm text-gray-600">Tendencia de ganancias del año</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#a8c241]">$3,532,000</p>
                  <p className="text-sm text-gray-600">Total este año</p>
                </div>
              </div>
              
              {/* Gráfico de barras simple */}
              <div className="flex items-end justify-between h-80 space-x-1 bg-gray-50 rounded-lg p-4">
                {monthlyEarningsData.map((data, index) => {
                  const heightPercent = (data.revenue / getMaxRevenue()) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center h-full justify-end flex-1">
                      {/* Barra con gradiente verde Wiru */}
                      <div 
                        className="bg-gradient-to-t from-[#a8c241] to-[#c5d96f] hover:from-[#8ea635] hover:to-[#a8c241] rounded-t-sm transition-colors duration-200 w-full max-w-8 cursor-pointer relative group"
                        style={{ 
                          height: `${Math.max(heightPercent, 10)}%`,
                          minHeight: '20px'
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          ${(data.revenue / 1000).toFixed(0)}k
                        </div>
                      </div>
                      
                      {/* Etiqueta del mes */}
                      <span className="text-xs text-gray-600 mt-2 font-medium">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#a8c241] to-[#c5d96f] rounded"></div>
                    <span className="text-gray-600">Ingresos</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    Promedio mensual: ${(3532000 / 12).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Órdenes recientes */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
                <Link to="/orders">
                  <Button variant="outline" size="sm" className="text-[#a8c241] border-[#a8c241] hover:bg-[#a8c241] hover:text-white">
                    Ver todas
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#a8c241] rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.item}</p>
                        <p className="text-xs text-gray-600">{order.id} • {order.weight}kg</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-[#a8c241] text-sm">${order.amount}</p>
                      <Badge 
                        className={`text-xs ${
                          order.status === 'Completada' 
                            ? 'bg-[#a8c241] bg-opacity-10 text-[#719428]' 
                            : 'bg-[#c5d96f] bg-opacity-10 text-[#8ea635]'
                        } border-0`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">¿Tienes más dispositivos?</p>
                  <Link to="/sell">
                    <Button className="w-full bg-gradient-to-r from-[#a8c241] to-[#8ea635] hover:from-[#8ea635] hover:to-[#719428] text-white">
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      Crear Nueva Orden
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de acciones rápidas */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/sell">
                <Button variant="outline" className="h-auto py-4 flex-col border-[#a8c241] text-[#a8c241] hover:bg-[#a8c241] hover:text-white transition-all">
                  <ShoppingBagIcon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Vender</span>
                </Button>
              </Link>
              
              <Link to="/orders">
                <Button variant="outline" className="h-auto py-4 flex-col border-[#8ea635] text-[#8ea635] hover:bg-[#8ea635] hover:text-white transition-all">
                  <ClipboardDocumentListIcon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Mis Órdenes</span>
                </Button>
              </Link>
              
              <Link to="/payments">
                <Button variant="outline" className="h-auto py-4 flex-col border-[#719428] text-[#719428] hover:bg-[#719428] hover:text-white transition-all">
                  <CurrencyDollarIcon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Pagos</span>
                </Button>
              </Link>
              
              <Link to="/stats">
                <Button variant="outline" className="h-auto py-4 flex-col border-[#c5d96f] text-[#719428] hover:bg-[#c5d96f] hover:text-white transition-all">
                  <ChartBarIcon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">Estadísticas</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Banner de impacto ambiental */}
        <Card className="bg-gradient-to-r from-[#a8c241] to-[#8ea635] text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Impacto Ambiental</h3>
                  <p className="text-[#c5d96f] text-lg">Has evitado {mockUserData.co2Impact} kg de CO₂</p>
                  <p className="text-white opacity-90">Equivalente a plantar {mockUserData.treeEquivalent} árboles</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-2xl font-bold">{mockUserData.kgRecycled}kg</p>
                  <p className="text-sm text-[#c5d96f]">Material reciclado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;