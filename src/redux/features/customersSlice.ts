// src/redux/features/customersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomerLevel, TopCustomer } from './dashboardSlice';

export interface CustomersState {
  topCustomers: TopCustomer[];
  customerLevels: CustomerLevel[];
  isLoading: boolean;
  error: string | null;
  selectedLevel: string;
}

const initialState: CustomersState = {
  topCustomers: [],
  customerLevels: [],
  isLoading: false,
  error: null,
  selectedLevel: 'all',
};

// Thunk para cargar top clientes
export const fetchTopCustomers = createAsyncThunk(
  'customers/fetchTopCustomers',
  async ({ timeRange, limit = 10 }: { timeRange: string, limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/customers/top?timeRange=${timeRange}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar los datos de top clientes');
    }
  }
);

// Thunk para cargar distribución de niveles de clientes
export const fetchCustomerLevels = createAsyncThunk(
  'customers/fetchCustomerLevels',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/customers/levels?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar la distribución de niveles de clientes');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedLevel: (state, action: PayloadAction<string>) => {
      state.selectedLevel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchTopCustomers
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
      // Casos para fetchCustomerLevels
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
      });
  },
});

export const { setSelectedLevel } = customersSlice.actions;
export default customersSlice.reducer;
