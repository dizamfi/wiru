// // src/components/layout/Header.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import {
//   BellIcon,
//   Bars3Icon,
//   ChevronDownIcon,
//   UserIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon,
// } from '@heroicons/react/24/outline';
// import { Button, Badge } from '@/components/ui';
// import { useAuth } from '@/hooks/useAuth';
// import { cn } from '@/utils/cn';
// import { env } from '@/utils/env';

// interface HeaderProps {
//   onMenuClick?: () => void;
//   showMenuButton?: boolean;
// }

// export const Header: React.FC<HeaderProps> = ({ 
//   onMenuClick, 
//   showMenuButton = false 
// }) => {
//   const { user, logout, isAuthenticated } = useAuth();
  
//   // Mock notification count
//   const notificationCount = 3;

//   const userInitials = user ? 
//     `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
//     'U';

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Left side */}
//           <div className="flex items-center">
//             {/* Menu button for mobile */}
//             {showMenuButton && (
//               <button
//                 type="button"
//                 className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
//                 onClick={onMenuClick}
//               >
//                 <span className="sr-only">Abrir sidebar</span>
//                 <Bars3Icon className="h-6 w-6" />
//               </button>
//             )}

//             {/* Logo for public pages */}
//             {!showMenuButton && (
//               <Link to="/" className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">CE</span>
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">
//                   {env.APP_NAME}
//                 </span>
//               </Link>
//             )}

//             {/* Navigation for public pages */}
//             {!isAuthenticated && (
//               <nav className="hidden md:flex space-x-8 ml-10">
//                 <Link 
//                   to="/about" 
//                   className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
//                 >
//                   Sobre Nosotros
//                 </Link>
//                 <Link 
//                   to="/how-it-works" 
//                   className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
//                 >
//                   Cómo Funciona
//                 </Link>
//                 <Link 
//                   to="/contact" 
//                   className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
//                 >
//                   Contacto
//                 </Link>
//               </nav>
//             )}
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <Button variant="ghost" size="icon">
//                     <BellIcon className="h-5 w-5" />
//                     {notificationCount > 0 && (
//                       <Badge 
//                         variant="danger" 
//                         className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
//                       >
//                         {notificationCount}
//                       </Badge>
//                     )}
//                   </Button>
//                 </div>

//                 {/* User Menu */}
//                 <Menu as="div" className="relative">
//                   <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                     {user?.avatar ? (
//                       <img
//                         src={user.avatar}
//                         alt={`${user.firstName} ${user.lastName}`}
//                         className="w-8 h-8 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-medium">
//                           {userInitials}
//                         </span>
//                       </div>
//                     )}
//                     <div className="hidden sm:block text-left">
//                       <p className="text-sm font-medium text-gray-900">
//                         {user?.firstName} {user?.lastName}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {user?.email}
//                       </p>
//                     </div>
//                     <ChevronDownIcon className="hidden sm:block w-4 h-4 text-gray-400" />
//                   </Menu.Button>

//                   <Transition
//                     as={React.Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//                       <div className="px-1 py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/profile"
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
//                               )}
//                             >
//                               <UserIcon className="mr-2 h-4 w-4" />
//                               Mi Perfil
//                             </Link>
//                           )}
//                         </Menu.Item>
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/settings"
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
//                               )}
//                             >
//                               <Cog6ToothIcon className="mr-2 h-4 w-4" />
//                               Configuración
//                             </Link>
//                           )}
//                         </Menu.Item>
//                       </div>
//                       <div className="px-1 py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <button
//                               onClick={() => logout()}
//                               className={cn(
//                                 'group flex w-full items-center rounded-md px-2 py-2 text-sm',
//                                 active ? 'bg-red-100 text-red-900' : 'text-gray-900'
//                               )}
//                             >
//                               <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
//                               Cerrar Sesión
//                             </button>
//                           )}
//                         </Menu.Item>
//                       </div>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>
//               </>
//             ) : (
//               /* Auth buttons for public pages */
//               <div className="flex items-center space-x-4">
//                 <Link to="/login">
//                   <Button variant="ghost">
//                     Iniciar Sesión
//                   </Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button>
//                     Registrarse
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };








// src/components/layout/Header.tsx - Actualizado con logo SVG y estilo Binance

// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   MagnifyingGlassIcon,
//   BellIcon,
//   UserCircleIcon,
//   ChevronDownIcon,
//   CogIcon,
//   ArrowRightOnRectangleIcon,
//   GlobeAltIcon,
//   QuestionMarkCircleIcon,
//   ChartBarIcon,
//   ClipboardDocumentListIcon,
//   ShoppingBagIcon,
//   BanknotesIcon
// } from '@heroicons/react/24/outline';
// import { cn } from '@/utils/cn';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { useAuth } from '@/hooks/useAuth';
// import { env } from '@/utils/env';

// // Importar el logo SVG existente
// import WiruLogo from '@/assets/logo.svg'; // Ajusta la ruta según donde tengas el SVG

// interface HeaderProps {
//   onMenuClick: () => void;
//   showMenuButton?: boolean;
// }

// export const Header: React.FC<HeaderProps> = ({ 
//   onMenuClick, 
//   showMenuButton = false 
// }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout, isAuthenticated } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [notifications, setNotifications] = useState(3);

//   // Navegación principal para cuando está autenticado
//   const mainNavigation = [
//     { 
//       name: 'Inicio', 
//       href: '/dashboard', 
//       current: location.pathname === '/dashboard',
//       icon: ChartBarIcon 
//     },
//     { 
//       name: 'Vender', 
//       href: '/sell', 
//       current: location.pathname === '/sell',
//       icon: ShoppingBagIcon,
//       badge: 'Hot',
//       badgeColor: 'bg-secondary-500 text-gray-900'
//     },
//     { 
//       name: 'Órdenes', 
//       href: '/dashboard/orders', 
//       current: location.pathname.includes('/orders'),
//       icon: ClipboardDocumentListIcon 
//     },
//     { 
//       name: 'Pagos', 
//       href: '/dashboard/payments', 
//       current: location.pathname.includes('/payments'),
//       icon: BanknotesIcon 
//     },
//   ];

//   // Navegación para páginas públicas
//   const publicNavigation = [
//     { name: 'Inicio', href: '/', current: location.pathname === '/' },
//     { name: 'Cómo Funciona', href: '/how-it-works', current: location.pathname === '/how-it-works' },
//     { name: 'Sobre Nosotros', href: '/about', current: location.pathname === '/about' },
//     { name: 'Contacto', href: '/contact', current: location.pathname === '/contact' },
//   ];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   const userInitials = user ? 
//     `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
//     'U';

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md bg-white/95">
//       <div className="max-w-full mx-auto px-4 lg:px-6">
//         <div className="flex justify-between items-center h-16">
//           {/* Left section - Logo y navegación */}
//           <div className="flex items-center space-x-6">
//             {/* Mobile menu button */}
//             {showMenuButton && (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onMenuClick}
//                 className="lg:hidden"
//               >
//                 <Bars3Icon className="h-6 w-6" />
//               </Button>
//             )}

//             {/* Logo - usando tu SVG existente */}
//             <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
//               <img 
//                 src={WiruLogo} 
//                 alt="Wiru" 
//                 className="h-8 w-8 flex-shrink-0"
//               />
//               <div className="hidden sm:block">
//                 <span className="text-xl font-bold text-primary-600">wiru</span>
//               </div>
//             </Link>

//             {/* Main navigation - Desktop */}
//             <div className="hidden lg:flex lg:items-center lg:space-x-1">
//               {(isAuthenticated ? mainNavigation : publicNavigation).map((item) => {
//                 const Icon = 'icon' in item ? item.icon : null;
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={cn(
//                       'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
//                       item.current
//                         ? 'bg-primary-100 text-primary-700'
//                         : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
//                     )}
//                   >
//                     {/* {Icon && <Icon className="h-4 w-4" />}
//                     <span>{item.name}</span>
//                     {'badge' in item && item.badge && (
//                       <span className={cn(
//                         'px-1.5 py-0.5 text-xs font-medium rounded-full',
//                         item.badgeColor || 'bg-primary-100 text-primary-800'
//                       )}>
//                         {item.badge}
//                       </span>
//                     )} */}
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Center - Search bar (solo si está autenticado) */}
//           {isAuthenticated && (
//             <div className="flex-1 max-w-xl mx-6 hidden md:block">
//               <form onSubmit={handleSearch} className="relative">
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Buscar órdenes, dispositivos..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-sm"
//                   />
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Right section */}
//           <div className="flex items-center space-x-3">
//             {isAuthenticated ? (
//               <>
//                 {/* Search button - Mobile */}
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <MagnifyingGlassIcon className="h-5 w-5" />
//                 </Button>

