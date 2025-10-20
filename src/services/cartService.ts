// src/services/cartService.ts - SERVICIO DE CARRITO FRONTEND

// import { CartItem } from '@/types/categories';
// import api from './api';

// export interface BackendCartItem {
//   id: string;
//   cartId: string;
//   categoryId: string;
//   categoryName: string;
//   categoryPath: string;
//   weight: number;
//   quantity: number;
//   pricePerKg: number;
//   estimatedValue: number;
//   images: string[];
//   notes?: string;
//   createdAt: string;
//   updatedAt: string;
//   category?: any;
// }

// export interface Cart {
//   id: string;
//   userId: string;
//   items: BackendCartItem[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface AddCartItemPayload {
//   categoryId: string;
//   categoryName: string;
//   categoryPath: string;
//   weight: number;
//   quantity: number;
//   pricePerKg: number;
//   estimatedValue: number;
//   images: string[]; // URLs
//   notes?: string;
// }

// class CartService {
//   /**
//    * Obtener carrito del usuario
//    */
//   async getCart(): Promise<Cart> {
//     try {
//       const response = await api.get('/cart');
//       return response.data.data;
//     } catch (error: any) {
//       console.error('Error fetching cart:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al obtener el carrito'
//       );
//     }
//   }

//   /**
//    * Agregar item al carrito
//    */
//   async addItem(item: AddCartItemPayload | Omit<CartItem, 'id' | 'createdAt'>): Promise<BackendCartItem> {
//     try {
//       // Las imágenes deben ser URLs (ya subidas a Cloudinary)
//       const payload = {
//         categoryId: item.categoryId,
//         categoryName: item.categoryName,
//         categoryPath: item.categoryPath,
//         weight: parseFloat(item.weight.toString()),
//         quantity: parseInt(item.quantity.toString()),
//         pricePerKg: parseFloat(item.pricePerKg.toString()),
//         estimatedValue: parseFloat(item.estimatedValue.toString()),
//         images: (item as any).images.map((img: any) => 
//           typeof img === 'string' ? img : URL.createObjectURL(img)
//         ),
//         notes: item.notes || '',
//       };

//       console.log('📦 Adding to cart:', payload);

//       const response = await api.post('/cart/items', payload);
//       return response.data.data;
//     } catch (error: any) {
//       console.error('Error adding item to cart:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al agregar item al carrito'
//       );
//     }
//   }

//   /**
//    * Actualizar item del carrito
//    */
//   async updateItem(
//     itemId: string,
//     updates: Partial<Omit<CartItem, 'id' | 'categoryId' | 'createdAt'>>
//   ): Promise<BackendCartItem> {
//     try {
//       const response = await api.put(`/cart/items/${itemId}`, updates);
//       return response.data.data;
//     } catch (error: any) {
//       console.error('Error updating cart item:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al actualizar item'
//       );
//     }
//   }

//   /**
//    * Eliminar item del carrito
//    */
//   async removeItem(itemId: string): Promise<void> {
//     try {
//       await api.delete(`/cart/items/${itemId}`);
//     } catch (error: any) {
//       console.error('Error removing cart item:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al eliminar item'
//       );
//     }
//   }

//   /**
//    * Limpiar carrito
//    */
//   async clearCart(): Promise<void> {
//     try {
//       await api.delete('/cart');
//     } catch (error: any) {
//       console.error('Error clearing cart:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al limpiar carrito'
//       );
//     }
//   }

//   /**
//    * Obtener resumen del carrito
//    */
//   async getCartSummary(): Promise<{
//     totalItems: number;
//     totalWeight: number;
//     totalValue: number;
//     items: BackendCartItem[];
//   }> {
//     try {
//       const response = await api.get('/cart/summary');
//       return response.data.data;
//     } catch (error: any) {
//       console.error('Error fetching cart summary:', error);
//       throw new Error(
//         error.response?.data?.message || 'Error al obtener resumen del carrito'
//       );
//     }
//   }
// }

// export default new CartService();




// src/services/cartService.ts - VERSIÓN MEJORADA

import { CartItem } from '@/types/categories';
import api from './api';

