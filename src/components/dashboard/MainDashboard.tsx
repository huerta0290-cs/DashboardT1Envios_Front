// src/components/dashboard/MainDashboard.tsx
'use client';

import { Box, Typography, Stack } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import OverviewTab from './tabs/OverviewTab';

// Importa los demás componentes de pestaña cuando sean necesarios
import CarriersTab from './tabs/CarriersTab';
import CustomersTab from './tabs/CustomersTab';
// import FinancesTab from './tabs/FinancesTab';
// import IncidentsTab from './tabs/IncidentsTab';

export default function MainDashboard() {
  const { activeTab, data } = useAppSelector(state => state.dashboard);
  
  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No hay datos disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Por favor, intenta cambiar el rango de tiempo o verifica tu conexión
        </Typography>
      </Box>
    );
  }

  // Renderizar la pestaña activa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data} />;
      case 'carriers':
        return <CarriersTab />;
      case 'customers':
        return <CustomersTab />
      case 'finances':
        // Placeholder, se implementará después
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Vista de Finanzas</Typography>
            <Typography variant="body1" color="text.secondary">
              Esta sección se implementará en la siguiente fase
            </Typography>
          </Box>
        );
      case 'incidents':
        // Placeholder, se implementará después
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Vista de Incidencias</Typography>
            <Typography variant="body1" color="text.secondary">
              Esta sección se implementará en la siguiente fase
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {renderActiveTab()}
    </Box>
  );
}
