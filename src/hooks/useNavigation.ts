import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navegación con preservación de query params
  const navigateWithParams = useCallback((
    to: string, 
    preserveParams?: string[]
  ) => {
    const currentParams = new URLSearchParams(location.search);
    const newUrl = new URL(to, window.location.origin);
    
    if (preserveParams) {
      preserveParams.forEach(param => {
        const value = currentParams.get(param);
        if (value) {
          newUrl.searchParams.set(param, value);
        }
      });
    }

    navigate(`${newUrl.pathname}${newUrl.search}`);
  }, [navigate, location.search]);

  // Navegación con estado
  const navigateWithState = useCallback((
    to: string, 
    state: any
  ) => {
    navigate(to, { state });
  }, [navigate]);

  // Navegación con reemplazo
  const navigateReplace = useCallback((to: string) => {
    navigate(to, { replace: true });
  }, [navigate]);

  // Volver atrás
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // Ir adelante
  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  // Actualizar query params sin navegación
  const updateSearchParams = useCallback((
    params: Record<string, string | null>
  ) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Obtener valor de query param
  const getSearchParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  // Verificar si estamos en una ruta específica
  const isCurrentRoute = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Verificar si una ruta es ancestro de la actual
  const isAncestorRoute = useCallback((path: string) => {
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return {
    // Navigation methods
    navigate,
    navigateWithParams,
    navigateWithState,
    navigateReplace,
    goBack,
    goForward,
    
    // Query params
    updateSearchParams,
    getSearchParam,
    searchParams,
    
    // Route checking
    isCurrentRoute,
    isAncestorRoute,
    
    // Current location info
    pathname: location.pathname,
    search: location.search,
    state: location.state,
    location,
  };
};