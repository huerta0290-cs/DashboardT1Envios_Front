// src/services/api.ts - Versión actualizada con mejor manejo de errores
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getAuthToken, refreshToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_DASHBOARD_INFO || 'https://api.t1envios.com';

// Configuración base de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumentar timeout para operaciones que pueden tardar
  timeout: 30000,
});

// Interceptor para añadir el token de autorización a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en la configuración de la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación y refrescar el token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Asegurarse de que config existe y crear una copia que se pueda modificar
    if (!error.config) {
      console.error('Error sin configuración:', error);
      return Promise.reject(error);
    }
    
    const originalRequest = { ...error.config } as AxiosRequestConfig & { _retry?: boolean };
    
    // Si es un error 401 (No autorizado) y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Recibido 401, intentando refrescar token...');
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const newToken = await refreshToken();
        
        if (newToken) {
          // Si tenemos un nuevo token, actualizamos el header y reintentamos
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si hay un error al refrescar el token, lo manejamos aquí
        console.error('Error al refrescar el token:', refreshError);
        
        // Aquí podrías mostrar una notificación o disparar un evento para redirigir al login
        console.log('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
    }
    
    // Mensaje de error mejorado para depuración
    const errorMessage = `Error en la petición: ${error.message}`;
    
    if (error.response) {
      console.error(`${errorMessage}\nStatus: ${error.response.status}\nData:`, error.response.data);
    } else if (error.request) {
      console.error(`${errorMessage}\nSin respuesta del servidor, request:`, error.request);
    } else {
      console.error(errorMessage);
    }
    
    // Si no es un error 401 o no pudimos refrescar el token, propagamos el error
    return Promise.reject(error);
  }
);

// Función auxiliar para manejar errores en los servicios
const handleApiError = (error: any, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // El servidor respondió con un código de error
      throw new Error(error.response.data?.message || fallbackMessage);
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor. Verifique su conexión.');
    } else {
      // Error al configurar la solicitud
      throw new Error(`Error al configurar la solicitud: ${error.message}`);
    }
  }
  // Error que no es de Axios
  throw new Error(error.message || fallbackMessage);
};

// Servicio para el dashboard con manejo de errores mejorado
export const dashboardService = {
  // Obtener datos del overview del dashboard
  getOverview: async (timeRange: string, startDate?: string, endDate?: string) => {
    try {
      console.log(`Obteniendo overview con timeRange=${timeRange}${startDate ? `, startDate=${startDate}` : ''}${endDate ? `, endDate=${endDate}` : ''}`);
      
      let queryParams = `timeRange=${timeRange}`;
      if (timeRange === 'custom' && startDate && endDate) {
        queryParams += `&fromDate=${startDate}&toDate=${endDate}`;
      }
      
      const response = await apiClient.get(`/dashboard/overview?${queryParams}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener los datos del dashboard');
    }
  },
  
  // Endpoint para KPIs específicos
  getKPIs: async (timeRange: string) => {
    try {
      const response = await apiClient.get(`/dashboard/kpis?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener los KPIs');
    }
  },
  
  // Endpoint para datos de transportistas
  getCarriers: async (timeRange: string, startDate?: string, endDate?: string, page?:number, pageSize?:number, search?:string) => {
    try {
      // Construir query params
      let queryParams = `page=${page}&page_size=${pageSize}&timeRange=${timeRange}`;
      if (timeRange === 'custom' && startDate && endDate) {
        queryParams += `&startDate=${startDate}&endDate=${endDate}`;
      }

       // Añadir búsqueda si existe
      if (search && search.trim()) {
        queryParams += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await apiClient.get(`/carriers?${queryParams}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener datos de transportistas');
    }
  },
  
  // Endpoint para transportista específico
  getCarrierDetails: async (carrierId: number, timeRange: string) => {
    try {
      const response = await apiClient.get(`/carriers/${carrierId}?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Error al obtener detalles del transportista ${carrierId}`);
    }
  },
  
  // Endpoint para clientes top
  getCustomers: async (timeRange: string, startDate?: string, endDate?: string, page?:number, pageSize?:number, search?:string) => {
    try {
      // Construir query params
      let queryParams = `page=${page}&page_size=${pageSize}&timeRange=${timeRange}`;
      if (timeRange === 'custom' && startDate && endDate) {
        queryParams += `&startDate=${startDate}&endDate=${endDate}`;
      }

       // Añadir búsqueda si existe
      if (search && search.trim()) {
        queryParams += `&search=${encodeURIComponent(search.trim())}`;
      }

      const response = await apiClient.get(`/customers/top?${queryParams}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener los top clientes');
    }
  },
  
  // Endpoint para obtener niveles de clientes
  getCustomerLevels: async (timeRange: string) => {
    try {
      const response = await apiClient.get(`/customers/levels?timeRange=${timeRange}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener niveles de clientes');
    }
  },
  
  // Endpoint para obtener resumen de incidencias
  getIncidents: async () => {
    try {
      const response = await apiClient.get(`/incidents`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener resumen de incidencias');
    }
  },
  
  // Endpoint para obtener datos financieros
  getFinancialSummary: async (timeRange: string, startDate?: string, endDate?: string) => {
    try {

      let queryParams = `timeRange=${timeRange}`;
      if (timeRange === 'custom' && startDate && endDate) {
        queryParams += `&fromDate=${startDate}&toDate=${endDate}`;
      }

      const response = await apiClient.get(`/finances/summary?${queryParams}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error al obtener resumen financiero');
    }
  },
};

export default apiClient;
