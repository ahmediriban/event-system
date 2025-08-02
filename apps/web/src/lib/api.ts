import axios, { AxiosError, AxiosResponse } from 'axios';

// Create axios instance for the proxy
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error response interface
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: AxiosError<ApiError>): ApiError => {
  return {
      message: error.response?.data?.message || 'Network error occurred',
      error: error.response?.data?.error || 'Network Error',
      statusCode: error.response?.status || 500,
    };
}; 