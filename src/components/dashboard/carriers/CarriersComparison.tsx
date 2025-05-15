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
  Avatar,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { 
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Carrier } from '@/redux/features/dashboardSlice';
import { formatNumber, formatCurrency, formatPercent } from '@/utils/formatters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CarriersComparisonProps {
  carriers: Carrier[];
  selectedCarrier: string;
  setSelectedCarrier: (carrier: string) => void;
}

export default function CarriersComparison({ 
  carriers, 
  selectedCarrier, 
  setSelectedCarrier 
}: CarriersComparisonProps) {
  // Preparar opciones para el filtro
  const filterOptions = ['Todos', ...carriers.map(c => c.name)];
  
  const handleFilterChange = (value: string) => {
    if (value === 'Todos') {
      setSelectedCarrier('all');
    } else {
      setSelectedCarrier(value);
    }
  };
  
  // Filtrar transportistas si es necesario
  const filteredCarriers = selectedCarrier === 'all' 
    ? carriers 
    : carriers.filter(c => c.name === selectedCarrier);
  
  // Acciones para la tarjeta
  const cardActions = (
    <Stack direction="row" spacing={2}>
      <Button
        size="small"
        startIcon={<DownloadIcon />}
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.light',
            opacity: 0.9,
          },
          px: 2,
          py: 0.5,
          fontSize: '0.75rem',
        }}
      >
        Exportar
      </Button>
      <DropdownFilter 
        options={filterOptions} 
        defaultValue="Todos"
        onChange={handleFilterChange}
      />
    </Stack>
  );

  return (
    <CardComponent 
      title="Comparativa de Transportistas" 
      actions={cardActions}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="carriers comparison table">
          <TableHead>
            <TableRow>
              <TableCell>Transportista</TableCell>
              <TableCell align="right">Guías</TableCell>
              <TableCell align="right">Ingresos</TableCell>
              <TableCell align="right">Costos</TableCell>
              <TableCell align="right">Margen (%)</TableCell>
              <TableCell align="right">Tiempo Entrega</TableCell>
              <TableCell align="right">Incidencias (%)</TableCell>
              <TableCell align="center">Tendencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCarriers.map((carrier) => (
              <TableRow
                key={carrier.id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: carrier.color,
                        mr: 2
                      }}
                      variant="rounded"
                    >
                      {carrier.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="medium">
                      {carrier.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {formatNumber(carrier.guides)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(carrier.revenue)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(carrier.cost)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    color={carrier.margin > 32 ? 'success.main' : carrier.margin > 25 ? 'warning.main' : 'error.main'}
                  >
                    {carrier.margin.toFixed(1)}%
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2"
                    color={carrier.avgDeliveryTime < 2 ? 'success.main' : carrier.avgDeliveryTime < 2.5 ? 'warning.main' : 'error.main'}
                  >
                    {carrier.avgDeliveryTime.toFixed(1)} días
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2"
                    color={carrier.incidentRate < 5 ? 'success.main' : carrier.incidentRate < 6 ? 'warning.main' : 'error.main'}
                  >
                    {carrier.incidentRate.toFixed(1)}%
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ height: 30, width: 100, mx: 'auto' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={carrier.trend.map((value, i) => ({ name: i, value }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={carrier.color} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardComponent>
  );
}