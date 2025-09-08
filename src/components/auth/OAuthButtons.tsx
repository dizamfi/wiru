// src/components/auth/OAuthButtons.tsx
import React from 'react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { FacebookSignInButton } from './FacebookSignInButton';
import { env } from '@/utils/env';

interface OAuthButtonsProps {
  disabled?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  disabled = false,
  onSuccess,
  onError,
}) => {
  if (!env.ENABLE_OAUTH) {
    return null;
  }

  return (
    <div className="space-y-3">
      {env.GOOGLE_CLIENT_ID && (
        <GoogleSignInButton
          disabled={disabled}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      
      {env.FACEBOOK_APP_ID && (
        <FacebookSignInButton
          disabled={disabled}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
      
      {/* Divider */}
      {(env.GOOGLE_CLIENT_ID || env.FACEBOOK_APP_ID) && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o continúa con</span>
          </div>
        </div>
      )}
    </div>
  );
};