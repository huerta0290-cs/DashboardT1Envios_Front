// src/components/dashboard/DashboardPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Stack, 
  Alert, 
  Snackbar, 
  CircularProgress, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff, ErrorOutline, InfoOutlined } from '@mui/icons-material';
import Header from '@/components/layout/Header';
import NavTabs from '@/components/layout/NavTabs';
import MainDashboard from '@/components/dashboard/MainDashboard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchDashboardData, clearError } from '@/redux/features/dashboardSlice';
import { getAuthToken, setAuthToken, isAuthenticated } from '../../service/auth';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { 
    isLoading, 
    error, 
    timeRange, 
    customDateRange 
  } = useAppSelector(state => state.dashboard);
  
  // Estado para el diálogo de login
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Verificar autenticación
  const checkAuthentication = () => {
    if (!isAuthenticated()) {
      setShowLoginDialog(true);
      setAuthError('Se requiere autenticación para acceder al dashboard');
    } else {
      setShowLoginDialog(false);
      setAuthError(null);
      fetchData();
    }
  };

  // Efecto para cargar datos cuando cambia el rango de tiempo
  useEffect(() => {
    // Solo cargamos datos si hay un token
    if (isAuthenticated()) {
      fetchData();
    }
  }, [dispatch, timeRange, customDateRange]);

  // Función para cargar datos
  const fetchData = () => {
    // Preparar parámetros según si es rango personalizado o no
    const params = {
      timeRange,
      ...(timeRange === 'custom' && customDateRange.startDate && customDateRange.endDate 
        ? { 
            startDate: customDateRange.startDate, 
            endDate: customDateRange.endDate 
          }
        : {})
    };
    
    // Verificamos token y cargamos datos
    if (isAuthenticated()) {
      console.log('Fetching dashboard data with params:', params);
      dispatch(fetchDashboardData(params))
        .unwrap()
        .then(() => {
          // Datos cargados exitosamente
          setAuthError(null);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          // Si recibimos un error 401, mostramos el diálogo de login nuevamente
          if (err.includes('401') || err.includes('autoriza') || err.includes('autent')) {
            setAuthError('Sesión expirada o token inválido');
            setShowLoginDialog(true);
          }
        });
    } else {
      setAuthError('Se requiere autenticación para acceder al dashboard');
      setShowLoginDialog(true);
    }
  };

  // Manejar cierre del mensaje de error
  const handleCloseError = () => {
    dispatch(clearError());
  };

  // Manejar envío del formulario de login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setLoginError('Por favor ingrese un token de autenticación');
      return;
    }
    
    setAuthToken(token);
    setShowLoginDialog(false);
    setLoginError('');
    
    // Cargar datos después de autenticar
    fetchData();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      {isAuthenticated() && !authError && (
        <>
          <Header />
          <NavTabs />
        </>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {isLoading ? (
          <Stack 
            direction="column" 
            alignItems="center" 
            justifyContent="center" 
            sx={{ height: '100%', py: 8 }}
          >
            <CircularProgress size={60} sx={{ mb: 4 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Cargando datos del dashboard...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Obteniendo información más reciente de T1 Envíos
            </Typography>
          </Stack>
        ) : (
          <>
            {authError && !showLoginDialog ? (
              <Stack 
                direction="column" 
                alignItems="center" 
                justifyContent="center" 
                spacing={3}
                sx={{ height: '100%', py: 8 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'error.light',
                    borderRadius: 2,
                    maxWidth: 500
                  }}
                >
                  <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" color="error.main" gutterBottom>
                    Error de Autenticación
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {authError}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setShowLoginDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Iniciar Sesión
                  </Button>
                </Paper>
              </Stack>
            ) : (
              isAuthenticated() && !authError && <MainDashboard />
            )}
          </>
        )}
      </Box>
      
      {/* Alerta de error */}
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

      {/* Diálogo de login */}
      <Dialog 
        open={showLoginDialog} 
        maxWidth="sm" 
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>Autenticación Requerida</DialogTitle>
        <form onSubmit={handleLoginSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Por favor, ingrese su token de autenticación para acceder al dashboard.
              </Typography>
              
              <TextField
                autoFocus
                margin="dense"
                label="Token de autenticación"
                type={showToken ? 'text' : 'password'}
                fullWidth
                variant="outlined"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                error={!!loginError}
                helperText={loginError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowToken(!showToken)}
                        edge="end"
                      >
                        {showToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 2 }}>
                  <Alert 
                    severity="info" 
                    icon={<InfoOutlined />}
                    sx={{ 
                      alignItems: 'flex-start',
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Modo de desarrollo activo. Puedes usar:
                    </Typography>
                    <Box 
                      sx={{ 
                        p: 1, 
                        fontSize: '0.8rem', 
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        overflowX: 'auto'
                      }}
                    >
                      <code>NEXT_PUBLIC_DEV_AUTH_TOKEN</code> (configurado en .env.local)
                    </Box>
                  </Alert>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button type="submit" variant="contained">
              Acceder
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
