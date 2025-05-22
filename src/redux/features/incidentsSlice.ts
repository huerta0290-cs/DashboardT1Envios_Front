// src/redux/features/incidentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../service/api';
import { Incident } from './dashboardSlice'; // Reutilizamos el tipo Incident

interface IncidentDetail {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'finalized';
  createdAt: string;
  resolvedAt?: string;
  shipmentId: string;
  customerId: number;
  customerName: string;
  carrierId: number;
  carrierName: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  resolutionTime?: number; // tiempo en horas o días
  assignedTo?: string;
  comments: {
    id: number;
    user: string;
    timestamp: string;
    text: string;
  }[];
  actions: {
    id: number;
    user: string;
    timestamp: string;
    action: string;
    details: string;
  }[];
}

export interface IncidentData {
  id: string;
  customer: string;
  type: string;
  carrier: string;
  shipmentNumber: string;
  status: string;
  date: string;
  openDays: number;
  color: string;
}

export interface IncidentsState {
  summary: Incident | null;
  incidentsList: {
    id: string;
    type: string;
    status: 'pending' | 'in_progress' | 'finalized';
    createdAt: string;
    customerId: number;
    customerName: string;
    carrierId: number;
    carrierName: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  incidents: IncidentData[],
  selectedIncident: string | null;
  incidentDetails: IncidentDetail | null;
  isLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  timeRange: string;
  statusFilter: string | null;
  typeFilter: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: IncidentsState = {
  summary: null,
  incidentsList: [],
  incidents: [],
  selectedIncident: null,
  incidentDetails: null,
  isLoading: false,
  detailsLoading: false,
  error: null,
  timeRange: '7d',
  statusFilter: null,
  typeFilter: null,
  page: 1,
  limit: 10,
  total: 0
};

// Thunk para cargar resumen de incidencias
export const fetchIncidents = createAsyncThunk(
  'incidents',
  async (_, { rejectWithValue }) => {
    try {
      // Usar el servicio API centralizado
      return await dashboardService.getIncidents();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar el resumen de incidencias');
    }
  }
);

// Thunk para cargar lista de incidencias con paginación y filtros
export const fetchIncidentsList = createAsyncThunk(
  'incidents/fetchList',
  async ({ 
    timeRange,
    page = 1,
    limit = 10,
    status = null,
    type = null
  }: { 
    timeRange: string;
    page?: number;
    limit?: number;
    status?: string | null;
    type?: string | null;
  }, { rejectWithValue }) => {
    try {
      // En producción, se conectaría con un endpoint real que soporte estos parámetros
      // Por ahora, creamos datos simulados
      const mockIncidents = Array.from({ length: 15 }, (_, i) => ({
        id: `INC-${i + 1000}`,
        type: ['Retraso', 'Daño', 'Pérdida', 'Dirección', 'Otros'][Math.floor(Math.random() * 5)],
        status: ['pending', 'in_progress', 'finalized'][Math.floor(Math.random() * 3)] as 'pending' | 'in_progress' | 'finalized',
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
        customerId: Math.floor(Math.random() * 10) + 1,
        customerName: ['APLIN', 'CHICOS OLÉ', 'DESIGUALEX', 'CLAROSHOP', 'EMISSARY'][Math.floor(Math.random() * 5)],
        carrierId: Math.floor(Math.random() * 5) + 1,
        carrierName: ['DHL', 'FEDEX', 'UPS', 'JT EXPRESS', 'EXPRESS'][Math.floor(Math.random() * 5)],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      }));
      
      // Filtrar si hay filtros activos
      let filteredData = [...mockIncidents];
      if (status) {
        filteredData = filteredData.filter(item => item.status === status);
      }
      if (type) {
        filteredData = filteredData.filter(item => item.type === type);
      }
      
      // Paginar
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        incidents: paginatedData,
        total: filteredData.length
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar la lista de incidencias');
    }
  }
);

// Thunk para cargar detalles de una incidencia específica
export const fetchIncidentDetails = createAsyncThunk(
  'incidents/fetchDetails',
  async (incidentId: string, { rejectWithValue }) => {
    try {
      // Datos simulados para el detalle de la incidencia
      // En producción, esto sería una llamada real a la API
      return {
        id: incidentId,
        type: 'Retraso',
        status: 'in_progress' as const,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        shipmentId: `SHP-${Math.floor(Math.random() * 1000000)}`,
        customerId: 1,
        customerName: 'APLIN',
        carrierId: 1,
        carrierName: 'DHL',
        description: 'El envío no fue entregado en la fecha prometida debido a problemas logísticos en la última milla.',
        priority: 'high' as const,
        assignedTo: 'Juan Pérez',
        comments: [
          {
            id: 1,
            user: 'Juan Pérez',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            text: 'He contactado con el transportista para verificar el estado del envío.'
          },
          {
            id: 2,
            user: 'Ana García',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            text: 'El transportista confirma que el envío será entregado mañana sin falta.'
          }
        ],
        actions: [
          {
            id: 1,
            user: 'Sistema',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            action: 'Creación',
            details: 'Incidencia creada automáticamente por retraso en la entrega.'
          },
          {
            id: 2,
            user: 'Juan Pérez',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            action: 'Actualización',
            details: 'Incidencia asignada a Juan Pérez'
          }
        ]
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar los detalles de la incidencia');
    }
  }
);

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setSelectedIncident: (state, action: PayloadAction<string | null>) => {
      state.selectedIncident = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<string>) => {
      state.timeRange = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.typeFilter = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Manejar estados para fetchIncidentsSummary
      .addCase(fetchIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchIncidentsList
      .addCase(fetchIncidentsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidentsList = action.payload.incidents;
        state.total = action.payload.total;
      })
      .addCase(fetchIncidentsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Manejar estados para fetchIncidentDetails
      .addCase(fetchIncidentDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.incidentDetails = action.payload;
      })
      .addCase(fetchIncidentDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setSelectedIncident, 
  setTimeRange, 
  setStatusFilter,
  setTypeFilter,
  setPage,
  setLimit,
  clearError 
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
