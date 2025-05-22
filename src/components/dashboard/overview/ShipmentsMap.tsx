// src/components/dashboard/overview/ShipmentsMap.tsx
'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Stack, 
  Tabs, 
  Tab, 
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import MapIcon from '@mui/icons-material/Map';
import GridViewIcon from '@mui/icons-material/GridView';
import CardComponent from '@/components/common/CardComponent';
import { GeographicData } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';
import dynamic from 'next/dynamic';

// Redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setMapView, setMapViewType } from '@/redux/features/dashboardSlice';

// Importar el componente Leaflet de forma dinámica para evitar problemas de SSR
const LeafletMap = dynamic(
  () => import('./LeafletMap').then(mod => ({ default: mod.LeafletMap })),
  { 
    ssr: false,
    loading: () => (
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          background: '#f5f5f5',
          borderRadius: 1
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Cargando mapa interactivo...
        </Typography>
      </Box>
    )
  }
);

// Interfaces para TypeScript
interface MexicoHeatMapProps {
  data: { state: string; volume: number; incidents: number }[];
  mapView: 'volume' | 'incidents';
}

interface RegionData {
  state: string;
  volume: number;
  incidents: number;
}

// Componente para el mapa de calor SVG (original)
const MexicoHeatMap = ({ data, mapView }: MexicoHeatMapProps) => {
  // Simular un mapa con estados interactivos
  const regions = [
    { id: 'MEX', name: 'México', x: 45, y: 55, w: 10, h: 10 },
    { id: 'JAL', name: 'Jalisco', x: 30, y: 50, w: 12, h: 12 },
    { id: 'NL', name: 'Nuevo León', x: 60, y: 30, w: 14, h: 14 },
    { id: 'CDMX', name: 'Ciudad de México', x: 50, y: 60, w: 8, h: 8 },
    { id: 'PUE', name: 'Puebla', x: 55, y: 65, w: 9, h: 9 },
    { id: 'SON', name: 'Sonora', x: 20, y: 20, w: 15, h: 15 },
    { id: 'GTO', name: 'Guanajuato', x: 40, y: 45, w: 10, h: 10 },
  ];

  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  const getRegionData = (regionName: string): RegionData => {
    return data.find((item: RegionData) => item.state.toLowerCase().includes(regionName.toLowerCase())) || 
           { state: regionName, volume: 0, incidents: 0 };
  };
  
  const getColor = (regionName: string): string => {
    const regionData = getRegionData(regionName);
    const value: number = mapView === 'volume' ? regionData.volume : regionData.incidents;
    
    // Calcular el color basado en la intensidad del valor
    const maxValue: number = Math.max(...data.map((d: { volume: number; incidents: number }) => mapView === 'volume' ? d.volume : d.incidents));
    const intensity: number = value / (maxValue || 1); // Evitar división por cero
    
    // Color azul con opacidad variable
    return `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`;
  };
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Fondo del mapa */}
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <rect x="0" y="0" width="100" height="100" fill="#E5F3FF" rx="4" />
        
        {/* Regiones del mapa */}
        {regions.map(region => {
          const regionData = getRegionData(region.name);
          const fillColor = getColor(region.name);
          
          return (
            <g
              key={region.id}
              onMouseEnter={() => setActiveRegion(region.id)}
              onMouseLeave={() => setActiveRegion(null)}
              style={{ cursor: 'pointer' }}
            >
              <title>
                {region.name} - {mapView === 'volume' ? 'Volumen: ' : 'Incidencias: '}
                {formatNumber(mapView === 'volume' ? regionData.volume : regionData.incidents)}
              </title>
              <rect
                x={region.x}
                y={region.y}
                width={region.w}
                height={region.h}
                fill={fillColor}
                stroke={activeRegion === region.id ? "#3B82F6" : "white"}
                strokeWidth={activeRegion === region.id ? 2 : 1}
                rx="2"
              />
              <text
                x={region.x + region.w/2}
                y={region.y + region.h/2 + 1}
                textAnchor="middle"
                fontSize="4"
                fill="#1F2937"
                fontWeight={activeRegion === region.id ? "bold" : "normal"}
              >
                {region.id}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Leyenda */}
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        background: 'white', 
        padding: '5px', 
        borderRadius: '4px',
        fontSize: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(59, 130, 246, 0.2)', marginRight: '4px' }}></div>
          <span>Bajo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(59, 130, 246, 0.5)', marginRight: '4px' }}></div>
          <span>Medio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(59, 130, 246, 0.9)', marginRight: '4px' }}></div>
          <span>Alto</span>
        </div>
      </div>
    </div>
  );
};

interface ShipmentsMapProps {
  mapData: GeographicData;
}

export default function ShipmentsMap({ mapData }: ShipmentsMapProps) {
  const dispatch = useAppDispatch();
  const { mapView, mapViewType } = useAppSelector(state => state.dashboard);
  
  // Estado local para alternar entre vista SVG y Leaflet
  const [useLeafletMap, setUseLeafletMap] = useState(false);

  // Manejador para cambiar entre volumen e incidencias
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'volume' | 'incidents' | null,
  ) => {
    if (newView !== null) {
      dispatch(setMapView(newView));
    }
  };

  // Manejador para cambiar entre origen y destino
  const handleViewTypeChange = (
    event: React.SyntheticEvent, 
    newViewType: 'origin' | 'destination',
  ) => {
    dispatch(setMapViewType(newViewType));
  };

  // Manejador para cambiar tipo de mapa
  const handleMapTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseLeafletMap(event.target.checked);
  };

  // Seleccionar los datos correctos según el tipo de vista (origen o destino)
  const currentMapData = mapViewType === 'destination' ? mapData.destination : mapData.origin;

  // Ordenar estados por volumen o incidencias según la vista
  const sortedData = [...currentMapData].sort((a, b) => {
    if (mapView === 'volume') {
      return b.volume - a.volume;
    }
    return b.incidents - a.incidents;
  });

  // Componente de acciones para la tarjeta
  const mapActions = (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* Switch para cambiar tipo de mapa */}
      <FormControlLabel
        control={
          <Switch
            checked={useLeafletMap}
            onChange={handleMapTypeChange}
            size="small"
          />
        }
        label={
          <Tooltip title={useLeafletMap ? "Cambiar a vista simple" : "Cambiar a mapa interactivo"}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {useLeafletMap ? <MapIcon fontSize="small" /> : <GridViewIcon fontSize="small" />}
              <Typography variant="caption">
                {useLeafletMap ? "Interactivo" : "Simple"}
              </Typography>
            </Box>
          </Tooltip>
        }
        sx={{ 
          mr: 2,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.75rem'
          }
        }}
      />
      
      {/* Toggle buttons para volumen/incidencias */}
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
    </Stack>
  );

  return (
    <CardComponent 
      title="Mapa de Envíos" 
      // actions={mapActions}
      height={useLeafletMap ? 500 : 380}
    >
      <Stack direction="column" sx={{ height: '100%' }}>
        {/* Pestañas para cambiar entre origen y destino */}
        <Tabs
          value={mapViewType}
          onChange={handleViewTypeChange}
          aria-label="origin-destination-tabs"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            value="origin" 
            label="Origen" 
            icon={<FlightTakeoffIcon fontSize="small" />} 
            iconPosition="start"
            sx={{ 
              textTransform: 'none', 
              minWidth: 'auto',
              fontSize: '0.875rem',
            }}
          />
          <Tab 
            value="destination" 
            label="Destino" 
            icon={<FlightLandIcon fontSize="small" />} 
            iconPosition="start"
            sx={{ 
              textTransform: 'none', 
              minWidth: 'auto',
              fontSize: '0.875rem',
            }}
          />
        </Tabs>
        
        <Stack direction="row" sx={{ height: 'calc(100% - 48px)' }}>
          {/* Lado izquierdo - Mapa */}
          <Box sx={{ width: useLeafletMap ? '70%' : '65%', height: '100%' }}>
            {useLeafletMap ? (
              <LeafletMap data={currentMapData} mapView={mapView} />
            ) : (
              <MexicoHeatMap data={currentMapData} mapView={mapView} />
            )}
          </Box>
          
          {/* Lado derecho - Lista de estados */}
          <Box sx={{ width: useLeafletMap ? '30%' : '35%', pl: 3, overflow: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Top Estados ({mapViewType === 'destination' ? 'Destino' : 'Origen'})
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', pl: 0, mt: 2 }}>
              {sortedData.slice(0, useLeafletMap ? 8 : 5).map((state, index) => (
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
        </Stack>
      </Stack>
    </CardComponent>
  );
}