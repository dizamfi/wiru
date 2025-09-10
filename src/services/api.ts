// // src/services/api.ts (Frontend) - Versión Corregida
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
//       // ✅ Validar códigos de estado exitosos incluyendo 201
//       validateStatus: (status) => {
//         return status >= 200 && status < 300; // 200-299 son exitosos
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
//             statusText: response.statusText,
//             data: response.data,
//           });
//         }

//         // ✅ Verificar que la respuesta sea exitosa (200-299)
//         if (response.status >= 200 && response.status < 300) {
//           return response;
//         }

//         return response;
//       },
//       async (error) => {
//         const originalRequest = error.config;

//         // Log de error detallado
//         console.error('❌ API Error:', {
//           status: error.response?.status,
//           statusText: error.response?.statusText,
//           message: error.response?.data?.message,
//           errors: error.response?.data?.errors,
//           url: error.config?.url,
//           method: error.config?.method,
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





// src/services/api.ts
import { env } from '@/utils/env';
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface ApiError {
  message: string;
  errors?: any;
  status?: number;
}

// Crear instancia de axios
const apiInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(String(env.API_TIMEOUT) || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para agregar token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejar errores y refresh tokens
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Si el token expiró, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Reintentar la request original
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Servicio API principal
export const apiService = {
  // GET request
  async get(url: string, config = {}) {
    try {
      const response = await apiInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  },

  // POST request
  async post(url: string, data = {}, config = {}) {
    try {
      const response = await apiInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  },

  // PUT request
  async put(url: string, data = {}, config = {}) {
    try {
      const response = await apiInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  },

  // DELETE request
  async delete(url: string, config = {}) {
    try {
      const response = await apiInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  },

  // PATCH request
  async patch(url: string, data = {}, config = {}) {
    try {
      const response = await apiInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  },

  // Manejo centralizado de errores
  handleError(error: AxiosError): ApiError {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });

    const responseData = error.response?.data as any;
    
    // Error de red
    if (!error.response) {
      return {
        message: 'Error de conexión con el servidor',
        status: 0
      };
    }

    // Errores del backend
    if (responseData) {
      return {
        message: responseData.message || 'Error del servidor',
        errors: responseData.errors,
        status: error.response.status
      };
    }

    // Error genérico
    return {
      message: error.message || 'Error desconocido',
      status: error.response?.status || 500
    };
  },

  // Función para upload de archivos
  async uploadFile(url: string, file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
};

export default apiService;