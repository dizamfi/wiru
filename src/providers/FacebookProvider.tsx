// src/providers/FacebookProvider.tsx
import React, { useEffect } from 'react';
import { env } from '@/utils/env';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookProviderProps {
  children: React.ReactNode;
}

export const FacebookProvider: React.FC<FacebookProviderProps> = ({ children }) => {
  useEffect(() => {
    if (!env.FACEBOOK_APP_ID || !env.ENABLE_OAUTH) {
      return;
    }

    // Configurar Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: env.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    // Cargar Facebook SDK
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/es_LA/sdk.js';
      script.async = true;
      script.defer = true;
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    };

    loadFacebookSDK();
  }, []);

  return <>{children}</>;
};