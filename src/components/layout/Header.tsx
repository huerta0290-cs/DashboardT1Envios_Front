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
  Stack,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon, 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarMonth as CalendarMonthIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useDashboard } from '@/utils/dashboard-hooks';
import DateRangePicker from '@/components/common/DateRangePicker';
import { format } from 'date-fns';
import { es as esLocale } from 'date-fns/locale';

export default function Header() {
  const { 
    timeRange, 
    updateTimeRange, 
    comparisonEnabled, 
    toggleComparison,
    refreshDashboard,
    customDateRange,
    setDateRange
  } = useDashboard();
  
  // Estado para el diálogo de rango de fechas
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Estado para menú de usuario
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Texto para mostrar cuando se selecciona un rango personalizado
  const getCustomRangeText = () => {
    if (customDateRange.fromDate && customDateRange.toDate) {
      const fromDate = new Date(customDateRange.fromDate);
      const toDate = new Date(customDateRange.toDate);
      return `${format(fromDate, 'dd MMM', { locale: esLocale })} - ${format(toDate, 'dd MMM', { locale: esLocale })}`;
    }
    return "Personalizado";
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
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
          
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Botón de actualizar */}
            <Tooltip title="Actualizar datos">
              <IconButton 
                size="small" 
                onClick={refreshDashboard}
                sx={{ bgcolor: 'grey.100' }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Selector de rango de tiempo */}
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                bgcolor: 'grey.100', 
                borderRadius: 2,
                p: 0.5
              }}
            >
              <Button 
                onClick={() => updateTimeRange('1d')}
                variant={timeRange === '1d' ? 'contained' : 'text'}
                color={timeRange === '1d' ? 'primary' : 'inherit'}
                size="small"
                sx={{ 
                  boxShadow: timeRange === '1d' ? 1 : 0, 
                  minWidth: '60px',
                  color: timeRange === '1d' ? 'white' : 'text.secondary',
                }}
              >
                Hoy
              </Button>
              <Button 
                onClick={() => updateTimeRange('7d')}
                variant={timeRange === '7d' ? 'contained' : 'text'}
                color={timeRange === '7d' ? 'primary' : 'inherit'}
                size="small"
                sx={{ 
                  boxShadow: timeRange === '7d' ? 1 : 0, 
                  minWidth: '60px',
                  color: timeRange === '7d' ? 'white' : 'text.secondary',
                }}
              >
                7 días
              </Button>
              <Button 
                onClick={() => updateTimeRange('30d')}
                variant={timeRange === '30d' ? 'contained' : 'text'}
                color={timeRange === '30d' ? 'primary' : 'inherit'}
                size="small"
                sx={{ 
                  boxShadow: timeRange === '30d' ? 1 : 0, 
                  minWidth: '60px',
                  color: timeRange === '30d' ? 'white' : 'text.secondary',
                }}
              >
                30 días
              </Button>
              <Button 
                onClick={() => setDatePickerOpen(true)}
                variant={timeRange === 'custom' ? 'contained' : 'text'}
                color={timeRange === 'custom' ? 'primary' : 'inherit'}
                size="small"
                startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                sx={{ 
                  boxShadow: timeRange === 'custom' ? 1 : 0, 
                  color: timeRange === 'custom' ? 'white' : 'text.secondary',
                }}
              >
                {timeRange === 'custom' ? getCustomRangeText() : "Personalizado"}
              </Button>
            </Stack>
            
            {/* Switch de comparación */}
            <FormControlLabel
              control={
                <Switch 
                  size="small"
                  checked={comparisonEnabled}
                  onChange={(e) => toggleComparison(e.target.checked)}
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
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'user-menu-button',
                }}
              >
                <MenuItem onClick={handleClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleClose}>Configuración</MenuItem>
                <MenuItem onClick={handleClose}>Cerrar Sesión</MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Diálogo de selección de rango de fechas */}
      <DateRangePicker
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        onApply={(fromDate, toDate) => {
          setDateRange(fromDate, toDate);
          updateTimeRange('custom');
        }}
        initialFromDate={customDateRange.fromDate}
        initialToDate={customDateRange.toDate}
      />
    </>
  );
}
