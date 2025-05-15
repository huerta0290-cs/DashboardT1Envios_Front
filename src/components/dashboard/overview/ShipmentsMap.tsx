'use client';

import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';
import { LocationOn as MapPinIcon } from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';
import { MapData } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';

interface ShipmentsMapProps {
  mapData: MapData[];
  mapView: 'volume' | 'incidents';
  setMapView: (view: 'volume' | 'incidents') => void;
}

export default function ShipmentsMap({ 
  mapData, 
  mapView, 
  setMapView 
}: ShipmentsMapProps) {
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'volume' | 'incidents',
  ) => {
    if (newView !== null) {
      setMapView(newView);
    }
  };

  // Ordenar estados por volumen o incidencias según la vista
  const sortedData = [...mapData].sort((a, b) => {
    if (mapView === 'volume') {
      return b.volume - a.volume;
    }
    return b.incidents - a.incidents;
  });

  // Componente de acciones para la tarjeta
  const mapActions = (
    <ToggleButtonGroup
      value={mapView}
      exclusive
      onChange={handleViewChange}
      size="small"
      sx={{
        '& .MuiToggleButtonGroup-grouped': {
          fontSize: '0.75rem',
          textTransform: 'none',
        },
      }}
    >
      <ToggleButton value="volume" aria-label="Volumen">
        Volumen
      </ToggleButton>
      <ToggleButton value="incidents" aria-label="Incidencias">
        Incidencias
      </ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <CardComponent 
      title="Mapa de Envíos" 
      actions={mapActions}
      height={380}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Lado izquierdo - Mapa */}
        <Box 
          sx={{ 
            width: '65%', 
            height: '100%', 
            bgcolor: 'primary.light', 
            opacity: 0.1,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MapPinIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Mapa de México con zonas de calor mostrando {mapView === 'volume' ? 'volumen de envíos' : 'incidencias'}
          </Typography>
        </Box>
        
        {/* Lado derecho - Lista de estados */}
        <Box sx={{ width: '35%', pl: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Top Estados
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', pl: 0, mt: 2 }}>
            {sortedData.slice(0, 5).map((state, index) => (
              <Box 
                component="li" 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none',
                  }
                }}
              >
                <Typography variant="body2" color="text.primary">
                  {state.state}
                </Typography>
                <Typography variant="subtitle2">
                  {formatNumber(mapView === 'volume' ? state.volume : state.incidents)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </CardComponent>
  );
}