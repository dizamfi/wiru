import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Determinar el tipo de layout basado en la ruta
  const getLayoutVariant = (): 'default' | 'auth' | 'dashboard' => {
    const path = location.pathname;
    
    // Rutas de autenticación
    const authRoutes = [
      '/login', 
      '/register', 
      '/forgot-password', 
      '/reset-password', 
      '/verify-email',
      '/auth/callback'
    ];
    
    if (authRoutes.includes(path)) {
      return 'auth';
    }
    
    // Rutas del dashboard (requieren autenticación)
    const dashboardRoutes = [
      '/dashboard',
      '/sell',
      '/orders',
      '/payments',
      '/referrals',
      '/rewards',
      '/stats',
      '/profile',
      '/settings',
      '/notifications'
    ];
    
    const isDashboardRoute = dashboardRoutes.some(route => 
      path === route || path.startsWith(`${route}/`)
    );
    
    if (isDashboardRoute && isAuthenticated) {
      return 'dashboard';
    }
    
    return 'default';
  };

  const layoutVariant = getLayoutVariant();
  
  return {
    layoutVariant,
    showSidebar: layoutVariant === 'dashboard',
    showFooter: layoutVariant !== 'auth',
    isAuthLayout: layoutVariant === 'auth',
    isDashboardLayout: layoutVariant === 'dashboard',
    isPublicLayout: layoutVariant === 'default',
  };
};