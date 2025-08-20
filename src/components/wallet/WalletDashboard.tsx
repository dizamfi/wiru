// src/components/wallet/WalletDashboard.tsx
import React, { useState } from 'react';
import { 
  BanknotesIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/currency';
import { useWallet } from '@/hooks/useWallet';
import { AddBankAccountModal } from './AddBankAccountModal';
import { TransactionsList } from './TransactionsList';
import { WithdrawalModal } from './WithdrawalModal';

export const WalletDashboard: React.FC = () => {
  const { 
    balance, 
    pendingBalance, 
    availableForWithdrawal,
    recentTransactions,
    bankAccounts,
    withdrawalHistory,
    loading,
    requestWithdrawal,
    addBankAccount
  } = useWallet();

  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);

  const stats = [
    {
      label: 'Balance Total',
      value: balance?.total || 0,
      icon: BanknotesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Disponible para Retiro',
      value: availableForWithdrawal || 0,
      icon: ArrowUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pendiente de Verificación',
      value: pendingBalance || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billetera Virtual</h1>
          <p className="text-gray-600">Gestiona tus ganancias y retiros</p>
        </div>
        <div className="flex space-x-3">
          {bankAccounts.length === 0 ? (
            <Button
              onClick={() => setShowAddBankModal(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Agregar Cuenta</span>
            </Button>
          ) : (
            <Button
              onClick={() => setShowWithdrawalModal(true)}
              disabled={!availableForWithdrawal || availableForWithdrawal < 10}
              className="flex items-center space-x-2"
            >
              <ArrowUpIcon className="h-4 w-4" />
              <span>Retirar Dinero</span>
            </Button>
          )}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {index === 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showBalance ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(showBalance || index !== 0) ? formatCurrency(stat.value) : '•••••'}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bank Accounts */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cuentas Bancarias</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddBankModal(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Cuenta
            </Button>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <BanknotesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No tienes cuentas bancarias registradas</p>
              <Button onClick={() => setShowAddBankModal(true)}>
                Agregar Primera Cuenta
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div 
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <BanknotesIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-gray-600">
                        {account.accountType === 'savings' ? 'Ahorro' : 'Corriente'} - 
                        ****{account.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.isDefault && (
                      <Badge variant="success">Principal</Badge>
                    )}
                    {account.verifiedAt ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ClockIcon className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Withdrawals */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Retiros Recientes</h3>
          
          {withdrawalHistory.length === 0 ? (
            <div className="text-center py-8">
              <ArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tienes retiros registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalHistory.slice(0, 5).map((withdrawal) => (
                <div 
                  key={withdrawal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      withdrawal.status === 'completed' ? 'bg-green-100' :
                      withdrawal.status === 'failed' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {withdrawal.status === 'completed' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : withdrawal.status === 'failed' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(withdrawal.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      withdrawal.status === 'completed' ? 'success' :
                      withdrawal.status === 'failed' ? 'danger' :
                      'warning'
                    }>
                      {withdrawal.status === 'completed' ? 'Completado' :
                       withdrawal.status === 'failed' ? 'Fallido' :
                       withdrawal.status === 'processing' ? 'Procesando' : 'Pendiente'}
                    </Badge>
                    {withdrawal.fee && (
                      <p className="text-xs text-gray-500 mt-1">
                        Comisión: {formatCurrency(withdrawal.fee)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionsList transactions={recentTransactions} />

      {/* Modals */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        availableAmount={availableForWithdrawal || 0}
        bankAccounts={bankAccounts}
        onWithdraw={async (data) => { await requestWithdrawal(data); }}
      />

      <AddBankAccountModal
        isOpen={showAddBankModal}
        onClose={() => setShowAddBankModal(false)}
        onAdd={async (data) => { await addBankAccount(data); }}
      />
    </div>
  );
};

