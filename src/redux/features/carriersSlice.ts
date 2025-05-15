// src/redux/features/carriersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Carrier } from './dashboardSlice';

export interface CarriersState {
  data: Carrier[];
  carrierDetails: Carrier | null;
  isLoading: boolean;
  error: string | null;
  selectedCarrier: string;
}

const initialState: CarriersState = {
  data: [],
  carrierDetails: null,
  isLoading: false,
  error: null,
  selectedCarrier: 'all',
};

// Thunk para cargar datos de transportistas
export const fetchCarriers = createAsyncThunk(
  'carriers/fetchCarriers',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/carriers?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar los datos de transportistas');
    }
  }
);

// Thunk para cargar datos de un transportista específico
export const fetchCarrierDetails = createAsyncThunk(
  'carriers/fetchCarrierDetails',
  async ({ carrierId, timeRange }: { carrierId: string, timeRange: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/carriers/${carrierId}?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar los detalles del transportista');
    }
  }
);

const carriersSlice = createSlice({
  name: 'carriers',
  initialState,
  reducers: {
    setSelectedCarrier: (state, action: PayloadAction<string>) => {
      state.selectedCarrier = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchCarriers
      .addCase(fetchCarriers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarriers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchCarriers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchCarrierDetails
      .addCase(fetchCarrierDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarrierDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carrierDetails = action.payload;
      })
      .addCase(fetchCarrierDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCarrier } = carriersSlice.actions;
export default carriersSlice.reducer;
