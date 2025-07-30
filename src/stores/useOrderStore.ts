// // src/stores/useOrderStore.ts
// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import {
//   Order,
//   OrderStatus,
//   OrderFilters,
//   OrderStats,
//   CreateOrderRequest,
//   UpdateOrderRequest,
//   VerificationInfo,
//   ShippingInfo,
//   OrderTimelineEvent
// } from '@/types/order';
// import { orderApi } from '@/services/orderApi';

// interface OrderState {
//   // Orders data
//   orders: Order[];
//   currentOrder: Order | null;
//   stats: OrderStats | null;
  
//   // UI state
//   loading: boolean;
//   error: string | null;
  
//   // Filters and pagination
//   filters: OrderFilters;
//   totalPages: number;
//   currentPage: number;
  
//   // Cache
//   cachedOrders: Map<string, Order>;
//   lastFetch: string | null;
// }

// interface OrderActions {
//   // Data fetching
//   fetchOrders: (filters?: OrderFilters) => Promise<void>;
//   fetchOrderById: (orderId: string) => Promise<Order>;
//   fetchOrderStats: () => Promise<void>;
//   refreshOrders: () => Promise<void>;
  
//   // Order management
//   createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
//   updateOrder: (orderId: string, updates: UpdateOrderRequest) => Promise<Order>;
//   cancelOrder: (orderId: string, reason?: string) => Promise<void>;
//   duplicateOrder: (orderId: string) => Promise<Order>;
  
//   // Status management
//   updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => Promise<void>;
//   schedulePickup: (orderId: string, pickupDate: string, timeSlot: string) => Promise<void>;
//   confirmDelivery: (orderId: string) => Promise<void>;
  
//   // Verification
//   submitVerification: (orderId: string, verification: VerificationInfo) => Promise<void>;
//   approveVerification: (orderId: string) => Promise<void>;
//   rejectVerification: (orderId: string, reason: string) => Promise<void>;
  
//   // Shipping and tracking
//   updateShippingInfo: (orderId: string, shipping: Partial<ShippingInfo>) => Promise<void>;
//   trackShipment: (orderId: string) => Promise<ShippingInfo>;
  
//   // Timeline
//   addTimelineEvent: (orderId: string, event: Omit<OrderTimelineEvent, 'id'>) => Promise<void>;
  
//   // Filters and search
//   setFilters: (filters: Partial<OrderFilters>) => void;
//   clearFilters: () => void;
//   setCurrentPage: (page: number) => void;
  
//   // UI utilities
//   setCurrentOrder: (order: Order | null) => void;
//   clearError: () => void;
//   reset: () => void;
// }

// interface OrderStore extends OrderState, OrderActions {}

// const initialFilters: OrderFilters = {
//   sortBy: 'createdAt',
//   sortOrder: 'desc',
//   page: 1,
//   limit: 20
// };

// const initialState: OrderState = {
//   orders: [],
//   currentOrder: null,
//   stats: null,
//   loading: false,
//   error: null,
//   filters: initialFilters,
//   totalPages: 0,
//   currentPage: 1,
//   cachedOrders: new Map(),
//   lastFetch: null
// };

// export const useOrderStore = create<OrderStore>()(
//   devtools(
//     (set, get) => ({
//       ...initialState,

//       // Data fetching
//       fetchOrders: async (filters?: OrderFilters) => {
//         try {
//           set({ loading: true, error: null });
          
//           const targetFilters = { ...get().filters, ...filters };
//           const response = await orderApi.getOrders(targetFilters);
          
//           set({
//             orders: response.data,
//             totalPages: response.pagination?.totalPages || 0,
//             currentPage: response.pagination?.page || 1,
//             filters: targetFilters,
//             lastFetch: new Date().toISOString(),
//             loading: false
//           });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al cargar órdenes',
//             loading: false
//           });
//         }
//       },

