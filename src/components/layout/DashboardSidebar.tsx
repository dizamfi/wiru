// // src/components/layout/DashboardSidebar.tsx
// import React, { Fragment } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Transition } from '@headlessui/react';
// import {
//   HomeIcon,
//   ShoppingBagIcon,
//   ClipboardDocumentListIcon,
//   UserGroupIcon,
//   ChartBarIcon,
//   CogIcon,
//   QuestionMarkCircleIcon,
//   XMarkIcon,
//   BanknotesIcon,
// } from '@heroicons/react/24/outline';
// import {
//   HomeIcon as HomeIconSolid,
//   ShoppingBagIcon as ShoppingBagIconSolid,
//   ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
//   UserGroupIcon as UserGroupIconSolid,
//   ChartBarIcon as ChartBarIconSolid,
//   BanknotesIcon as BanknotesIconSolid,
// } from '@heroicons/react/24/solid';
// import { cn } from '@/utils/cn';
// import { useAuth } from '@/hooks/useAuth';

// interface NavigationItem {
//   name: string;
//   href: string;
//   icon: React.ComponentType<{ className?: string }>;
//   iconActive: React.ComponentType<{ className?: string }>;
//   badge?: string | number;
//   badgeColor?: string;
//   enabled?: boolean;
// }

// interface DashboardSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
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
//     href: '/dashboard/sell',
//     icon: ShoppingBagIcon,
//     iconActive: ShoppingBagIconSolid,
//   },
//   {
//     name: 'Mis Órdenes',
//     href: '/dashboard/orders',
//     icon: ClipboardDocumentListIcon,
//     iconActive: ClipboardDocumentListIconSolid,
//     badge: 2,
//     badgeColor: 'bg-orange-100 text-orange-800',
//   },
//   {
//     name: 'Billetera',
//     href: '/dashboard/wallet',
//     icon: BanknotesIcon,
//     iconActive: BanknotesIconSolid,
//   },
//   {
//     name: 'Referidos',
//     href: '/dashboard/referrals',
//     icon: UserGroupIcon,
//     iconActive: UserGroupIconSolid,
//     enabled: true,
//     badge: 'Nuevo',
//     badgeColor: 'bg-green-100 text-green-800',
//   },
//   {
//     name: 'Estadísticas',
//     href: '/dashboard/stats',
//     icon: ChartBarIcon,
//     iconActive: ChartBarIconSolid,
//   },
// ];

// const secondaryNavigation: NavigationItem[] = [
//   {
//     name: 'Configuración',
//     href: '/dashboard/settings',
//     icon: CogIcon,
//     iconActive: CogIcon,
//   },
//   {
//     name: 'Ayuda',
//     href: '/dashboard/help',
//     icon: QuestionMarkCircleIcon,
//     iconActive: QuestionMarkCircleIcon,
//   },
// ];

// export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
//   const location = useLocation();
//   const { user } = useAuth();

//   const isActive = (href: string) => {
//     if (href === '/dashboard') {
//       return location.pathname === '/dashboard';
//     }
//     return location.pathname.startsWith(href);
//   };

//   const NavigationItem: React.FC<{ 
//     item: NavigationItem; 
//     onClick?: () => void;
//   }> = ({ item, onClick }) => {
//     if (item.enabled === false) return null;

//     const active = isActive(item.href);
//     const Icon = active ? item.iconActive : item.icon;

//     return (
//       <Link
//         to={item.href}
//         onClick={onClick}
//         className={cn(
//           'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200',
//           active
//             ? 'bg-[#a8c241] text-white shadow-sm'
//             : 'text-gray-700 hover:bg-gray-100 hover:text-[#a8c241]'
//         )}
//       >
//         <Icon 
//           className={cn(
//             'mr-3 h-5 w-5 flex-shrink-0',
//             active ? 'text-white' : 'text-gray-400 group-hover:text-[#a8c241]'
//           )} 
//         />
//         <span className="flex-1">{item.name}</span>
//         {item.badge && (
//           <span className={cn(
//             'ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full',
//             item.badgeColor || 'bg-gray-100 text-gray-800'
//           )}>
//             {item.badge}
//           </span>
//         )}
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* Mobile sidebar backdrop */}
//       <Transition
//         show={isOpen}
//         as={Fragment}
//         enter="transition-opacity ease-linear duration-300"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="transition-opacity ease-linear duration-300"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       >
//         <div className="fixed inset-0 z-50 bg-gray-900/80 lg:hidden" onClick={onClose} />
//       </Transition>

