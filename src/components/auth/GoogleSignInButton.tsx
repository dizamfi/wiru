// import React, { useEffect, useRef } from 'react';
// import { useGoogleAuth } from '@/hooks/useGoogleAuth';
// import { Button } from '@/components/ui';
// import { cn } from '@/utils/cn';

// interface GoogleLoginButtonProps {
//   className?: string;
//   variant?: 'button' | 'native';
//   text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
//   theme?: 'outline' | 'filled_blue' | 'filled_black';
//   size?: 'large' | 'medium' | 'small';
//   disabled?: boolean;
//   onError?: (error: string) => void;
// }

// export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
//   className,
//   variant = 'native',
//   text = 'continue_with',
//   theme = 'outline',
//   size = 'large',
//   disabled = false,
//   onError,
// }) => {
//   const buttonRef = useRef<HTMLDivElement>(null);
//   const fallbackRef = useRef<HTMLButtonElement>(null);
//   const {
//     isGoogleLoaded,
//     initializeGoogle,
//     renderGoogleButton,
//     isLoading,
//   } = useGoogleAuth();

//   useEffect(() => {
//     if (!disabled && isGoogleLoaded) {
//       // Inicializar Google Auth
//       const initialized = initializeGoogle();
      
//       if (initialized && variant === 'native') {
//         // Esperar un poco para que el DOM esté listo
//         const timer = setTimeout(() => {
//           const success = renderGoogleButton('google-signin-button', {
//             text,
//             theme,
//             size,
//           });
          
//           if (!success && onError) {
//             onError('No se pudo renderizar el botón de Google');
//           }
//         }, 100);

//         return () => clearTimeout(timer);
//       }
//     }
//   }, [
//     isGoogleLoaded, 
//     disabled, 
//     initializeGoogle, 
//     renderGoogleButton, 
//     variant, 
//     text, 
//     theme, 
//     size,
//     onError
//   ]);

//   // Botón de fallback si Google no carga o variant es 'button'
//   const renderFallbackButton = () => (
//     <Button
//       ref={fallbackRef}
//       variant="outline"
//       fullWidth
//       disabled={disabled || isLoading || !isGoogleLoaded}
//       className={cn('relative', className)}
//       leftIcon={
//         <svg className="w-5 h-5" viewBox="0 0 24 24">
//           <path
//             fill="currentColor"
//             d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//           />
//           <path
//             fill="currentColor"
//             d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//           />
//           <path
//             fill="currentColor"
//             d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//           />
//           <path
//             fill="currentColor"
//             d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//           />
//         </svg>
//       }
//       onClick={() => {
//         if (!isGoogleLoaded && onError) {
//           onError('Google Identity Services no está disponible');
//         }
//       }}
//     >
//       {isGoogleLoaded ? 'Continuar con Google' : 'Cargando Google...'}
//     </Button>
//   );

//   // Si variant es 'button' o Google no está disponible, mostrar fallback
//   if (variant === 'button' || !isGoogleLoaded) {
//     return renderFallbackButton();
//   }

//   // Renderizar contenedor para botón nativo de Google
//   return (
//     <div className={cn('w-full', className)}>
//       <div
//         id="google-signin-button"
//         ref={buttonRef}
//         className="w-full"
//         style={{ minHeight: size === 'large' ? '48px' : size === 'medium' ? '40px' : '32px' }}
//       />
      
//       {/* Fallback oculto que se muestra si el nativo falla */}
//       <div className="hidden" id="google-fallback">
//         {renderFallbackButton()}
//       </div>
//     </div>
//   );
// };

// // Componente simplificado para casos básicos
// export const GoogleSignInButton: React.FC<{
//   className?: string;
//   disabled?: boolean;
// }> = ({ className, disabled }) => (
//   <GoogleLoginButton
//     className={className}
//     disabled={disabled}
//     variant="native"
//     text="continue_with"
//     theme="outline"
//     size="large"
//   />
// );




// src/components/auth/GoogleSignInButton.tsx
import React, { useEffect, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/Button';
import { env } from '@/utils/env';
import { cn } from '@/utils/cn';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  text?: string;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  className,
  text = 'Continuar con Google',
  variant = 'outlined',
  size = 'medium',
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    // Verificar si ya está cargado
    if (window.google) {
      initializeGoogleSignIn();
      return;
    }

    // Cargar Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    script.onerror = () => {
      onError('Error al cargar Google Sign-In');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google || !env.GOOGLE_CLIENT_ID) {
      onError('Google Sign-In no está configurado correctamente');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: env.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Renderizar el botón
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: variant === 'outlined' ? 'outline' : 'filled_blue',
          size: size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        });
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      onError('Error al inicializar Google Sign-In');
    }
  };

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      onSuccess(response.credential);
    } else {
      onError('No se recibió credencial de Google');
    }
  };

  const handleCustomButtonClick = () => {
    if (window.google && isLoaded) {
      window.google.accounts.id.prompt();
    }
  };

  // Si queremos usar un botón personalizado en lugar del oficial de Google
  const CustomButton = () => (
    <Button
      type="button"
      variant={variant === 'outlined' ? 'outline' : 'default'}
      onClick={handleCustomButtonClick}
      disabled={disabled || !isLoaded}
      className={cn(
        'w-full flex items-center justify-center space-x-3 border-gray-300 text-gray-700 hover:bg-gray-50',
        className
      )}
    >
      <FcGoogle className="w-5 h-5" />
      <span>{text}</span>
    </Button>
  );

  return (
    <div className="w-full">
      {/* Botón oficial de Google (recomendado) */}
      <div 
        ref={buttonRef} 
        className={cn('w-full', className)}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      
      {/* Fallback mientras carga */}
      {!isLoaded && (
        <Button
          variant="outline"
          disabled
          className="w-full flex items-center justify-center space-x-3 border-gray-300 text-gray-700"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Cargando...</span>
        </Button>
      )}
    </div>
  );
};