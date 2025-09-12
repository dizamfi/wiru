import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { env } from '@/utils/env';
import { cn } from '@/utils/cn';

interface FacebookSignInButtonProps {
  onSuccess: (accessToken: string, userID: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  text?: string;
  variant?: 'contained' | 'outlined';
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const FacebookSignInButton: React.FC<FacebookSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  className,
  text = 'Continuar con Facebook',
  variant = 'outlined',
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    // Verificar si ya está cargado
    if (window.FB) {
      setIsLoaded(true);
      return;
    }

    // Configurar callback cuando FB SDK se cargue
    window.fbAsyncInit = function() {
      if (!env.FACEBOOK_APP_ID) {
        onError('Facebook App ID no está configurado');
        return;
      }

      window.FB.init({
        appId: env.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });

      setIsLoaded(true);
    };

    // Cargar Facebook SDK
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/es_ES/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('✅ Facebook SDK loaded');
      };
      script.onerror = () => {
        onError('Error al cargar Facebook SDK');
      };

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    }

    return () => {
      // Cleanup si es necesario
    };
  }, [env.FACEBOOK_APP_ID, onError]);

  const handleFacebookLogin = () => {
    if (!window.FB || !isLoaded || disabled || isLoading) {
      return;
    }

    setIsLoading(true);

    window.FB.login((response: any) => {
      console.log('🔍 Facebook login response:', response);

      if (response.status === 'connected') {
        // Usuario autorizado exitosamente
        const { accessToken, userID } = response.authResponse;
        
        console.log('✅ Facebook login successful:', { userID });
        onSuccess(accessToken, userID);
      } else if (response.status === 'not_authorized') {
        // Usuario canceló o no autorizó
        onError('Autorización de Facebook cancelada');
      } else {
        // Error desconocido
        onError('Error al conectar con Facebook');
      }

      setIsLoading(false);
    }, {
      scope: 'email,public_profile',
      return_scopes: true
    });
  };

  return (
    <Button
      type="button"
      variant={variant === 'outlined' ? 'outline' : 'default'}
      onClick={handleFacebookLogin}
      disabled={disabled || !isLoaded || isLoading}
      className={cn(
        'w-full flex items-center justify-center space-x-3 border-gray-300 text-gray-700 hover:bg-gray-50',
        variant === 'contained' && 'bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#166FE5]',
        className
      )}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )}
      <span>{isLoading ? 'Conectando...' : text}</span>
    </Button>
  );
};