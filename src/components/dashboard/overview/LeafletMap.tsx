// src/components/dashboard/overview/LeafletMap.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Typography } from '@mui/material';
import { formatNumber } from '@/utils/formatters';
import chroma from 'chroma-js';
import L from 'leaflet';

// Importar estilos de Leaflet
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// GeoJSON simplificado de México por estados (puedes reemplazar con datos más precisos)
const mexicoStatesGeoJSON: GeoJSON.FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Ciudad de México", "code": "CDMX" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.3, 19.2], [-99.0, 19.2], [-99.0, 19.6], [-99.3, 19.6], [-99.3, 19.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "México", "code": "MEX" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-100.5, 18.5], [-98.5, 18.5], [-98.5, 20.5], [-100.5, 20.5], [-100.5, 18.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Jalisco", "code": "JAL" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-105.5, 19.0], [-102.5, 19.0], [-102.5, 22.0], [-105.5, 22.0], [-105.5, 19.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Veracruz", "code": "VER" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-98.5, 17.0], [-96.0, 17.0], [-96.0, 22.5], [-98.5, 22.5], [-98.5, 17.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Querétaro", "code": "QRO" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-100.8, 20.0], [-99.5, 20.0], [-99.5, 21.7], [-100.8, 21.7], [-100.8, 20.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Sinaloa", "code": "SIN" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-109.5, 22.5], [-105.5, 22.5], [-105.5, 26.9], [-109.5, 26.9], [-109.5, 22.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Nuevo León", "code": "NL" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-101.5, 24.0], [-99.0, 24.0], [-99.0, 27.8], [-101.5, 27.8], [-101.5, 24.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Puebla", "code": "PUE" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.0, 17.5], [-96.8, 17.5], [-96.8, 20.8], [-99.0, 20.8], [-99.0, 17.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Sonora", "code": "SON" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-115.0, 26.0], [-108.0, 26.0], [-108.0, 32.5], [-115.0, 32.5], [-115.0, 26.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Guanajuato", "code": "GTO" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-102.0, 19.8], [-99.6, 19.8], [-99.6, 21.8], [-102.0, 21.8], [-102.0, 19.8]]]
      }
    }
  ]
};

interface LeafletMapProps {
  data: { state: string; volume: number; incidents: number }[];
  mapView: 'volume' | 'incidents';
}

export const LeafletMap = ({ data, mapView }: LeafletMapProps) => {
  const [geoJsonKey, setGeoJsonKey] = useState(0);

  //Crear un mapa normalizado de los datos
  const dataMap = useMemo(() => {
    const map = new Map();
    data.forEach(item => {
      const normalizedName = normalizeStateName(item.state);
      map.set(normalizedName, item);
    });
    return map;
  }, [data]);

  // Función para normalizar nombres de estados
  const normalizeStateName = (name: string): string => {
    const normalized = name.toLowerCase().trim();
    const nameMap: { [key: string]: string } = {
      'ciudad de méxico': 'ciudad de méxico',
      'ciudad de mexico': 'ciudad de méxico',
      'cdmx': 'ciudad de méxico',
      'mexico': 'méxico',
      'méxico': 'méxico',
      'estado de mexico': 'méxico',
      'veracruz': 'veracruz',
      'jalisco': 'jalisco',
      'qro.': 'querétaro',
      'querétaro': 'querétaro',
      'sinaloa': 'sinaloa',
      'nuevo león': 'nuevo león',
      'nl': 'nuevo león',
      'puebla': 'puebla',
      'pue': 'puebla',
      'sonora': 'sonora',
      'son': 'sonora',
      'guanajuato': 'guanajuato',
      'gto': 'guanajuato'
    };
    return nameMap[normalized] || normalized;
  };

  // Calcular el valor máximo para la escala de colores
  const maxValue = useMemo(() => {
    const values = data.map(d => mapView === 'volume' ? d.volume : d.incidents);
    return Math.max(...values, 1); // Mínimo 1 para evitar división por cero
  }, [data, mapView]);

  // Crear escala de colores
  const colorScale = useMemo(() => {
    return chroma.scale(['#E5F3FF', '#3B82F6', '#1E40AF']).domain([0, maxValue]);
  }, [maxValue]);

  // Función para obtener el color de un estado
  const getStateColor = (stateName: string): string => {
    const normalizedName = normalizeStateName(stateName);
    const stateData = dataMap.get(normalizedName);
    
    if (!stateData) return '#E5F3FF';
    
    const value = mapView === 'volume' ? stateData.volume : stateData.incidents;
    return colorScale(value).toString();
  };

  // Función para obtener los datos de un estado
  const getStateData = (stateName: string) => {
    const normalizedName = normalizeStateName(stateName);
    return dataMap.get(normalizedName) || { state: stateName, volume: 0, incidents: 0 };
  };

  // Estilo para cada feature del GeoJSON
  const geoJsonStyle = (feature: any) => {
    const stateName = feature.properties.name;
    return {
      fillColor: getStateColor(stateName),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.7
    };
  };

  // Eventos del mouse para cada feature
  const onEachFeature = (feature: any, layer: any) => {
    const stateName = feature.properties.name;
    const stateData = getStateData(stateName);
    
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 4,
          color: '#3B82F6',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle(feature));
      }
    });

    // Popup con información
    layer.bindPopup(`
      <div style="text-align: center; font-family: 'Roboto', sans-serif;">
        <h4 style="margin: 0 0 8px 0; color: #1f2937;">${stateName}</h4>
        <p style="margin: 4px 0; color: #374151;"><strong>Volumen:</strong> ${formatNumber(stateData.volume)}</p>
        <p style="margin: 4px 0; color: #374151;"><strong>Incidencias:</strong> ${formatNumber(stateData.incidents)}</p>
      </div>
    `);
  };

  // Forzar re-render cuando cambian los datos
  useEffect(() => {
    setGeoJsonKey(prev => prev + 1);
  }, [data, mapView]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={[23.6345, -102.5528]} // Centro de México
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <GeoJSON
          key={geoJsonKey}
          data={mexicoStatesGeoJSON}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {/* Leyenda personalizada */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '120px',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
          {mapView === 'volume' ? 'Volumen' : 'Incidencias'}
        </Typography>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colorScale(0).hex(),
              border: '1px solid #ccc',
              borderRadius: '2px'
            }}></div>
            <Typography variant="caption">0</Typography>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colorScale(maxValue / 2).hex(),
              border: '1px solid #ccc',
              borderRadius: '2px'
            }}></div>
            <Typography variant="caption">{Math.round(maxValue / 2)}</Typography>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: colorScale(maxValue).hex(),
              border: '1px solid #ccc',
              borderRadius: '2px'
            }}></div>
            <Typography variant="caption">{maxValue}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};