// import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
// import { ApiResponse, ApiError } from '@/types';
// import { env } from '@/utils/env';

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

//   private setupInterceptors() {
//     // Request interceptor - agregar token
//     this.api.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor - manejar errores globales
//     this.api.interceptors.response.use(
//       (response: AxiosResponse<ApiResponse>) => response,
//       async (error: AxiosError<ApiError>) => {
//         if (error.response?.status === 401) {
//           // Token expirado - intentar refresh
//           try {
//             await this.refreshToken();
//             // Reintentar la petición original
//             return this.api.request(error.config!);
//           } catch {
//             // Si falla el refresh, logout
//             this.logout();
//           }
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   private async refreshToken() {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) throw new Error('No refresh token');

//     const response = await this.api.post('/auth/refresh', {
//       refreshToken,
//     });

//     const { accessToken, refreshToken: newRefreshToken } = response.data.data;
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', newRefreshToken);
//   }

//   private logout() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
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

//   public delete<T = any>(url: string, config = {}) {
//     return this.api.delete<ApiResponse<T>>(url, config);
//   }

//   // Para upload de archivos
//   public postFormData<T = any>(url: string, formData: FormData, config: import('axios').AxiosRequestConfig = {}) {
//     return this.api.post<ApiResponse<T>>(url, formData, {
//       ...config,
//       headers: {
//         ...(config.headers || {}),
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   }
// }

// export const apiService = new ApiService();
// export default apiService;



// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/utils/env';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: env.API_BASE_URL,
      timeout: env.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - agregar token a las requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log de la request
        console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          headers: config.headers,
        });
        
        return config;
      },
      (error) => {
        console.error('❌ Error en request interceptor:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar tokens expirados
    this.api.interceptors.response.use(
      (response) => {
        // Log de la response exitosa
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      async (error) => {
        // Log del error
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('🔄 Intentando renovar token...');
              const response = await this.post('/auth/refresh', { refreshToken });
              const { accessToken } = (response.data.data as { accessToken: string });
              
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              console.log('✅ Token renovado exitosamente');
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.error('❌ Error al renovar token:', refreshError);
            // Refresh token también expiró, logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.delete(url, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.api.patch(url, data, config);
  }

  // Método para verificar conectividad con el backend
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('❌ Backend no disponible:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();