//       fetchOrderById: async (orderId: string) => {
//         try {
//           // Check cache first
//           const cached = get().cachedOrders.get(orderId);
//           if (cached) {
//             set({ currentOrder: cached });
//             return cached;
//           }

//           set({ loading: true, error: null });
          
//           const order = await orderApi.getOrderById(orderId);
          
//           // Update cache
//           const newCache = new Map(get().cachedOrders);
//           newCache.set(orderId, order);
          
//           set({
//             currentOrder: order,
//             cachedOrders: newCache,
//             loading: false
//           });
          
//           return order;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al cargar orden',
//             loading: false
//           });
//           throw error;
//         }
//       },

//       fetchOrderStats: async () => {
//         try {
//           const stats = await orderApi.getOrderStats();
//           set({ stats });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al cargar estadísticas'
//           });
//         }
//       },

//       refreshOrders: async () => {
//         // Clear cache and fetch fresh data
//         set({ cachedOrders: new Map(), lastFetch: null });
//         await get().fetchOrders();
//       },

//       // Order management
//       createOrder: async (orderData: CreateOrderRequest) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await orderApi.createOrder(orderData);
          
//           // Add to beginning of orders list
//           const currentOrders = get().orders;
//           set({
//             orders: [response.order, ...currentOrders],
//             currentOrder: response.order,
//             loading: false
//           });
          
//           // Update cache
//           const newCache = new Map(get().cachedOrders);
//           newCache.set(response.order.id, response.order);
//           set({ cachedOrders: newCache });
          
//           return response.order;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al crear orden',
//             loading: false
//           });
//           throw error;
//         }
//       },

//       updateOrder: async (orderId: string, updates: UpdateOrderRequest) => {
//         try {
//           set({ loading: true, error: null });
          
//           const updatedOrder = await orderApi.updateOrder(orderId, updates);
          
//           // Update in orders list
//           const orders = get().orders.map(order =>
//             order.id === orderId ? updatedOrder : order
//           );
          
//           // Update current order if it's the same
//           const currentOrder = get().currentOrder?.id === orderId ? updatedOrder : get().currentOrder;
          
//           // Update cache
//           const newCache = new Map(get().cachedOrders);
//           newCache.set(orderId, updatedOrder);
          
//           set({
//             orders,
//             currentOrder,
//             cachedOrders: newCache,
//             loading: false
//           });
          
//           return updatedOrder;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al actualizar orden',
//             loading: false
//           });
//           throw error;
//         }
//       },

//       cancelOrder: async (orderId: string, reason?: string) => {
//         try {
//           await orderApi.cancelOrder(orderId, reason);
          
//           // Update order status
//           await get().updateOrderStatus(orderId, 'cancelled', reason);
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al cancelar orden'
//           });
//           throw error;
//         }
//       },

//       duplicateOrder: async (orderId: string) => {
//         try {
//           set({ loading: true, error: null });
          
//           const duplicatedOrder = await orderApi.duplicateOrder(orderId);
          
//           // Add to beginning of orders list
//           const currentOrders = get().orders;
//           set({
//             orders: [duplicatedOrder, ...currentOrders],
//             currentOrder: duplicatedOrder,
//             loading: false
//           });
          
//           return duplicatedOrder;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al duplicar orden',
//             loading: false
//           });
//           throw error;
//         }
//       },

//       // Status management
//       updateOrderStatus: async (orderId: string, newStatus: OrderStatus, notes?: string) => {
//         try {
//           const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus, notes);
          
//           // Update in store
//           await get().updateOrder(orderId, { status: newStatus });
          
//           // Add timeline event
//           if (notes) {
//             await get().addTimelineEvent(orderId, {
//               orderId,
//               status: newStatus,
//               title: `Estado actualizado a ${newStatus}`,
//               description: notes,
//               timestamp: new Date().toISOString(),
//               isVisible: true
//             });
//           }
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al actualizar estado'
//           });
//           throw error;
//         }
//       },

//       schedulePickup: async (orderId: string, pickupDate: string, timeSlot: string) => {
//         try {
//           const result = await orderApi.schedulePickup(orderId, pickupDate, timeSlot);
          
