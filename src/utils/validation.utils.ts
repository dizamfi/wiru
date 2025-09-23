// src/utils/validation.utils.ts - Utilidades para validaciones seguras
export class ValidationUtils {
  /**
   * Validar si un array existe y no está vacío
   */
  static isValidArray<T>(arr: T[] | null | undefined): arr is T[] {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Obtener la longitud segura de un array
   */
  static safeArrayLength<T>(arr: T[] | null | undefined): number {
    return Array.isArray(arr) ? arr.length : 0;
  }

  /**
   * Obtener array seguro (nunca undefined)
   */
  static safeArray<T>(arr: T[] | null | undefined): T[] {
    return Array.isArray(arr) ? arr : [];
  }

  /**
   * Validar si un objeto existe y tiene propiedades
   */
  static isValidObject(obj: any): boolean {
    return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
  }

  /**
   * Obtener propiedad segura de un objeto
   */
  static safeProperty<T>(obj: any, property: string, defaultValue: T): T {
    return obj && obj[property] !== undefined ? obj[property] : defaultValue;
  }

  /**
   * Validar si una string existe y no está vacía
   */
  static isValidString(str: string | null | undefined): str is string {
    return typeof str === 'string' && str.trim().length > 0;
  }

  /**
   * Obtener string segura
   */
  static safeString(str: string | null | undefined, defaultValue: string = ''): string {
    return this.isValidString(str) ? str : defaultValue;
  }

  /**
   * Validar si un número es válido
   */
  static isValidNumber(num: number | null | undefined): num is number {
    return typeof num === 'number' && !isNaN(num) && isFinite(num);
  }

  /**
   * Obtener número seguro
   */
  static safeNumber(num: number | null | undefined, defaultValue: number = 0): number {
    return this.isValidNumber(num) ? num : defaultValue;
  }

  /**
   * Validar email
   */
  static isValidEmail(email: string | null | undefined): boolean {
    if (!this.isValidString(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar precio (mayor a 0)
   */
  static isValidPrice(price: number | null | undefined): boolean {
    return this.isValidNumber(price) && price! > 0;
  }

  /**
   * Validar peso (mayor a 0)
   */
  static isValidWeight(weight: number | null | undefined): boolean {
    return this.isValidNumber(weight) && weight! > 0;
  }

  /**
   * Validar ID (string no vacía)
   */
  static isValidId(id: string | null | undefined): boolean {
    return this.isValidString(id) && id!.length > 5; // IDs típicamente son más largos
  }

  /**
   * Validar URL
   */
  static isValidUrl(url: string | null | undefined): boolean {
    if (!this.isValidString(url)) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validar categoría de Wiru
   */
  static isValidCategory(category: any): boolean {
    return (
      this.isValidObject(category) &&
      this.isValidId(category.id) &&
      this.isValidString(category.name) &&
      ['ACTIVE', 'INACTIVE', 'DRAFT'].includes(category.status) &&
      ['COMPLETE_DEVICES', 'DISMANTLED_DEVICES'].includes(category.type)
    );
  }

  /**
   * Validar item del carrito
   */
  static isValidCartItem(item: any): boolean {
    return (
      this.isValidObject(item) &&
      this.isValidId(item.categoryId) &&
      this.isValidString(item.categoryName) &&
      this.isValidPrice(item.estimatedPrice) &&
      this.isValidWeight(item.weight) &&
      this.isValidNumber(item.quantity) &&
      item.quantity > 0 &&
      this.isValidString(item.condition)
    );
  }

  /**
   * Limpiar y validar array de categorías
   */
  static cleanCategoryArray(categories: any[] | null | undefined): any[] {
    const safeArray = this.safeArray(categories);
    return safeArray.filter(this.isValidCategory);
  }

  /**
   * Limpiar y validar array de items del carrito
   */
  static cleanCartItemArray(items: any[] | null | undefined): any[] {
    const safeArray = this.safeArray(items);
    return safeArray.filter(this.isValidCartItem);
  }

  /**
   * Obtener mensaje de error amigable
   */
  static getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.data?.message) return error.data.message;
    return 'Ha ocurrido un error inesperado';
  }

  /**
   * Validar respuesta de API
   */
  static isValidApiResponse(response: any): boolean {
    return (
      this.isValidObject(response) &&
      (response.success === true || response.data !== undefined)
    );
  }

  /**
   * Extraer datos seguros de respuesta de API
   */
  static extractApiData<T>(response: any, defaultValue: T): T {
    if (!this.isValidApiResponse(response)) return defaultValue;
    return response.data || response || defaultValue;
  }

  /**
   * Validar configuración de archivo de imagen
   */
  static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return (
      file instanceof File &&
      validTypes.includes(file.type) &&
      file.size <= maxSize &&
      file.size > 0
    );
  }

  /**
   * Validar array de archivos de imagen
   */
  static validateImageFiles(files: FileList | File[] | null | undefined): File[] {
    if (!files) return [];
    
    const fileArray = Array.from(files);
    return fileArray.filter(this.isValidImageFile);
  }

  /**
   * Generar ID temporal para items del carrito
   */
  static generateTempId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formatear precio para mostrar
   */
  static formatPrice(price: number | null | undefined): string {
    const safePrice = this.safeNumber(price);
    return `${safePrice.toFixed(2)}`;
  }

  /**
   * Formatear peso para mostrar
   */
  static formatWeight(weight: number | null | undefined): string {
    const safeWeight = this.safeNumber(weight);
    return `${safeWeight.toFixed(2)}kg`;
  }

  /**
   * Validar condición de dispositivo
   */
  static isValidDeviceCondition(condition: string | null | undefined): boolean {
    const validConditions = ['EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR', 'POOR'];
    return this.isValidString(condition) && validConditions.includes(condition);
  }

  /**
   * Validar método de entrega
   */
  static isValidDeliveryMethod(method: string | null | undefined): boolean {
    const validMethods = ['pickup', 'home'];
    return this.isValidString(method) && validMethods.includes(method);
  }

  /**
   * Validar datos completos para crear orden
   */
  static validateOrderData(orderData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidArray(orderData.items)) {
      errors.push('Debe incluir al menos un item para vender');
    } else {
      const validItems = this.cleanCartItemArray(orderData.items);
      if (validItems.length === 0) {
        errors.push('No hay items válidos en el carrito');
      }
    }

    if (!this.isValidDeliveryMethod(orderData.deliveryMethod)) {
      errors.push('Método de entrega no válido');
    }

    if (orderData.deliveryMethod === 'home' && !this.isValidObject(orderData.pickupAddress)) {
      errors.push('Dirección de recolección requerida para entrega a domicilio');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Funciones de utilidad exportadas directamente
export const safeArray = ValidationUtils.safeArray;
export const safeArrayLength = ValidationUtils.safeArrayLength;
export const isValidArray = ValidationUtils.isValidArray;
export const safeString = ValidationUtils.safeString;
export const safeNumber = ValidationUtils.safeNumber;
export const formatPrice = ValidationUtils.formatPrice;
export const formatWeight = ValidationUtils.formatWeight;