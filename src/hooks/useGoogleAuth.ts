import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { env } from '@/utils/env';
import type { GoogleInitConfig, GoogleButtonConfig, CredentialResponse } from '@/types/google.types';

export const useGoogleAuth = () => {
  const { loginWithGoogle, isLoading } = useAuth();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Verificar si Google API está cargada
  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
        return true;
      }
      return false;
    };

    // Verificar inmediatamente
    if (checkGoogleLoaded()) return;

    // Si no está cargada, verificar periódicamente
    const interval = setInterval(() => {
      if (checkGoogleLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    // Limpiar después de 10 segundos si no carga
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.warn('Google Identity Services no se pudo cargar');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Manejar respuesta de credenciales de Google
  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        await loginWithGoogle(response.credential);
      } catch (error) {
        console.error('Error en login con Google:', error);
      }
    }
  }, [loginWithGoogle]);

  // Inicializar Google Identity Services
  const initializeGoogle = useCallback(() => {
    if (!isGoogleLoaded || !window.google || !env.GOOGLE_CLIENT_ID) {
      return false;
    }

    try {
      const config: GoogleInitConfig = {
        client_id: env.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
      };

      window.google.accounts.id.initialize(config);
      return true;
    } catch (error) {
      console.error('Error inicializando Google Auth:', error);
      return false;
    }
  }, [isGoogleLoaded, handleCredentialResponse]);

  // Renderizar botón de Google
  const renderGoogleButton = useCallback((
    elementId: string, 
    customConfig?: Partial<GoogleButtonConfig>
  ) => {
    if (!isGoogleLoaded || !window.google) {
      console.warn('Google Identity Services no está disponible');
      return false;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Elemento con ID "${elementId}" no encontrado`);
      return false;
    }

    try {
      const defaultConfig: GoogleButtonConfig = {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
        locale: 'es',
      };

      const config = { ...defaultConfig, ...customConfig };
      
      // Limpiar contenido anterior
      element.innerHTML = '';
      
      window.google.accounts.id.renderButton(element, config);
      return true;
    } catch (error) {
      console.error('Error renderizando botón de Google:', error);
      return false;
    }
  }, [isGoogleLoaded]);

  // Mostrar prompt One Tap
  const promptGoogleAuth = useCallback(() => {
    if (!isGoogleLoaded || !window.google) {
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('Google One Tap no se mostró:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('Google One Tap fue omitido:', notification.getSkippedReason());
        }
      });
    } catch (error) {
      console.error('Error mostrando Google prompt:', error);
    }
  }, [isGoogleLoaded]);

  // Cancelar flujo de Google
  const cancelGoogleAuth = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  }, []);

  // Deshabilitar auto-select
  const disableAutoSelect = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  return {
    isGoogleLoaded,
    initializeGoogle,
    renderGoogleButton,
    promptGoogleAuth,
    cancelGoogleAuth,
    disableAutoSelect,
    isLoading,
  };
};