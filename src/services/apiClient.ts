import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useApiStatusStore } from '@/store/apiStatus';

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void }> = [];

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    // Request interceptor: loader + token
    this.axiosInstance.interceptors.request.use((config) => {
      useApiStatusStore.getState().startLoading();
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });

    // Response interceptor: loader + retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => {
        useApiStatusStore.getState().stopLoading();
        return response;
      },
      async (error: AxiosError) => {
        useApiStatusStore.getState().stopLoading();
        const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

        if (!originalRequest) return Promise.reject(error);

        // Skip retry for auth endpoints
        const isAuthRoute = originalRequest.url?.includes('/auth/');

        // If 401, try refreshing token
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers)
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return this.axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          this.isRefreshing = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
              { token: refreshToken },
            );
            const newToken = response.data.accessToken;

            localStorage.setItem('accessToken', newToken);
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            this.failedQueue.forEach((p) => p.resolve(newToken));
            this.failedQueue = [];
            return this.axiosInstance(originalRequest);
          } catch (err) {
            this.failedQueue.forEach((p) => p.reject(err));
            this.failedQueue = [];
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Safely extract message
        const message = (error.response?.data as any)?.detail || error?.message;
        return Promise.reject(message);
      },
    );
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, config).then((res) => res.data);
  }

  post<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(url, body, config).then((res) => res.data);
  }

  put<T, B = unknown>(url: string, body: B, config?: AxiosRequestConfig) {
    return this.axiosInstance.put<T>(url, body, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(url, config).then((res) => res.data);
  }
}

/** this line calls the proxy api and hides the real api in client side */
const BASE_URL = typeof window === 'undefined' ? process.env.API_BASE_URL : '/api/proxy';
export const apiClient = new ApiClient(BASE_URL!);
