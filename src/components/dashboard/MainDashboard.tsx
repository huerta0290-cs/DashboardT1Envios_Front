'use client';

import { Box, Alert } from '@mui/material';
import { useDashboard } from '@/utils/dashboard-hooks';
import OverviewTab from './tabs/OverviewTab';
import CarriersTab from './tabs/CarriersTab';
import CustomersTab from './tabs/CustomersTab';
import FinancesTab from './tabs/FinancesTab';
import IncidentsTab from './tabs/IncidentsTab';
import ErrorState from './ErrorState';

export default function MainDashboard() {
  const { 
    activeTab, 
    data, 
    error, 
    refreshDashboard 
  } = useDashboard();
  
  // Si hay un error y no hay datos, mostrar estado de error
  if (error && !data) {
    return <ErrorState 
      message={error.message} 
      code={error.code} 
      onRetry={refreshDashboard} 
    />;
  }
  
  // Si no hay datos (y no estamos manejando un error), no renderizar nada
  if (!data) {
    return null;
  }

  // Renderizar la pestaña activa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data} />;
      case 'carriers':
        return <CarriersTab />;
      case 'customers':
        return <CustomersTab />;
      case 'finances':
        return <FinancesTab data={data} />;
      case 'incidents':
        return <IncidentsTab data={data} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Mostrar alerta cuando estamos usando datos de muestra */}
      {error?.usingMockData && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          onClose={refreshDashboard}
        >
          Los datos mostrados son de prueba. Ocurrió un error al obtener los datos reales: {error.message}
        </Alert>
      )}
      
      {renderActiveTab()}
    </Box>
  );
}
