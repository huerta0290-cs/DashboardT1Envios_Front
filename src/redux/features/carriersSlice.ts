// src/redux/features/carriersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api';
import { Carrier } from './dashboardSlice'; // Reutilizamos el tipo Carrier
import { se } from 'date-fns/locale';

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface CarrierPerformanceData {
  timeToDeliver: Record<string, number>;
  incidentRates: Record<string, number>;
  resolutionTimes: Record<string, number>;
  volumeComparison: {
    carrier: string;
    thisMonth: number;
    lastMonth: number;
    change: number;
  }[];
}

export interface CarriersState {
  carriers: Carrier[];
  selectedCarrier: number | null;
  carrierDetails: Carrier | null;
  performanceData: CarrierPerformanceData | null;
  isLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  timeRange: '1d' | '7d' | '30d' | 'custom';
  customDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  pagination: Pagination | null;
}

const initialState: CarriersState = {
  carriers: [],
  selectedCarrier: null,
  carrierDetails: null,
  performanceData: null,
  isLoading: false,
  detailsLoading: false,
  error: null,
  timeRange: '7d',
  customDateRange: {
    startDate: null,
    endDate: null
  },
  pagination: null
};

// Thunk para cargar todos los transportistas
export const fetchCarriers = createAsyncThunk(
  'carriers/fetchAll',
  async (params: { 
    timeRange: '1d' | '7d' | '30d' | 'custom'; 
    startDate?: string; 
    endDate?: string;
    page: number;
    pageSize: number; 
    search?: string;
  }, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getCarriers(
        params.timeRange,
        params.startDate,
        params.endDate,
        params.page,
        params.pageSize,
        params.search
      );
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los transportistas');
    }
  }
);

// Thunk para cargar detalles de un transportista específico
export const fetchCarrierDetails = createAsyncThunk(
  'carriers/fetchDetails',
  async ({ carrierId, timeRange }: { carrierId: number; timeRange: string }, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getCarrierDetails(carrierId, timeRange);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los detalles del transportista');
    }
  }
);

const carriersSlice = createSlice({
  name: 'carriers',
  initialState,
  reducers: {
    setSelectedCarrier: (state, action: PayloadAction<number | null>) => {
      state.selectedCarrier = action.payload;
    },
    setCarrierTimeRange: (state, action: PayloadAction<'1d' | '7d' | '30d' | 'custom'>) => {
      state.timeRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCarrierCustomDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.customDateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Manejar estados para fetchCarriers
      .addCase(fetchCarriers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarriers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carriers = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCarriers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchCarrierDetails
      .addCase(fetchCarrierDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCarrierDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.carrierDetails = action.payload.carrier;
        state.performanceData = action.payload.performance;
      })
      .addCase(fetchCarrierDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedCarrier, setCarrierTimeRange, clearError, setCarrierCustomDateRange } = carriersSlice.actions;
export default carriersSlice.reducer;
