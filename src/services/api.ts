// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { env } from '@/utils/env';

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// class ApiService {
//   private api: AxiosInstance;

//   constructor() {
//     this.api = axios.create({
//       baseURL: env.API_BASE_URL,
//       timeout: env.API_TIMEOUT,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors(): void {
//     // Request interceptor - agregar token a las requests
//     this.api.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
        
//         // Log de la request
//         console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, {
//           data: config.data,
//           headers: config.headers,
//         });
        
//         return config;
//       },
//       (error) => {
//         console.error('❌ Error en request interceptor:', error);
//         return Promise.reject(error);
//       }
//     );

//     // Response interceptor - manejar tokens expirados
//     this.api.interceptors.response.use(
//       (response) => {
//         // Log de la response exitosa
//         console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
//           status: response.status,
//           data: response.data,
//         });
//         return response;
//       },
//       async (error) => {
//         // Log del error
//         console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
//           status: error.response?.status,
//           data: error.response?.data,
//           message: error.message,
//         });

//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           try {
//             const refreshToken = localStorage.getItem('refreshToken');
//             if (refreshToken) {
//               console.log('🔄 Intentando renovar token...');
//               const response = await this.post('/auth/refresh', { refreshToken });
//               const { accessToken } = (response.data.data as { accessToken: string });
              
//               localStorage.setItem('accessToken', accessToken);
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
//               console.log('✅ Token renovado exitosamente');
//               return this.api(originalRequest);
//             }
//           } catch (refreshError) {
//             console.error('❌ Error al renovar token:', refreshError);
//             // Refresh token también expiró, logout
//             localStorage.removeItem('accessToken');
//             localStorage.removeItem('refreshToken');
//             localStorage.removeItem('user');
//             window.location.href = '/login';
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
//     return this.api.get(url, config);
//   }

//   async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
//     return this.api.post(url, data, config);
//   }

//   async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
//     return this.api.put(url, data, config);
//   }

//   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
//     return this.api.delete(url, config);
//   }

//   async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
//     return this.api.patch(url, data, config);
//   }

//   // Método para verificar conectividad con el backend
//   async healthCheck(): Promise<boolean> {
//     try {
//       const response = await this.get('/health');
//       return response.status === 200;
//     } catch (error) {
//       console.error('❌ Backend no disponible:', error);
//       return false;
//     }
//   }
// }

// export const apiService = new ApiService();






// // src/services/api.ts (Frontend)
// import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// import { env } from '@/utils/env';

// // Tipos para las respuestas de la API
// export interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data: T;
//   errors?: Record<string, string[]>;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   timestamp?: string;
// }

// class ApiService {
//   private api: AxiosInstance;
//   private isRefreshing = false;
//   private failedQueue: Array<{
//     resolve: (value?: any) => void;
//     reject: (error?: any) => void;
//   }> = [];

