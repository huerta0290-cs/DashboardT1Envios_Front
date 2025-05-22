'use client';

import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import IncidentsKPIs from '../incidents/IncidentsKPIs';
import IncidentsByType from '../incidents/IncidentsByType';
import IncidentsTrend from '../incidents/IncidentsTrend';
import IncidentsResolutionTime from '../incidents/IncidentsResolutionTime';
import IncidentsTable from '../incidents/IncidentsTable';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchIncidents } from '@/redux/features/incidentsSlice'

interface IncidentsTabProps {
  data: DashboardData;
}

export default function IncidentsTab({ data }: IncidentsTabProps) {
  const dispatch = useAppDispatch();
  const { 
    isLoading, 
    error, 
    incidents
  } = useAppSelector(state => state.incidents);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  useEffect(() => {
    if(!incidents) return;
    console.log("Incidencias",incidents)
  }, [incidents]);

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
      {incidents.length>0 && 
        <IncidentsTable 
          incidents={incidents} 
          carriers={data.carriers} 
          customers={data.topCustomers} 
        />
      }
    </Stack>
  );
}