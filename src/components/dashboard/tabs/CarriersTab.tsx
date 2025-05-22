// src/components/dashboard/tabs/CarriersTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { Stack, Box, Typography, CircularProgress } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import CarriersComparison from '../carriers/CarriersComparison';
import CarriersDistribution from '../carriers/CarriersDistribution';
import CarriersPerformance from '../carriers/CarriersPerformance';
import DeliveryTime from '../carriers/DeliveryTime';
import IncidentResolution from '../carriers/IncidentResolution';

interface CarriersTabProps {
  data: DashboardData;
}

export default function CarriersTab({ data }: CarriersTabProps) {  
  // Estado local para manejar el carrier seleccionado
  const [localSelectedCarrier, setLocalSelectedCarrier] = useState<string>('all');

  return (
    <Stack spacing={3}>
      {/* Tabla comparativa de transportistas */}
      <CarriersComparison 
        selectedCarrier={localSelectedCarrier}
        setSelectedCarrier={setLocalSelectedCarrier}
      />
      
     {/* Gráficos de rendimiento */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersDistribution carriers={data.carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersPerformance carriers={data.carriers} />
        </Box>
      </Stack>
      
      {/* Gráficos de tiempo de entrega y resolución de incidencias */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <DeliveryTime carriers={data.carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentResolution incidentData={data.incidents.resolutionTime} />
        </Box>
      </Stack>
    </Stack>
  );
}

// Los componentes de CarriersComparison, CarriersDistribution, etc. se importarían desde sus respectivos archivos
// Para simplificar, aquí usamos stubs que podrían implementarse en los archivos correspondientes
