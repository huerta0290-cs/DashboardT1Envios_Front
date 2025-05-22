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
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Carrier, TopCustomer } from '@/redux/features/dashboardSlice';
import { IncidentData } from '@/redux/features/incidentsSlice';


interface IncidentsTableProps {
  incidents: IncidentData[];
  carriers: Carrier[];
  customers: TopCustomer[];
}

export default function IncidentsTable({ 
  incidents, 
  carriers, 
  customers 
}: IncidentsTableProps) {
  const [statusFilter, setStatusFilter] = useState('Todas');
  
  // Simular incidencias recientes
  // const generateMockIncidents = () => {
  //   const types = incidents.byType;
  //   const result = [];
    
  //   for (let i = 0; i < 5; i++) {
  //     const isResolved = i % 3 === 0;
  //     const isPending = i % 3 === 1;
  //     const randomType = types[i % types.length];
  //     const randomCarrier = carriers[i % carriers.length];
  //     const randomCustomer = customers[i % customers.length];
      
  //     result.push({
  //       id: `INC-${Math.floor(1000000 + Math.random() * 9000000)}`,
  //       customer: randomCustomer,
  //       type: randomType,
  //       carrier: randomCarrier,
  //       shipmentNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
  //       status: isResolved ? 'resolved' : isPending ? 'pending' : 'processing',
  //       date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
  //       openDays: isResolved ? 0 : i + 1
  //     });
  //   }
    
  //   return result;
  // };
  
  // const mockIncidents = generateMockIncidents();
  
  //Filtrar por estado si es necesario
  const filteredIncidents = statusFilter === 'Todas' 
    ? incidents 
    : incidents.filter(incident => {
        if (statusFilter === 'Resueltas') return incident.status === 'finalized';
        if (statusFilter === 'Pendientes') return incident.status === 'pending';
        if (statusFilter === 'En Proceso') return incident.status === 'in_process';
        return true;
      });

  // const filteredIncidents = incidents
  
  // Obtener color basado en el tipo de incidencia
  const getTypeColor = (color: string) => {
    return {
      bg: `${color}30`,
      text: color
    };
  };
  
  // Obtener color basado en el status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalized':
        return { bg: 'success.light', text: 'success.main' };
      case 'pending':
        return { bg: 'error.light', text: 'error.main' };
      case 'in_process':
        return { bg: 'warning.light', text: 'warning.main' };
      default:
        return { bg: 'grey.100', text: 'text.primary' };
    }
  };
  
  // Obtener texto de status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'finalized':
        return 'Resuelto';
      case 'pending':
        return 'Pendiente';
      case 'in_process':
        return 'En Proceso';
      default:
        return status;
    }
  };
  
  return (
    <CardComponent 
      title="Últimas Incidencias Reportadas" 
      actions={
        <DropdownFilter 
          options={['Todas', 'Pendientes', 'Resueltas', 'En Proceso']} 
          defaultValue="Todas"
          onChange={setStatusFilter}
        />
      }
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Transportista</TableCell>
              <TableCell>Guía</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Tiempo Abierto</TableCell>
              {/* <TableCell align="center">Acciones</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents.map((incident, index) => {
              const typeColor = getTypeColor(incident.color);
              const statusColor = getStatusColor(incident.status);
              
              return (
                <TableRow
                  key={index}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {incident.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {incident.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={incident.type}
                      size="small"
                      sx={{ 
                        bgcolor: typeColor.bg,
                        color: typeColor.text,
                        fontWeight: 'medium',
                        fontSize: '0.6875rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: incident.color,
                          fontSize: '0.75rem',
                          mr: 1
                        }}
                        variant="rounded"
                      >
                        {incident.carrier.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">
                        {incident.carrier}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {incident.shipmentNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={getStatusText(incident.status)}
                      size="small"
                      sx={{ 
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 'medium',
                        fontSize: '0.6875rem',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(incident.date).toLocaleDateString('es-MX')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={
                        incident.status === 'resolved' 
                          ? 'success.main' 
                          : incident.openDays > 2 
                            ? 'error.main' 
                            : 'warning.main'
                      }
                    >
                      {incident.status === 'resolved' 
                        ? 'Cerrado'
                        : `${incident.openDays} ${incident.openDays === 1 ? 'día' : 'días'}`
                      }
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="center">
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </CardComponent>
  );
}