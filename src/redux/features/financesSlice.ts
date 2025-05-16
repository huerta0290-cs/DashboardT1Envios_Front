// src/redux/features/financesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api';

interface FinancialSummary {
  totalRevenue: number;
  previousRevenue: number;
  revenueChange: number;
  averageMargin: number;
  previousMargin: number;
  marginChange: number;
  availableBalance: number;
  consumedBalance: number;
}

interface RevenueByCarrier {
  carrier: string;
  carrierId: number;
  revenue: number;
  cost: number;
  margin: number;
  color: string;
  previousPeriod?: {
    revenue: number;
    cost: number;
    margin: number;
  };
}

interface RevenueByCustomer {
  customer: string;
  customerId: number;
  level: string;
  revenue: number;
  margin: number;
  previousPeriod?: {
    revenue: number;
    margin: number;
  };
  growth?: number;
}

interface MarginTrend {
  period: string;
  value: number;
}

interface RevenueForecast {
  period: string;
  actual: number;
  projected: number;
}

export interface FinancesState {
  summary: FinancialSummary | null;
  revenueByCarrier: RevenueByCarrier[];
  revenueByCustomer: RevenueByCustomer[];
  marginTrend: MarginTrend[];
  revenueForecast: RevenueForecast[];
  isLoading: boolean;
  error: string | null;
  timeRange: string;
  viewMode: 'current' | 'previous' | 'comparison';
  forecastPeriod: 'monthly' | 'quarterly' | 'yearly';
}

const initialState: FinancesState = {
  summary: null,
  revenueByCarrier: [],
  revenueByCustomer: [],
  marginTrend: [],
  revenueForecast: [],
  isLoading: false,
  error: null,
  timeRange: '7d',
  viewMode: 'current',
  forecastPeriod: 'monthly'
};

// Thunk para cargar resumen financiero
export const fetchFinancialSummary = createAsyncThunk(
  'finances/fetchSummary',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getFinancialSummary(timeRange);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar el resumen financiero');
    }
  }
);

