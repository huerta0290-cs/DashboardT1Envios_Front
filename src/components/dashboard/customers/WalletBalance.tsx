'use client';

import { Box, Typography, Stack, Divider } from '@mui/material';
import { 
  Wallet as WalletIcon,
  ArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import { WalletData } from '@/redux/features/dashboardSlice';
import { formatCurrency } from '@/utils/formatters';

interface WalletBalanceProps {
  walletData: WalletData;
}

export default function WalletBalance({ walletData }: WalletBalanceProps) {
  return (
    <CardComponent title="Saldo Disponible" height={380}>
      <Stack 
        direction="column" 
        spacing={3} 
        sx={{ 
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 2 
        }}
      >
        {/* Icono y saldo disponible */}
        <Box sx={{ mb: 2 }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              bgcolor: 'primary.light', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2
            }}
          >
            <WalletIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {formatCurrency(walletData.availableBalance)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Saldo total disponible
          </Typography>
        </Box>
        
        <Divider flexItem />
        
        {/* Estadísticas adicionales */}
        <Stack direction="row" spacing={4} justifyContent="center" width="100%">
          <Box>
            <Typography variant="h6" fontWeight="semibold" color="text.primary">
              {formatCurrency(walletData.consumedBalance)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consumido en el período
            </Typography>
          </Box>
          
          {/* <Divider orientation="vertical" flexItem /> */}
          
          {/* <Box>
            <Typography variant="h6" fontWeight="semibold" color="text.primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {walletData.lowBalanceAlerts.length}
              {walletData.lowBalanceAlerts.length > 0 && (
                <ArrowRightIcon sx={{ fontSize: 16, color: 'error.main', ml: 0.5 }} />
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Alertas de saldo bajo
            </Typography>
          </Box> */}
        </Stack>
      </Stack>
    </CardComponent>
  );
}