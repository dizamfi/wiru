// src/providers/OAuthProviders.tsx
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from '@/utils/env';

interface OAuthProvidersProps {
  children: React.ReactNode;
}

export const OAuthProviders: React.FC<OAuthProvidersProps> = ({ children }) => {
  if (!env.ENABLE_OAUTH) {
    return <>{children}</>;
  }

  return (
    <>
      {env.GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      ) : (
        children
      )}
    </>
  );
};