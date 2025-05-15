// src/components/dashboard/tabs/OverviewTab.tsx
'use client';

import { Stack, Box, Alert, Snackbar } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import KPICards from '../overview/KPICards';
import CarrierDistribution from '../overview/CarrierDistribution';
import ShipmentsMap from '../overview/ShipmentsMap';
import TopCustomers from '../overview/TopCustomers';
import BalanceAlerts from '../overview/BalanceAlerts';
import QualityMetrics from '../overview/QualityMetrics';
import IncidentsSummary from '../overview/IncidentsSummary';
import SalesTrend from '../overview/SalesTrend';
import { useDashboard } from '@/utils/dashboard-hooks';

interface OverviewTabProps {
  data: DashboardData;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const { 
    timeRange, 
    mapView, 
    updateMapView,
    error,
    handleClearError 
  } = useDashboard();

  return (
    <Stack spacing={3}>
      {/* Mensaje de error */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleClearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClearError} 
          severity={error?.code === 'NOT_FOUND' ? 'warning' : 'error'} 
          sx={{ width: '100%' }}
        >
          {error?.message}
        </Alert>
      </Snackbar>

      {/* KPIs principales */}
      <KPICards kpis={data.kpis} />
      
      {/* Gráficos principales */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CarrierDistribution carriers={data.carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <ShipmentsMap 
            mapData={data.mapData} 
            mapView={mapView}
            setMapView={updateMapView}
          />
        </Box>
      </Stack>
      
      {/* Gráficos secundarios */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <TopCustomers customers={data.topCustomers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <BalanceAlerts walletData={data.walletData} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <QualityMetrics metrics={data.qualityMetrics} />
        </Box>
      </Stack>
      
      {/* Gráficos inferiores */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <IncidentsSummary incidents={data.incidents} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <SalesTrend timeRange={timeRange} />
        </Box>
      </Stack>
    </Stack>
  );
}
