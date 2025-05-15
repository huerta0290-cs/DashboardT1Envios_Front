'use client';

import { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Chip
} from '@mui/material';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { TopCustomer } from '@/redux/features/dashboardSlice';
import { formatCurrency } from '@/utils/formatters';

interface TopRevenueCustomersProps {
  customers: TopCustomer[];
}

export default function TopRevenueCustomers({ customers }: TopRevenueCustomersProps) {
  const [period, setPeriod] = useState('Este Período');
  
  // Ordenar clientes por ingresos (descendente)
  const sortedCustomers = [...customers].sort((a, b) => b.revenue - a.revenue);
  
  // Mostrar solo los 5 primeros
  const topCustomers = sortedCustomers.slice(0, 5);
  
  // Obtener color basado en el nivel
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Nivel 26':
        return { bg: 'success.light', text: 'success.main' };
      case 'Nivel 10':
        return { bg: 'info.light', text: 'info.main' };
      case 'Nivel 1':
        return { bg: 'grey.200', text: 'text.secondary' };
      default:
        return { bg: 'grey.100', text: 'text.primary' };
    }
  };
  
  return (
    <CardComponent 
      title="Top 5 Clientes por Ingresos" 
      actions={
        <DropdownFilter 
          options={['Este Período', 'Período Anterior', 'Crecimiento']} 
          defaultValue="Este Período"
          onChange={setPeriod}
        />
      }
      height={350}
    >
      <TableContainer>
        <Table sx={{ minWidth: 500 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Nivel</TableCell>
              <TableCell align="right">Ingresos</TableCell>
              <TableCell align="right">Margen (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topCustomers.map((customer) => {
              const levelColor = getLevelColor(customer.level);
              
              // Simular datos para diferentes períodos
              const currentRevenue = customer.revenue;
              const previousRevenue = period === 'Período Anterior' 
                ? customer.revenue * 0.85 
                : customer.revenue;
              const growthPercent = period === 'Crecimiento'
                ? ((customer.revenue - customer.revenue * 0.85) / (customer.revenue * 0.85)) * 100
                : null;
              
              return (
                <TableRow 
                  key={customer.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      {customer.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={customer.level}
                      size="small"
                      sx={{ 
                        bgcolor: levelColor.bg,
                        color: levelColor.text,
                        fontWeight: 'medium',
                        fontSize: '0.6875rem',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {period === 'Crecimiento'
                        ? `+${growthPercent?.toFixed(1)}%`
                        : formatCurrency(period === 'Período Anterior' ? previousRevenue : currentRevenue)
                      }
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium" 
                      color={customer.margin > 35 ? 'success.main' : customer.margin > 30 ? 'warning.main' : 'error.main'}
                    >
                      {customer.margin.toFixed(1)}%
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </CardComponent>
  );
}