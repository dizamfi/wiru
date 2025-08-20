// src/components/profile/BankAccountsManager.tsx
import React, { useState } from 'react';
import { 
  BanknotesIcon, 
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BankAccount, PersonProfile } from '@/types/user';
import { AddBankAccountModal } from '@/components/wallet/AddBankAccountModal';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/useToast';

interface BankAccountsManagerProps {
  user: PersonProfile;
}

export const BankAccountsManager: React.FC<BankAccountsManagerProps> = ({ user }) => {
  const { 
    bankAccounts, 
    defaultBankAccount,
    addBankAccount, 
    removeBankAccount, 
    setDefaultBankAccount,
    loading 
  } = useWallet();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  const handleAddAccount = async (accountData: any) => {
    try {
      await addBankAccount(accountData);
      setShowAddModal(false);
      toast({
        title: 'Cuenta agregada',
        description: 'La cuenta bancaria se ha agregado exitosamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar la cuenta bancaria',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria?')) {
      return;
    }

    setDeletingAccountId(accountId);
    try {
      await removeBankAccount(accountId);
      toast({
        title: 'Cuenta eliminada',
        description: 'La cuenta bancaria se ha eliminado exitosamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la cuenta bancaria',
        variant: 'destructive'
      });
    } finally {
      setDeletingAccountId(null);
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await setDefaultBankAccount(accountId);
      toast({
        title: 'Cuenta predeterminada',
        description: 'La cuenta se ha establecido como predeterminada',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo establecer la cuenta como predeterminada',
        variant: 'destructive'
      });
    }
  };

  const formatAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cuentas Bancarias</h3>
              <p className="text-sm text-gray-600">
                Gestiona tus cuentas bancarias para recibir pagos
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Agregar Cuenta</span>
            </Button>
          </div>

          {/* Lista de cuentas */}
          {bankAccounts.length === 0 ? (
            <div className="text-center py-12">
              <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No tienes cuentas bancarias
              </h4>
              <p className="text-gray-600 mb-6">
                Agrega una cuenta bancaria para recibir tus pagos de forma automática
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Agregar Primera Cuenta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`border rounded-lg p-4 transition-all ${
                    account.isDefault 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Información de la cuenta */}
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        account.isDefault ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <BanknotesIcon className={`h-6 w-6 ${
                          account.isDefault ? 'text-primary-600' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {account.bankName}
                          </h4>
                          {account.isDefault && (
                            <Badge variant="success" className="flex items-center space-x-1">
                              <StarIcon className="h-3 w-3" />
                              <span>Principal</span>
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            {account.accountType === 'savings' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'} - 
                            {formatAccountNumber(account.accountNumber)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Titular: {account.accountHolder}
                          </p>
                        </div>
                        
                        {/* Estado de verificación */}
                        <div className="flex items-center space-x-2 mt-2">
                          {account.verifiedAt ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">
                                Verificada
                              </span>
                            </>
                          ) : (
                            <>
                              <ClockIcon className="h-4 w-4 text-yellow-600" />
                              <span className="text-xs text-yellow-600 font-medium">
                                Pendiente de verificación
                              </span>
                            </>
                          )}
                          <span className="text-xs text-gray-500">
                            • Agregada el {new Date(account.createdAt).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                      {!account.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(account.id)}
                          disabled={loading}
                        >
                          Hacer Principal
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAccount(account.id)}
                        disabled={loading || deletingAccountId === account.id}
                        loading={deletingAccountId === account.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Información importante</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• La cuenta principal se usará por defecto para todos los retiros</li>
              <li>• Las cuentas deben estar a tu nombre para poder verificarlas</li>
              <li>• La verificación puede tardar hasta 24 horas</li>
              <li>• Puedes tener máximo 3 cuentas bancarias activas</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Historial de transacciones bancarias */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          
          <div className="space-y-3">
            {/* Simulación de actividad reciente */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Cuenta verificada exitosamente
                  </p>
                  <p className="text-xs text-gray-600">
                    {bankAccounts[0]?.bankName} ****{bankAccounts[0]?.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleDateString('es-ES')}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PlusIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Nueva cuenta agregada
                  </p>
                  <p className="text-xs text-gray-600">
                    {bankAccounts[0]?.bankName} - Cuenta de ahorros
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para agregar cuenta */}
      <AddBankAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAccount}
        existingAccounts={bankAccounts}
      />
    </div>
  );
};