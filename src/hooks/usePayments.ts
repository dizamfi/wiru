// src/hooks/usePayments.ts
import { useEffect, useCallback, useMemo } from 'react';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PaymentFilter, PaymentTransaction, PaymentStatus, PaymentType } from '@/types/payment';
import { toast } from '@/components/ui/use-toast';
export const usePayments = (autoFetch = true) => {
  const store = usePaymentStore();

  // Auto-fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchTransactions();
      store.fetchPaymentSummary();
      store.fetchBankAccounts();
    }
  }, [autoFetch, store.fetchTransactions, store.fetchPaymentSummary, store.fetchBankAccounts]);

  // Memoized computed values
  const stats = useMemo(() => {
    const { transactions, summary } = store;
    
    return {
      totalTransactions: transactions.length,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
      failedTransactions: transactions.filter(t => t.status === 'failed').length,
      totalEarnings: summary?.totalEarnings || 0,
      availableForWithdrawal: summary?.availableForWithdrawal || 0,
      pendingAmount: summary?.pendingAmount || 0,
      completedThisMonth: summary?.completedThisMonth || 0
    };
  }, [store.transactions, store.summary]);

  // Enhanced filtering function
  const filterTransactions = useCallback((filters: Partial<PaymentFilter>) => {
    store.setFilters(filters);
  }, [store]);

  // Quick filter functions
  const showOnlyPending = useCallback(() => {
    filterTransactions({ status: 'pending' });
  }, [filterTransactions]);

  const showOnlyCompleted = useCallback(() => {
    filterTransactions({ status: 'completed' });
  }, [filterTransactions]);

  const showOnlySales = useCallback(() => {
    filterTransactions({ type: 'sale' });
  }, [filterTransactions]);

  const showOnlyReferrals = useCallback(() => {
    filterTransactions({ type: 'referral' });
  }, [filterTransactions]);

  // Search function with debouncing
  const searchTransactions = useCallback((searchTerm: string) => {
    filterTransactions({ searchTerm });
  }, [filterTransactions]);

  // Export functions with error handling
  const exportToPDF = useCallback(async () => {
    try {
      const url = await store.exportTransactions({
        format: 'pdf',
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          to: new Date().toISOString()
        },
        filters: store.filters
      });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacciones-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportación exitosa',
        description: 'Las transacciones se han exportado correctamente'
      });
    } catch (error) {
      toast({
        title: 'Error al exportar',
        description: 'No se pudieron exportar las transacciones',
        variant: 'destructive'
      });
    }
  }, [store.exportTransactions, store.filters]);

  const exportToCSV = useCallback(async () => {
    try {
      const url = await store.exportTransactions({
        format: 'csv',
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        },
        filters: store.filters
      });
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacciones-${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Exportación exitosa',
        description: 'Las transacciones se han exportado correctamente'
      });
    } catch (error) {
      toast({
        title: 'Error al exportar',
        description: 'No se pudieron exportar las transacciones',
        variant: 'destructive'
      });
    }
  }, [store.exportTransactions, store.filters]);

  // Transaction utilities
  const getTransactionById = useCallback((id: string): PaymentTransaction | undefined => {
    return store.transactions.find(t => t.id === id);
  }, [store.transactions]);

  const getTransactionsByStatus = useCallback((status: PaymentStatus): PaymentTransaction[] => {
    return store.transactions.filter(t => t.status === status);
  }, [store.transactions]);

  const getTransactionsByType = useCallback((type: PaymentType): PaymentTransaction[] => {
    return store.transactions.filter(t => t.type === type);
  }, [store.transactions]);

  // Withdrawal utilities
  const canRequestWithdrawal = useMemo(() => {
    return (stats.availableForWithdrawal || 0) >= 10; // Minimum withdrawal amount
  }, [stats.availableForWithdrawal]);

  const requestWithdrawal = useCallback(async (amount: number, method: string, details: any) => {
    try {
      const result = await store.createWithdrawal({
        amount,
        method: method as any,
        ...details
      });
      
      toast({
        title: 'Retiro solicitado',
        description: `Tu solicitud de retiro por $${amount} ha sido procesada`
      });
      
      return result;
    } catch (error) {
      toast({
        title: 'Error en retiro',
        description: 'No se pudo procesar tu solicitud de retiro',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.createWithdrawal]);

  // Bank account utilities
  const addBankAccount = useCallback(async (accountData: any) => {
    try {
      const result = await store.addBankAccount(accountData);
      
      toast({
        title: 'Cuenta agregada',
        description: 'La cuenta bancaria se ha agregado correctamente'
      });
      
      return result;
    } catch (error) {
      toast({
        title: 'Error al agregar cuenta',
        description: 'No se pudo agregar la cuenta bancaria',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.addBankAccount]);

  const setDefaultBankAccount = useCallback(async (accountId: string) => {
    try {
      await store.setDefaultBankAccount(accountId);
      
      toast({
        title: 'Cuenta predeterminada',
        description: 'La cuenta se ha establecido como predeterminada'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo establecer la cuenta como predeterminada',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.setDefaultBankAccount]);

  // Refresh functions
  const refreshTransactions = useCallback(() => {
    store.fetchTransactions();
  }, [store.fetchTransactions]);

  const refreshSummary = useCallback(() => {
    store.fetchPaymentSummary();
  }, [store.fetchPaymentSummary]);

  const refreshAll = useCallback(() => {
    store.fetchTransactions();
    store.fetchPaymentSummary();
    store.fetchBankAccounts();
    store.fetchWithdrawals();
  }, [store.fetchTransactions, store.fetchPaymentSummary, store.fetchBankAccounts, store.fetchWithdrawals]);

  // Clear error with toast
  const clearError = useCallback(() => {
    store.clearError();
  }, [store.clearError]);

  // Format currency utility
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  // Format date utility
  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  }, []);

  return {
    // State
    ...store,
    
    // Computed values
    stats,
    canRequestWithdrawal,
    
    // Filter functions
    filterTransactions,
    showOnlyPending,
    showOnlyCompleted,
    showOnlySales,
    showOnlyReferrals,
    searchTransactions,
    
    // Export functions
    exportToPDF,
    exportToCSV,
    
    // Transaction utilities
    getTransactionById,
    getTransactionsByStatus,
    getTransactionsByType,
    
    // Withdrawal utilities
    requestWithdrawal,
    
    // Bank account utilities
    addBankAccount,
    setDefaultBankAccount,
    
    // Refresh functions
    refreshTransactions,
    refreshSummary,
    refreshAll,
    
    // Utility functions
    clearError,
    formatCurrency,
    formatDate
  };
};