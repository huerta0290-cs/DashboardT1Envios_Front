'use client';

import { Grid, Stack, Paper, Box, Typography } from '@mui/material';
import { 
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { KPI, WalletData } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface FinanceKPIsProps {
  kpis: KPI;
  walletData: WalletData;
}

export default function FinanceKPIs({ kpis, walletData }: FinanceKPIsProps) {
  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={3}
      justifyContent="space-between"
    >
      {/* Ingresos Totales */}
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
              Ingresos Totales
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {formatCurrency(kpis.totalRevenue)}
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: kpis.revenueChange > 0 ? 'success.main' : 'error.main',
                  typography: 'caption',
                  fontWeight: 'medium'
                }}
              >
                {kpis.revenueChange > 0 ? '+' : ''}{kpis.revenueChange.toFixed(1)}%
              </Box>
              <Typography variant="caption" color="text.secondary">
                vs período anterior
              </Typography>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'success.light' 
            }}
          >
            <AttachMoneyIcon sx={{ color: 'success.main' }} />
          </Box>
        </Stack>
      </Paper>
      
      {/* Margen Promedio */}
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
              Margen Promedio
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {kpis.averageMargin.toFixed(1)}%
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Box 
                component="span" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: kpis.marginChange > 0 ? 'success.main' : 'error.main',
                  typography: 'caption',
                  fontWeight: 'medium'
                }}
              >
                {kpis.marginChange > 0 ? '+' : ''}{kpis.marginChange.toFixed(1)} pts
              </Box>
              <Typography variant="caption" color="text.secondary">
                vs período anterior
              </Typography>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'secondary.light' 
            }}
          >
            <TrendingUpIcon sx={{ color: 'secondary.main' }} />
          </Box>
        </Stack>
      </Paper>
      
      {/* Saldo en Plataforma */}
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
              Saldo en Plataforma
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {formatCurrency(walletData.availableBalance)}
            </Typography>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" color="primary">
                {formatCurrency(walletData.consumedBalance)} consumido en el período
              </Typography>
            </Stack>
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'primary.light' 
            }}
          >
            <AccountBalanceIcon sx={{ color: 'primary.main' }} />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}