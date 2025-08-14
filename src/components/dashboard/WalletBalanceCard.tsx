// src/components/dashboard/WalletBalanceCard.tsx - VERSIÓN MINIMALISTA WIRU
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Button 
} from '@/components/ui';
import {
  EyeIcon,
  EyeSlashIcon,
  BanknotesIcon,
  ArrowDownIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  type: 'income' | 'pending';
  amount: number;
  description: string;
  date: string;
}

interface WalletBalanceProps {
  balance: {
    available: number;
    pending: number;
    total: number;
  };
  recentTransactions: Transaction[];
  onWithdraw?: () => void;
  onViewAll?: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceProps> = ({ 
  balance, 
  recentTransactions, 
  onWithdraw, 
  onViewAll 
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-[#a8c241] to-[#8ea635] text-white shadow-lg border-0">
      <CardContent className="p-6">
        {/* Header del saldo */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white/90">
                Tu Saldo
              </h3>
              <p className="text-xs text-white/70">
                Disponible para retiro
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2"
          >
            {showBalance ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Saldo principal */}
        <div className="mb-6">
          <div className="text-4xl font-bold mb-3">
            {showBalance ? formatCurrency(balance.available) : '••••••••'}
          </div>
          
          {balance.pending > 0 && (
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <ClockIcon className="h-4 w-4" />
              <span>Pendiente: {showBalance ? formatCurrency(balance.pending) : '••••••'}</span>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3 mb-6">
          <Button
            onClick={onWithdraw}
            className="flex-1 bg-white text-[#8ea635] hover:bg-white/90 font-medium"
            disabled={balance.available < 50000}
          >
            <ArrowDownIcon className="h-4 w-4 mr-2" />
            Retirar
          </Button>
          <Button
            onClick={onViewAll}
            variant="outline"
            className="flex-1 border-white text-white hover:bg-white hover:bg-opacity-10"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Ver Movimientos
          </Button>
        </div>

        {/* Transacciones recientes */}
        {recentTransactions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-white/90 mb-3">
              Últimos Movimientos
            </h4>
            <div className="space-y-2">
              {recentTransactions.slice(0, 2).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-300' : 'bg-orange-300'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-white/70">
                        {new Date(transaction.date).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-green-300">
                    +{showBalance ? formatCurrency(transaction.amount) : '••••••'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};