// src/components/dashboard/overview/TopCustomers.tsx
'use client';

import { Box, Typography, Avatar, Stack } from '@mui/material';
import CardComponent from '@/components/common/CardComponent';
import ViewAllButton from '@/components/common/ViewAllButton';
import { TopCustomer } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface TopCustomersProps {
  customers: TopCustomer[];
}

export default function TopCustomers({ customers }: TopCustomersProps) {
  // Obtener las iniciales del nombre del cliente
  const getInitials = (name: string) => {
    return name.split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  // Obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success.main';
      case 'at_risk':
        return 'warning.main';
      case 'inactive':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <CardComponent 
      title="Top Clientes" 
      actions={<ViewAllButton />}
      height={400}
    >
      <Box component="ul" sx={{ 
        listStyle: 'none', 
        pl: 0,
        mt: 1,
        height: '100%',
        overflow: 'none'
      }}>
        {customers.slice(0, 5).map((customer, index) => (
          <Box 
            component="li" 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              }
            }}
          >
            <Stack direction="row" alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  width: 40,
                  height: 40,
                  mr: 2,
                  fontSize: '0.875rem',
                  fontWeight: 'medium',
                }}
              >
                {getInitials(customer.name)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {customer.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: getStatusColor(customer.status),
                      display: 'inline-block',
                      mr: 1,
                    }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {customer.level}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                {formatCurrency(customer.revenue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatNumber(customer.guides)} guías
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </CardComponent>
  );
}
