// // src/hooks/useCart.ts - HOOK PARA CARRITO CON PERSISTENCIA
// import { useState, useEffect } from 'react';
// import { CartItem } from '@/types/categories';

// const CART_STORAGE_KEY = 'wiru_cart';

// export const useCart = () => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Cargar carrito desde localStorage al montar
//   useEffect(() => {
//     try {
//       const savedCart = localStorage.getItem(CART_STORAGE_KEY);
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         // No podemos guardar File objects en localStorage, así que solo cargamos la metadata
//         // Las imágenes se subirán cuando se cree la orden
//         setCart(parsedCart);
//       }
//     } catch (error) {
//       console.error('Error loading cart from localStorage:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Guardar carrito en localStorage cada vez que cambie
//   useEffect(() => {
//     if (!isLoading) {
//       try {
//         // No podemos serializar File objects, así que guardamos solo metadata
//         const cartToSave = cart.map(item => ({
//           ...item,
//           images: [], // Las imágenes se manejan en memoria
//         }));
//         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
//       } catch (error) {
//         console.error('Error saving cart to localStorage:', error);
//       }
//     }
//   }, [cart, isLoading]);

//   const addToCart = (item: CartItem) => {
//     setCart(prev => {
//       const existingIndex = prev.findIndex(
//         cartItem =>
//           cartItem.categoryId === item.categoryId &&
//           cartItem.weight === item.weight
//       );

//       if (existingIndex >= 0) {
//         const updated = [...prev];
//         updated[existingIndex] = {
//           ...updated[existingIndex],
//           quantity: updated[existingIndex].quantity + item.quantity,
//           estimatedValue:
//             updated[existingIndex].estimatedValue + item.estimatedValue,
//         };
//         return updated;
//       }

//       return [...prev, item];
//     });
//   };

//   const removeFromCart = (index: number) => {
//     setCart(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateCartItem = (index: number, updates: Partial<CartItem>) => {
//     setCart(prev => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], ...updates };
//       return updated;
//     });
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem(CART_STORAGE_KEY);
//   };

//   const getTotalWeight = () => {
//     return cart.reduce((sum, item) => sum + item.weight * item.quantity, 0);
//   };

//   const getTotalValue = () => {
//     return cart.reduce((sum, item) => sum + item.estimatedValue, 0);
//   };

//   return {
//     cart,
//     isLoading,
//     addToCart,
//     removeFromCart,
//     updateCartItem,
//     clearCart,
//     getTotalWeight,
//     getTotalValue,
//   };
// };




// src/hooks/useCart.ts - VERSIÓN CORREGIDA

import { useState, useEffect } from 'react';
import { CartItem } from '@/types/categories';
import cartService from '@/services/cartService';
import uploadService from '@/services/uploadService';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Cargar carrito desde el backend al montar o cuando el usuario cambie
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromBackend();
    } else {
      setCart([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadCartFromBackend = async () => {
    try {
      setIsLoading(true);
      const backendCart = await cartService.getCart();
      
      console.log('📥 Cart from backend:', backendCart);

      // ✅ VALIDAR QUE items EXISTA Y SEA UN ARRAY
      if (!backendCart || !backendCart.items || !Array.isArray(backendCart.items)) {
        console.warn('Cart items is not an array:', backendCart);
        setCart([]);
        return;
      }
      
      // Convertir items del backend al formato del frontend
      const frontendItems: CartItem[] = backendCart.items.map(item => ({
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        categoryPath: item.categoryPath,
        weight: parseFloat(item.weight.toString()),
        quantity: item.quantity,
        pricePerKg: parseFloat(item.pricePerKg.toString()),
        estimatedValue: parseFloat(item.estimatedValue.toString()),
        images: [], // Las imágenes ya están en el servidor como URLs
        notes: item.notes,
        createdAt: item.createdAt,
      }));

      console.log('✅ Cart loaded:', frontendItems);
      setCart(frontendItems);
    } catch (error: any) {
      console.error('❌ Error loading cart:', error);
      // No mostrar toast si es un error 404 (carrito vacío es normal)
      if (error.response?.status !== 404) {
        toast.error('Error al cargar el carrito');
      }
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
  if (!isAuthenticated) {
    toast.error('Debes iniciar sesión para agregar al carrito');
    return;
  }

  try {
    setIsSyncing(true);
    toast.loading('Agregando al carrito...', { id: 'add-to-cart' });

    console.log('📦 Original item:', item);

    // 1. Subir imágenes a Cloudinary primero
    let imageUrls: string[] = [];
    if (item.images && item.images.length > 0) {
      console.log('📤 Uploading images:', item.images.length);
      imageUrls = await uploadService.uploadMultipleImages(item.images);
      console.log('✅ Images uploaded:', imageUrls);
    }

    // 2. Preparar payload con datos validados
    const payload = {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryPath: item.categoryPath,
      weight: parseFloat(item.weight.toString()),
      quantity: parseInt(item.quantity.toString()),
      pricePerKg: parseFloat(item.pricePerKg.toString()),
      estimatedValue: parseFloat(item.estimatedValue.toString()),
      images: imageUrls,
      notes: item.notes || '',
    };

    console.log('📤 Sending payload to backend:', payload);

    // 3. Agregar al backend
    const response = await cartService.addItem(payload);

    console.log('✅ Backend response:', response);

    // 4. Recargar carrito desde el backend
    await loadCartFromBackend();

    toast.success('Artículo agregado al carrito', { id: 'add-to-cart' });
  } catch (error: any) {
    console.error('❌ Error adding to cart:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    toast.error(error.message || 'Error al agregar al carrito', { id: 'add-to-cart' });
  } finally {
    setIsSyncing(false);
  }
};

  const removeFromCart = async (itemId: string) => {
    if (!isAuthenticated) return;

    try {
      setIsSyncing(true);
      toast.loading('Eliminando del carrito...', { id: 'remove-from-cart' });
      
      await cartService.removeItem(itemId);
      await loadCartFromBackend();
      
      toast.success('Artículo eliminado del carrito', { id: 'remove-from-cart' });
    } catch (error: any) {
      console.error('❌ Error removing from cart:', error);
      toast.error(error.message || 'Error al eliminar del carrito', { id: 'remove-from-cart' });
    } finally {
      setIsSyncing(false);
    }
  };

  const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
    if (!isAuthenticated) return;

    try {
      setIsSyncing(true);
      await cartService.updateItem(itemId, updates);
      await loadCartFromBackend();
      toast.success('Artículo actualizado');
    } catch (error: any) {
      console.error('❌ Error updating cart item:', error);
      toast.error(error.message || 'Error al actualizar');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setIsSyncing(true);
      toast.loading('Limpiando carrito...', { id: 'clear-cart' });
      
      await cartService.clearCart();
      setCart([]);
      
      toast.success('Carrito limpiado', { id: 'clear-cart' });
    } catch (error: any) {
      console.error('❌ Error clearing cart:', error);
      toast.error(error.message || 'Error al limpiar carrito', { id: 'clear-cart' });
    } finally {
      setIsSyncing(false);
    }
  };

  const getTotalWeight = () => {
    return cart.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  };

  const getTotalValue = () => {
    return cart.reduce((sum, item) => sum + item.estimatedValue, 0);
  };

  return {
    cart,
    isLoading,
    isSyncing,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalWeight,
    getTotalValue,
    refreshCart: loadCartFromBackend,
  };
};