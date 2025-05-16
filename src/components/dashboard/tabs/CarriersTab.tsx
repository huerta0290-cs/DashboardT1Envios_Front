// src/components/dashboard/tabs/CarriersTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { Stack, Box, Typography, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCarriers, fetchCarrierDetails } from '@/redux/features/carriersSlice';
import CarriersComparison from '../carriers/CarriersComparison';
import CarriersDistribution from '../carriers/CarriersDistribution';
import CarriersPerformance from '../carriers/CarriersPerformance';
import DeliveryTime from '../carriers/DeliveryTime';
import IncidentResolution from '../carriers/IncidentResolution';

export default function CarriersTab() {
  const dispatch = useAppDispatch();
  const { 
    carriers, 
    selectedCarrier, 
    isLoading, 
    error, 
    timeRange 
  } = useAppSelector(state => state.carriers);
  
  // También necesitamos obtener el mapeo de los transportistas en el state del dashboard
  const { data: dashboardData } = useAppSelector(state => state.dashboard);
  
  // Estado local para manejar el carrier seleccionado
  const [localSelectedCarrier, setLocalSelectedCarrier] = useState<string>('all');

  // Efecto para cargar los transportistas
  useEffect(() => {
    dispatch(fetchCarriers(timeRange));
  }, [dispatch, timeRange]);

  // Si tenemos un carrierId seleccionado y no son todos, cargamos sus detalles
  useEffect(() => {
    if (selectedCarrier && String(selectedCarrier) !== 'all') {
      dispatch(fetchCarrierDetails({ 
        carrierId: parseInt(String(selectedCarrier)), 
        timeRange 
      }));
    }
  }, [dispatch, selectedCarrier, timeRange]);

  // Si el componente carga y aún no hay datos, mostramos un mensaje de carga
  if (isLoading && carriers.length === 0) {
    return (
      <Stack 
        direction="column" 
        spacing={2} 
        alignItems="center" 
        justifyContent="center" 
        sx={{ height: '300px' }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Cargando datos de transportistas...
        </Typography>
      </Stack>
    );
  }

  // Si hay un error, mostramos el mensaje
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar los datos
        </Typography>
        <Typography variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  // Para simplificar este ejemplo, usamos los carriers del dashboard hasta que se carguen los carriers específicos
  const carriersData = carriers.length > 0 ? carriers : (dashboardData?.carriers || []);
  //const carriersData = carriers

  return (
    <Stack spacing={3}>
      {/* Tabla comparativa de transportistas */}
      <CarriersComparison 
        carriers={carriersData} 
        selectedCarrier={localSelectedCarrier}
        setSelectedCarrier={setLocalSelectedCarrier}
      />
      
      {/* Gráficos de rendimiento */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersDistribution carriers={carriersData} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersPerformance carriers={carriersData} />
        </Box>
      </Stack>
      
      {/* Gráficos de tiempo de entrega y resolución de incidencias */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <DeliveryTime carriers={carriersData} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentResolution 
            incidentData={dashboardData?.incidents.resolutionTime || {}} 
          />
        </Box>
      </Stack>
    </Stack>
  );
}

// Los componentes de CarriersComparison, CarriersDistribution, etc. se importarían desde sus respectivos archivos
// Para simplificar, aquí usamos stubs que podrían implementarse en los archivos correspondientes
