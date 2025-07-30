// src/hooks/useOrders.ts
import { useEffect, useCallback, useMemo } from 'react';
import { useOrderStore } from '@/stores/useOrderStore';
import { 
  Order, 
  OrderStatus, 
  OrderFilters, 
  CreateOrderRequest, 
  UpdateOrderRequest,
  VerificationInfo,
  ORDER_STATUS_CONFIG
} from '@/types/order';
import { toast } from '@/components/ui/use-toast';

export const useOrders = (autoFetch = true) => {
  const store = useOrderStore();

  // Auto-fetch orders on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchOrders();
      store.fetchOrderStats();
    }
  }, [autoFetch, store.fetchOrders, store.fetchOrderStats]);

  // Memoized computed values
  const ordersByStatus = useMemo(() => {
    return store.orders.reduce((acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order);
      return acc;
    }, {} as Record<OrderStatus, Order[]>);
  }, [store.orders]);

  const recentOrders = useMemo(() => {
    return store.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [store.orders]);

  const activeOrders = useMemo(() => {
    const activeStatuses: OrderStatus[] = [
      'pending', 'confirmed', 'pickup_scheduled', 'in_transit', 
      'received', 'in_verification', 'verified', 'payment_pending'
    ];
    return store.orders.filter(order => activeStatuses.includes(order.status));
  }, [store.orders]);

  // Format helpers
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency
    }).format(amount);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatWeight = useCallback((weight: number) => {
    return `${weight.toFixed(2)} kg`;
  }, []);

  // Status helpers
  const getStatusInfo = useCallback((status: OrderStatus) => {
    return ORDER_STATUS_CONFIG[status];
  }, []);

  const getStatusBadgeVariant = useCallback((status: OrderStatus) => {
    const config = ORDER_STATUS_CONFIG[status];
    switch (config.color) {
      case 'green': case 'emerald': return 'success';
      case 'red': return 'danger';
      case 'yellow': case 'orange': return 'warning';
      case 'blue': case 'indigo': case 'cyan': return 'info';
      default: return 'default';
    }
  }, []);

  const canTransitionTo = useCallback((currentStatus: OrderStatus, targetStatus: OrderStatus) => {
    const config = ORDER_STATUS_CONFIG[currentStatus];
    return config.allowedTransitions.includes(targetStatus);
  }, []);

  // Order operations
  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    try {
      const order = await store.createOrder(orderData);
      
      toast({
        title: 'Orden creada exitosamente',
        description: `Orden ${order.orderNumber} ha sido creada`,
        variant: 'success'
      });
      
      return order;
    } catch (error) {
      toast({
        title: 'Error al crear orden',
        description: 'No se pudo crear la orden. Intenta nuevamente.',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.createOrder]);

  const updateOrder = useCallback(async (orderId: string, updates: UpdateOrderRequest) => {
    try {
      const order = await store.updateOrder(orderId, updates);
      
      toast({
        title: 'Orden actualizada',
        description: 'Los cambios han sido guardados exitosamente',
        variant: 'success'
      });
      
      return order;
    } catch (error) {
      toast({
        title: 'Error al actualizar orden',
        description: 'No se pudieron guardar los cambios',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.updateOrder]);

  const cancelOrder = useCallback(async (orderId: string, reason?: string) => {
    try {
      await store.cancelOrder(orderId, reason);
      
      toast({
        title: 'Orden cancelada',
        description: 'La orden ha sido cancelada exitosamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al cancelar orden',
        description: 'No se pudo cancelar la orden',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.cancelOrder]);

  const duplicateOrder = useCallback(async (orderId: string) => {
    try {
      const newOrder = await store.duplicateOrder(orderId);
      
      toast({
        title: 'Orden duplicada',
        description: `Nueva orden ${newOrder.orderNumber} creada`,
        variant: 'success'
      });
      
      return newOrder;
    } catch (error) {
      toast({
        title: 'Error al duplicar orden',
        description: 'No se pudo duplicar la orden',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.duplicateOrder]);

  // Status operations
  const updateOrderStatus = useCallback(async (
    orderId: string, 
    newStatus: OrderStatus, 
    notes?: string
  ) => {
    try {
      await store.updateOrderStatus(orderId, newStatus, notes);
      
      const statusInfo = getStatusInfo(newStatus);
      toast({
        title: 'Estado actualizado',
        description: `Orden cambiada a: ${statusInfo.label}`,
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar estado',
        description: 'No se pudo cambiar el estado de la orden',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.updateOrderStatus, getStatusInfo]);

  const schedulePickup = useCallback(async (
    orderId: string, 
    pickupDate: string, 
    timeSlot: string
  ) => {
    try {
      await store.schedulePickup(orderId, pickupDate, timeSlot);
      
      toast({
        title: 'Recolección programada',
        description: `Programada para ${new Date(pickupDate).toLocaleDateString('es-ES')}`,
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al programar recolección',
        description: 'No se pudo programar la recolección',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.schedulePickup]);

  // Verification operations
  const submitVerification = useCallback(async (
    orderId: string, 
    verification: VerificationInfo
  ) => {
    try {
      await store.submitVerification(orderId, verification);
      
      toast({
        title: 'Verificación enviada',
        description: 'Los resultados de verificación han sido registrados',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error en verificación',
        description: 'No se pudo procesar la verificación',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.submitVerification]);

  // Tracking operations
  const trackShipment = useCallback(async (orderId: string) => {
    try {
      const shippingInfo = await store.trackShipment(orderId);
      
      toast({
        title: 'Información actualizada',
        description: 'Estado de envío actualizado',
        variant: 'success'
      });
      
      return shippingInfo;
    } catch (error) {
      toast({
        title: 'Error al rastrear envío',
        description: 'No se pudo obtener información de rastreo',
        variant: 'destructive'
      });
      throw error;
    }
  }, [store.trackShipment]);

  // Filter operations
  const applyFilters = useCallback((filters: Partial<OrderFilters>) => {
    store.setFilters(filters);
  }, [store.setFilters]);

  const clearFilters = useCallback(() => {
    store.clearFilters();
  }, [store.clearFilters]);

  const searchOrders = useCallback((searchTerm: string) => {
    store.setFilters({ searchTerm, page: 1 });
  }, [store.setFilters]);

  const filterByStatus = useCallback((status: OrderStatus | 'all') => {
    const statusFilter = status === 'all' ? undefined : status;
    store.setFilters({ status: statusFilter, page: 1 });
  }, [store.setFilters]);

  const filterByDateRange = useCallback((from: string, to: string) => {
    store.setFilters({ dateRange: { from, to }, page: 1 });
  }, [store.setFilters]);

  // Utility functions
  const getOrderProgress = useCallback((order: Order) => {
    const statuses = Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[];
    const currentIndex = statuses.indexOf(order.status);
    const totalSteps = statuses.filter(status => !ORDER_STATUS_CONFIG[status].isTerminal).length;
    
    return {
      current: currentIndex + 1,
      total: totalSteps,
      percentage: Math.round(((currentIndex + 1) / totalSteps) * 100)
    };
  }, []);

  const getOrderSummary = useCallback((order: Order) => {
    const totalItems = order.items.length;
    const totalWeight = order.items.reduce((sum, item) => sum + item.estimatedWeight, 0);
    const hasVerification = !!order.verification;
    const variance = hasVerification ? 
      ((order.verification!.totalActualValue - order.estimatedTotal) / order.estimatedTotal * 100) : 0;

    return {
      totalItems,
      totalWeight,
      hasVerification,
      variance,
      isValueIncreased: variance > 0,
      isValueDecreased: variance < 0
    };
  }, []);

  const getEstimatedCompletion = useCallback((order: Order) => {
    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    
    // Estimated times in hours for each status transition
    const estimatedTimes = {
      pending: 2,
      confirmed: 4,
      pickup_scheduled: 24,
      in_transit: 48,
      received: 2,
      in_verification: 24,
      verified: 4,
      payment_pending: 24,
      paid: 1
    };

    let remainingTime = 0;
    const currentStatusIndex = Object.keys(estimatedTimes).indexOf(order.status);
    const remainingStatuses = Object.keys(estimatedTimes).slice(currentStatusIndex + 1);
    
    remainingStatuses.forEach(status => {
      remainingTime += estimatedTimes[status as keyof typeof estimatedTimes];
    });

    const estimatedCompletion = new Date();
    estimatedCompletion.setHours(estimatedCompletion.getHours() + remainingTime);

    return {
      remainingHours: remainingTime,
      estimatedDate: estimatedCompletion.toISOString(),
      formattedDate: estimatedCompletion.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      await store.refreshOrders();
      await store.fetchOrderStats();
      
      toast({
        title: 'Datos actualizados',
        description: 'La información ha sido actualizada exitosamente',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudieron actualizar los datos',
        variant: 'destructive'
      });
    }
  }, [store.refreshOrders, store.fetchOrderStats]);

  return {
    // State
    orders: store.orders,
    currentOrder: store.currentOrder,
    stats: store.stats,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    totalPages: store.totalPages,
    currentPage: store.currentPage,
    
    // Computed values
    ordersByStatus,
    recentOrders,
    activeOrders,
    
    // Order operations
    createOrder,
    updateOrder,
    cancelOrder,
    duplicateOrder,
    fetchOrderById: store.fetchOrderById,
    
    // Status operations
    updateOrderStatus,
    schedulePickup,
    confirmDelivery: store.confirmDelivery,
    
    // Verification operations
    submitVerification,
    approveVerification: store.approveVerification,
    rejectVerification: store.rejectVerification,
    
    // Tracking operations
    trackShipment,
    updateShippingInfo: store.updateShippingInfo,
    
    // Timeline operations
    addTimelineEvent: store.addTimelineEvent,
    
    // Filter operations
    applyFilters,
    clearFilters,
    searchOrders,
    filterByStatus,
    filterByDateRange,
    setCurrentPage: store.setCurrentPage,
    
    // Utilities
    formatCurrency,
    formatDate,
    formatWeight,
    getStatusInfo,
    getStatusBadgeVariant,
    canTransitionTo,
    getOrderProgress,
    getOrderSummary,
    getEstimatedCompletion,
    
    // UI utilities
    setCurrentOrder: store.setCurrentOrder,
    clearError: store.clearError,
    refreshData
  };
};