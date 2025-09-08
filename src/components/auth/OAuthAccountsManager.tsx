// src/components/auth/OAuthAccountsManager.tsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface OAuthAccount {
  google: boolean;
  facebook: boolean;
}

export const OAuthAccountsManager: React.FC = () => {
  const [accounts, setAccounts] = useState<OAuthAccount>({ google: false, facebook: false });
  const [isLoading, setIsLoading] = useState(true);
  const { user, getOAuthAccounts, unlinkOAuthAccount } = useAuthContext();

  useEffect(() => {
    loadOAuthAccounts();
  }, []);

  const loadOAuthAccounts = async () => {
    try {
      const result = await getOAuthAccounts();
      setAccounts(result);
    } catch (error) {
      console.error('Error loading OAuth accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async (provider: 'google' | 'facebook') => {
    if (!confirm(`¿Estás seguro de que quieres desvincular tu cuenta de ${provider}?`)) {
      return;
    }

    try {
      await unlinkOAuthAccount(provider);
      toast.success(`Cuenta de ${provider} desvinculada exitosamente`);
      await loadOAuthAccounts();
    } catch (error: any) {
      toast.error(error.message || `Error al desvincular cuenta de ${provider}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cuentas Vinculadas
      </h3>
      
      <div className="space-y-4">
        {/* Google Account */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Google</h4>
              <p className="text-sm text-gray-500">
                {accounts.google ? 'Cuenta vinculada' : 'No vinculada'}
              </p>
            </div>
          </div>
          
          {accounts.google && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnlink('google')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Desvincular
            </Button>
          )}
        </div>

        {/* Facebook Account */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">f</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Facebook</h4>
              <p className="text-sm text-gray-500">
                {accounts.facebook ? 'Cuenta vinculada' : 'No vinculada'}
              </p>
            </div>
          </div>
          
          {accounts.facebook && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnlink('facebook')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Desvincular
            </Button>
          )}
        </div>
      </div>
      
      {!accounts.google && !accounts.facebook && (
        <p className="text-center text-gray-500 mt-4">
          No tienes cuentas OAuth vinculadas
        </p>
      )}
    </div>
  );
};