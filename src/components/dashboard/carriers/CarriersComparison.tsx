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
  Button,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Carrier } from '@/redux/features/dashboardSlice';
import { formatNumber, formatCurrency, formatPercent } from '@/utils/formatters';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCarriers } from '@/redux/features/carriersSlice';

interface CarriersComparisonProps {
  selectedCarrier: string;
  setSelectedCarrier: (carrier: string) => void;
}

export default function CarriersComparison({ 
  selectedCarrier, 
  setSelectedCarrier 
}: CarriersComparisonProps) {
  const dispatch = useAppDispatch();
  const { 
    carriers, 
    pagination, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.carriers);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterOptions, setFilterOptions] = useState<string[]>(['Todos']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Cargar datos de transportistas con paginación
  useEffect(() => {
    dispatch(fetchCarriers({ page, pageSize, timeRange: '7d', search: searchQuery }));
  }, [dispatch, page, pageSize, searchQuery]);
  
  // Actualizar opciones de filtro cuando se cargan los datos
  useEffect(() => {
    if (carriers && carriers.length > 0) {
      const options = ['Todos', ...carriers.map(c => c.name)];
      setFilterOptions(options);
    }
  }, [carriers]);
  
  const handleFilterChange = (value: string) => {
    if (value === 'Todos') {
      setSelectedCarrier('all');
    } else {
      setSelectedCarrier(value);
    }
  };
  
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
  
  const handleRefresh = () => {
    dispatch(fetchCarriers({
      page, 
      pageSize, 
      timeRange: '7d',
      search: searchQuery
    }));
  };
  
  // Filtrar transportistas si es necesario
  const filteredCarriers = selectedCarrier === 'all' 
    ? carriers || [] 
    : carriers?.filter(c => c.name === selectedCarrier) || [];
  
  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
  };

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
          {filteredCarriers.length} resultado{filteredCarriers.length !== 1 ? 's' : ''} encontrado{filteredCarriers.length !== 1 ? 's' : ''} para "{searchQuery}"
        </Typography>
      )}
    </Box>
  );

  // Acciones para la tarjeta
  const cardActions = (
    <Stack direction="row" spacing={2} alignItems="center">    
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
        onChange={handleFilterChange}
      />
    </Stack>
  );

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
          <>Mostrando resultados para "{searchQuery}": {filteredCarriers.length} de {pagination?.totalItems || 0}</>
        ) : (
          <>Mostrando {filteredCarriers.length} de {pagination?.totalItems || 0} transportistas</>
        )}
      </Typography>
    </Stack>
  );

  return (
    <CardComponent 
      title="Comparativa de Transportistas" 
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
            <Table sx={{ minWidth: 650 }} size="small" aria-label="carriers comparison table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
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
                {filteredCarriers.length > 0 ? (
                  filteredCarriers.map((carrier) => (
                    <TableRow
                      key={carrier.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {carrier.id}
                        </Typography>
                      </TableCell>
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
                  ))
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