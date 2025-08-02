// // src/components/layout/Sidebar.tsx
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import {
//   HomeIcon,
//   ShoppingBagIcon,
//   ClockIcon,
//   CreditCardIcon,
//   UserGroupIcon,
//   GiftIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
//   QuestionMarkCircleIcon,
//   XMarkIcon
// } from '@heroicons/react/24/outline';
// import {
//   HomeIcon as HomeIconSolid,
//   ShoppingBagIcon as ShoppingBagIconSolid,
//   ClockIcon as ClockIconSolid,
//   CreditCardIcon as CreditCardIconSolid,
//   UserGroupIcon as UserGroupIconSolid,
//   GiftIcon as GiftIconSolid,
//   ChartBarIcon as ChartBarIconSolid,
// } from '@heroicons/react/24/solid';
// import { Badge } from '@/components/ui';
// import { cn } from '@/utils/cn';
// import { env } from '@/utils/env';

// interface NavigationItem {
//   name: string;
//   href: string;
//   icon: React.ComponentType<{ className?: string }>;
//   iconActive: React.ComponentType<{ className?: string }>;
//   badge?: string | number;
//   badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
//   enabled?: boolean;
// }

// interface SidebarProps {
//   isOpen: boolean;
//   onClose?: () => void;
// }

// const navigation: NavigationItem[] = [
//   {
//     name: 'Dashboard',
//     href: '/dashboard',
//     icon: HomeIcon,
//     iconActive: HomeIconSolid,
//   },
//   {
//     name: 'Vender',
//     href: '/sell',
//     icon: ShoppingBagIcon,
//     iconActive: ShoppingBagIconSolid,
//   },
//   {
//     name: 'Mis Órdenes',
//     href: '/orders',
//     icon: ClockIcon,
//     iconActive: ClockIconSolid,
//     badge: 2,
//     badgeVariant: 'warning',
//   },
//   {
//     name: 'Pagos',
//     href: '/payments',
//     icon: CreditCardIcon,
//     iconActive: CreditCardIconSolid,
//   },
//   {
//     name: 'Referidos',
//     href: '/referrals',
//     icon: UserGroupIcon,
//     iconActive: UserGroupIconSolid,
//     enabled: env.ENABLE_REFERRALS,
//     badge: 'Nuevo',
//     badgeVariant: 'success',
//   },
//   {
//     name: 'Recompensas',
//     href: '/rewards',
//     icon: GiftIcon,
//     iconActive: GiftIconSolid,
//     enabled: env.ENABLE_POINTS,
//   },
//   {
//     name: 'Estadísticas',
//     href: '/stats',
//     icon: ChartBarIcon,
//     iconActive: ChartBarIconSolid,
//   },
// ];

// const secondaryNavigation: NavigationItem[] = [
//   {
//     name: 'Configuración',
//     href: '/settings',
//     icon: Cog6ToothIcon,
//     iconActive: Cog6ToothIcon,
//   },
//   {
//     name: 'Ayuda',
//     href: '/help',
//     icon: QuestionMarkCircleIcon,
//     iconActive: QuestionMarkCircleIcon,
//   },
// ];

// export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
//   const location = useLocation();

//   const isActive = (href: string) => {
//     return location.pathname === href || location.pathname.startsWith(`${href}/`);
//   };

//   const NavItem: React.FC<{ item: NavigationItem; onClick?: () => void }> = ({ 
//     item, 
//     onClick 
//   }) => {
//     const active = isActive(item.href);
//     const Icon = active ? item.iconActive : item.icon;

//     // Si el item está deshabilitado, no renderizar
//     if (item.enabled === false) {
//       return null;
//     }

//     return (
//       <Link
//         to={item.href}
//         onClick={onClick}
//         className={cn(
//           'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
//           active
//             ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
//             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//         )}
//       >
//         <Icon
//           className={cn(
//             'mr-3 h-5 w-5 flex-shrink-0',
//             active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
//           )}
//         />
//         <span className="flex-1">{item.name}</span>
        
//         {item.badge && (
//           <Badge 
//             variant={item.badgeVariant || 'default'}
//             className="ml-2 text-xs"
//           >
//             {item.badge}
//           </Badge>
//         )}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Overlay para móvil */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar - FIXED position para que se mantenga en el scroll */}
//       <div
//         className={cn(
//           'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
//           // En desktop siempre visible y fijo
//           'lg:translate-x-0',
//           // En móvil se muestra/oculta según isOpen
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         )}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header del sidebar */}
//           <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
//             <Link to="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">CE</span>
//               </div>
//               <span className="text-lg font-semibold text-gray-900">
//                 {env.APP_NAME}
//               </span>
//             </Link>
            
