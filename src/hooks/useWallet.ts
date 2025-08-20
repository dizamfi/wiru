// src/hooks/useWallet.ts - Completo
import React from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BankAccount } from '@/types/user';
import { Transaction } from '@/components/wallet/TransactionsList';

export interface WalletBalance {
  total: number;
  available: number;
  pending: number;
  withdrawn: number;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccountId: string;
  description?: string;
  fee: number;
  finalAmount: number;
}

export interface WithdrawalHistory {
  id: string;
  amount: number;
  fee: number;
  finalAmount: number;
  bankAccountId: string;
  bankAccount?: BankAccount;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  reference?: string;
}

interface WalletState {
  // Balance
  balance: WalletBalance | null;
  
  // Transactions
  recentTransactions: Transaction[];
  allTransactions: Transaction[];
  transactionFilters: {
    type?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  
  // Bank accounts
  bankAccounts: BankAccount[];
  defaultBankAccount: BankAccount | null;
  
  // Withdrawals
  withdrawalHistory: WithdrawalHistory[];
  pendingWithdrawals: WithdrawalHistory[];
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Pagination
  transactionsPage: number;
  hasMoreTransactions: boolean;
}

interface WalletActions {
  // Balance
  fetchBalance: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  
  // Transactions
  fetchTransactions: (page?: number) => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  filterTransactions: (filters: any) => void;
  
  // Bank accounts
  fetchBankAccounts: () => Promise<void>;
  addBankAccount: (accountData: any) => Promise<BankAccount>;
  removeBankAccount: (accountId: string) => Promise<void>;
  setDefaultBankAccount: (accountId: string) => Promise<void>;
  
  // Withdrawals
  requestWithdrawal: (withdrawalData: WithdrawalRequest) => Promise<WithdrawalHistory>;
  fetchWithdrawalHistory: () => Promise<void>;
  cancelWithdrawal: (withdrawalId: string) => Promise<void>;
  