//                 {/* Balance estimado (estilo Binance) */}
//                 <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 bg-gray-50 rounded-lg">
//                   <div className="text-right">
//                     <p className="text-xs text-gray-500">Balance estimado</p>
//                     <p className="text-sm font-semibold text-gray-900">1,985.49 USDT</p>
//                   </div>
//                   <div className="text-xs text-danger-600">
//                     -24.22 $(-1.20%)
//                   </div>
//                 </div>

//                 {/* Quick actions */}
//                 <div className="hidden sm:flex items-center space-x-2">
//                   <Link to="/dashboard/payments/deposit">
//                     <Button size="sm" variant="secondary" className="text-xs">
//                       Depositar
//                     </Button>
//                   </Link>
                  
//                   <Link to="/dashboard/payments/withdraw">
//                     <Button size="sm" variant="outline" className="text-xs">
//                       Retirar
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* Notifications */}
//                 <div className="relative">
//                   <Button variant="ghost" size="icon">
//                     <BellIcon className="h-5 w-5" />
//                   </Button>
//                   {notifications > 0 && (
//                     <Badge 
//                       variant="danger" 
//                       className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0 min-w-[16px]"
//                     >
//                       {notifications}
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Language selector */}
//                 <Menu as="div" className="relative hidden sm:block">
//                   <Menu.Button className="flex items-center space-x-1 px-2 py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors duration-200 rounded-lg hover:bg-gray-50">
//                     <GlobeAltIcon className="h-4 w-4" />
//                     <span className="text-xs">ES</span>
//                   </Menu.Button>
                  
//                   <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       <div className="py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <button className={cn(
//                               'flex items-center w-full px-3 py-2 text-sm',
//                               active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                             )}>
//                               🇪🇸 Español
//                             </button>
//                           )}
//                         </Menu.Item>
//                         <Menu.Item>
//                           {({ active }) => (
//                             <button className={cn(
//                               'flex items-center w-full px-3 py-2 text-sm',
//                               active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                             )}>
//                               🇺🇸 English
//                             </button>
//                           )}
//                         </Menu.Item>
//                       </div>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>

//                 {/* User menu (estilo Binance) */}
//                 <Menu as="div" className="relative">
//                   <Menu.Button className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//                     <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
//                       <span className="text-xs font-semibold text-white">
//                         {userInitials}
//                       </span>
//                     </div>
//                     <div className="hidden sm:block text-left max-w-32">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {user?.firstName}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         Usuario habitual
//                       </p>
//                     </div>
//                     <ChevronDownIcon className="h-3 w-3 text-gray-400" />
//                   </Menu.Button>

//                   <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       {/* Header del menú */}
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
//                             <span className="text-sm font-semibold text-white">
//                               {userInitials}
//                             </span>
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-900">
//                               {user?.firstName} {user?.lastName}
//                             </p>
//                             <p className="text-xs text-gray-500">UID: 39858387</p>
//                           </div>
//                         </div>
//                         <div className="mt-2 text-xs text-gray-600">
//                           <span>Nivel VIP: </span>
//                           <span className="text-warning-600">Usuario habitual ›</span>
//                         </div>
//                       </div>
                      
//                       <div className="py-1">
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/dashboard/profile"
//                               className={cn(
//                                 'flex items-center px-4 py-2 text-sm',
//                                 active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                               )}
//                             >
//                               <UserCircleIcon className="mr-3 h-4 w-4" />
//                               Mi Perfil
//                             </Link>
//                           )}
//                         </Menu.Item>
                        
//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/dashboard/settings"
//                               className={cn(
//                                 'flex items-center px-4 py-2 text-sm',
//                                 active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                               )}
//                             >
//                               <CogIcon className="mr-3 h-4 w-4" />
//                               Configuración
//                             </Link>
//                           )}
//                         </Menu.Item>