export interface BackendCartItem {
  id: string;
  cartId: string;
  categoryId: string;
  categoryName: string;
  categoryPath: string;
  weight: number;
  quantity: number;
  pricePerKg: number;
  estimatedValue: number;
  images: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  category?: any;
}

export interface Cart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  createdAt: string;
  updatedAt: string;
}

// Payload para agregar un item al carrito desde el frontend (imágenes como URLs)
export interface AddCartItemPayload {
  categoryId: string;
  categoryName: string;
  categoryPath: string;
  weight: number;
  quantity: number;
  pricePerKg: number;
  estimatedValue: number;
  images: string[]; // URLs
  notes?: string;
}

class CartService {
  /**
   * Obtener carrito del usuario
   */
  async getCart(): Promise<Cart> {
    try {
      console.log('🛒 Fetching cart from backend...');
      
      const response = await api.get('/cart');
      
      console.log('📦 Cart response:', response.data);

      // ✅ Manejar diferentes estructuras de respuesta
      const cart = response.data?.data || response.data;

      // ✅ Validar que el carrito tenga la estructura correcta
      if (!cart) {
        throw new Error('Respuesta del carrito inválida');
      }

      // ✅ Asegurar que items sea un array
      if (!cart.items) {
        cart.items = [];
      }

      if (!Array.isArray(cart.items)) {
        console.warn('Cart items is not an array, converting:', cart.items);
        cart.items = [];
      }

      return cart;
    } catch (error: any) {
      console.error('❌ Error fetching cart:', error);
      
      // Si el error es 404, devolver carrito vacío
      if (error.response?.status === 404) {
        return {
          id: '',
          userId: '',
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      throw new Error(
        error.response?.data?.message || 'Error al obtener el carrito'
      );
    }
  }

  /**
   * Agregar item al carrito
   */
  async addItem(item: AddCartItemPayload | Omit<CartItem, 'id' | 'createdAt'>): Promise<BackendCartItem> {
    try {
      const payload = {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        categoryPath: item.categoryPath,
        weight: parseFloat(item.weight.toString()),
        quantity: parseInt(item.quantity.toString()),
        pricePerKg: parseFloat(item.pricePerKg.toString()),
        estimatedValue: parseFloat(item.estimatedValue.toString()),
        images: Array.isArray((item as any).images)
          ? (item as any).images.map((img: any) => typeof img === 'string' ? img : '')
          : [],
        notes: item.notes || '',
      };

      console.log('📦 Adding to cart:', payload);

      const response = await api.post('/cart/items', payload);
      
      console.log('✅ Item added:', response.data);
      
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('❌ Error adding item to cart:', error);
      console.error('Error details:', error.response?.data);
      
      throw new Error(
        error.response?.data?.message || 'Error al agregar item al carrito'
      );
    }
  }

  /**
   * Actualizar item del carrito
   */
  async updateItem(
    itemId: string,
    updates: Partial<Omit<CartItem, 'id' | 'categoryId' | 'createdAt'>>
  ): Promise<BackendCartItem> {
    try {
      const response = await api.put(`/cart/items/${itemId}`, updates);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('❌ Error updating cart item:', error);
      throw new Error(
        error.response?.data?.message || 'Error al actualizar item'
      );
    }
  }

  /**
   * Eliminar item del carrito
   */
  async removeItem(itemId: string): Promise<void> {
    try {
      await api.delete(`/cart/items/${itemId}`);
    } catch (error: any) {
      console.error('❌ Error removing cart item:', error);
      throw new Error(
        error.response?.data?.message || 'Error al eliminar item'
      );
    }
  }

  /**
   * Limpiar carrito
   */
  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart');
    } catch (error: any) {
      console.error('❌ Error clearing cart:', error);
      throw new Error(
        error.response?.data?.message || 'Error al limpiar carrito'
      );
    }
  }

  /**
   * Obtener resumen del carrito
   */
  async getCartSummary(): Promise<{
    totalItems: number;
    totalWeight: number;
    totalValue: number;
    items: BackendCartItem[];
  }> {
    try {
      const response = await api.get('/cart/summary');
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('❌ Error fetching cart summary:', error);
      throw new Error(
        error.response?.data?.message || 'Error al obtener resumen del carrito'
      );
    }
  }
}

export default new CartService();