  // Utils
  calculateKushkiFee: (amount: number) => number;
  getAvailableForWithdrawal: () => number;
}

const useWalletStore = create<WalletState & WalletActions>()(
  devtools((set, get) => ({
    // Initial state
    balance: {
      total: 1250.75,
      available: 1150.75,
      pending: 100.00,
      withdrawn: 2400.50
    },
    recentTransactions: [
      {
        id: 'txn_001',
        type: 'earning',
        amount: 150.00,
        currency: 'USD',
        description: 'Venta completada - Smartphone iPhone 12',
        status: 'completed',
        createdAt: '2024-08-15T10:30:00Z',
        orderId: 'ORD-001',
        metadata: {}
      },
      {
        id: 'txn_002',
        type: 'withdrawal',
        amount: -100.00,
        currency: 'USD',
        description: 'Retiro a Banco Pichincha',
        status: 'completed',
        createdAt: '2024-08-12T14:20:00Z',
        withdrawalId: 'WTH-001',
        metadata: {
          bankAccount: 'Banco Pichincha ****1234',
          fee: 2.90,
          method: 'bank_transfer'
        }
      },
      {
        id: 'txn_003',
        type: 'fee',
        amount: -2.90,
        currency: 'USD',
        description: 'Comisión Kushki - Retiro',
        status: 'completed',
        createdAt: '2024-08-12T14:20:00Z',
        withdrawalId: 'WTH-001',
        metadata: {
          fee: 2.90
        }
      },
      {
        id: 'txn_004',
        type: 'earning',
        amount: 85.50,
        currency: 'USD',
        description: 'Venta completada - Laptop Dell',
        status: 'completed',
        createdAt: '2024-08-10T09:15:00Z',
        orderId: 'ORD-002',
        metadata: {}
      },
      {
        id: 'txn_005',
        type: 'bonus',
        amount: 50.00,
        currency: 'USD',
        description: 'Bono por referido activo',
        status: 'completed',
        createdAt: '2024-08-08T16:45:00Z',
        metadata: {
          reference: 'REF-Juan-Perez'
        }
      }
    ],
    allTransactions: [],
    transactionFilters: {},
    
    bankAccounts: [
      {
        id: 'bank_001',
        userId: 'user_123',
        bankName: 'Banco Pichincha',
        bankCode: '1007',
        accountType: 'savings',
        accountNumber: '2200123456789',
        accountHolder: 'Juan Carlos Pérez',
        identificationType: 'cedula',
        identificationNumber: '1234567890',
        isDefault: true,
        isActive: true,
        createdAt: '2024-07-01T00:00:00Z',
        verifiedAt: '2024-07-01T12:00:00Z'
      }
    ],
    defaultBankAccount: null,
    
    withdrawalHistory: [
      {
        id: 'WTH-001',
        amount: 100.00,
        fee: 2.90,
        finalAmount: 97.10,
        bankAccountId: 'bank_001',
        status: 'completed',
        createdAt: '2024-08-12T14:20:00Z',
        processedAt: '2024-08-12T16:30:00Z',
        reference: 'KUSHKI-TXN-123456'
      },
      {
        id: 'WTH-002',
        amount: 200.00,
        fee: 5.80,
        finalAmount: 194.20,
        bankAccountId: 'bank_001',
        status: 'pending',
        createdAt: '2024-08-14T10:15:00Z'
      }
    ],
    pendingWithdrawals: [],
    
    loading: false,
    error: null,
    transactionsPage: 1,
    hasMoreTransactions: true,

    // Actions
    fetchBalance: async () => {
      set({ loading: true, error: null });
      try {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Los datos ya están en el estado inicial
        set({ loading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al cargar balance',
          loading: false 
        });
      }
    },

    refreshBalance: async () => {
      // Refresh silencioso sin loading
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Actualizar balance aquí
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    },

    fetchTransactions: async (page = 1) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular paginación
        const state = get();
        if (page === 1) {
          set({ 
            allTransactions: state.recentTransactions,
            transactionsPage: 1,
            loading: false 
          });
        } else {
          // Simular más transacciones para páginas siguientes
          const moreTransactions: Transaction[] = [
            {
              id: `txn_${Date.now()}`,
              type: 'earning',
              amount: 75.25,
              currency: 'USD',
              description: 'Venta completada - Tablet Samsung',
              status: 'completed',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              orderId: 'ORD-003',
              metadata: {}
            }
          ];
          
          set({ 
            allTransactions: [...state.allTransactions, ...moreTransactions],
            transactionsPage: page,
            hasMoreTransactions: page < 3, // Máximo 3 páginas para demo
            loading: false 
          });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al cargar transacciones',
          loading: false 
        });
      }
    },

    fetchRecentTransactions: async () => {
      // Ya están cargadas en el estado inicial
      return Promise.resolve();
    },

    filterTransactions: (filters) => {
      set({ transactionFilters: filters });
    },

    fetchBankAccounts: async () => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const state = get();
        const defaultAccount = state.bankAccounts.find(acc => acc.isDefault);
        
        set({ 
          defaultBankAccount: defaultAccount || null,
          loading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al cargar cuentas bancarias',
          loading: false 
        });
      }
    },

    addBankAccount: async (accountData) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newAccount: BankAccount = {
          id: `bank_${Date.now()}`,
          userId: 'user_123',
          ...accountData,
          isActive: true,
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString() // Auto-verificar para demo
        };

        const state = get();
        const updatedAccounts = [...state.bankAccounts, newAccount];
        
        // Si es la primera cuenta o se marcó como predeterminada
        if (accountData.isDefault || state.bankAccounts.length === 0) {
          // Remover predeterminado de otras cuentas
          updatedAccounts.forEach(acc => {
            if (acc.id !== newAccount.id) acc.isDefault = false;
          });
          newAccount.isDefault = true;
        }

        set({ 
          bankAccounts: updatedAccounts,
          defaultBankAccount: newAccount.isDefault ? newAccount : state.defaultBankAccount,
          loading: false 
        });
        
        return newAccount;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al agregar cuenta bancaria',
          loading: false 
        });
        throw error;
      }
    },

    removeBankAccount: async (accountId) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const state = get();
        const accountToRemove = state.bankAccounts.find(acc => acc.id === accountId);
        const updatedAccounts = state.bankAccounts.filter(acc => acc.id !== accountId);
        
        // Si se eliminó la cuenta predeterminada, establecer otra como predeterminada
        let newDefaultAccount = state.defaultBankAccount;
        if (accountToRemove?.isDefault && updatedAccounts.length > 0) {
          updatedAccounts[0].isDefault = true;
          newDefaultAccount = updatedAccounts[0];
        } else if (accountToRemove?.isDefault) {
          newDefaultAccount = null;
        }

        set({ 
          bankAccounts: updatedAccounts,
          defaultBankAccount: newDefaultAccount,
          loading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al eliminar cuenta bancaria',
          loading: false 
        });
        throw error;
      }
    },

    setDefaultBankAccount: async (accountId) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const state = get();
        const updatedAccounts = state.bankAccounts.map(acc => ({
          ...acc,
          isDefault: acc.id === accountId
        }));
        
        const newDefaultAccount = updatedAccounts.find(acc => acc.id === accountId);

        set({ 
          bankAccounts: updatedAccounts,
          defaultBankAccount: newDefaultAccount || null,
          loading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al establecer cuenta predeterminada',
          loading: false 
        });
        throw error;
      }
    },

    requestWithdrawal: async (withdrawalData) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const state = get();
        const bankAccount = state.bankAccounts.find(acc => acc.id === withdrawalData.bankAccountId);
        
        const newWithdrawal: WithdrawalHistory = {
          id: `WTH-${Date.now()}`,
          amount: withdrawalData.amount,
          fee: withdrawalData.fee,
          finalAmount: withdrawalData.finalAmount,
          bankAccountId: withdrawalData.bankAccountId,
          bankAccount: bankAccount,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        // Crear transacciones asociadas
        const withdrawalTransaction: Transaction = {
          id: `txn_${Date.now()}_withdrawal`,
          type: 'withdrawal',
          amount: -withdrawalData.amount,
          currency: 'USD',
          description: `Retiro a ${bankAccount?.bankName || 'Cuenta bancaria'}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          withdrawalId: newWithdrawal.id,
          metadata: {
            bankAccount: `${bankAccount?.bankName} ****${bankAccount?.accountNumber.slice(-4)}`,
            fee: withdrawalData.fee,
            method: 'bank_transfer'
          }
        };

        const feeTransaction: Transaction = {
          id: `txn_${Date.now()}_fee`,
          type: 'fee',
          amount: -withdrawalData.fee,
          currency: 'USD',
          description: 'Comisión Kushki - Retiro',
          status: 'pending',
          createdAt: new Date().toISOString(),
          withdrawalId: newWithdrawal.id,
          metadata: {
            fee: withdrawalData.fee
          }
        };

        // Actualizar balance
        const newBalance = {
          ...state.balance!,
          available: state.balance!.available - withdrawalData.amount,
          pending: state.balance!.pending + withdrawalData.amount
        };

        set({ 
          withdrawalHistory: [newWithdrawal, ...state.withdrawalHistory],
          pendingWithdrawals: [newWithdrawal, ...state.pendingWithdrawals],
          recentTransactions: [withdrawalTransaction, feeTransaction, ...state.recentTransactions],
          balance: newBalance,
          loading: false 
        });
        
        return newWithdrawal;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al procesar retiro',
          loading: false 
        });
        throw error;
      }
    },

    fetchWithdrawalHistory: async () => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const state = get();
        const pending = state.withdrawalHistory.filter(w => w.status === 'pending');
        
        set({ 
          pendingWithdrawals: pending,
          loading: false 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al cargar historial de retiros',
          loading: false 
        });
      }
    },

    cancelWithdrawal: async (withdrawalId) => {
      set({ loading: true, error: null });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const state = get();
        const withdrawal = state.withdrawalHistory.find(w => w.id === withdrawalId);
        
        if (withdrawal && withdrawal.status === 'pending') {
          const updatedWithdrawals = state.withdrawalHistory.map(w =>
            w.id === withdrawalId ? { ...w, status: 'cancelled' as const } : w
          );
          
          const updatedPending = state.pendingWithdrawals.filter(w => w.id !== withdrawalId);
          
          // Restaurar balance
          const newBalance = {
            ...state.balance!,
            available: state.balance!.available + withdrawal.amount,
            pending: state.balance!.pending - withdrawal.amount
          };

          set({ 
            withdrawalHistory: updatedWithdrawals,
            pendingWithdrawals: updatedPending,
            balance: newBalance,
            loading: false 
          });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al cancelar retiro',
          loading: false 
        });
        throw error;
      }
    },

    calculateKushkiFee: (amount) => {
      // Comisión Kushki: 2.9% con mínimo de $2
      return Math.max(amount * 0.029, 2);
    },

    getAvailableForWithdrawal: () => {
      const state = get();
      return state.balance?.available || 0;
    }
  }))
);

// Hook principal para usar el wallet
export const useWallet = () => {
  const store = useWalletStore();

  React.useEffect(() => {
    // Cargar datos iniciales
    store.fetchBalance();
    store.fetchBankAccounts();
    store.fetchWithdrawalHistory();
  }, []);

  return {
    // State
    balance: store.balance,
    availableForWithdrawal: store.getAvailableForWithdrawal(),
    pendingBalance: store.balance?.pending || 0,
    recentTransactions: store.recentTransactions,
    allTransactions: store.allTransactions,
    bankAccounts: store.bankAccounts,
    defaultBankAccount: store.defaultBankAccount,
    withdrawalHistory: store.withdrawalHistory,
    pendingWithdrawals: store.pendingWithdrawals,
    loading: store.loading,
    error: store.error,
    hasMoreTransactions: store.hasMoreTransactions,

    // Actions
    refreshBalance: store.refreshBalance,
    fetchTransactions: store.fetchTransactions,
    addBankAccount: store.addBankAccount,
    removeBankAccount: store.removeBankAccount,
    setDefaultBankAccount: store.setDefaultBankAccount,
    requestWithdrawal: store.requestWithdrawal,
    cancelWithdrawal: store.cancelWithdrawal,
    calculateKushkiFee: store.calculateKushkiFee,

    // Computed values
    canWithdraw: (store.balance?.available || 0) >= 10,
    totalEarnings: store.balance?.total || 0,
    totalWithdrawn: store.balance?.withdrawn || 0
  };
};

// Hook específico para estadísticas del wallet
export const useWalletStats = () => {
  const { balance, recentTransactions, withdrawalHistory } = useWallet();

  const stats = React.useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlyEarnings = recentTransactions
      .filter(t => {
        const txDate = new Date(t.createdAt);
        return t.type === 'earning' && 
               txDate.getMonth() === thisMonth && 
               txDate.getFullYear() === thisYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyWithdrawals = withdrawalHistory
      .filter(w => {
        const wDate = new Date(w.createdAt);
        return w.status === 'completed' &&
               wDate.getMonth() === thisMonth && 
               wDate.getFullYear() === thisYear;
      })
      .reduce((sum, w) => sum + w.finalAmount, 0);

    const totalFees = recentTransactions
      .filter(t => t.type === 'fee')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const earningTransactions = recentTransactions.filter(t => t.type === 'earning');
    const averageTransaction = earningTransactions.length > 0 ? 
      monthlyEarnings / earningTransactions.length : 0;

    // Estadísticas adicionales
    const weeklyEarnings = recentTransactions
      .filter(t => {
        const txDate = new Date(t.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return t.type === 'earning' && txDate >= weekAgo;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawalFrequency = withdrawalHistory.length > 0 ? 
      withdrawalHistory.length / 30 : 0; // retiros por día promedio

    return {
      monthlyEarnings,
      monthlyWithdrawals,
      weeklyEarnings,
      totalFees,
      averageTransaction,
      withdrawalFrequency,
      profitMargin: monthlyEarnings > 0 ? ((monthlyEarnings - totalFees) / monthlyEarnings) * 100 : 0,
      totalTransactions: recentTransactions.length,
      successfulWithdrawals: withdrawalHistory.filter(w => w.status === 'completed').length
    };
  }, [balance, recentTransactions, withdrawalHistory]);

  return stats;
};

// Hook para métricas avanzadas del wallet
export const useWalletMetrics = () => {
  const { balance, recentTransactions, withdrawalHistory } = useWallet();

  const metrics = React.useMemo(() => {
    // Calcular tendencias mensuales
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
        name: date.toLocaleDateString('es-ES', { month: 'short' })
      };
    }).reverse();

    const monthlyData = last6Months.map(({ month, year, name }) => {
      const monthlyEarnings = recentTransactions
        .filter(t => {
          const txDate = new Date(t.createdAt);
          return t.type === 'earning' && 
                 txDate.getMonth() === month && 
                 txDate.getFullYear() === year;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyWithdrawals = withdrawalHistory
        .filter(w => {
          const wDate = new Date(w.createdAt);
          return w.status === 'completed' &&
                 wDate.getMonth() === month && 
                 wDate.getFullYear() === year;
        })
        .reduce((sum, w) => sum + w.finalAmount, 0);

      return {
        month: name,
        earnings: monthlyEarnings,
        withdrawals: monthlyWithdrawals,
        net: monthlyEarnings - monthlyWithdrawals
      };
    });

    // Calcular velocidad de retiro
    const avgWithdrawalTime = withdrawalHistory
      .filter(w => w.status === 'completed' && w.processedAt)
      .reduce((sum, w) => {
        const created = new Date(w.createdAt).getTime();
        const processed = new Date(w.processedAt!).getTime();
        return sum + (processed - created);
      }, 0) / withdrawalHistory.filter(w => w.status === 'completed').length;

    // Eficiencia de costos
    const totalFees = recentTransactions
      .filter(t => t.type === 'fee')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalEarnings = recentTransactions
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + t.amount, 0);

    const feePercentage = totalEarnings > 0 ? (totalFees / totalEarnings) * 100 : 0;

    return {
      monthlyData,
      avgWithdrawalTimeHours: avgWithdrawalTime / (1000 * 60 * 60),
      feePercentage,
      totalEarnings,
      totalFees,
      retentionRate: balance?.available ? (balance.available / balance.total) * 100 : 0
    };
  }, [balance, recentTransactions, withdrawalHistory]);

  return metrics;
};