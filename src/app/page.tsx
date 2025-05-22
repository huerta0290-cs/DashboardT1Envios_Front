// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
import NavTabs from '@/components/layout/NavTabs';
import MainDashboard from '@/components/dashboard/MainDashboard';
import LoadingState from '@/components/dashboard/LoadingState';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchDashboardData, clearError } from '@/redux/features/dashboardSlice';
import { isAuthenticated, getAuthToken, setupStorageListener } from '../service/auth';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error, timeRange, customDateRange } = useAppSelector(state => state.dashboard);
  
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar autenticación al cargar la página
  useEffect(() => {
    checkAuthentication();
    
    // Configurar listener para cambios en storage (logout en otras pestañas)
    const cleanup = setupStorageListener(() => {
      checkAuthentication();
    });
    
    return cleanup;
  }, []);

  // Cargar datos cuando cambie el rango de tiempo y el usuario esté autenticado
  useEffect(() => {
    if (isUserAuthenticated) {
      loadDashboardData();
    }
  }, [dispatch, timeRange, customDateRange, isUserAuthenticated]);

  const checkAuthentication = () => {
    setIsCheckingAuth(true);
    
    // Simular una pequeña demora para mostrar el estado de carga
    setTimeout(() => {
      const authenticated = isAuthenticated();
      console.log('Checking auth status:', authenticated, 'Token:', !!getAuthToken());
      
      setIsUserAuthenticated(authenticated);
      
      if (!authenticated) {
        setAuthError('Se requiere autenticación para acceder al dashboard');
      } else {
        setAuthError(null);
      }
      
      setIsCheckingAuth(false);
    }, 500);
  };

  const loadDashboardData = () => {
    const params = {
      timeRange,
      ...(timeRange === 'custom' && customDateRange.startDate && customDateRange.endDate 
        ? { 
            startDate: customDateRange.startDate, 
            endDate: customDateRange.endDate 
          }
        : {})
    };
    
    dispatch(fetchDashboardData(params))
      .unwrap()
      .catch((err) => {
        console.error('Error loading dashboard data:', err);
        
        // Si hay un error de autenticación, cerrar sesión
        if (err.includes('401') || err.includes('autoriza') || err.includes('autent')) {
          handleAuthError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
      });
  };

  const handleLoginSuccess = () => {
    setIsUserAuthenticated(true);
    setAuthError(null);
    // Los datos se cargarán automáticamente por el useEffect
  };

  const handleAuthError = (errorMessage: string) => {
    setAuthError(errorMessage);
    setIsUserAuthenticated(false);
    // Opcional: limpiar el token del localStorage
    // removeAuthToken();
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  // Mostrar estado de carga inicial
  if (isCheckingAuth) {
    return <LoadingState />;
  }

  // Mostrar formulario de login si no está autenticado
  if (!isUserAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} error={authError || undefined} />;
  }

  // Mostrar dashboard si está autenticado
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <NavTabs />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {isLoading ? <LoadingState /> : <MainDashboard />}
      </Box>
      
      {/* Snackbar para errores */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}