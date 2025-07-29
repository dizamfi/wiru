import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types';
import { env } from '@/utils/env';

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

  private setupInterceptors() {
    // Request interceptor - agregar token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - manejar errores globales
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expirado - intentar refresh
          try {
            await this.refreshToken();
            // Reintentar la petición original
            return this.api.request(error.config!);
          } catch {
            // Si falla el refresh, logout
            this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await this.api.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }

  private logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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

  public delete<T = any>(url: string, config = {}) {
    return this.api.delete<ApiResponse<T>>(url, config);
  }

  // Para upload de archivos
  public postFormData<T = any>(url: string, formData: FormData, config: import('axios').AxiosRequestConfig = {}) {
    return this.api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...(config.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;