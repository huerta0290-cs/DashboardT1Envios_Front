// src/redux/features/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api'; // Importar el servicio API en lugar de axios

// Definir tipos
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

export interface IncidentOrigin {
  total: number;
  types: IncidentType[];
}

export interface IncidentType {
  name: string;
  value: number;
  color: string;
}

export interface Incident {
  total: number;
  resolved: number;
  byType: IncidentType[];
  byOrigin: {
    automatic: IncidentOrigin;
    manual: IncidentOrigin;
  };
  resolutionTime: Record<string, number>;
  trend: {
    day: string;
    automatic: number;
    manual: number;
    total: number;
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

// Datos geográficos para un solo estado
export interface MapData {
  state: string;
  volume: number;
  incidents: number;
}

// Datos geográficos completos separados por origen y destino
export interface GeographicData {
  destination: MapData[];
  origin: MapData[];
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
  mapData: GeographicData;
}

export interface DashboardState {
  data: DashboardData | null;
  timeRange: '1d' | '7d' | '30d' | 'custom';
  activeTab: 'overview' | 'carriers' | 'customers' | 'finances' | 'incidents';
  isLoading: boolean;
  error: string | null;
  comparisonEnabled: boolean;
  selectedCarrier: string;
  mapView: 'volume' | 'incidents';
  mapViewType: 'origin' | 'destination'; // Nuevo campo para controlar origen/destino
  customDateRange: {
    startDate: string | null;
    endDate: string | null;
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
  mapViewType: 'destination', // Por defecto mostrar destino
  customDateRange: {
    startDate: null,
    endDate: null
  }
};

// Thunk para cargar datos del dashboard utilizando el servicio API
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (params: { 
    timeRange: '1d' | '7d' | '30d' | 'custom'; 
    startDate?: string; 
    endDate?: string 
  }, { rejectWithValue }) => {
    try {
      // Usar dashboardService en lugar de axios directamente
      return await dashboardService.getOverview(
        params.timeRange,
        params.startDate,
        params.endDate
      );
    } catch (error: any) {
      // Manejar el error
      return rejectWithValue(
        error.response?.data?.message || 
        'Error al cargar los datos del dashboard'
      );
    }
  }
);

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
    setCustomDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.customDateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
     setMapViewType: (state, action: PayloadAction<'origin' | 'destination'>) => {
      state.mapViewType = action.payload;
    }
  },
  extraReducers: (builder) => {
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
        state.error = action.payload as string;
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
  clearError,
  setMapViewType, // Añade esta exportación
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
