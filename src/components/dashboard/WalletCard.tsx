// src/components/dashboard/WalletCard.tsx - ESTILO TARJETA BANCARIA MINIMALISTA
import React, { useState } from 'react';
import { Button } from '@/components/ui';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface WalletCardProps {
  balance: number;
  accountNumber?: string;
  onWithdraw?: () => void;
  className?: string;
}

export const WalletCard: React.FC<WalletCardProps> = ({ 
  balance, 
//   accountNumber = "•••• 2293",
  onWithdraw,
  className = ""
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <div className={`bg-gradient-to-r from-[#a8c241] to-[#8ea635] rounded-2xl p-6 text-white shadow-lg max-w-sm ${className}`}>
      {/* Header con icono y toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <BanknotesIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Saldo Disponible</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBalance(!showBalance)}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 w-8 h-8"
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
        <div className="text-3xl font-bold mb-2">
          {showBalance ? formatCurrency(balance) : '••••••••'}
        </div>
        {/* <div className="text-sm opacity-80">
          Wiru {accountNumber}
        </div> */}
      </div>

      {/* Botón de retiro */}
      <Button
        onClick={onWithdraw}
        className="bg-white text-[#8ea635] hover:bg-white/90 font-medium px-6"
        disabled={balance < 50000}
      >
        <ArrowUpIcon className="h-4 w-4 mr-2 rotate-45" />
        Retirar
      </Button>
    </div>
  );
};