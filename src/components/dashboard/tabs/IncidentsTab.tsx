'use client';

import { Box, Stack } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import IncidentsKPIs from '../incidents/IncidentsKPIs';
import IncidentsByType from '../incidents/IncidentsByType';
import IncidentsTrend from '../incidents/IncidentsTrend';
import IncidentsResolutionTime from '../incidents/IncidentsResolutionTime';
import IncidentsTable from '../incidents/IncidentsTable';

interface IncidentsTabProps {
  data: DashboardData;
}

export default function IncidentsTab({ data }: IncidentsTabProps) {
  return (
    <Stack spacing={3}>
      {/* KPIs de incidencias */}
      <IncidentsKPIs incidents={data.incidents} kpis={data.kpis} />
      
      {/* Gráficos de tipos de incidencias y tendencia */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentsByType incidentTypes={data.incidents.byType} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentsTrend incidentTrend={data.incidents.trend} />
        </Box>
      </Stack>
      
      {/* Tiempo de resolución de incidencias */}
      <IncidentsResolutionTime 
        resolutionTime={data.incidents.resolutionTime} 
        carrierData={data.carriers}
      />
      
      {/* Tabla de incidencias recientes */}
      <IncidentsTable 
        incidents={data.incidents} 
        carriers={data.carriers} 
        customers={data.topCustomers} 
      />
    </Stack>
  );
}