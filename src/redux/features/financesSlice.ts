// src/redux/features/financesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { KPI, WalletData } from './dashboardSlice';

export interface FinanceProjection {
  name: string;
  actual: number;
  projected: number;
}

export interface MarginTrendPoint {
  name: string;
  value: number;
}

export interface FinancesState {
  summary: {
    kpis: KPI;
    walletData: WalletData;
  } | null;
  revenue: any[];
  projection: FinanceProjection[];
  marginTrend: MarginTrendPoint[];
  isLoading: boolean;
  error: string | null;
  periodFilter: string;
  forecastTimeframe: string;
}

const initialState: FinancesState = {
  summary: null,
  revenue: [],
  projection: [],
  marginTrend: [],
  isLoading: false,
  error: null,
  periodFilter: 'Este Período',
  forecastTimeframe: 'Mensual',
};

// Thunk para cargar resumen financiero
export const fetchFinancesSummary = createAsyncThunk(
  'finances/fetchFinancesSummary',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/finances/summary?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar el resumen financiero');
    }
  }
);

// Thunk para cargar datos de ingresos
export const fetchRevenueData = createAsyncThunk(
  'finances/fetchRevenueData',
  async ({ timeRange, period = 'current' }: { timeRange: string, period?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/finances/revenue?timeRange=${timeRange}&period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar los datos de ingresos');
    }
  }
);

// Thunk para cargar proyección
export const fetchProjection = createAsyncThunk(
  'finances/fetchProjection',
  async (timeframe: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/finances/projection?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar la proyección de ingresos');
    }
  }
);

// Thunk para cargar tendencia de margen
export const fetchMarginTrend = createAsyncThunk(
  'finances/fetchMarginTrend',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/finances/margin-trend?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar la tendencia de margen');
    }
  }
);

const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setPeriodFilter: (state, action: PayloadAction<string>) => {
      state.periodFilter = action.payload;
    },
    setForecastTimeframe: (state, action: PayloadAction<string>) => {
      state.forecastTimeframe = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchFinancesSummary
      .addCase(fetchFinancesSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFinancesSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchFinancesSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchRevenueData
      .addCase(fetchRevenueData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchProjection
      .addCase(fetchProjection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projection = action.payload;
      })
      .addCase(fetchProjection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchMarginTrend
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
      });
  },
});

export const { setPeriodFilter, setForecastTimeframe } = financesSlice.actions;
export default financesSlice.reducer;