//           // Update order with shipping info
//           await get().updateOrder(orderId, {
//             status: 'pickup_scheduled',
//             shipping: {
//               pickupScheduled: true,
//               pickupDate,
//               pickupTimeSlot: timeSlot
//             }
//           });
          
//           return result;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al programar recolección'
//           });
//           throw error;
//         }
//       },

//       confirmDelivery: async (orderId: string) => {
//         try {
//           await orderApi.confirmDelivery(orderId);
//           await get().updateOrderStatus(orderId, 'received');
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al confirmar entrega'
//           });
//           throw error;
//         }
//       },

//       // Verification
//       submitVerification: async (orderId: string, verification: VerificationInfo) => {
//         try {
//           set({ loading: true, error: null });
          
//           const updatedOrder = await orderApi.submitVerification(orderId, verification);
          
//           await get().updateOrder(orderId, {
//             status: verification.requiresApproval ? 'verified' : 'payment_pending'
//           });
          
//           set({ loading: false });
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al enviar verificación',
//             loading: false
//           });
//           throw error;
//         }
//       },

//       approveVerification: async (orderId: string) => {
//         try {
//           await orderApi.approveVerification(orderId);
//           await get().updateOrderStatus(orderId, 'payment_pending');
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al aprobar verificación'
//           });
//           throw error;
//         }
//       },

//       rejectVerification: async (orderId: string, reason: string) => {
//         try {
//           await orderApi.rejectVerification(orderId, reason);
//           await get().updateOrderStatus(orderId, 'rejected', reason);
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al rechazar verificación'
//           });
//           throw error;
//         }
//       },

//       // Shipping and tracking
//       updateShippingInfo: async (orderId: string, shipping: Partial<ShippingInfo>) => {
//         try {
//           const updatedOrder = await orderApi.updateShippingInfo(orderId, shipping);
//           await get().updateOrder(orderId, { shipping });
//           return updatedOrder;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al actualizar información de envío'
//           });
//           throw error;
//         }
//       },

//       trackShipment: async (orderId: string) => {
//         try {
//           const shippingInfo = await orderApi.trackShipment(orderId);
          
//           // Update order with latest shipping info
//           await get().updateOrder(orderId, { shipping: shippingInfo });
          
//           return shippingInfo;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al rastrear envío'
//           });
//           throw error;
//         }
//       },

//       // Timeline
//       addTimelineEvent: async (orderId: string, event: Omit<OrderTimelineEvent, 'id'>) => {
//         try {
//           const addedEvent = await orderApi.addTimelineEvent(orderId, event);
          
//           // Update order timeline
//           const currentOrder = get().currentOrder;
//           if (currentOrder && currentOrder.id === orderId) {
//             set({
//               currentOrder: {
//                 ...currentOrder,
//                 timeline: [...currentOrder.timeline, addedEvent]
//               }
//             });
//           }
          
//           return addedEvent;
//         } catch (error) {
//           set({
//             error: error instanceof Error ? error.message : 'Error al agregar evento'
//           });
//           throw error;
//         }
//       },

//       // Filters and search
//       setFilters: (newFilters: Partial<OrderFilters>) => {
//         const updatedFilters = { ...get().filters, ...newFilters };
//         set({ filters: updatedFilters });
        
//         // Auto-fetch with new filters
//         get().fetchOrders(updatedFilters);
//       },

//       setCurrentPage: (page: number) => {
//         const updatedFilters = { ...get().filters, page };
//         set({ currentPage: page, filters: updatedFilters });
//         get().fetchOrders(updatedFilters);
//       },

//       // UI utilities
//       setCurrentOrder: (order: Order | null) => {
//         set({ currentOrder: order });
//       },

//       clearError: () => {
//         set({ error: null });
//       },

//       reset: () => {
//         set(initialState);
//       }
//     }),
//     {
//       name: 'order-store'
//     }
//   )
// );