'use client';

import { Stack, Paper, Box, Typography, LinearProgress } from '@mui/material';
import { 
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { Incident, KPI } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';

interface IncidentsKPIsProps {
  incidents: Incident;
  kpis: KPI;
}

export default function IncidentsKPIs({ incidents, kpis }: IncidentsKPIsProps) {
  // Calcular tasa de incidencias
  const incidentRate = ((incidents.total / kpis.guidesGenerated) * 100).toFixed(1);
  
  // Calcular porcentaje de resolución
  const resolutionPercent = (incidents.resolved / Math.max(incidents.total, 1)) * 100;
  
  // Calcular tiempo promedio de resolución (en días)
  const avgResolutionTime = Object.values(incidents.resolutionTime).reduce((sum, time) => sum + time, 0) / 
    Math.max(Object.values(incidents.resolutionTime).length, 1);

  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={3}
      justifyContent="space-between"
    >
      {/* Total de Incidencias */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          flex: 1, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total de Incidencias
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {formatNumber(incidents.total)}
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(incidents.resolved)} resueltas
                </Typography>
              </Box>
              <Box sx={{ mx: 1, color: 'divider' }}>|</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(incidents.total - incidents.resolved)} pendientes
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'error.light' 
            }}
          >
            <WarningIcon sx={{ color: 'error.main' }} />
          </Box>
        </Stack>
      </Paper>
      
      {/* Tasa de Incidencias */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          flex: 1, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tasa de Incidencias
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {incidentRate}%
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Typography 
                variant="caption" 
                color={parseFloat(incidentRate) < 5 ? 'success.main' : 'warning.main'}
              >
                {incidents.total} incidencias / {formatNumber(kpis.guidesGenerated)} guías
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ width: '40%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Resueltas: {resolutionPercent.toFixed(0)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={resolutionPercent} 
              color="success"
              sx={{ 
                height: 8, 
                borderRadius: 4,
              }}
            />
          </Box>
        </Stack>
      </Paper>
      
      {/* Tiempo de Resolución */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          flex: 1, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tiempo de Resolución
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {avgResolutionTime.toFixed(1)}
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                Días promedio
              </Typography>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'warning.light' 
            }}
          >
            <AccessTimeIcon sx={{ color: 'warning.main' }} />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}