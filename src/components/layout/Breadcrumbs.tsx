import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapeo de rutas a nombres legibles en español
const routeNames: Record<string, string> = {
  '': 'Inicio',
  'dashboard': 'Dashboard',
  'sell': 'Vender',
  'orders': 'Mis Órdenes',
  'payments': 'Pagos',
  'referrals': 'Referidos',
  'rewards': 'Recompensas',
  'stats': 'Estadísticas',
  'profile': 'Perfil',
  'settings': 'Configuración',
  'help': 'Ayuda',
  'categories': 'Categorías',
  'history': 'Historial',
  'notifications': 'Notificaciones',
  'about': 'Acerca de',
  'contact': 'Contacto',
  'privacy': 'Privacidad',
  'terms': 'Términos',
  'how-it-works': 'Cómo funciona',
  'pricing': 'Precios',
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items,
  className 
}) => {
  const location = useLocation();

  // Si no se proporcionan items, generarlos automáticamente desde la URL
  const breadcrumbItems = items || (() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Si estamos en la página de inicio, no mostrar breadcrumbs
    if (pathSegments.length === 0) {
      return [];
    }

    const generatedItems: BreadcrumbItem[] = [
      { name: 'Inicio', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Obtener el nombre legible del segmento
      const segmentName = routeNames[segment] || 
        // Si no está en el mapeo, capitalizar la primera letra
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      generatedItems.push({
        name: segmentName,
        href: currentPath,
        current: isLast
      });
    });

    return generatedItems;
  })();

  // No mostrar breadcrumbs si solo hay un item (inicio) o ninguno
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {/* Separador (excepto para el primer item) */}
            {index > 0 && (
              <ChevronRightIcon 
                className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" 
                aria-hidden="true" 
              />
            )}
            
            {/* Item actual (no es link) */}
            {item.current ? (
              <span 
                className="text-sm font-medium text-gray-500" 
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              /* Items anteriores (son links) */
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              >
                {/* Mostrar icono de casa para inicio */}
                {index === 0 && item.name === 'Inicio' ? (
                  <div className="flex items-center">
                    <HomeIcon 
                      className="h-4 w-4" 
                      aria-hidden="true" 
                      title="Inicio"
                    />
                    <span className="sr-only">Inicio</span>
                  </div>
                ) : (
                  item.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Componente auxiliar para breadcrumbs personalizados
export const BreadcrumbsCustom: React.FC<{
  items: BreadcrumbItem[];
  className?: string;
}> = ({ items, className }) => {
  return <Breadcrumbs items={items} className={className} />;
};