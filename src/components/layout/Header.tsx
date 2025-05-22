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
  DialogContentText,
  Stack,
  Chip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon, 
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarMonth as CalendarMonthIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTimeRange, setComparisonEnabled } from '@/redux/features/dashboardSlice';
import { removeAuthToken, getUserInfo } from '../../service/auth';

export default function Header() {
  const dispatch = useAppDispatch();
  const { timeRange, comparisonEnabled } = useAppSelector(state => state.dashboard);
  
  // Estados locales
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const open = Boolean(anchorEl);
  
  // Obtener información del usuario
  const userInfo = getUserInfo() || {
    name: 'Usuario',
    email: 'usuario@t1envios.com',
    role: 'Usuario'
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (newRange: '1d' | '7d' | '30d' | 'custom') => {
    dispatch(setTimeRange(newRange));
  };

  const handleComparisonToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setComparisonEnabled(event.target.checked));
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    // Limpiar token y storage
    removeAuthToken();
    setShowLogoutDialog(false);
    
    // Forzar recarga completa de la página para limpiar todo el estado
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  // Obtener las primeras letras del nombre para el avatar
  const getAvatarLetters = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: 3 }}>
          {/* Logo y Título */}
          <Stack direction="row" alignItems="center">
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
          </Stack>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Controles del Dashboard */}
          <Stack direction="row" alignItems="center" spacing={3}>
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
            <Stack direction="row" alignItems="center" spacing={1}>
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
                  {getAvatarLetters(userInfo.name)}
                </Avatar>
                <Stack direction="column" sx={{ ml: 1, alignItems: 'flex-start' }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ lineHeight: 1 }}>
                    {userInfo.name}
                  </Typography>
                  <Chip 
                    label={userInfo.role} 
                    size="small" 
                    sx={{ 
                      height: 16, 
                      fontSize: '0.65rem',
                      bgcolor: 'primary.light',
                      color: 'primary.main'
                    }} 
                  />
                </Stack>
                <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
              </Box>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menú desplegable del usuario */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 200,
            mt: 1
          }
        }}
      >
        {/* Información del usuario */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" fontWeight="medium">
            {userInfo.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userInfo.email}
          </Typography>
        </Box>
        
        <MenuItem onClick={handleClose}>
          <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <SettingsIcon sx={{ mr: 1, fontSize: 18 }} />
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
          <ExitToAppIcon sx={{ mr: 1, fontSize: 18 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Diálogo de confirmación de logout */}
      <Dialog
        open={showLogoutDialog}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea cerrar sesión? Tendrá que volver a autenticarse para acceder al dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}