// src/redux/features/incidentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Incident } from './dashboardSlice';

export interface IncidentsList {
  incidentId: string;
  customerId: number;
  customerName: string;
  incidentType: string;
  carrierId: number;
  carrierName: string;
  shipmentNumber: string;
  status: 'resolved' | 'pending' | 'in_process';
  createdAt: string;
  daysOpen: number;
}

export interface IncidentsState {
  summary: Incident | null;
  types: { name: string; value: number; color: string }[];
  trend: { day: string; count: number }[];
  latestIncidents: IncidentsList[];
  isLoading: boolean;
  error: string | null;
  filterStatus: string;
}

const initialState: IncidentsState = {
  summary: null,
  types: [],
  trend: [],
  latestIncidents: [],
  isLoading: false,
  error: null,
  filterStatus: 'all',
};

// Thunk para cargar resumen de incidencias
export const fetchIncidentsSummary = createAsyncThunk(
  'incidents/fetchIncidentsSummary',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/incidents/summary?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar el resumen de incidencias');
    }
  }
);

// Thunk para cargar tipos de incidencias
export const fetchIncidentsTypes = createAsyncThunk(
  'incidents/fetchIncidentsTypes',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/incidents/types?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar los tipos de incidencias');
    }
  }
);

// Thunk para cargar tendencia de incidencias
export const fetchIncidentsTrend = createAsyncThunk(
  'incidents/fetchIncidentsTrend',
  async (timeRange: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/incidents/trend?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar la tendencia de incidencias');
    }
  }
);

// Thunk para cargar últimas incidencias
export const fetchLatestIncidents = createAsyncThunk(
  'incidents/fetchLatestIncidents',
  async ({ timeRange, status = 'all', limit = 5 }: { timeRange: string, status?: string, limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/incidents/latest?timeRange=${timeRange}&status=${status}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error al cargar las últimas incidencias');
    }
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para fetchIncidentsSummary
      .addCase(fetchIncidentsSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchIncidentsSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchIncidentsTypes
      .addCase(fetchIncidentsTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.types = action.payload;
      })
      .addCase(fetchIncidentsTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchIncidentsTrend
      .addCase(fetchIncidentsTrend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trend = action.payload;
      })
      .addCase(fetchIncidentsTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Casos para fetchLatestIncidents
      .addCase(fetchLatestIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestIncidents = action.payload;
      })
      .addCase(fetchLatestIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilterStatus } = incidentsSlice.actions;
export default incidentsSlice.reducer;