//       {/* Sidebar */}
//       <Transition
//         show={isOpen}
//         as={Fragment}
//         enter="transition ease-in-out duration-300 transform"
//         enterFrom="-translate-x-full"
//         enterTo="translate-x-0"
//         leave="transition ease-in-out duration-300 transform"
//         leaveFrom="translate-x-0"
//         leaveTo="-translate-x-full"
//       >
//         <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:static lg:inset-auto lg:shadow-none lg:translate-x-0">
//           <div className="flex h-full flex-col">
//             {/* Header */}
//             <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
//               <Link to="/dashboard" className="flex items-center space-x-3">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-xl blur-lg opacity-30"></div>
//                   <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl shadow-lg">
//                     <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                     </svg>
//                   </div>
//                 </div>
//                 <div>
//                   <span className="text-xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
//                     WIRU
//                   </span>
//                   <div className="text-xs font-medium text-gray-500 -mt-1">
//                     Dashboard
//                   </div>
//                 </div>
//               </Link>
              
//               {/* Close button (mobile only) */}
//               <button
//                 type="button"
//                 className="lg:hidden -mr-2 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 rounded-md"
//                 onClick={onClose}
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* User info */}
//             {user && (
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   {user.avatar ? (
//                     <img
//                       className="h-10 w-10 rounded-full object-cover"
//                       src={user.avatar}
//                       alt="Avatar"
//                     />
//                   ) : (
//                     <div className="h-10 w-10 rounded-full bg-[#a8c241] flex items-center justify-center">
//                       <span className="text-sm font-medium text-white">
//                         {`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}
//                       </span>
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {user.firstName} {user.lastName}
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">
//                       {user.email}
//                     </p>
//                   </div>
//                 </div>
//                 {user.wallet && (
//                   <div className="mt-3 p-2 bg-green-50 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-medium text-green-900">
//                         Saldo disponible
//                       </span>
//                       <span className="text-sm font-bold text-green-600">
//                         ${user.wallet.availableBalance.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Navigation */}
//             <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//               {/* Primary navigation */}
//               <div className="space-y-1">
//                 {navigation.map((item) => (
//                   <NavigationItem 
//                     key={item.name} 
//                     item={item} 
//                     onClick={onClose}
//                   />
//                 ))}
//               </div>

//               {/* Divider */}
//               <div className="my-4 border-t border-gray-200" />

//               {/* Secondary navigation */}
//               <div className="space-y-1">
//                 <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Soporte
//                 </p>
//                 {secondaryNavigation.map((item) => (
//                   <NavigationItem 
//                     key={item.name} 
//                     item={item} 
//                     onClick={onClose}
//                   />
//                 ))}
//               </div>
//             </nav>

//             {/* Footer */}
//             <div className="p-4 border-t border-gray-200">
//               <div className="bg-gradient-to-r from-[#a8c241]/10 to-[#719428]/10 rounded-lg p-3">
//                 <div className="flex items-center">
//                   <div className="flex-1">
//                     <p className="text-xs font-medium text-[#719428]">
//                       ¡Sigue reciclando!
//                     </p>
//                     <p className="text-xs text-gray-600">
//                       Gana más con referidos
//                     </p>
//                   </div>
//                   <Link 
//                     to="/dashboard/referrals"
//                     className="text-xs font-medium text-[#a8c241] hover:text-[#719428]"
//                   >
//                     Ver más
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Transition>
//     </>
//   );
// };




// src/components/layout/DashboardSidebar.tsx (FIXED)
import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BanknotesIcon as BanknotesIconSolid,
} from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  enabled?: boolean;
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    name: 'Vender',
    href: '/dashboard/sell',
    icon: ShoppingBagIcon,
    iconActive: ShoppingBagIconSolid,
  },
  {
    name: 'Mis Órdenes',
    href: '/dashboard/orders',
    icon: ClipboardDocumentListIcon,
    iconActive: ClipboardDocumentListIconSolid,
    badge: 2,
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  {
    name: 'Billetera',
    href: '/dashboard/wallet',
    icon: BanknotesIcon,
    iconActive: BanknotesIconSolid,
  },
  {
    name: 'Referidos',
    href: '/dashboard/referrals',
    icon: UserGroupIcon,
    iconActive: UserGroupIconSolid,
    enabled: true,
    badge: 'Nuevo',
    badgeColor: 'bg-green-100 text-green-800',
  },
  {
    name: 'Estadísticas',
    href: '/dashboard/stats',
    icon: ChartBarIcon,
    iconActive: ChartBarIconSolid,
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: CogIcon,
    iconActive: CogIcon,
  },
  {
    name: 'Ayuda',
    href: '/dashboard/help',
    icon: QuestionMarkCircleIcon,
    iconActive: QuestionMarkCircleIcon,
  },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Función para obtener el saldo de manera segura
  const getAvailableBalance = () => {
    if (!user?.wallet) return '0.00';
    
    // Verificar si availableBalance existe y es un número
    const balance = user.wallet.availableBalance;
    if (typeof balance === 'number') {
      return balance.toFixed(2);
    }
    
    // Si viene como string, intentar convertir
    if (typeof balance === 'string') {
      const numBalance = parseFloat(balance);
      return !isNaN(numBalance) ? numBalance.toFixed(2) : '0.00';
    }
    
    return '0.00';
  };

  const NavigationItem: React.FC<{ 
    item: NavigationItem; 
    onClick?: () => void;
  }> = ({ item, onClick }) => {
    if (item.enabled === false) return null;

    const active = isActive(item.href);
    const Icon = active ? item.iconActive : item.icon;

    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200',
          active
            ? 'bg-[#a8c241] text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#a8c241]'
        )}
      >
        <Icon 
          className={cn(
            'mr-3 h-5 w-5 flex-shrink-0',
            active ? 'text-white' : 'text-gray-400 group-hover:text-[#a8c241]'
          )} 
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className={cn(
            'ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full',
            item.badgeColor || 'bg-gray-100 text-gray-800'
          )}>
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 bg-gray-900/80 lg:hidden" onClick={onClose} />
      </Transition>

      {/* Sidebar */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:static lg:inset-auto lg:shadow-none lg:translate-x-0">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#a8c241] to-[#719428] rounded-xl blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-[#a8c241] via-[#8ea635] to-[#719428] p-2 rounded-xl shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-[#a8c241] to-[#719428] bg-clip-text text-transparent">
                    WIRU
                  </span>
                  <div className="text-xs font-medium text-gray-500 -mt-1">
                    Dashboard
                  </div>
                </div>
              </Link>
              
              {/* Close button (mobile only) */}
              <button
                type="button"
                className="lg:hidden -mr-2 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 rounded-md"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatar}
                      alt="Avatar"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#a8c241] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {`${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {/* Wallet info - CORREGIDO para evitar el error */}
                {user.wallet && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-900">
                        Saldo disponible
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ${getAvailableBalance()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {/* Primary navigation */}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavigationItem 
                    key={item.name} 
                    item={item} 
                    onClick={onClose}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200" />

              {/* Secondary navigation */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Soporte
                </p>
                {secondaryNavigation.map((item) => (
                  <NavigationItem 
                    key={item.name} 
                    item={item} 
                    onClick={onClose}
                  />
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-[#a8c241]/10 to-[#719428]/10 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#719428]">
                      ¡Sigue reciclando!
                    </p>
                    <p className="text-xs text-gray-600">
                      Gana más con referidos
                    </p>
                  </div>
                  <Link 
                    to="/dashboard/referrals"
                    className="text-xs font-medium text-[#a8c241] hover:text-[#719428]"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};