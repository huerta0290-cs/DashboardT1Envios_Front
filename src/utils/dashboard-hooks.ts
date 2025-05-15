// src/utils/dashboard-hooks.ts
'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDashboardData, 
  fetchCarriersData,
  setTimeRange, 
  setActiveTab, 
  setComparisonEnabled, 
  setSelectedCarrier, 
  setMapView,
  setCustomDateRange,
  clearError
} from '@/redux/features/dashboardSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import type { DashboardState } from '@/redux/features/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardState = useSelector<RootState, DashboardState>((state) => state.dashboard);
  const prevTimeRangeRef = useRef(dashboardState.timeRange);
  const isInitialMount = useRef(true);
  
  // Cargar los datos del dashboard cuando cambia el rango de tiempo
  useEffect(() => {
    // Si es el montaje inicial o si realmente cambió el timeRange
    if (isInitialMount.current || prevTimeRangeRef.current !== dashboardState.timeRange) {
      dispatch(fetchDashboardData(dashboardState.timeRange));
      prevTimeRangeRef.current = dashboardState.timeRange;
    }
    
    // Después del primer render, ya no es montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [dashboardState.timeRange]); // Quitamos dispatch de las dependencias

  // Función para actualizar datos del dashboard
  const refreshDashboard = useCallback(() => {
    dispatch(fetchDashboardData(dashboardState.timeRange));
  }, [dispatch, dashboardState.timeRange]);

  // Función para cargar datos de transportistas
  const loadCarriersData = useCallback((carrierId?: string) => {
    dispatch(fetchCarriersData({ 
      timeRange: dashboardState.timeRange,
      carrierId 
    }));
  }, [dispatch, dashboardState.timeRange]);

  // Función para cambiar el rango de tiempo
  const updateTimeRange = useCallback((range: '1d' | '7d' | '30d' | 'custom') => {
    // Solo actualizamos si es diferente
    if (range !== dashboardState.timeRange) {
      dispatch(setTimeRange(range));
    }
  }, [dispatch, dashboardState.timeRange]);

  // Resto de funciones
  const updateActiveTab = useCallback((tab: 'overview' | 'carriers' | 'customers' | 'finances' | 'incidents') => {
    dispatch(setActiveTab(tab));
  }, [dispatch]);

  const toggleComparison = useCallback((enabled: boolean) => {
    dispatch(setComparisonEnabled(enabled));
  }, [dispatch]);

  const updateSelectedCarrier = useCallback((carrier: string) => {
    dispatch(setSelectedCarrier(carrier));
  }, [dispatch]);

  const updateMapView = useCallback((view: 'volume' | 'incidents') => {
    dispatch(setMapView(view));
  }, [dispatch]);

  const setDateRange = useCallback((fromDate: string, toDate: string) => {
    dispatch(setCustomDateRange({ fromDate, toDate }));
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...dashboardState,
    refreshDashboard,
    loadCarriersData,
    updateTimeRange,
    updateActiveTab,
    toggleComparison,
    updateSelectedCarrier,
    updateMapView,
    setDateRange,
    handleClearError
  };
};