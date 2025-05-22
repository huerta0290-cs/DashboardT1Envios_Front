// src/services/auth.ts
/**
 * Servicio para gestionar la autenticación y los tokens
 * Esta es una implementación básica que más adelante se integrará con Keycloak
 */

// Credenciales de desarrollo (solo para desarrollo local)
const DEV_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_DEV_USERNAME,
  password: process.env.NEXT_PUBLIC_DEV_PASSWORD
};

// Credenciales adicionales permitidas
const ALLOWED_CREDENTIALS = [
  { username: 'admin', password: 't1Envi05', role: 'Dashboard Admin', name: 'Administrador' },
  // { username: 'supervisor', password: 'super123', role: 'Supervisor', name: 'Supervisor' },
  // { username: 'viewer', password: 'view123', role: 'Viewer', name: 'Usuario Viewer' }
];

// Clave para almacenar información del usuario
const USER_INFO_KEY = 'user_info';

export interface UserInfo {
  username: string;
  name: string;
  email: string;
  role: string;
  loginTime: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UserInfo;
  error?: string;
}

// Clave para almacenar el token en localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Duración del token en minutos (por defecto 8 horas)
const DEFAULT_TOKEN_DURATION = 8 * 60; // 480 minutos

export interface TokenInfo {
  token: string;
  expiresAt: number;
  isExpired: boolean;
}

// Almacenamiento del token en localStorage
export const getAuthToken = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Primero intentamos obtener el token del localStorage
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  // Verificar si el token ha expirado
  if (token && expiryTime) {
    const now = Date.now();
    const expiry = parseInt(expiryTime);
    
    if (now > expiry) {
      // Token expirado, limpiar localStorage
      removeAuthToken();
      return '';
    }
    
    return token;
  }
  
  // Solo retornamos el token que está almacenado, NO auto-configuramos el token de desarrollo
  return token || '';
};

// Obtener información completa del token
export const getTokenInfo = (): TokenInfo | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiryTime) {
    return null;
  }
  
  const expiresAt = parseInt(expiryTime);
  const isExpired = Date.now() > expiresAt;
  
  return {
    token,
    expiresAt,
    isExpired
  };
};

// Guardar el token en localStorage con tiempo de expiración
export const setAuthToken = (token: string, durationMinutes?: number): void => {
  if (typeof window !== 'undefined') {
    const duration = durationMinutes || DEFAULT_TOKEN_DURATION;
    const expiryTime = Date.now() + (duration * 60 * 1000); // Convertir minutos a milliseconds
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    console.log(`Token almacenado. Expira en: ${new Date(expiryTime).toLocaleString()}`);
  }
};

// Eliminar el token y información del usuario (cerrar sesión)
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    console.log('Sesión cerrada - datos removidos del almacenamiento local');
  }
};

// Verificar si hay un token válido (usuario autenticado)
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Verificar si el token está próximo a expirar (dentro de los próximos 30 minutos)
export const isTokenNearExpiry = (minutesThreshold: number = 30): boolean => {
  const tokenInfo = getTokenInfo();
  
  if (!tokenInfo || tokenInfo.isExpired) {
    return false;
  }
  
  const timeUntilExpiry = tokenInfo.expiresAt - Date.now();
  const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);
  
  return minutesUntilExpiry <= minutesThreshold;
};

// Obtener tiempo restante hasta la expiración del token
export const getTimeUntilExpiry = (): { minutes: number; hours: number } | null => {
  const tokenInfo = getTokenInfo();
  
  if (!tokenInfo || tokenInfo.isExpired) {
    return null;
  }
  
  const timeUntilExpiry = tokenInfo.expiresAt - Date.now();
  const totalMinutes = Math.floor(timeUntilExpiry / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { minutes, hours };
};

// Función para validar el formato del token (básica)
export const validateTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Validaciones básicas del token
  if (token.length < 8) {
    return false;
  }
  
  // En un entorno real, aquí harías validaciones más específicas
  // como verificar si es un JWT válido, etc.
  
  return true;
};

// Función para refrescar el token (stub para futura implementación con Keycloak)
export const refreshToken = async (): Promise<string | null> => {
  // Esta función será implementada cuando se integre Keycloak
  // Por ahora, simplemente devuelve el token actual o null
  
  const currentToken = getAuthToken();
  if (!currentToken) {
    return null;
  }
  
  try {
    // Aquí iría la lógica para refrescar el token con Keycloak
    // const response = await keycloakClient.refreshToken();
    // setAuthToken(response.access_token, response.expires_in / 60);
    // return response.access_token;
    
    // Por ahora, extender la validez del token actual
    if (process.env.NODE_ENV === 'development') {
      setAuthToken(currentToken, DEFAULT_TOKEN_DURATION);
      console.log('Token renovado (modo desarrollo)');
      return currentToken;
    }
    
    return currentToken;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    removeAuthToken();
    return null;
  }
};

// Función para decodificar información básica del token (simulada)
export const decodeToken = (token?: string): any => {
  const tokenToUse = token || getAuthToken();
  
  if (!tokenToUse) {
    return null;
  }
  
  // En un entorno real, esto decodificaría un JWT
  // Por ahora, devolvemos la información del usuario almacenada
  const userInfo = getUserInfo();
  
  if (userInfo) {
    return {
      sub: `user-${userInfo.username}`,
      name: userInfo.name,
      email: userInfo.email,
      username: userInfo.username,
      roles: [userInfo.role.toLowerCase().replace(' ', '-')],
      exp: Math.floor(Date.now() / 1000) + (DEFAULT_TOKEN_DURATION * 60),
      iat: Math.floor(userInfo.loginTime / 1000)
    };
  }
  
  // Aquí iría la lógica real de decodificación JWT
  try {
    // const decoded = jwt.decode(tokenToUse);
    // return decoded;
    return null;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

// Función para autenticar con credenciales locales
export const authenticateUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    // Simular demora de red
    setTimeout(() => {
      const { username, password } = credentials;
      
      // Buscar usuario en credenciales permitidas
      const user = ALLOWED_CREDENTIALS.find(
        cred => cred.username.toLowerCase() === username.toLowerCase() && cred.password === password
      );
      
      if (user) {
        // Generar token simulado
        const token = `auth_${user.username}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Información del usuario
        const userInfo: UserInfo = {
          username: user.username,
          name: user.name,
          email: `${user.username}@t1envios.com`,
          role: user.role,
          loginTime: Date.now()
        };
        
        // Guardar token y usuario
        setAuthToken(token);
        setUserInfo(userInfo);
        
        resolve({
          success: true,
          token,
          user: userInfo
        });
      } else {
        resolve({
          success: false,
          error: 'Usuario o contraseña incorrectos'
        });
      }
    }, 1000); // Simular 1 segundo de demora
  });
};

// Guardar información del usuario
export const setUserInfo = (userInfo: UserInfo): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }
};

// Obtener información del usuario
export const getUserInfo = (): UserInfo | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  if (!userInfoStr) {
    return null;
  }
  
  try {
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

// Obtener lista de usuarios disponibles (solo para desarrollo)
export const getAvailableUsers = (): Array<{username: string, role: string, name: string}> => {
  if (process.env.NODE_ENV === 'development') {
    return ALLOWED_CREDENTIALS.map(cred => ({
      username: cred.username,
      role: cred.role,
      name: cred.name
    }));
  }
  return [];
};

// Event listener para detectar cambios en localStorage (útil para logout en múltiples pestañas)
export const setupStorageListener = (onTokenChange: () => void): (() => void) | void => {
  if (typeof window !== 'undefined') {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) {
        onTokenChange();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Retornar función cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};