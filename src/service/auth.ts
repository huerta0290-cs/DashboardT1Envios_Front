// src/services/auth.ts
/**
 * Servicio para gestionar la autenticación y los tokens
 * Esta es una implementación básica que más adelante se integrará con Keycloak
 */

// Token de prueba (solo para desarrollo)
const DEV_TOKEN = process.env.NEXT_PUBLIC_DEV_AUTH_TOKEN || 'dasffasfaasd';

// Almacenamiento del token en localStorage
export const getAuthToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Primero intentamos obtener el token del localStorage
  const token = localStorage.getItem('auth_token');
  
  // Si no hay token en localStorage y estamos en desarrollo, usamos el token de prueba
  if (!token && process.env.NODE_ENV === 'development') {
    if (DEV_TOKEN) {
      localStorage.setItem('auth_token', DEV_TOKEN);
      return DEV_TOKEN;
    }
  }
  
  return token || '';
};

// Guardar el token en localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Eliminar el token (cerrar sesión)
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Verificar si hay un token (usuario autenticado)
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Función para refrescar el token (stub para futura implementación con Keycloak)
export const refreshToken = async (): Promise<string | null> => {
  // Esta función será implementada cuando se integre Keycloak
  // Por ahora, simplemente devuelve el token actual o null
  
  const currentToken = getAuthToken();
  if (!currentToken) {
    return null;
  }
  
  // Aquí iría la lógica para refrescar el token
  return currentToken;
};
