// src/components/dashboard/ErrorState.tsx
'use client';

import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import { Warning as WarningIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorStateProps {
  message: string;
  code?: string;
  onRetry: () => void;
}

export default function ErrorState({ message, code, onRetry }: ErrorStateProps) {
  // Determinar título y descripción basados en el tipo de error
  let title = 'Error al cargar datos';
  let description = 'Ha ocurrido un problema al obtener la información del dashboard.';
  
  if (code === 'NOT_FOUND') {
    title = 'Información no disponible';
    description = 'No se encontraron datos para los parámetros solicitados.';
  } else if (code === '401' || code === '403') {
    title = 'Acceso no autorizado';
    description = 'No tienes permisos para acceder a esta información.';
  } else if (code === 'NETWORK_ERROR') {
    title = 'Error de conexión';
    description = 'No se pudo establecer conexión con el servidor.';
  }

  return (
    <Stack spacing={4} sx={{ py: 6 }}>
      {/* Mensaje de error */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <WarningIcon 
            color="warning" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          
          <Typography variant="h5" gutterBottom color="text.primary">
            {title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {description}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {message}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Reintentar
          </Button>
        </Box>
      </Paper>
      
      {/* Contenido esqueleto para mantener el layout */}
      <Box sx={{ opacity: 0.3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {[1, 2, 3, 4].map(i => (
            <Paper 
              key={i} 
              elevation={0} 
              sx={{ 
                height: 150, 
                flex: 1,
                borderRadius: 2, 
                border: '1px solid', 
                borderColor: 'divider',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
