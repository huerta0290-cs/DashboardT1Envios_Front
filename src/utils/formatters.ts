// src/utils/formatters.ts
/**
 * Formatea un número como moneda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-MX').format(value);
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercent = (value: number, digits: number = 1): string => {
  return `${value.toFixed(digits)}%`;
};

/**
 * Obtiene la clase de color según el tipo de variación
 */
export const getChangeColorClass = (value: number, isInverted: boolean = false): string => {
  if (value === 0) return 'text-gray-500';
  
  if (isInverted) {
    return value > 0 ? 'text-red-500' : 'text-green-500';
  }
  
  return value > 0 ? 'text-green-500' : 'text-red-500';
};

/**
 * Obtiene la clase de color por rango
 */
export const getRangeColorClass = (value: number, thresholds: { low: number, medium: number, inverted?: boolean }): string => {
  const { low, medium, inverted = false } = thresholds;
  
  if (inverted) {
    if (value < low) return 'text-green-600';
    if (value < medium) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  if (value > medium) return 'text-green-600';
  if (value > low) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Formatea una fecha
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Formatea un rango de tiempo para mostrar en la UI
 */
export const formatTimeRange = (timeRange: string, startDate?: string, endDate?: string): string => {
  switch (timeRange) {
    case '1d':
      return 'Hoy';
    case '7d':
      return 'Últimos 7 días';
    case '30d':
      return 'Últimos 30 días';
    case 'custom':
      if (startDate && endDate) {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }
      return 'Rango personalizado';
    default:
      return 'Período seleccionado';
  }
};
