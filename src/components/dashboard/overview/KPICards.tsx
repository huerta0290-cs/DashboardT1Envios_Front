'use client';

import { Box, Stack, Button, Typography, LinearProgress } from '@mui/material';
import {
  LocalShipping as PackageIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import KPICard from '@/components/common/KPICard';
import { KPI } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface KPICardsProps {
  kpis: KPI;
}

export default function KPICards({ kpis }: KPICardsProps) {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
    {/* Primera fila - 4 KPI cards */}
        <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{ width: '100%', mb: 3 }}
            flexWrap="wrap"
            justifyContent="space-between"
        >
            <Box sx={{ 
            width: { xs: '100%', sm: '48%', lg: '24%' }, 
            mb: { xs: 2, sm: 2, lg: 0 },
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            p: 2
            }}>
            <Typography variant="subtitle1" color="text.secondary">Guías Generadas</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">1,645</Typography>
                <Box sx={{ bgcolor: '#e6effd', p: 1, borderRadius: '50%' }}>
                <PackageIcon sx={{ color: '#3B82F6' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>24.3%</Typography>
                <Typography variant="body2" color="text.secondary">vs 1,323</Typography>
            </Box>
            <LinearProgress variant="determinate" value={80} color="primary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            {/* Repite el mismo patrón para las otras 3 KPI cards */}
            <Box sx={{ 
            width: { xs: '100%', sm: '48%', lg: '24%' }, 
            mb: { xs: 2, sm: 2, lg: 0 },
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            p: 2
            }}>
            <Typography variant="subtitle1" color="text.secondary">Ingresos Totales</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">$129,500</Typography>
                <Box sx={{ bgcolor: '#e6f7ef', p: 1, borderRadius: '50%' }}>
                <AttachMoneyIcon sx={{ color: '#10B981' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>22.4%</Typography>
                <Typography variant="body2" color="text.secondary">vs $105,840</Typography>
            </Box>
            <LinearProgress variant="determinate" value={75} color="success" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ 
            width: { xs: '100%', sm: '48%', lg: '24%' }, 
            mb: { xs: 2, sm: 0, lg: 0 },
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            p: 2
            }}>
            <Typography variant="subtitle1" color="text.secondary">Margen Promedio</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">30.7%</Typography>
                <Box sx={{ bgcolor: '#ededfd', p: 1, borderRadius: '50%' }}>
                <TrendingUpIcon sx={{ color: '#6366F1' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>0.4 pts</Typography>
                <Typography variant="body2" color="text.secondary">vs 30.3%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={65} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ 
            width: { xs: '100%', sm: '48%', lg: '24%' },
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            p: 2
            }}>
            <Typography variant="subtitle1" color="text.secondary">NPS / Satisfacción</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" fontWeight="bold">67.6</Typography>
                <Box sx={{ bgcolor: '#fef3e6', p: 1, borderRadius: '50%' }}>
                <GroupIcon sx={{ color: '#F59E0B' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>2.4 pts</Typography>
                <Typography variant="body2" color="text.secondary">vs 65.2</Typography>
            </Box>
            <LinearProgress variant="determinate" value={80} color="warning" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
        </Stack>
    </Box>
  );
}