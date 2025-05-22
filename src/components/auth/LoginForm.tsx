// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { 
  Box,
  Stack,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { authenticateUser, getAvailableUsers, type LoginCredentials } from '../../service/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
  error?: string;
}

export default function LoginForm({ onLoginSuccess, error }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim()) {
      setValidationError('Por favor ingrese su nombre de usuario');
      return;
    }
    
    if (!credentials.password.trim()) {
      setValidationError('Por favor ingrese su contraseña');
      return;
    }
    
    setIsLoading(true);
    setValidationError('');
    
    try {
      const result = await authenticateUser(credentials);
      
      if (result.success) {
        onLoginSuccess();
      } else {
        setValidationError(result.error || 'Error de autenticación');
      }
    } catch (err) {
      setValidationError('Error de conexión. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (validationError) {
      setValidationError('');
    }
  };

  // Función para usar credenciales de desarrollo
  const useTestCredentials = (username: string, password: string) => {
    setCredentials({ username, password });
  };

  // Obtener usuarios de prueba disponibles
  const availableUsers = getAvailableUsers();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        px: 2
      }}
    >
      <Card
        elevation={4}
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            {/* Logo y Título */}
            <Box sx={{ textAlign: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2
                }}
              >
                <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Paper>
              
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                T1 Envíos
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Dashboard Ejecutivo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Ingrese sus credenciales para acceder
              </Typography>
            </Box>

            {/* Alertas de Error */}
            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            {validationError && (
              <Alert severity="warning" sx={{ width: '100%' }}>
                {validationError}
              </Alert>
            )}

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Usuario"
                  type="text"
                  value={credentials.username}
                  onChange={handleCredentialChange('username')}
                  variant="outlined"
                  autoComplete="username"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleCredentialChange('password')}
                  variant="outlined"
                  autoComplete="current-password"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading || !credentials.username.trim() || !credentials.password.trim()}
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </Box>

            {/* Sección de Desarrollo */}
            {/* {process.env.NODE_ENV === 'development' && availableUsers.length > 0 && (
              <>
                <Divider sx={{ width: '100%', my: 2 }} />
                
                <Box sx={{ width: '100%' }}>
                  <Accordion elevation={0} sx={{ bgcolor: 'transparent' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        bgcolor: 'info.light',
                        borderRadius: 2,
                        mb: 1,
                        '&.Mui-expanded': {
                          borderRadius: '8px 8px 0 0'
                        }
                      }}
                    >
                      <Typography variant="body2" color="info.main" fontWeight="medium">
                        <strong>Modo Desarrollo:</strong> Usuarios de Prueba
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: 'grey.50', borderRadius: '0 0 8px 8px', p: 2 }}>
                      <List dense>
                        {availableUsers.map((user, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              bgcolor: 'white',
                              borderRadius: 1,
                              mb: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                            onClick={() => useTestCredentials(user.username, 'admin123')}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" fontWeight="medium">
                                    {user.name}
                                  </Typography>
                                  <Chip 
                                    label={user.role} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  Usuario: {user.username} | Contraseña: admin123
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </>
            )} */}

            {/* Información adicional */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                ¿Problemas para acceder? Contacte al administrador del sistema
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}