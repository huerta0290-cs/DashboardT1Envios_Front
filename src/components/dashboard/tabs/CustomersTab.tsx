// src/components/dashboard/tabs/CustomersTab.tsx
'use client';

import { useEffect } from 'react';
import { Box, Stack, CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchTopCustomers, fetchCustomerLevels, setSelectedLevel } from '@/redux/features/customersSlice';
import CustomerLevelDistribution from '../customers/CustomerLevelDistribution';
import WalletBalance from '../customers/WalletBalance';
import CustomerNPS from '../customers/CustomerNPS';
import TopCustomersTable from '../customers/TopCustomersTable';
import CustomerTrends from '../customers/CustomerTrends';

export default function CustomersTab() {
  const dispatch = useAppDispatch();
  const { 
    topCustomers, 
    customerLevels,
    timeRange, 
    isLoading, 
    error,
    selectedLevel
  } = useAppSelector(state => state.customers);
  
  const { kpis, walletData } = useSelector((state: RootState) => state.dashboard.data || { kpis: { npsScore: 0, npsChange: 0 }, walletData: { availableBalance: 0, consumedBalance: 0, lowBalanceAlerts: [] } });

  // Cargar datos de clientes cuando cambie el rango de tiempo
  useEffect(() => {
    dispatch(fetchTopCustomers({ timeRange }));
    dispatch(fetchCustomerLevels(timeRange));
  }, [dispatch, timeRange]);

  useEffect(() =>{
    if(!topCustomers) return;
    console.log("CUSTOMER",topCustomers)
  },[topCustomers])

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
  if (!topCustomers || topCustomers.length === 0 || !customerLevels || customerLevels.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No hay datos disponibles para mostrar.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Estadísticas principales de clientes */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <CustomerLevelDistribution customerLevels={customerLevels} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <WalletBalance walletData={walletData} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <CustomerNPS npsScore={kpis.npsScore} npsChange={kpis.npsChange} />
        </Box>
      </Stack>
      
      {/* Tabla de top clientes */}
      <TopCustomersTable 
        customers={topCustomers} 
        selectedLevel={selectedLevel}
        setSelectedLevel={(level) => dispatch(setSelectedLevel(level))}
      />
      
      {/* Tendencias de clientes */}
      <CustomerTrends customers={topCustomers.slice(0, 5)} />
    </Stack>
  );
}