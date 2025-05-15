// src/components/dashboard/overview/BalanceAlerts.tsx
'use client';

import { Box, Typography, Button, Alert, Stack } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import ViewAllButton from '@/components/common/ViewAllButton';
import { WalletData } from '@/redux/features/dashboardSlice';
import { formatCurrency } from '@/utils/formatters';

interface BalanceAlertsProps {
  walletData: WalletData;
}

export default function BalanceAlerts({ walletData }: BalanceAlertsProps) {
  const { lowBalanceAlerts } = walletData;

  return (
    <CardComponent 
      title="Alertas de Saldo" 
      actions={<ViewAllButton />}
      height={400}
    >
      {lowBalanceAlerts.length > 0 ? (
        <Box 
          component="ul" 
          sx={{ 
            listStyle: 'none', 
            pl: 0, 
            mt: 1,
            height: '100%',
            overflow: 'auto',
          }}
        >
          {lowBalanceAlerts.map((alert, index) => (
            <Box 
              component="li" 
              key={index} 
              sx={{ 
                mb: 2,
                '&:last-child': {
                  mb: 0,
                }
              }}
            >
              <Alert 
                severity="error" 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="body2" fontWeight="medium">
                      {alert.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        bgcolor: 'error.light', 
                        color: 'error.main',
                        px: 1,
                        py: 0.5,
                        borderRadius: 5,
                        fontWeight: 'medium'
                      }}
                    >
                      {alert.estimatedDays} {alert.estimatedDays === 1 ? 'día' : 'días'} restantes
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Saldo disponible: <Typography component="span" fontWeight="medium" color="error.main">{formatCurrency(alert.availableBalance)}</Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button 
                    variant="text" 
                    size="small" 
                    color="primary"
                    sx={{ textTransform: 'none', p: 0 }}
                  >
                    Notificar
                  </Button>
                </Box>
              </Alert>
            </Box>
          ))}
        </Box>
      ) : (
        <Stack 
          direction="column"
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            height: '100%',
            py: 4,
          }}
        >
          <CheckIcon 
            sx={{ 
              fontSize: 48, 
              color: 'success.main',
              mb: 2,
            }} 
          />
          <Typography color="text.secondary">
            No hay alertas de saldo bajo
          </Typography>
        </Stack>
      )}
    </CardComponent>
  );
}
