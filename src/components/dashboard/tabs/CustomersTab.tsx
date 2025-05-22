'use client';

import { Box, Stack } from '@mui/material';
import { DashboardData } from '@/redux/features/dashboardSlice';
import CustomerLevelDistribution from '../customers/CustomerLevelDistribution';
import WalletBalance from '../customers/WalletBalance';
import CustomerNPS from '../customers/CustomerNPS';
import TopCustomersTable from '../customers/TopCustomersTable';
import CustomerTrends from '../customers/CustomerTrends';

interface CustomersTabProps {
  data: DashboardData;
}

export default function CustomersTab({ data }: CustomersTabProps) {
  return (
    <Stack spacing={3}>
      {/* Estadísticas principales de clientes */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <CustomerLevelDistribution customerLevels={data.customerLevels} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <WalletBalance walletData={data.walletData} />
        </Box>
        {/* <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <CustomerNPS npsScore={data.kpis.npsScore} npsChange={data.kpis.npsChange} />
        </Box> */}
      </Stack>
      
      {/* Tabla de top clientes */}
      <TopCustomersTable  />
      
      {/* Tendencias de clientes */}
      {/* <CustomerTrends customers={data.topCustomers.slice(0, 5)} /> */}
    </Stack>
  );
}