// Thunk para cargar distribución de ingresos por transportista
export const fetchRevenueByCarrier = createAsyncThunk(
  'finances/fetchRevenueByCarrier',
  async ({ 
    timeRange, 
    viewMode 
  }: { 
    timeRange: string; 
    viewMode: 'current' | 'previous' | 'comparison'
  }, { rejectWithValue }) => {
    try {
      // En producción, esto sería una llamada real a la API con los parámetros
      // Por ahora, simulamos los datos
      
      // Datos base de ingresos por transportista (periodo actual)
      const baseData = [
        { carrier: 'DHL', carrierId: 1, revenue: 450000, cost: 290000, margin: 35.6, color: '#FFCC00' },
        { carrier: 'FEDEX', carrierId: 2, revenue: 320000, cost: 220000, margin: 31.2, color: '#4D148C' },
        { carrier: 'UPS', carrierId: 3, revenue: 180000, cost: 126000, margin: 30.0, color: '#351C15' },
        { carrier: 'JT EXPRESS', carrierId: 4, revenue: 140000, cost: 102000, margin: 27.1, color: '#E20000' },
        { carrier: 'EXPRESS', carrierId: 5, revenue: 90000, cost: 67500, margin: 25.0, color: '#00AEEF' }
      ];
      
      // Datos del periodo anterior (simular un 10% menos)
      const previousData = baseData.map(item => ({
        ...item,
        revenue: Math.round(item.revenue * 0.9),
        cost: Math.round(item.cost * 0.9),
        margin: parseFloat((item.margin * 0.95).toFixed(1))
      }));
      
      // Determinar qué datos devolver según el modo de vista
      if (viewMode === 'previous') {
        return previousData;
      } else if (viewMode === 'comparison') {
        return baseData.map((item, index) => ({
          ...item,
          previousPeriod: {
            revenue: previousData[index].revenue,
            cost: previousData[index].cost,
            margin: previousData[index].margin
          }
        }));
      } else {
        return baseData;
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los ingresos por transportista');
    }
  }
);

// Thunk para cargar distribución de ingresos por cliente
export const fetchRevenueByCustomer = createAsyncThunk(
  'finances/fetchRevenueByCustomer',
  async ({ 
    timeRange, 
    limit = 5, 
    viewMode 
  }: { 
    timeRange: string; 
    limit?: number; 
    viewMode: string;
  }, { rejectWithValue }) => {
    try {
      // Datos simulados
      const baseData = [
        { customer: 'APLIN', customerId: 1, level: 'Nivel 26', revenue: 135000, margin: 40.2 },
        { customer: 'CHICOS OLÉ', customerId: 2, level: 'Nivel 26', revenue: 120000, margin: 38.5 },
        { customer: 'DESIGUALEX', customerId: 3, level: 'Nivel 10', revenue: 95000, margin: 35.8 },
        { customer: 'CLAROSHOP', customerId: 4, level: 'Nivel 26', revenue: 85000, margin: 37.9 },
        { customer: 'EMISSARY', customerId: 5, level: 'Nivel 10', revenue: 75000, margin: 32.7 }
      ];
      
      // Datos del periodo anterior (simular un 12% menos)
      const previousData = baseData.map(item => ({
        ...item,
        revenue: Math.round(item.revenue * 0.88),
        margin: parseFloat((item.margin * 0.92).toFixed(1))
      }));
      
      // Determinar qué datos devolver según el modo de vista
      if (viewMode === 'previous') {
        return previousData.slice(0, limit);
      } else if (viewMode === 'comparison') {
        return baseData.map((item, index) => ({
          ...item,
          previousPeriod: {
            revenue: previousData[index].revenue,
            margin: previousData[index].margin
          }
        })).slice(0, limit);
      } else if (viewMode === 'growth') {
        return baseData.map((item, index) => ({
          ...item,
          growth: parseFloat(((item.revenue / previousData[index].revenue - 1) * 100).toFixed(1))
        })).slice(0, limit);
      } else {
        return baseData.slice(0, limit);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los ingresos por cliente');
    }
  }
);

// Thunk para cargar tendencia de margen
export const fetchMarginTrend = createAsyncThunk(
  'finances/fetchMarginTrend',
  async (_: void, { rejectWithValue }) => {
    try {
      // Datos simulados de tendencia de margen
      return [
        { period: 'Sem 1', value: 31.2 },
        { period: 'Sem 2', value: 32.5 },
        { period: 'Sem 3', value: 33.1 },
        { period: 'Sem 4', value: 32.8 },
        { period: 'Sem 5', value: 33.7 },
        { period: 'Sem 6', value: 35.2 },
        { period: 'Sem 7', value: 34.9 }
      ];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar la tendencia del margen');
    }
  }
);

// Thunk para cargar proyección de ingresos
export const fetchRevenueForecast = createAsyncThunk(
  'finances/fetchRevenueForecast',
  async (period: 'monthly' | 'quarterly' | 'yearly', { rejectWithValue }) => {
    try {
      // Datos simulados basados en el periodo solicitado
      if (period === 'monthly') {
        return [
          { period: 'Ene', actual: 285000, projected: 285000 },
          { period: 'Feb', actual: 310000, projected: 310000 },
          { period: 'Mar', actual: 342000, projected: 342000 },
          { period: 'Abr', actual: 375000, projected: 375000 },
          { period: 'May', actual: 0, projected: 405000 },
          { period: 'Jun', actual: 0, projected: 430000 },
          { period: 'Jul', actual: 0, projected: 460000 },
          { period: 'Ago', actual: 0, projected: 485000 }
        ];
      } else if (period === 'quarterly') {
        return [
          { period: 'Q1', actual: 850000, projected: 850000 },
          { period: 'Q2', actual: 960000, projected: 960000 },
          { period: 'Q3', actual: 0, projected: 1100000 },
          { period: 'Q4', actual: 0, projected: 1250000 }
        ];
      } else {
        return [
          { period: '2022', actual: 3200000, projected: 3200000 },
          { period: '2023', actual: 3950000, projected: 3950000 },
          { period: '2024', actual: 1810000, projected: 4500000 },
          { period: '2025', actual: 0, projected: 5200000 }
        ];
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar la proyección de ingresos');
    }
  }
);

const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'current' | 'previous' | 'comparison'>) => {
      state.viewMode = action.payload;
    },
    setForecastPeriod: (state, action: PayloadAction<'monthly' | 'quarterly' | 'yearly'>) => {
      state.forecastPeriod = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Manejar estados para fetchFinancialSummary
      .addCase(fetchFinancialSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFinancialSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchRevenueByCarrier
      .addCase(fetchRevenueByCarrier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByCarrier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueByCarrier = action.payload;
      })
      .addCase(fetchRevenueByCarrier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchRevenueByCustomer
      .addCase(fetchRevenueByCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueByCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueByCustomer = action.payload;
      })
      .addCase(fetchRevenueByCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchMarginTrend
      .addCase(fetchMarginTrend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarginTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.marginTrend = action.payload;
      })
      .addCase(fetchMarginTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchRevenueForecast
      .addCase(fetchRevenueForecast.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueForecast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenueForecast = action.payload;
      })
      .addCase(fetchRevenueForecast.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setTimeRange, 
  setViewMode, 
  setForecastPeriod,
  clearError 
} = financesSlice.actions;

export default financesSlice.reducer;
