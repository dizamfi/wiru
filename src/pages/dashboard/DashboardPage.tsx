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







// src/pages/dashboard/DashboardPage.tsx - DASHBOARD COMPLETO SIN DESBORDAMIENTO
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
  // TrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

// Datos mock empresariales
const mockUserData = {
  ordersCompleted: 347,
  totalEarned: 2847650,
  walletBalance: 1458900,
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

// Datos de órdenes recientes
const recentOrders = [
  {
    id: 'ORD-001',
    type: 'Smartphones',
    date: '2024-08-12',
    amount: 125.50,
    status: 'completada',
    weight: '2.5kg'
  },
  {
    id: 'ORD-002',
    type: 'Laptops',
    date: '2024-08-11',
    amount: 485.30,
    status: 'en_curso',
    weight: '5.2kg'
  },
  {
    id: 'ORD-003',
    type: 'Tablets',
    date: '2024-08-10',
    amount: 89.75,
    status: 'completada',
    weight: '1.8kg'
  },
  {
    id: 'ORD-004',
    type: 'Accesorios',
    date: '2024-08-09',
    amount: 45.20,
    status: 'en_curso',
    weight: '0.8kg'
  }
];

// Header del Dashboard
const DashboardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DASHBOARD</h1>
        <p className="text-gray-600">Bienvenido a tu dashboard</p>
      </div>
      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
        DESCARGAR REPORTES
      </Button>
    </div>
  );
};

// Componente de métrica sin desbordamiento
const MetricCard: React.FC<{
  value: string;
  label: string;
  change: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  isWallet?: boolean;
}> = ({ value, label, change, color, icon: Icon, isWallet = false }) => {
  const [showBalance, setShowBalance] = useState(true);
  
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              color === 'emerald' ? 'bg-emerald-100' : 
              color === 'blue' ? 'bg-blue-100' : 
              color === 'purple' ? 'bg-purple-100' : 
              color === 'orange' ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              <Icon className={`h-5 w-5 ${
                color === 'emerald' ? 'text-emerald-600' : 
                color === 'blue' ? 'text-blue-600' : 
                color === 'purple' ? 'text-purple-600' : 
                color === 'orange' ? 'text-orange-600' : 'text-green-600'
              }`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 mb-1 truncate">{label}</p>
              <p className={`text-lg font-bold text-gray-900 truncate ${isWallet ? 'font-mono' : ''}`}>
                {isWallet && !showBalance ? '••••••••' : value}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1 flex-shrink-0">
            {isWallet && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:bg-gray-100 p-1 w-6 h-6"
              >
                {showBalance ? <EyeSlashIcon className="h-3 w-3" /> : <EyeIcon className="h-3 w-3" />}
              </Button>
            )}
            <span className={`text-xs font-medium ${
              color === 'emerald' ? 'text-emerald-600' : 
              color === 'blue' ? 'text-blue-600' : 
              color === 'purple' ? 'text-purple-600' : 
              color === 'orange' ? 'text-orange-600' : 'text-green-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Gráfico de ingresos
const RevenueChart: React.FC = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">Ingresos Generados</h3>
            <p className="text-2xl font-bold text-emerald-600 truncate">${mockUserData.todayEarnings.toLocaleString()}</p>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <DocumentArrowDownIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center p-4">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium text-sm">Gráfico de Ingresos</p>
            <p className="text-xs text-gray-400">Últimos 12 meses</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Órdenes</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Ingresos</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Usuarios</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Historial de órdenes
const RecentOrders: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-emerald-100 text-emerald-700';
      case 'en_curso':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completada':
        return <CheckCircleIcon className="h-4 w-4 text-emerald-600" />;
      case 'en_curso':
        return <ClockIcon className="h-4 w-4 text-orange-600" />;
      default:
        return <ClipboardDocumentListIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 truncate">Historial de Órdenes</h3>
          <Link to="/orders">
            <Button variant="outline" size="sm" className="flex-shrink-0">
              Ver Todas
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate text-sm">{order.id}</p>
                  <p className="text-xs text-gray-600 truncate">{order.type} • {order.weight}</p>
                </div>
              </div>
              <div className="text-right space-y-1 flex-shrink-0 ml-2">
                <p className="text-xs text-gray-600">{order.date}</p>
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                  {order.status === 'completada' ? 'Completada' : 'En Curso'}
                </Badge>
                <p className="text-xs font-medium text-gray-900">${order.amount}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total órdenes este mes:</span>
            <span className="font-medium text-gray-900">347</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-lg"></div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <DashboardHeader />

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          value={`$${mockUserData.walletBalance.toLocaleString()}`}
          label="Saldo Disponible"
          change="Wallet"
          color="emerald"
          icon={BanknotesIcon}
          isWallet={true}
        />
        <MetricCard
          value="347"
          label="Órdenes Completadas"
          change="+14%"
          color="blue"
          icon={CheckCircleIcon}
        />
        <MetricCard
          value={`${mockUserData.kgRecycled.toFixed(1)}kg`}
          label="Kg Reciclados"
          change="+8.2kg"
          color="purple"
          icon={ScaleIcon}
        />
        <MetricCard
          value="128"
          label="Nuevos Clientes"
          change="+5%"
          color="orange"
          icon={UserGroupIcon}
        />
      </div>

      {/* Sección media: Gráfico + Órdenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentOrders />
      </div>

      {/* Sección inferior: Gráficos adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Impacto Ambiental */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 truncate">Impacto Ambiental</h3>
            <div className="h-40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-emerald-600">{mockUserData.co2Impact.toFixed(0)}</p>
                    <p className="text-xs text-emerald-600">kg CO₂</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">CO₂ Evitado</p>
                <p className="text-xs text-gray-500">
                  {mockUserData.treeEquivalent} árboles plantados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Órdenes por Mes */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 truncate">Órdenes por Mes</h3>
            <div className="h-40 bg-gray-50 rounded-lg flex items-end justify-center p-4">
              <div className="flex items-end space-x-2 h-full">
                {[65, 45, 80, 55, 70, 90, 75].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t w-4 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {['E', 'F', 'M', 'A', 'M', 'J', 'J'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded"></div>
                <span className="text-gray-600">Completadas</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
                <span className="text-gray-600">En Curso</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuarios por Ciudad */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 truncate">Usuarios por Ciudad</h3>
            <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-500 font-medium text-sm">Colombia</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">Bogotá</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">Medellín</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">23%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate flex-1 mr-2">Cali</span>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/3 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium w-8 text-right">18%</span>
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