// src/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton, 
  Tooltip, 
  Divider, 
  Switch, 
  FormControlLabel, 
  ButtonGroup,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon, 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  setTimeRange, 
  setComparisonEnabled, 
  setCustomDateRange 
} from '@/redux/features/dashboardSlice';
import {
  setCarrierTimeRange,
  setCarrierCustomDateRange
} from '@/redux/features/carriersSlice';
import {
  setCustomerTimeRange,
  setCustomerCustomDateRange
} from '@/redux/features/customersSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const { timeRange, comparisonEnabled, customDateRange } = useAppSelector(state => state.dashboard);
  
  // Estado para menú de usuario
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Estado para diálogo de fecha personalizada
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    customDateRange.startDate ? new Date(customDateRange.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    customDateRange.endDate ? new Date(customDateRange.endDate) : null
  );
  
  // Manejadores de eventos
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (newRange: '1d' | '7d' | '30d' | 'custom') => {
    if (newRange === 'custom') {
      setDateDialogOpen(true);
    } else {
      dispatch(setTimeRange(newRange));
      dispatch(setCarrierTimeRange(newRange))
      dispatch(setCustomerTimeRange(newRange))
    }
  };

  const handleComparisonToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setComparisonEnabled(event.target.checked));
  };

  const handleDateDialogClose = () => {
    setDateDialogOpen(false);
  };

  const handleDateDialogConfirm = () => {
    if (startDate && endDate) {
      // Formatear las fechas en formato ISO
      const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      
      // Actualizar el state de Redux
      dispatch(setCustomDateRange({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }));
      dispatch(setCarrierCustomDateRange({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }));
      dispatch(setCustomerCustomDateRange({
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }));
      
      // Establecer el rango de tiempo como personalizado
      dispatch(setTimeRange('custom'));
      dispatch(setCarrierTimeRange('custom'))
      dispatch(setCustomerTimeRange('custom'))
    }
    setDateDialogOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} color="default" component="header">
        <Toolbar sx={{ px: 3 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mr: 0.5 }}>
              T1
            </Typography>
            <Typography variant="h6" color="text.primary" fontWeight="semibold">
              Envíos
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 20 }} />
            <Typography variant="body1" color="text.secondary">
              Dashboard Ejecutivo
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Selector de rango de tiempo */}
            <ButtonGroup 
              variant="outlined" 
              size="small" 
              sx={{ 
                backgroundColor: 'grey.100', 
                borderRadius: 2,
                '& .MuiButtonGroup-grouped': {
                  borderColor: 'transparent',
                  minWidth: '60px'
                }
              }}
            >
              <Button 
                onClick={() => handleTimeRangeChange('1d')}
                variant={timeRange === '1d' ? 'contained' : 'outlined'}
                color={timeRange === '1d' ? 'primary' : 'inherit'}
                sx={{ 
                  boxShadow: timeRange === '1d' ? 1 : 0, 
                  color: timeRange === '1d' ? 'primary.main' : 'text.secondary',
                  bgcolor: timeRange === '1d' ? 'white' : 'transparent'
                }}
              >
                Hoy
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('7d')}
                variant={timeRange === '7d' ? 'contained' : 'outlined'}
                color={timeRange === '7d' ? 'primary' : 'inherit'}
                sx={{ 
                  boxShadow: timeRange === '7d' ? 1 : 0, 
                  color: timeRange === '7d' ? 'primary.main' : 'text.secondary',
                  bgcolor: timeRange === '7d' ? 'white' : 'transparent'
                }}
              >
                7 días
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('30d')}
                variant={timeRange === '30d' ? 'contained' : 'outlined'}
                color={timeRange === '30d' ? 'primary' : 'inherit'}
                sx={{ 
                  boxShadow: timeRange === '30d' ? 1 : 0, 
                  color: timeRange === '30d' ? 'primary.main' : 'text.secondary',
                  bgcolor: timeRange === '30d' ? 'white' : 'transparent'
                }}
              >
                30 días
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('custom')}
                variant={timeRange === 'custom' ? 'contained' : 'outlined'}
                color={timeRange === 'custom' ? 'primary' : 'inherit'}
                startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                sx={{ 
                  boxShadow: timeRange === 'custom' ? 1 : 0, 
                  color: timeRange === 'custom' ? 'primary.main' : 'text.secondary',
                  bgcolor: timeRange === 'custom' ? 'white' : 'transparent'
                }}
              >
                Personalizado
              </Button>
            </ButtonGroup>
            
            {/* Switch de comparación */}
            <FormControlLabel
              control={
                <Switch 
                  size="small"
                  checked={comparisonEnabled}
                  onChange={handleComparisonToggle}
                  color="primary"
                />
              }
              label={<Typography variant="body2">Comparar</Typography>}
              sx={{ ml: 1 }}
            />

            {/* Iconos de acciones */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Notificaciones">
                <IconButton size="small" color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Configuración">
                <IconButton size="small" color="inherit">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              
              {/* Menú de usuario */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  ml: 1, 
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'grey.100' },
                  p: 0.5
                }}
                onClick={handleUserMenuClick}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main', 
                    fontSize: 14 
                  }}
                >
                  A
                </Avatar>
                <Typography variant="body2" fontWeight="medium" sx={{ ml: 1 }}>
                  Admin
                </Typography>
                <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Box>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      
      {/* Menú de usuario */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleUserMenuClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>Mi Perfil</MenuItem>
        <MenuItem onClick={handleUserMenuClose}>Configuración</MenuItem>
        <MenuItem onClick={handleUserMenuClose}>Cerrar Sesión</MenuItem>
      </Menu>
      
      {/* Diálogo para selección de fecha personalizada */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Dialog 
          open={dateDialogOpen} 
          onClose={handleDateDialogClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Selecciona el rango de fechas</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <DatePicker
                label="Fecha de inicio"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
              <DatePicker
                label="Fecha de fin"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined'
                  }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDateDialogClose}>Cancelar</Button>
            <Button 
              onClick={handleDateDialogConfirm} 
              variant="contained" 
              disabled={!startDate || !endDate}
            >
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}