//   constructor() {
//     this.api = axios.create({
//       baseURL: env.API_BASE_URL,
//       timeout: parseInt(String(env.API_TIMEOUT) || '10000'),
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors() {
//     // Request interceptor - agregar token de autorización
//     this.api.interceptors.request.use(
//       (config: InternalAxiosRequestConfig) => {
//         const token = localStorage.getItem('accessToken');
        
//         if (token && config.headers) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }

//         // Log de request en desarrollo
//         if (import.meta.env.DEV) {
//           console.log('🚀 API Request:', {
//             method: config.method?.toUpperCase(),
//             url: config.url,
//             data: config.data,
//           });
//         }

//         return config;
//       },
//       (error) => {
//         console.error('❌ Request error:', error);
//         return Promise.reject(error);
//       }
//     );

//     // Response interceptor - manejar respuestas y errores
//     this.api.interceptors.response.use(
//       (response: AxiosResponse<ApiResponse>) => {
//         // Log de response en desarrollo
//         if (import.meta.env.DEV) {
//           console.log('✅ API Response:', {
//             status: response.status,
//             data: response.data,
//           });
//         }

//         return response;
//       },
//       async (error) => {
//         const originalRequest = error.config;

//         // Log de error
//         console.error('❌ API Error:', {
//           status: error.response?.status,
//           message: error.response?.data?.message,
//           url: error.config?.url,
//         });

//         // Si es error 401 y no es una request de refresh token
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           if (this.isRefreshing) {
//             // Si ya se está refrescando, agregar a la cola
//             return new Promise((resolve, reject) => {
//               this.failedQueue.push({ resolve, reject });
//             }).then(token => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               return this.api(originalRequest);
//             }).catch(err => {
//               return Promise.reject(err);
//             });
//           }

//           originalRequest._retry = true;
//           this.isRefreshing = true;

//           try {
//             const newToken = await this.refreshToken();
//             this.processQueue(null, newToken);
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return this.api(originalRequest);
//           } catch (refreshError) {
//             this.processQueue(refreshError, null);
//             this.logout();
//             return Promise.reject(refreshError);
//           } finally {
//             this.isRefreshing = false;
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   private async refreshToken(): Promise<string> {
//     const refreshToken = localStorage.getItem('refreshToken');
    
//     if (!refreshToken) {
//       throw new Error('No refresh token');
//     }

//     try {
//       const response = await this.api.post<ApiResponse<{
//         tokens: {
//           accessToken: string;
//           refreshToken: string;
//         };
//       }>>('/auth/refresh', {
//         refreshToken,
//       });

//       const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
      
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', newRefreshToken);
      
//       return accessToken;
//     } catch (error) {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       throw error;
//     }
//   }

//   private processQueue(error: any, token: string | null = null) {
//     this.failedQueue.forEach(({ resolve, reject }) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(token);
//       }
//     });

//     this.failedQueue = [];
//   }

//   private logout() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
    
//     // Redirigir al login
//     window.location.href = '/login';
//   }

//   // Métodos públicos
//   public get<T = any>(url: string, config = {}) {
//     return this.api.get<ApiResponse<T>>(url, config);
//   }

//   public post<T = any>(url: string, data = {}, config = {}) {
//     return this.api.post<ApiResponse<T>>(url, data, config);
//   }

//   public put<T = any>(url: string, data = {}, config = {}) {
//     return this.api.put<ApiResponse<T>>(url, data, config);
//   }

//   public patch<T = any>(url: string, data = {}, config = {}) {
//     return this.api.patch<ApiResponse<T>>(url, data, config);
//   }

//   public delete<T = any>(url: string, config = {}) {
//     return this.api.delete<ApiResponse<T>>(url, config);
//   }

//   // Para upload de archivos
//   public postFormData<T = any>(url: string, formData: FormData, config: any = {}) {
//     return this.api.post<ApiResponse<T>>(url, formData, {
//       ...config,
//       headers: {
//         ...config.headers,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   }

//   // Método para establecer headers personalizados
//   public setHeader(key: string, value: string) {
//     this.api.defaults.headers.common[key] = value;
//   }

//   // Método para remover headers
//   public removeHeader(key: string) {
//     delete this.api.defaults.headers.common[key];
//   }

//   // Método para verificar conectividad
//   public async healthCheck(): Promise<boolean> {
//     try {
//       await this.api.get('/health');
//       return true;
//     } catch (error) {
//       console.warn('❌ API health check failed:', error);
//       return false;
//     }
//   }

//   // Método para obtener información de la API
//   public async getApiInfo() {
//     try {
//       const response = await this.api.get('/');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to get API info:', error);
//       throw error;
//     }
//   }

//   // Método para cancelar requests
//   public createCancelToken() {
//     return axios.CancelToken.source();
//   }

//   // Método para verificar si un error es de cancelación
//   public isCancel(error: any) {
//     return axios.isCancel(error);
//   }
// }

// export const apiService = new ApiService();

// // Helper para manejar errores de API de forma consistente
// export const handleApiError = (error: any): string => {
//   if (error.response?.data?.errors) {
//     // Errores de validación
//     const errors = error.response.data.errors;
//     const firstError = Object.values(errors)[0];
//     return Array.isArray(firstError) ? firstError[0] : String(firstError);
//   }
  
//   if (error.response?.data?.message) {
//     // Mensaje de error del servidor
//     return error.response.data.message;
//   }
  
//   if (error.message) {
//     // Error de axios o network
//     return error.message;
//   }
  
//   // Error genérico
//   return 'Ha ocurrido un error inesperado';
// };

// // Helper para crear URLs con parámetros de query
// export const buildUrl = (path: string, params?: Record<string, any>): string => {
//   const url = new URL(path, env.API_BASE_URL);
  
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== '') {
//         url.searchParams.append(key, String(value));
//       }
//     });
//   }
  
//   return url.pathname + url.search;
// };

// // Helper para formatear datos de paginación
// export const formatPaginationParams = (page: number = 1, limit: number = 10) => ({
//   page: String(page),
//   limit: String(limit),
// });

// // Interceptor personalizado para logging
// export const createApiLogger = (name: string) => {
//   return {
//     request: (config: InternalAxiosRequestConfig) => {
//       console.log(`🚀 [${name}] Request:`, {
//         method: config.method?.toUpperCase(),
//         url: config.url,
//         data: config.data,
//       });
//       return config;
//     },
//     response: (response: AxiosResponse) => {
//       console.log(`✅ [${name}] Response:`, {
//         status: response.status,
//         data: response.data,
//       });
//       return response;
//     },
//     error: (error: any) => {
//       console.error(`❌ [${name}] Error:`, {
//         status: error.response?.status,
//         message: error.response?.data?.message,
//         url: error.config?.url,
//       });
//       return Promise.reject(error);
//     },
//   };
// };




// src/services/api.ts (Frontend) - Versión Corregida
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/utils/env';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp?: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: env.API_BASE_URL,
      timeout: parseInt(String(env.API_TIMEOUT) || '10000'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // ✅ Validar códigos de estado exitosos incluyendo 201
      validateStatus: (status) => {
        return status >= 200 && status < 300; // 200-299 son exitosos
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - agregar token de autorización
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de request en desarrollo
        if (import.meta.env.DEV) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar respuestas y errores
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Log de response en desarrollo
        if (import.meta.env.DEV) {
          console.log('✅ API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
          });
        }

        // ✅ Verificar que la respuesta sea exitosa (200-299)
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Log de error detallado
        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.response?.data?.message,
          errors: error.response?.data?.errors,
          url: error.config?.url,
          method: error.config?.method,
        });

        // Si es error 401 y no es una request de refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Si ya se está refrescando, agregar a la cola
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    try {
      const response = await this.api.post<ApiResponse<{
        tokens: {
          accessToken: string;
          refreshToken: string;
        };
      }>>('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return accessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirigir al login
    window.location.href = '/login';
  }

  // Métodos públicos
  public get<T = any>(url: string, config = {}) {
    return this.api.get<ApiResponse<T>>(url, config);
  }

  public post<T = any>(url: string, data = {}, config = {}) {
    return this.api.post<ApiResponse<T>>(url, data, config);
  }

  public put<T = any>(url: string, data = {}, config = {}) {
    return this.api.put<ApiResponse<T>>(url, data, config);
  }

  public patch<T = any>(url: string, data = {}, config = {}) {
    return this.api.patch<ApiResponse<T>>(url, data, config);
  }

  public delete<T = any>(url: string, config = {}) {
    return this.api.delete<ApiResponse<T>>(url, config);
  }

  // Para upload de archivos
  public postFormData<T = any>(url: string, formData: FormData, config: any = {}) {
    return this.api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Método para verificar conectividad
  public async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch (error) {
      console.warn('❌ API health check failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();

// Helper para manejar errores de API de forma consistente
export const handleApiError = (error: any): string => {
  if (error.response?.data?.errors) {
    // Errores de validación
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  if (error.response?.data?.message) {
    // Mensaje de error del servidor
    return error.response.data.message;
  }
  
  if (error.message) {
    // Error de axios o network
    return error.message;
  }
  
  // Error genérico
  return 'Ha ocurrido un error inesperado';
};