//             {/* Botón cerrar solo en móvil */}
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
//               >
//                 <span className="sr-only">Cerrar</span>
//                 <XMarkIcon className="w-5 h-5" />
//               </button>
//             )}
//           </div>

//           {/* Navigation - Con scroll interno si es necesario */}
//           <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//             {/* Primary Navigation */}
//             <div className="space-y-1">
//               {navigation.map((item) => (
//                 <NavItem 
//                   key={item.name} 
//                   item={item} 
//                   onClick={onClose}
//                 />
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="border-t border-gray-200 my-6" />

//             {/* Secondary Navigation */}
//             <div className="space-y-1">
//               <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Configuración
//               </p>
//               {secondaryNavigation.map((item) => (
//                 <NavItem 
//                   key={item.name} 
//                   item={item} 
//                   onClick={onClose}
//                 />
//               ))}
//             </div>
//           </nav>

//           {/* Footer del sidebar */}
//           <div className="p-4 border-t border-gray-200">
//             <div className="bg-primary-50 rounded-lg p-3">
//               <div className="flex items-center">
//                 <GiftIcon className="h-5 w-5 text-primary-600" />
//                 <div className="ml-3 flex-1">
//                   <p className="text-xs font-medium text-primary-900">
//                     ¡Recicla más!
//                   </p>
//                   <p className="text-xs text-primary-700">
//                     Gana puntos extra
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };




// src/components/layout/Sidebar.tsx - Limpiado y corregido para móvil

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CogIcon as CogIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  enabled?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navegación principal
const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    name: 'Vender',
    href: '/sell',
    icon: ShoppingBagIcon,
    iconActive: ShoppingBagIconSolid,
  },
  {
    name: 'Mis Órdenes',
    href: '/dashboard/orders',
    icon: ClipboardDocumentListIcon,
    iconActive: ClipboardDocumentListIconSolid,
    badge: 2,
    badgeVariant: 'warning',
  },
  {
    name: 'Pagos',
    href: '/dashboard/payments',
    icon: BanknotesIcon,
    iconActive: BanknotesIconSolid,
  },
  {
    name: 'Estadísticas',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    iconActive: ChartBarIconSolid,
  },
];

// Navegación secundaria
const secondaryNavigation: NavigationItem[] = [
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: CogIcon,
    iconActive: CogIconSolid,
  },
  {
    name: 'Ayuda',
    href: '/help',
    icon: QuestionMarkCircleIcon,
    iconActive: QuestionMarkCircleIcon,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Componente para renderizar items de navegación
  const NavigationItem: React.FC<{ 
    item: NavigationItem; 
    onClick?: () => void 
  }> = ({ item, onClick }) => {
    const active = isActive(item.href);
    const Icon = active ? item.iconActive : item.icon;

    if (item.enabled === false) {
      return null;
    }

    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
          active
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <Icon
          className={cn(
            'mr-3 h-5 w-5 flex-shrink-0',
            active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
          )}
        />
        <span className="flex-1">{item.name}</span>
        
        {item.badge && (
          <Badge 
            variant={item.badgeVariant || 'default'}
            size="sm"
            className="ml-2"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Overlay para móvil - SOLO se muestra cuando isOpen es true */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col',
          // En desktop: altura desde el header hasta abajo, position relative, siempre visible
          'lg:relative lg:translate-x-0 lg:shadow-none lg:h-[calc(100vh-4rem)]',
          // En móvil: fixed overlay que se muestra/oculta según isOpen
          'fixed inset-y-0 left-0 lg:static',
          // Clase condicional para móvil
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // En desktop siempre visible
          'lg:translate-x-0'
        )}
      >
        {/* Espaciado para el header en móvil + botón cerrar */}
        <div className="lg:hidden pt-16 flex justify-end px-4 pb-2">
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <span className="sr-only">Cerrar</span>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navegación principal */}
        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto lg:pt-6">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavigationItem 
                key={item.name} 
                item={item} 
                onClick={() => {
                  // Solo cerrar en móvil
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Configuración
            </p>
            {secondaryNavigation.map((item) => (
              <NavigationItem 
                key={item.name} 
                item={item} 
                onClick={() => {
                  // Solo cerrar en móvil
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer del sidebar - SOLO "Recicla más" */}
        <div className="p-4 border-t border-gray-200">
          {/* Promoción/Incentivo - SOLO esto */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-xs font-medium text-primary-900">
                  ¡Recicla más!
                </p>
                <p className="text-xs text-primary-700">
                  Gana puntos extra
                </p>
              </div>
              <div className="text-primary-600">
                🎯
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;