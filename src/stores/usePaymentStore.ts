// src/stores/usePaymentStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PaymentState, 
  PaymentActions, 
  PaymentTransaction, 
  PaymentSummary,
  WithdrawalRequest,
  BankAccount,
  PaymentFilter,
  WithdrawalResponse,
  PaymentExport
} from '@/types/payment';
import { paymentApi } from '@/services/paymentApi';

interface PaymentStore extends PaymentState, PaymentActions {}

const initialState: PaymentState = {
  transactions: [],
  summary: null,
  withdrawals: [],
  bankAccounts: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    method: 'all',
    searchTerm: ''
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  }
};

export const usePaymentStore = create<PaymentStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Transactions
      fetchTransactions: async (filters?: PaymentFilter) => {
        try {
          set({ loading: true, error: null });
          
          const currentFilters = filters || get().filters;
          const { page, limit } = get().pagination;
          
          const response = await paymentApi.getTransactions({
            ...currentFilters,
            page,
            limit
          });
          
          set({
            transactions: response.transactions,
            pagination: {
              page: response.page,
              limit: response.limit,
              total: response.total,
              hasMore: response.hasMore
            },
            filters: currentFilters,
            loading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar transacciones',
            loading: false 
          });
        }
      },

      fetchTransactionById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const transaction = await paymentApi.getTransactionById(id);
          set({ loading: false });
          return transaction;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar transacción',
            loading: false 
          });
          throw error;
        }
      },

      // Summary
      fetchPaymentSummary: async () => {
        try {
          set({ loading: true, error: null });
          const summary = await paymentApi.getPaymentSummary();
          set({ summary, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar resumen',
            loading: false 
          });
        }
      },

      // Withdrawals
      createWithdrawal: async (request) => {
        try {
          set({ loading: true, error: null });
          const response = await paymentApi.createWithdrawal(request);
          
          // Actualizar lista de withdrawals
          const currentWithdrawals = get().withdrawals;
          set({ 
            withdrawals: [response.withdrawal, ...currentWithdrawals],
            loading: false 
          });
          
          return response;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al crear retiro',
            loading: false 
          });
          throw error;
        }
      },

      fetchWithdrawals: async () => {
        try {
          set({ loading: true, error: null });
          const withdrawals = await paymentApi.getWithdrawals();
          set({ withdrawals, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar retiros',
            loading: false 
          });
        }
      },

      cancelWithdrawal: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await paymentApi.cancelWithdrawal(id);
          
          // Actualizar estado local
          const withdrawals = get().withdrawals.map(w => 
            w.id === id ? { ...w, status: 'cancelled' as const } : w
          );
          set({ withdrawals, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cancelar retiro',
            loading: false 
          });
        }
      },

      // Bank Accounts
      fetchBankAccounts: async () => {
        try {
          set({ loading: true, error: null });
          const bankAccounts = await paymentApi.getBankAccounts();
          set({ bankAccounts, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al cargar cuentas bancarias',
            loading: false 
          });
        }
      },

      addBankAccount: async (account) => {
        try {
          set({ loading: true, error: null });
          const newAccount = await paymentApi.addBankAccount(account);
          
          const bankAccounts = [...get().bankAccounts, newAccount];
          set({ bankAccounts, loading: false });
          
          return newAccount;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al agregar cuenta bancaria',
            loading: false 
          });
          throw error;
        }
      },

      updateBankAccount: async (id: string, account) => {
        try {
          set({ loading: true, error: null });
          const updatedAccount = await paymentApi.updateBankAccount(id, account);
          
          const bankAccounts = get().bankAccounts.map(acc => 
            acc.id === id ? updatedAccount : acc
          );
          set({ bankAccounts, loading: false });
          
          return updatedAccount;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar cuenta bancaria',
            loading: false 
          });
          throw error;
        }
      },

      deleteBankAccount: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await paymentApi.deleteBankAccount(id);
          
          const bankAccounts = get().bankAccounts.filter(acc => acc.id !== id);
          set({ bankAccounts, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar cuenta bancaria',
            loading: false 
          });
        }
      },

      setDefaultBankAccount: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await paymentApi.setDefaultBankAccount(id);
          
          const bankAccounts = get().bankAccounts.map(acc => ({
            ...acc,
            isDefault: acc.id === id
          }));
          set({ bankAccounts, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al establecer cuenta por defecto',
            loading: false 
          });
        }
      },

      // Filters & Pagination
      setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        
        set({ 
          filters: updatedFilters,
          pagination: { ...get().pagination, page: 1 } // Reset page when filters change
        });
        
        // Auto-fetch with new filters
        get().fetchTransactions(updatedFilters);
      },

      setPage: (page: number) => {
        set({ 
          pagination: { ...get().pagination, page }
        });
        
        // Auto-fetch with new page
        get().fetchTransactions();
      },

      resetFilters: () => {
        const defaultFilters: PaymentFilter = {
          status: 'all',
          type: 'all',
          method: 'all',
          searchTerm: ''
        };
        
        set({ 
          filters: defaultFilters,
          pagination: { ...get().pagination, page: 1 }
        });
        
        // Auto-fetch with reset filters
        get().fetchTransactions(defaultFilters);
      },

      // Export
      exportTransactions: async (options: PaymentExport) => {
        try {
          set({ loading: true, error: null });
          const downloadUrl = await paymentApi.exportTransactions(options);
          set({ loading: false });
          return downloadUrl;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al exportar transacciones',
            loading: false 
          });
          throw error;
        }
      },

      // Utility
      clearError: () => set({ error: null }),

      reset: () => set(initialState)
    }),
    {
      name: 'payment-store'
    }
  )
);