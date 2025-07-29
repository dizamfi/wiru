import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClockIcon,
  CreditCardIcon,
  UserGroupIcon,
  GiftIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ClockIcon as ClockIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  GiftIcon as GiftIconSolid,
  ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid';
import { Badge } from '@/components/ui';
import { cn } from '@/utils/cn';
import { env } from '@/utils/env';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconActive: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger';
  enabled?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
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
    href: '/sell',
    icon: ShoppingBagIcon,
    iconActive: ShoppingBagIconSolid,
  },
  {
    name: 'Mis Órdenes',
    href: '/orders',
    icon: ClockIcon,
    iconActive: ClockIconSolid,
    badge: 2,
    badgeVariant: 'warning',
  },
  {
    name: 'Pagos',
    href: '/payments',
    icon: CreditCardIcon,
    iconActive: CreditCardIconSolid,
  },
  {
    name: 'Referidos',
    href: '/referrals',
    icon: UserGroupIcon,
    iconActive: UserGroupIconSolid,
    enabled: env.ENABLE_REFERRALS,
    badge: 'Nuevo',
    badgeVariant: 'success',
  },
  {
    name: 'Recompensas',
    href: '/rewards',
    icon: GiftIcon,
    iconActive: GiftIconSolid,
    enabled: env.ENABLE_POINTS,
  },
  {
    name: 'Estadísticas',
    href: '/stats',
    icon: ChartBarIcon,
    iconActive: ChartBarIconSolid,
  },
];

const secondaryNavigation: NavigationItem[] = [
  {
    name: 'Configuración',
    href: '/settings',
    icon: Cog6ToothIcon,
    iconActive: Cog6ToothIcon,
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

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const NavItem: React.FC<{ item: NavigationItem; onClick?: () => void }> = ({ 
    item, 
    onClick 
  }) => {
    const active = isActive(item.href);
    const Icon = active ? item.iconActive : item.icon;

    // Si está deshabilitado por feature flag, no mostrar
    if (item.enabled === false) {
      return null;
    }

    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          active
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <Icon
          className={cn(
            'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
            active ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
          )}
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <Badge 
            variant={item.badgeVariant || 'default'} 
            size="sm"
            className={cn(
              'ml-2',
              active && 'bg-white text-primary-600'
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CE</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {env.APP_NAME}
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Primary Navigation */}
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={onClose}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Configuración
              </p>
              {secondaryNavigation.map((item) => (
                <NavItem 
                  key={item.name} 
                  item={item} 
                  onClick={onClose}
                />
              ))}
            </div>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-3">
              <div className="flex items-center">
                <GiftIcon className="h-5 w-5 text-primary-600" />
                <div className="ml-3 flex-1">
                  <p className="text-xs font-medium text-primary-900">
                    ¡Recicla más!
                  </p>
                  <p className="text-xs text-primary-700">
                    Gana puntos extra
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};