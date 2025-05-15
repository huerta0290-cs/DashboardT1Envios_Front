// src/app/page.tsx
'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import NavTabs from '@/components/layout/NavTabs';
import MainDashboard from '@/components/dashboard/MainDashboard';
import LoadingState from '@/components/dashboard/LoadingState';
import { useDashboard } from '@/utils/dashboard-hooks';

export default function DashboardPage() {
  const { isLoading } = useDashboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <NavTabs />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'grey.50',
          overflow: 'auto',
        }}
      >
        {isLoading ? <LoadingState /> : <MainDashboard />}
      </Box>
    </Box>
  );
}
