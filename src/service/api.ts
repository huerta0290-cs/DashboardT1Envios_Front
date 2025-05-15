// src/services/api.ts
import axios from 'axios';

// Configura la instancia base de axios para la API
const API_BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_INFO || 'https://api.t1envios.com';

// Función para obtener el token de autenticación
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Función para guardar el token en localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Función para eliminar el token (logout)
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autorización a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo de errores global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    console.error('API Error:', error);
    
    // Si es un error 401 (no autorizado), podríamos limpiar el token
    if (error.response && error.response.status === 401) {
      removeAuthToken();
      error.isAuthError = true;
      error.userMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }
    
    // Si es un error 404, creamos un objeto de error más específico
    if (error.response && error.response.status === 404) {
      error.isNotFound = true;
      error.userMessage = 'Recurso no encontrado: ' + (error.response.data?.message || 'La información solicitada no está disponible');
    }
    
    // Asegurar que siempre haya un mensaje amigable para el usuario
    if (!error.userMessage) {
      error.userMessage = 
        error.response?.data?.message || 
        'Ocurrió un error al comunicarse con el servidor';
    }
    
    return Promise.reject(error);
  }
);

// Funciones para obtener datos del dashboard
export const dashboardService = {
  // Obtener datos generales del dashboard
  getOverview: async (timeRange: string) => {
    try {
      const response = await apiClient.get(`/dashboard/overview?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener datos específicos de transportistas
  getCarriers: async (timeRange: string, carrierId?: string) => {
    try {
      const url = carrierId 
        ? `/carriers/${carrierId}?timeRange=${timeRange}`
        : `/carriers?timeRange=${timeRange}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener datos de clientes
  getCustomers: async (timeRange: string, params?: { limit?: number }) => {
    try {
      const limit = params?.limit || 10;
      const response = await apiClient.get(`/customers/top?timeRange=${timeRange}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener datos de incidencias
  getIncidents: async (timeRange: string) => {
    try {
      const response = await apiClient.get(`/incidents/summary?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener datos financieros
  getFinances: async (timeRange: string) => {
    try {
      const response = await apiClient.get(`/finances/summary?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
