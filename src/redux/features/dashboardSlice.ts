// src/redux/features/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api';
import { generateMockData } from '../../service/mockData';

// Definición de tipos
export interface KPI {
  guidesGenerated: number;
  previousGuidesGenerated: number;
  guidesChange: number;
  totalRevenue: number;
  previousRevenue: number;
  revenueChange: number;
  averageMargin: number;
  previousMargin: number;
  marginChange: number;
  npsScore: number;
  previousNps: number;
  npsChange: number;
}

export interface Carrier {
  id: number;
  name: string;
  guides: number;
  revenue: number;
  cost: number;
  margin: number;
  avgDeliveryTime: number;
  incidentRate: number;
  trend: number[];
  color: string;
}

export interface CustomerLevel {
  name: string;
  value: number;
  color: string;
}

export interface TopCustomer {
  id: number;
  name: string;
  level: string;
  guides: number;
  revenue: number;
  margin: number;
  status: 'active' | 'at_risk' | 'inactive';
  nps: number;
  trend: number[];
}

export interface Incident {
  total: number;
  resolved: number;
  byType: {
    name: string;
    value: number;
    color: string;
  }[];
  resolutionTime: Record<string, number>;
  trend: {
    day: string;
    count: number;
  }[];
}

export interface WalletData {
  availableBalance: number;
  consumedBalance: number;
  lowBalanceAlerts: {
    customerId: number;
    name: string;
    availableBalance: number;
    estimatedDays: number;
  }[];
}

export interface QualityMetrics {
  onTimeDelivery: number;
  carrierSatisfaction: number;
  incidentResolutionRate: number;
  customerRetention: number;
}

export interface MapData {
  state: string;
  volume: number;
  incidents: number;
}

export interface DashboardData {
  kpis: KPI;
  carriers: Carrier[];
  customerLevels: CustomerLevel[];
  topCustomers: TopCustomer[];
  incidents: Incident;
  walletData: WalletData;
  qualityMetrics: QualityMetrics;
  mapData: MapData[];
}

export interface DashboardState {
  data: DashboardData | null;
  timeRange: '1d' | '7d' | '30d' | 'custom';
  activeTab: 'overview' | 'carriers' | 'customers' | 'finances' | 'incidents';
  isLoading: boolean;
  error: {
    message: string;
    code?: string;
    usingMockData?: boolean;
  } | null;
  comparisonEnabled: boolean;
  selectedCarrier: string;
  mapView: 'volume' | 'incidents';
  customDateRange: {
    fromDate: string | null;
    toDate: string | null;
  };
}

const initialState: DashboardState = {
  data: null,
  timeRange: '7d',
  activeTab: 'overview',
  isLoading: false,
  error: null,
  comparisonEnabled: false,
  selectedCarrier: 'all',
  mapView: 'volume',
  customDateRange: {
    fromDate: null,
    toDate: null
  }
};

// Thunk para obtener los datos del dashboard
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (timeRange: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { dashboard: DashboardState };
      let params = timeRange;
      
      // Si es custom, agregar fechas del rango personalizado
      if (timeRange === 'custom' && state.dashboard.customDateRange.fromDate && state.dashboard.customDateRange.toDate) {
        params = `custom&fromDate=${state.dashboard.customDateRange.fromDate}&toDate=${state.dashboard.customDateRange.toDate}`;
      }
      
      const response = await dashboardService.getOverview(params);
      return response;
    } catch (error: any) {
      // Si es un error 404, devolvemos un valor específico
      if (error.isNotFound) {
        return rejectWithValue({
          message: error.userMessage,
          code: 'NOT_FOUND'
        });
      }
      
      return rejectWithValue({
        message: error.userMessage || 'Error al cargar los datos del dashboard',
        code: error.response?.status || 'UNKNOWN'
      });
    }
  }
);

// Thunk para obtener datos específicos de transportistas
export const fetchCarriersData = createAsyncThunk(
  'dashboard/fetchCarriersData',
  async ({ timeRange, carrierId }: { timeRange: string; carrierId?: string }, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getCarriers(timeRange, carrierId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar datos de transportistas');
    }
  }
);

// Slice del dashboard
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<'1d' | '7d' | '30d' | 'custom'>) => {
      state.timeRange = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'overview' | 'carriers' | 'customers' | 'finances' | 'incidents'>) => {
      state.activeTab = action.payload;
    },
    setComparisonEnabled: (state, action: PayloadAction<boolean>) => {
      state.comparisonEnabled = action.payload;
    },
    setSelectedCarrier: (state, action: PayloadAction<string>) => {
      state.selectedCarrier = action.payload;
    },
    setMapView: (state, action: PayloadAction<'volume' | 'incidents'>) => {
      state.mapView = action.payload;
    },
    setCustomDateRange: (state, action: PayloadAction<{ fromDate: string; toDate: string }>) => {
      state.customDateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Casos para fetchDashboardData
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as {
          message: string;
          code?: string;
        } || {
          message: 'Error desconocido al cargar los datos'
        };
        
        // Si es un error 404 u otro error, cargamos datos demo para que la UI no se quede vacía
        const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA_ON_ERROR === 'true';
        if (useMockData || (action.payload as any)?.code === 'NOT_FOUND' || (action.payload as any)?.code === 'NETWORK_ERROR') {
          console.log('Usando datos de muestra debido a un error en la API');
          state.data = generateMockData(state.timeRange);
          // Añadir una bandera para indicar que estamos usando datos de muestra
          state.error = {
            ...state.error,
            usingMockData: true
          };
        }
      })
      
      // Casos para fetchCarriersData (puede extenderse según necesidades)
      .addCase(fetchCarriersData.pending, (state) => {
        // Opcional: establecer un estado de carga específico para transportistas
      })
      .addCase(fetchCarriersData.fulfilled, (state, action) => {
        // Actualizar solo los datos de transportistas
        if (state.data) {
          state.data.carriers = action.payload;
        }
      })
      .addCase(fetchCarriersData.rejected, (state, action) => {
        state.error = action.payload as {
          message: string;
          code?: string;
        } || {
          message: 'Error al cargar datos de transportistas'
        };
      });
  },
});

export const { 
  setTimeRange, 
  setActiveTab, 
  setComparisonEnabled, 
  setSelectedCarrier, 
  setMapView,
  setCustomDateRange,
  clearError
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
