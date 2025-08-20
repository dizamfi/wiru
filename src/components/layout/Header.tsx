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






// src/components/layout/Header.tsx - Header completo con navegación de información

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ShoppingBagIcon,
  InformationCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

// Importar el logo SVG existente
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
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [notifications] = useState(3); // Mock notifications
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navegación de información pública
  const publicNavigation = [
    { 
      name: 'Inicio', 
      href: '/how-it-works', 
      // icon: DocumentTextIcon,
      current: location.pathname === '/how-it-works' 
    },
    { 
      name: 'Cómo Funciona', 
      href: '/how-it-works', 
      // icon: DocumentTextIcon,
      current: location.pathname === '/how-it-works' 
    },
    { 
      name: 'Nosotros', 
      href: '/about', 
      // icon: InformationCircleIcon,
      current: location.pathname === '/about' 
    },
    { 
      name: 'Servicios', 
      href: '/services', 
      // icon: InformationCircleIcon,
      current: location.pathname === '/services' 
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      // icon: PhoneIcon,
      current: location.pathname === '/blog' 
    },
    { 
      name: 'Contacto', 
      href: '/contact', 
      // icon: PhoneIcon,
      current: location.pathname === '/contact' 
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userInitials = user ? 
    `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
    'U';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* Header ocupa todo el ancho sin márgenes - CON PADDING ARRIBA */}
        <div className="w-full px-4 lg:px-6 ">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Section - Logo y botón menú */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button para sidebar (dashboard) o navegación general */}
              {(showMenuButton || !isAuthenticated) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={showMenuButton ? onMenuClick : () => setMobileMenuOpen(true)}
                  className="lg:hidden text-black hover:bg-[#D0FF5B]/10 hover:text-black"
                >
                  <Bars3Icon className="h-6 w-6" />
                </Button>
              )}

              {/* Logo Wiru - MÁS GRANDE */}
              <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex-shrink-0">
                <img 
                  src={WiruLogo} 
                  alt="Wiru" 
                  className="h-28 w-auto"
                />
              </Link>
            </div>

            {/* Center Section - Navegación de información (solo visible en desktop) */}
            <div className="hidden lg:flex items-center space-x-1">
              {publicNavigation.map((item) => {
                // const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      item.current
                        ? 'bg-gray-100 text-black'
                        : 'text-black hover:text-[#99bb44]'
                    )}
                  >
                    {/* <Icon className={cn(
                      'h-4 w-4 mr-2 transition-colors duration-200',
                      item.current ? 'text-black' : 'text-black group-hover:text-[#99bb44]'
                    )} /> */}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Navegación y usuario */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Botón VENDER - MÁS LLAMATIVO */}
                  <Link to="/sell">
                    <Button 
                      className="bg-gradient-to-r from-[#99bb44] to-[#7fa836] hover:from-[#7fa836] hover:to-[#6d9230] text-white font-bold px-3 py-1 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      size="lg"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-2" />
                      ¡VENDER AHORA!
                    </Button>
                  </Link>

                  {/* Notificaciones - ICONO NEGRO con hover #D0FF5B */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-black hover:bg-[#D0FF5B]/10 hover:text-black"
                  >
                    <BellIcon className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0"
                      >
                        {notifications}
                      </Badge>
                    )}
                  </Button>

                  {/* Usuario Dropdown - ICONOS NEGROS */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-black hover:bg-[#D0FF5B]/10 rounded-lg px-2 py-1 transition-all duration-200">
                      {/* Avatar con iniciales */}
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {userInitials}
                        </span>
                      </div>
                      <ChevronDownIcon className="h-4 w-4 text-black" />
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
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* Header del menú */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-700">
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
                        
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard/profile"
                                className={cn(
                                  'flex items-center px-4 py-2 text-sm transition-colors duration-200',
                                  active 
                                    ? 'bg-[#D0FF5B]/10 text-black' 
                                    : 'text-gray-700'
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
                                  'flex items-center px-4 py-2 text-sm transition-colors duration-200',
                                  active 
                                    ? 'bg-[#D0FF5B]/10 text-black' 
                                    : 'text-gray-700'
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
                                  'flex items-center px-4 py-2 text-sm transition-colors duration-200',
                                  active 
                                    ? 'bg-[#D0FF5B]/10 text-black' 
                                    : 'text-gray-700'
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
                                  'flex items-center w-full px-4 py-2 text-sm transition-colors duration-200',
                                  active 
                                    ? 'bg-[#D0FF5B]/10 text-black' 
                                    : 'text-gray-700'
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
                /* Usuario no autenticado - BOTONES CON ICONOS NEGROS */
                <div className="hidden lg:flex items-center space-x-3">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-black hover:bg-[#D0FF5B]/10 hover:text-black"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="bg-[#D0FF5B] text-black border-0 hover:bg-[#D0FF5B]/90"
                    >
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation menu - Solo para usuarios no autenticados */}
      {!isAuthenticated && (
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            
            {/* Panel */}
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex flex-col h-full">
                {/* Header del menú móvil */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <img src={WiruLogo} alt="Wiru" className="h-24 w-auto" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-black hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation Links en móvil */}
                <div className="flex-1 px-4 py-6 space-y-1">
                  {publicNavigation.map((item) => {
                    // const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200',
                          item.current
                            ? 'bg-gray-100 text-black'
                            : 'text-gray-700 hover:bg-[#D0FF5B]/10 hover:text-[#D0FF5B]'
                        )}
                      >
                        {/* <Icon className={cn(
                          'h-6 w-6 mr-3 transition-colors duration-200',
                          item.current ? 'text-black' : 'text-gray-700 hover:text-[#D0FF5B]'
                        )} /> */}
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-4 py-4">
                  <div className="space-y-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-black hover:bg-[#D0FF5B]/10"
                      >
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        className="w-full bg-[#D0FF5B] text-black hover:bg-[#D0FF5B]/90"
                      >
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      )}
    </>
  );
};





// // src/components/layout/Header.tsx - DISEÑO PROFESIONAL WIRU 2024
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import {
//   Bars3Icon,
//   XMarkIcon,
//   BellIcon,
//   UserCircleIcon,
//   ChevronDownIcon,
//   CogIcon,
//   ArrowRightOnRectangleIcon,
//   QuestionMarkCircleIcon,
//   ShoppingBagIcon,
//   InformationCircleIcon,
//   PhoneIcon,
//   DocumentTextIcon,
//   SparklesIcon,
//   ArrowTrendingUpIcon
// } from '@heroicons/react/24/outline';
// import { cn } from '@/utils/cn';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import { useAuth } from '@/hooks/useAuth';

// // Logo placeholder - reemplaza con tu SVG real
// const WiruLogo = '/assets/logo.svg';

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
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Efecto de scroll para el header flotante
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Navegación pública
//   const publicNavigation = [
//     { 
//       name: 'Inicio', 
//       href: '/', 
//       current: location.pathname === '/',
//     },
//     { 
//       name: 'Cómo Funciona', 
//       href: '/how-it-works', 
//       current: location.pathname === '/how-it-works',
//     },
//     { 
//       name: 'Acerca de', 
//       href: '/about', 
//       current: location.pathname === '/about',
//     },
//     { 
//       name: 'Contacto', 
//       href: '/contact', 
//       current: location.pathname === '/contact',
//     },
//   ];

//   // Navegación dashboard
//   const dashboardNavigation = [
//     { 
//       name: 'Dashboard', 
//       href: '/dashboard', 
//       current: location.pathname === '/dashboard',
//       icon: ArrowTrendingUpIcon
//     },
//     { 
//       name: 'Órdenes', 
//       href: '/dashboard/orders', 
//       current: location.pathname.includes('/orders'),
//       icon: DocumentTextIcon
//     },
//     { 
//       name: 'Pagos', 
//       href: '/dashboard/payments', 
//       current: location.pathname.includes('/payments'),
//       icon: SparklesIcon 
//     },
//   ];

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   const userInitials = user ? 
//     `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 
//     'U';

//   return (
//     <>
//       {/* Header Principal */}
//       <header 
//         className={cn(
//           'fixed top-0 w-full z-50 transition-all duration-500 ease-out',
//           scrolled 
//             ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
//             : 'bg-transparent'
//         )}
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
            
//             {/* Left Section - Logo y Menu Mobile */}
//             <div className="flex items-center space-x-4">
//               {/* Mobile menu button */}
//               {showMenuButton && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onMenuClick}
//                   className="lg:hidden p-2"
//                 >
//                   <Bars3Icon className="h-6 w-6 text-gray-700" />
//                 </Button>
//               )}

//               {/* Logo Wiru - REDISEÑADO */}
//               <Link 
//                 to={isAuthenticated ? '/dashboard' : '/'} 
//                 className="flex items-center space-x-3 group"
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
//                   <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-3 rounded-2xl shadow-xl">
//                     <img 
//                       src={WiruLogo} 
//                       alt="Wiru" 
//                       className="h-8 w-8 filter brightness-0 invert"
//                     />
//                   </div>
//                 </div>
//                 <div className="hidden sm:block">
//                   <span className="text-2xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
//                     WIRU
//                   </span>
//                   <div className="text-xs font-medium text-gray-500 -mt-1">
//                     Recicla • Gana
//                   </div>
//                 </div>
//               </Link>
//             </div>

//             {/* Center Section - Navegación (Desktop) */}
//             <nav className="hidden lg:flex items-center space-x-1">
//               {isAuthenticated ? (
//                 // Navegación Dashboard
//                 dashboardNavigation.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       className={cn(
//                         'flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group',
//                         item.current
//                           ? 'bg-gradient-to-r from-[#a8c241] to-[#8ea635] text-white shadow-lg'
//                           : 'text-gray-700 hover:bg-gray-100 hover:text-[#719428]'
//                       )}
//                     >
//                       <Icon className="h-4 w-4 mr-2" />
//                       {item.name}
//                     </Link>
//                   );
//                 })
//               ) : (
//                 // Navegación Pública
//                 publicNavigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={cn(
//                       'px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300',
//                       item.current
//                         ? 'bg-gradient-to-r from-[#a8c241] to-[#8ea635] text-white shadow-lg'
//                         : 'text-gray-700 hover:bg-gray-100 hover:text-[#719428]'
//                     )}
//                   >
//                     {item.name}
//                   </Link>
//                 ))
//               )}
//             </nav>

//             {/* Right Section - Actions y Usuario */}
//             <div className="flex items-center space-x-3">
//               {isAuthenticated ? (
//                 <>
//                   {/* Botón VENDER - SUPER LLAMATIVO */}
//                   <Link to="/sell">
//                     <Button 
//                       className="relative overflow-hidden bg-gradient-to-r from-[#D0FF5B] via-[#a8c241] to-[#8ea635] hover:from-[#b8e642] hover:to-[#719428] text-gray-900 font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                       <div className="relative flex items-center">
//                         <ShoppingBagIcon className="h-5 w-5 mr-2" />
//                         <span className="hidden sm:inline">¡VENDER AHORA!</span>
//                         <span className="sm:hidden">VENDER</span>
//                       </div>
//                     </Button>
//                   </Link>

//                   {/* Notificaciones */}
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="relative p-2 hover:bg-gray-100 rounded-xl"
//                   >
//                     <BellIcon className="h-6 w-6 text-gray-700" />
//                     <Badge 
//                       variant="danger" 
//                       className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
//                     >
//                       3
//                     </Badge>
//                   </Button>

//                   {/* Menú Usuario */}
//                   <Menu as="div" className="relative">
//                     <Menu.Button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
//                       <div className="relative">
//                         {user?.avatar ? (
//                           <img 
//                             src={user.avatar} 
//                             alt={user.firstName} 
//                             className="h-9 w-9 rounded-xl object-cover"
//                           />
//                         ) : (
//                           <div className="h-9 w-9 bg-gradient-to-br from-[#a8c241] to-[#719428] rounded-xl flex items-center justify-center">
//                             <span className="text-sm font-bold text-white">
//                               {userInitials}
//                             </span>
//                           </div>
//                         )}
//                         <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
//                       </div>
//                       <div className="hidden sm:block text-left">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user?.firstName} {user?.lastName}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Ver perfil
//                         </div>
//                       </div>
//                       <ChevronDownIcon className="h-4 w-4 text-gray-500" />
//                     </Menu.Button>

//                     <Transition
//                       as={Fragment}
//                       enter="transition ease-out duration-200"
//                       enterFrom="transform opacity-0 scale-95"
//                       enterTo="transform opacity-100 scale-100"
//                       leave="transition ease-in duration-75"
//                       leaveFrom="transform opacity-100 scale-100"
//                       leaveTo="transform opacity-0 scale-95"
//                     >
//                       <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         <div className="py-2">
//                           <Menu.Item>
//                             {({ active }) => (
//                               <Link
//                                 to="/profile"
//                                 className={cn(
//                                   'flex items-center px-4 py-3 text-sm font-medium transition-colors',
//                                   active ? 'bg-gray-50 text-[#719428]' : 'text-gray-700'
//                                 )}
//                               >
//                                 <UserCircleIcon className="mr-3 h-5 w-5" />
//                                 Mi Perfil
//                               </Link>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <Link
//                                 to="/settings"
//                                 className={cn(
//                                   'flex items-center px-4 py-3 text-sm font-medium transition-colors',
//                                   active ? 'bg-gray-50 text-[#719428]' : 'text-gray-700'
//                                 )}
//                               >
//                                 <CogIcon className="mr-3 h-5 w-5" />
//                                 Configuración
//                               </Link>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <Link
//                                 to="/help"
//                                 className={cn(
//                                   'flex items-center px-4 py-3 text-sm font-medium transition-colors',
//                                   active ? 'bg-gray-50 text-[#719428]' : 'text-gray-700'
//                                 )}
//                               >
//                                 <QuestionMarkCircleIcon className="mr-3 h-5 w-5" />
//                                 Ayuda
//                               </Link>
//                             )}
//                           </Menu.Item>
//                           <div className="border-t border-gray-200 my-2"></div>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <button
//                                 onClick={handleLogout}
//                                 className={cn(
//                                   'flex items-center w-full px-4 py-3 text-sm font-medium transition-colors',
//                                   active ? 'bg-red-50 text-red-600' : 'text-gray-700'
//                                 )}
//                               >
//                                 <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
//                                 Cerrar Sesión
//                               </button>
//                             )}
//                           </Menu.Item>
//                         </div>
//                       </Menu.Items>
//                     </Transition>
//                   </Menu>
//                 </>
//               ) : (
//                 /* Botones de autenticación para usuarios no logueados */
//                 <div className="flex items-center space-x-3">
//                   <Link to="/login">
//                     <Button 
//                       variant="ghost" 
//                       className="text-gray-700 hover:text-[#719428] hover:bg-gray-100 font-medium px-4 py-2 rounded-xl"
//                     >
//                       Iniciar Sesión
//                     </Button>
//                   </Link>
//                   <Link to="/register">
//                     <Button className="bg-gradient-to-r from-[#a8c241] to-[#8ea635] hover:from-[#8ea635] hover:to-[#719428] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
//                       Registrarse
//                     </Button>
//                   </Link>
//                 </div>
//               )}

//               {/* Mobile menu toggle para navegación móvil */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="lg:hidden p-2"
//               >
//                 {mobileMenuOpen ? (
//                   <XMarkIcon className="h-6 w-6 text-gray-700" />
//                 ) : (
//                   <Bars3Icon className="h-6 w-6 text-gray-700" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Navigation Menu */}
//           <Transition
//             show={mobileMenuOpen}
//             as={Fragment}
//             enter="transition ease-out duration-200"
//             enterFrom="transform opacity-0 scale-95"
//             enterTo="transform opacity-100 scale-100"
//             leave="transition ease-in duration-75"
//             leaveFrom="transform opacity-100 scale-100"
//             leaveTo="transform opacity-0 scale-95"
//           >
//             <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-2xl">
//               <div className="px-4 py-6 space-y-4">
//                 {(isAuthenticated ? dashboardNavigation : publicNavigation).map((item) => {
//                   const Icon = 'icon' in item ? (item.icon as React.ElementType) : null;
//                   return (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       onClick={() => setMobileMenuOpen(false)}
//                       className={cn(
//                         'flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200',
//                         item.current
//                           ? 'bg-gradient-to-r from-[#a8c241] to-[#8ea635] text-white'
//                           : 'text-gray-700 hover:bg-gray-100 hover:text-[#719428]'
//                       )}
//                     >
//                       {Icon ? <Icon className="h-5 w-5 mr-3" /> : null}
//                       {item.name}
//                     </Link>
//                   );
//                 })}
                
//                 {/* Botones adicionales en mobile */}
//                 {!isAuthenticated && (
//                   <div className="pt-4 border-t border-gray-200 space-y-3">
//                     <Link 
//                       to="/login" 
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block w-full"
//                     >
//                       <Button 
//                         variant="outline" 
//                         className="w-full border-[#a8c241] text-[#719428] hover:bg-[#a8c241] hover:text-white"
//                       >
//                         Iniciar Sesión
//                       </Button>
//                     </Link>
//                     <Link 
//                       to="/register" 
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block w-full"
//                     >
//                       <Button className="w-full bg-gradient-to-r from-[#a8c241] to-[#8ea635] text-white">
//                         Registrarse Gratis
//                       </Button>
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Transition>
//         </div>
//       </header>

//       {/* Spacer para header fijo */}
//       <div className="h-20"></div>
//     </>
//   );
// };