//                         <Menu.Item>
//                           {({ active }) => (
//                             <Link
//                               to="/help"
//                               className={cn(
//                                 'flex items-center px-4 py-2 text-sm',
//                                 active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                               )}
//                             >
//                               <QuestionMarkCircleIcon className="mr-3 h-4 w-4" />
//                               Centro de Ayuda
//                             </Link>
//                           )}
//                         </Menu.Item>
                        
//                         <div className="border-t border-gray-100 my-1"></div>
                        
//                         <Menu.Item>
//                           {({ active }) => (
//                             <button
//                               onClick={handleLogout}
//                               className={cn(
//                                 'flex items-center w-full px-4 py-2 text-sm',
//                                 active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
//                               )}
//                             >
//                               <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
//                               Cerrar Sesión
//                             </button>
//                           )}
//                         </Menu.Item>
//                       </div>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>
//               </>
//             ) : (
//               /* Usuario no autenticado */
//               <div className="flex items-center space-x-3">
//                 <Link to="/login">
//                   <Button variant="ghost" size="sm">
//                     Iniciar Sesión
//                   </Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button variant="default" size="sm">
//                     Registrarse
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile navigation menu (solo cuando showMenuButton está activo) */}
//       {showMenuButton && (
//         <div className="lg:hidden border-t border-gray-200 bg-white">
//           <div className="px-4 py-3 space-y-1">
//             {mainNavigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   onClick={onMenuClick}
//                   className={cn(
//                     'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium',
//                     item.current
//                       ? 'bg-primary-100 text-primary-700'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   )}
//                 >
//                   <Icon className="h-5 w-5" />
//                   <span>{item.name}</span>
//                   {item.badge && (
//                     <span className={cn(
//                       'px-1.5 py-0.5 text-xs font-medium rounded-full ml-auto',
//                       item.badgeColor || 'bg-primary-100 text-primary-800'
//                     )}>
//                       {item.badge}
//                     </span>
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };






// src/components/layout/Header.tsx - Ancho completo y fijo

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

// Importar el logo SVG existente (color #D0FF5B)
import WiruLogo from '@/assets/logo.svg';

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  showMenuButton = false 
}) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [notifications] = useState(3); // Mock notifications

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userInitials = user ? 
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
    'U';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Header ocupa todo el ancho sin márgenes */}
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section - Logo y botón menú */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {showMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </Button>
            )}

            {/* Logo Wiru */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3">
              <img 
                src={WiruLogo} 
                alt="Wiru" 
                className="h-20 w-20 flex-shrink-0"
              />
              {/* <span className="text-xl font-bold text-primary-600 hidden sm:block">wiru</span> */}
            </Link>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            
            {isAuthenticated ? (
              <>
                {/* Botón Vender */}
                <Link to="/sell">
                  <Button 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-2"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                    <span>Vender</span>
                  </Button>
                </Link>

                {/* Botón Vender - Mobile */}
                <Link to="/sell" className="sm:hidden">
                  <Button size="icon" variant="secondary">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </Button>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                  </Button>
                  {notifications > 0 && (
                    <Badge 
                      variant="danger" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0 min-w-[16px]"
                    >
                      {notifications}
                    </Badge>
                  )}
                </div>

                {/* User Profile Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {userInitials}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 max-w-24 truncate">
                        {user?.firstName || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500">Eco Warrior</p>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400 hidden md:block" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {userInitials}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/profile"
                              className={cn(
                                'flex items-center px-4 py-2 text-sm transition-colors',
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              <UserCircleIcon className="mr-3 h-4 w-4" />
                              Mi Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard/settings"
                              className={cn(
                                'flex items-center px-4 py-2 text-sm transition-colors',
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              <CogIcon className="mr-3 h-4 w-4" />
                              Configuración
                            </Link>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/help"
                              className={cn(
                                'flex items-center px-4 py-2 text-sm transition-colors',
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              <QuestionMarkCircleIcon className="mr-3 h-4 w-4" />
                              Centro de Ayuda
                            </Link>
                          )}
                        </Menu.Item>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                'flex items-center w-full px-4 py-2 text-sm transition-colors',
                                active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              /* Usuario no autenticado */
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};