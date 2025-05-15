// src/components/dashboard/customers/TopCustomersTable.tsx
'use client';

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
  Chip,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import { 
  Info as InfoIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { TopCustomer } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TopCustomersTableProps {
  customers: TopCustomer[];
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
}

export default function TopCustomersTable({ 
  customers, 
  selectedLevel,
  setSelectedLevel 
}: TopCustomersTableProps) {
  
  // Filtrar clientes por nivel
  const getFilteredCustomers = () => {
    if (selectedLevel === 'all') {
      return customers;
    }
    return customers.filter(customer => customer.level === selectedLevel);
  };
  
  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };
  
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
  
  // Obtener color basado en el status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'success.light', text: 'success.main' };
      case 'at_risk':
        return { bg: 'warning.light', text: 'warning.main' };
      case 'inactive':
        return { bg: 'error.light', text: 'error.main' };
      default:
        return { bg: 'grey.100', text: 'text.primary' };
    }
  };
  
  // Obtener texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'at_risk':
        return 'En riesgo';
      case 'inactive':
        return 'Inactivo';
      default:
        return status;
    }
  };
  
  // Acciones para el card
  const cardActions = (
    <Stack direction="row" spacing={2}>
      <DropdownFilter 
        options={['Todos', 'Nivel 26', 'Nivel 10', 'Nivel 1']} 
        defaultValue={selectedLevel === 'all' ? 'Todos' : selectedLevel}
        onChange={(value) => setSelectedLevel(value === 'Todos' ? 'all' : value)}
      />
    </Stack>
  );
  
  return (
    <CardComponent 
      title="Top Clientes" 
      actions={cardActions}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Nivel</TableCell>
              <TableCell align="right">Guías</TableCell>
              <TableCell align="right">Ingresos</TableCell>
              <TableCell align="right">Margen (%)</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">NPS</TableCell>
              <TableCell align="center">Tendencia</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredCustomers().map((customer) => {
              const levelColor = getLevelColor(customer.level);
              const statusColor = getStatusColor(customer.status);
              
              return (
                <TableRow
                  key={customer.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  {/* Cliente */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          mr: 2
                        }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Nivel */}
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
                  
                  {/* Guías */}
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(customer.guides)}
                    </Typography>
                  </TableCell>
                  
                  {/* Ingresos */}
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(customer.revenue)}
                    </Typography>
                  </TableCell>
                  
                  {/* Margen */}
                  <TableCell align="right">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium" 
                      color={customer.margin > 35 ? 'success.main' : customer.margin > 30 ? 'warning.main' : 'error.main'}
                    >
                      {customer.margin.toFixed(1)}%
                    </Typography>
                  </TableCell>
                  
                  {/* Estado */}
                  <TableCell align="center">
                    <Chip 
                      label={getStatusText(customer.status)}
                      size="small"
                      sx={{ 
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 'medium',
                        fontSize: '0.6875rem',
                      }}
                    />
                  </TableCell>
                  
                  {/* NPS */}
                  <TableCell align="center">
                    <Tooltip title="Puntuación de satisfacción del cliente">
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={customer.nps > 75 ? 'success.main' : customer.nps > 65 ? 'warning.main' : 'error.main'}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {customer.nps}
                        <InfoIcon sx={{ fontSize: 14, ml: 0.5, color: 'action.active', opacity: 0.7 }} />
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  
                  {/* Tendencia */}
                  <TableCell align="center">
                    <Box sx={{ height: 30, width: 80, mx: 'auto' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={customer.trend.map((value, i) => ({ name: i, value }))}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3B82F6" 
                            strokeWidth={2} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </TableCell>
                  
                  {/* Acciones */}
                  <TableCell align="center">
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
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