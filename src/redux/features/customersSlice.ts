// src/redux/features/customersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api';
import { TopCustomer, CustomerLevel } from './dashboardSlice'; // Reutilizamos los tipos

interface CustomerTrends {
  nps: {
    date: string;
    value: number;
    change: number;
  }[];
  revenue: {
    date: string;
    value: number;
    change: number;
  }[];
  guides: {
    date: string;
    value: number;
    change: number;
  }[];
}

export interface CustomerDetails {
  id: number;
  name: string;
  level: string;
  email: string;
  phone: string;
  address: string;
  totalGuides: number;
  totalRevenue: number;
  averageMargin: number;
  nps: number;
  status: 'active' | 'at_risk' | 'inactive';
  lastOrder: string;
  walletBalance: number;
  trends: CustomerTrends;
}

export interface CustomersState {
  topCustomers: TopCustomer[];
  customerLevels: CustomerLevel[];
  selectedCustomer: number | null;
  customerDetails: CustomerDetails | null;
  isLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  levelFilter: string | null;
  selectedLevel: string;
  timeRange: '1d' | '7d' | '30d' | 'custom';
  customDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

const initialState: CustomersState = {
  topCustomers: [],
  customerLevels: [],
  selectedCustomer: null,
  customerDetails: null,
  isLoading: false,
  detailsLoading: false,
  error: null,
  levelFilter: null,
  selectedLevel: "all",
  timeRange: '7d',
  customDateRange: {
    startDate: null,
    endDate: null
  }
};

// Thunk para cargar los top clientes
export const fetchTopCustomers = createAsyncThunk(
  'customers/fetchTop',
  async ({ params, limit = 10 }: { params: { 
    timeRange: '1d' | '7d' | '30d' | 'custom'; 
    startDate?: string; 
    endDate?: string 
  }; limit?: number }, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getTopCustomers(
        params.timeRange,
        params.startDate,
        params.endDate, 
        limit
      );
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los top clientes');
    }
  }
);

// Thunk para cargar los niveles de clientes
export const fetchCustomerLevels = createAsyncThunk(
  'customers/fetchLevels',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getCustomerLevels(timeRange);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los niveles de clientes');
    }
  }
);

// Thunk para cargar los detalles de un cliente específico
export const fetchCustomerDetails = createAsyncThunk(
  'customers/fetchDetails',
  async ({ 
    customerId, 
    timeRange 
  }: { 
    customerId: number; 
    timeRange: string 
  }, { rejectWithValue }) => {
    try {
      // Simular llamada a API para el detalle de cliente específico
      // En producción, esto sería reemplazado por una llamada real
      // Por ahora, usamos un mock de datos
      return {
        id: customerId,
        name: 'Cliente Ejemplo',
        level: 'Nivel 26',
        email: 'cliente@ejemplo.com',
        phone: '+52 55 1234 5678',
        address: 'Av. Ejemplo 123, Ciudad de México',
        totalGuides: 125,
        totalRevenue: 45000,
        averageMargin: 32.5,
        nps: 75,
        status: 'active' as const,
        lastOrder: '2023-10-15',
        walletBalance: 15000,
        trends: {
          nps: [
            { date: '2023-08', value: 72, change: 0 },
            { date: '2023-09', value: 74, change: 2.7 },
            { date: '2023-10', value: 75, change: 1.3 }
          ],
          revenue: [
            { date: '2023-08', value: 38000, change: 0 },
            { date: '2023-09', value: 41000, change: 7.9 },
            { date: '2023-10', value: 45000, change: 9.7 }
          ],
          guides: [
            { date: '2023-08', value: 95, change: 0 },
            { date: '2023-09', value: 110, change: 15.8 },
            { date: '2023-10', value: 125, change: 13.6 }
          ]
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los detalles del cliente');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<number | null>) => {
      state.selectedCustomer = action.payload;
    },
    setCustomerTimeRange: (state, action: PayloadAction<'1d' | '7d' | '30d' | 'custom'>) => {
      state.timeRange = action.payload;
    },
    setLevelFilter: (state, action: PayloadAction<string | null>) => {
      state.levelFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedLevel: (state, action: PayloadAction<string>) => {
      state.selectedLevel = action.payload;
    },
    setCustomerCustomDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.customDateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Manejar estados para fetchTopCustomers
      .addCase(fetchTopCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topCustomers = action.payload;
      })
      .addCase(fetchTopCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchCustomerLevels
      .addCase(fetchCustomerLevels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerLevels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerLevels = action.payload;
      })
      .addCase(fetchCustomerLevels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchCustomerDetails
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.customerDetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setSelectedCustomer, 
  setCustomerTimeRange, 
  setLevelFilter, 
  clearError,
  setSelectedLevel,
  setCustomerCustomDateRange
} = customersSlice.actions;

export default customersSlice.reducer;
