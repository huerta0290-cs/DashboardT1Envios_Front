// src/components/dashboard/tabs/CarriersTab.tsx
'use client';

import { useEffect } from 'react';
import { Box, Stack, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCarriers, setSelectedCarrier } from '@/redux/features/carriersSlice';
import CarriersComparison from '../carriers/CarriersComparison';
import CarriersDistribution from '../carriers/CarriersDistribution';
import CarriersPerformance from '../carriers/CarriersPerformance';
import DeliveryTime from '../carriers/DeliveryTime';
import IncidentResolution from '../carriers/IncidentResolution';
import { useDashboard } from '@/utils/dashboard-hooks';

export default function CarriersTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { timeRange } = useDashboard();
  const { data: carriers, isLoading, error, selectedCarrier } = useSelector((state: RootState) => state.carriers);
  const { incidents } = useSelector((state: RootState) => state.dashboard.data || { incidents: { resolutionTime: {} } });

  // Cargar datos de transportistas cuando cambie el rango de tiempo
  useEffect(() => {
    dispatch(fetchCarriers(timeRange));
  }, [dispatch, timeRange]);

  // Actualizar el transportista seleccionado
  const handleCarrierSelection = (carrier: string) => {
    dispatch(setSelectedCarrier(carrier));
  };

  // Si está cargando, mostrar indicador de carga
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si hay un error, mostrar mensaje de error
  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!carriers || carriers.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No hay datos disponibles para mostrar.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Tabla comparativa de transportistas */}
      <CarriersComparison 
        carriers={carriers} 
        selectedCarrier={selectedCarrier}
        setSelectedCarrier={handleCarrierSelection}
      />
      
      {/* Gráficos de rendimiento */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersDistribution carriers={carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarriersPerformance carriers={carriers} />
        </Box>
      </Stack>
      
      {/* Gráficos de tiempo de entrega y resolución de incidencias */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <DeliveryTime carriers={carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentResolution incidentData={incidents?.resolutionTime || {}} />
        </Box>
      </Stack>
    </Stack>
  );
}
