// src/services/dashboard-service.ts
import { apiGet } from './api-config';
import { DashboardData } from '@/redux/features/dashboardSlice';

export interface DashboardResponse {
  data: DashboardData;
  meta: {
    lastUpdated: string;
    timeRange: string;
  };
}

// Servicio para obtener datos del dashboard
export const DashboardService = {
  // Obtener datos generales del dashboard
  getDashboardOverview: async (timeRange: string): Promise<DashboardResponse> => {
    const endpoint = '/dashboard/overview';
    return apiGet<DashboardResponse>(endpoint, { timeRange });
  },

  // Obtener KPIs específicos
  getKPIs: async (timeRange: string): Promise<any> => {
    const endpoint = '/dashboard/kpis';
    return apiGet(endpoint, { timeRange });
  },

  // Obtener datos de transportistas
  getCarriers: async (timeRange: string, carrierId?: string): Promise<any> => {
    const endpoint = carrierId ? `/carriers/${carrierId}` : '/carriers';
    return apiGet(endpoint, { timeRange });
  },

  // Obtener datos de clientes
  getCustomers: async (timeRange: string, limit: number = 10): Promise<any> => {
    const endpoint = '/customers/top';
    return apiGet(endpoint, { timeRange, limit });
  },

  // Obtener datos de incidencias
  getIncidents: async (timeRange: string): Promise<any> => {
    const endpoint = '/incidents/summary';
    return apiGet(endpoint, { timeRange });
  },

  // Obtener datos financieros
  getFinancialData: async (timeRange: string): Promise<any> => {
    const endpoint = '/finances/summary';
    return apiGet(endpoint, { timeRange });
  }
};