'use client';

import { useState, useEffect } from 'react';
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
  Button,
  Stack,
  Tooltip,
  IconButton,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { 
  Download as DownloadIcon,
  FilterAlt as FilterAltIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { TopCustomer } from '@/redux/features/dashboardSlice';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { fetchCustomers } from '@/redux/features/customersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function TopCustomersTable() {
  const { 
      topCustomers, 
      pagination, 
      isLoading, 
      error 
    } = useAppSelector((state) => state.customers);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useAppDispatch();
  // Estado para filtro de nivel
  const [levelFilter, setLevelFilter] = useState<string>('Todos');
  
  // Opciones de filtro
  const filterOptions = ['Todos', 'Nivel 26', 'Nivel 25', 'Nivel 24', 'Nivel 23', 'Nivel 22', 'Nivel 21', 'Nivel 20', 'Nivel 19', 'Nivel 18', 'Nivel 17', 'Nivel 16', 'Nivel 15', 'Nivel 14', 'Nivel 13', 'Nivel 12', 'Nivel 11', 'Nivel 10', 'Nivel 9', 'Nivel 8', 'Nivel 7', 'Nivel 6', 'Nivel 5', 'Nivel 4', 'Nivel 3', 'Nivel 2', 'Nivel 1', 'Nivel custom', 'Nivel flat'];
  
  // Cargar datos de transportistas con paginación
  useEffect(() => {
    dispatch(fetchCustomers({ params: { timeRange: '7d', page, pageSize, search: searchQuery } }));
  }, [dispatch, page, pageSize, searchQuery]);

  // Filtrar clientes por nivel
  const filteredCustomers = levelFilter === 'Todos' 
    ? topCustomers || []
    : topCustomers.filter(topCustomers => topCustomers.level === levelFilter);

  
  
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
      {/* <Button
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
      </Button> */}
      <DropdownFilter 
        options={filterOptions} 
        defaultValue="Todos"
        onChange={(value) => setLevelFilter(value)}
      />
    </Stack>
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    };
    
    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
      const newSize = event.target.value as number;
      setPageSize(newSize);
      setPage(1); // Resetear a primera página cuando cambia el tamaño de página
    };
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setIsSearching(!!event.target.value);
      setPage(1); // Resetear a primera página cuando se busca
    };
    
    const handleClearSearch = () => {
      setSearchQuery('');
      setIsSearching(false);
      setPage(1);
    };

  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

  const handleRefresh = () => {
     dispatch(fetchCustomers({ params: { timeRange: '7d', page, pageSize, search: searchQuery } }));
  };

  // Controles de paginación
  const paginationControls = (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2} 
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      sx={{ mt: 2 }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="rows-per-page-label">Filas por página</InputLabel>
        <Select
          labelId="rows-per-page-label"
          id="rows-per-page"
          value={pageSize}
          label="Filas por página"
          onChange={handlePageSizeChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      
      <Pagination 
        count={pagination?.totalPages || 1}
        page={page}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
      
      <Typography variant="body2" color="text.secondary">
        {isSearching ? (
          <>Mostrando resultados para "{searchQuery}": {filteredCustomers.length} de {pagination?.totalItems || 0}</>
        ) : (
          <>Mostrando {filteredCustomers.length} de {pagination?.totalItems || 0} transportistas</>
        )}
      </Typography>
    </Stack>
  );

  // Barra de búsqueda
    const searchBar = (
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre o ID del transportista..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={clearSearch}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            }
          }}
        />
        {searchQuery && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {filteredCustomers.length} resultado{filteredCustomers.length !== 1 ? 's' : ''} encontrado{filteredCustomers.length !== 1 ? 's' : ''} para "{searchQuery}"
          </Typography>
        )}
      </Box>
    );
  
  return (
    <CardComponent 
      title="Top Clientes" 
      actions={cardActions}
    >
      {searchBar}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
         </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleRefresh}
                sx={{ mt: 2 }}
              >
              Reintentar
            </Button>
         </Box>
        ) : (
          <>
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
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => {
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
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          {isSearching 
                            ? `No se encontraron resultados para "${searchQuery}"` 
                            : 'No hay datos disponibles'}
                        </Typography>
                        {isSearching && (
                          <Button 
                            variant="text" 
                            size="small" 
                            startIcon={<ClearIcon />}
                            onClick={handleClearSearch}
                            sx={{ mt: 1 }}
                          >
                            Limpiar búsqueda
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Controles de paginación */}
            {paginationControls}
          </>
      )}
    </CardComponent>
  );
}