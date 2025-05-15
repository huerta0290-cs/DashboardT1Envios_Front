'use client';

import { Box, Stack } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import FinanceKPIs from '../finances/FinanceKPIs';
import RevenueDistribution from '../finances/RevenueDistribution';
import RevenueVsCost from '../finances/RevenueVsCost';
import MarginTrend from '../finances/MarginTrend';
import TopRevenueCustomers from '../finances/TopRevenueCustomers';
import RevenueForecast from '../finances/RevenueForecast';

interface FinancesTabProps {
  data: DashboardData;
}

export default function FinancesTab({ data }: FinancesTabProps) {
  return (
    <Stack spacing={3}>
      {/* KPIs financieros */}
      <FinanceKPIs 
        kpis={data.kpis} 
        walletData={data.walletData} 
      />
      
      {/* Gráfico de distribución de ingresos */}
      <RevenueDistribution carriers={data.carriers} />
      
      {/* Gráficos de ingresos vs costos y tendencia de margen */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <RevenueVsCost carriers={data.carriers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <MarginTrend />
        </Box>
      </Stack>
      
      {/* Top clientes por ingresos y proyección */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <TopRevenueCustomers customers={data.topCustomers} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <RevenueForecast />
        </Box>
      </Stack>
    </Stack>
  );
}