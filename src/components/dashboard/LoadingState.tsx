// src/components/dashboard/LoadingState.tsx
'use client';

import { Box, Typography, CircularProgress, Stack, Paper } from '@mui/material';

export default function LoadingState() {
  // Función para crear un esqueleto (placeholder) para los componentes
  const SkeletonCard = ({ height = 300 }: { height?: number }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        height, 
        bgcolor: 'grey.100', 
        borderRadius: 2, 
        border: '1px solid', 
        borderColor: 'divider',
        p: 3,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        width: '70%', 
        height: 24, 
        bgcolor: 'grey.200', 
        borderRadius: 1, 
        mb: 3 
      }} />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress color="primary" size={40} />
      </Box>
    </Paper>
  );

  return (
    <Stack spacing={3}>
      {/* Mensaje de carga */}
      <Box 
        sx={{ 
          py: 2, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Cargando datos del dashboard...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Obteniendo información más reciente de T1 Envíos
        </Typography>
      </Box>

      {/* KPI Skeletons */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {[1, 2, 3, 4].map(i => (
          <SkeletonCard key={i} height={150} />
        ))}
      </Stack>

      {/* Main Charts Skeletons */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <SkeletonCard height={380} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <SkeletonCard height={380} />
        </Box>
      </Stack>

      {/* Secondary Charts Skeletons */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <SkeletonCard height={400} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <SkeletonCard height={400} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <SkeletonCard height={400} />
        </Box>
      </Stack>

      {/* Bottom Charts Skeletons */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <SkeletonCard height={350} />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <SkeletonCard height={350} />
        </Box>
      </Stack>
    </Stack>
  );
}
