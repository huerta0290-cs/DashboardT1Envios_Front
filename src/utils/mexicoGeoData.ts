import chroma from 'chroma-js';
import { useEffect, useState } from 'react';
// src/utils/mexicoGeoData.ts
// Utilidad para manejar datos geográficos de México

export interface StateGeoData {
  name: string;
  code: string;
  normalizedNames: string[];
  coordinates: number[][][];
  center: [number, number];
}

// Función para cargar GeoJSON desde archivos externos
export const loadMexicoGeoJSON = async (): Promise<any> => {
  try {
    // Opción 1: Cargar desde archivo local
    const response = await fetch('/data/mexico-states.geojson');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo GeoJSON local');
    }
    return await response.json();
  } catch (error) {
    console.warn('Usando GeoJSON simplificado:', error);
    return getMexicoSimplifiedGeoJSON();
  }
};

// GeoJSON simplificado pero más completo
export const getMexicoSimplifiedGeoJSON = () => ({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { 
        "name": "Aguascalientes", 
        "code": "AGS",
        "id": "01"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-102.8, 21.7], [-102.0, 21.7], [-102.0, 22.4], [-102.8, 22.4], [-102.8, 21.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Baja California", 
        "code": "BC",
        "id": "02"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-117.1, 28.0], [-109.4, 28.0], [-109.4, 32.7], [-117.1, 32.7], [-117.1, 28.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Baja California Sur", 
        "code": "BCS",
        "id": "03"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-115.0, 22.9], [-109.4, 22.9], [-109.4, 28.0], [-115.0, 28.0], [-115.0, 22.9]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Campeche", 
        "code": "CAM",
        "id": "04"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-92.5, 17.8], [-89.1, 17.8], [-89.1, 20.7], [-92.5, 20.7], [-92.5, 17.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Chiapas", 
        "code": "CHIS",
        "id": "07"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-94.1, 14.5], [-90.4, 14.5], [-90.4, 17.8], [-94.1, 17.8], [-94.1, 14.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Chihuahua", 
        "code": "CHIH",
        "id": "08"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-109.1, 25.5], [-103.4, 25.5], [-103.4, 31.8], [-109.1, 31.8], [-109.1, 25.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Ciudad de México", 
        "code": "CDMX",
        "id": "09"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.4, 19.1], [-98.9, 19.1], [-98.9, 19.6], [-99.4, 19.6], [-99.4, 19.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Coahuila", 
        "code": "COAH",
        "id": "05"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-104.7, 24.0], [-99.9, 24.0], [-99.9, 29.9], [-104.7, 29.9], [-104.7, 24.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Colima", 
        "code": "COL",
        "id": "06"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-104.8, 18.7], [-103.5, 18.7], [-103.5, 19.6], [-104.8, 19.6], [-104.8, 18.7]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Durango", 
        "code": "DGO",
        "id": "10"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-107.1, 22.3], [-102.5, 22.3], [-102.5, 26.9], [-107.1, 26.9], [-107.1, 22.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Guanajuato", 
        "code": "GTO",
        "id": "11"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-102.0, 19.8], [-99.6, 19.8], [-99.6, 21.8], [-102.0, 21.8], [-102.0, 19.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Guerrero", 
        "code": "GRO",
        "id": "12"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-102.2, 16.6], [-98.0, 16.6], [-98.0, 18.9], [-102.2, 18.9], [-102.2, 16.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Hidalgo", 
        "code": "HGO",
        "id": "13"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.9, 19.6], [-97.9, 19.6], [-97.9, 21.4], [-99.9, 21.4], [-99.9, 19.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Jalisco", 
        "code": "JAL",
        "id": "14"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-105.5, 19.0], [-102.5, 19.0], [-102.5, 22.0], [-105.5, 22.0], [-105.5, 19.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "México", 
        "code": "MEX",
        "id": "15"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-100.5, 18.5], [-98.5, 18.5], [-98.5, 20.5], [-100.5, 20.5], [-100.5, 18.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Michoacán", 
        "code": "MICH",
        "id": "16"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-103.8, 18.1], [-100.0, 18.1], [-100.0, 20.4], [-103.8, 20.4], [-103.8, 18.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Morelos", 
        "code": "MOR",
        "id": "17"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.6, 18.3], [-98.6, 18.3], [-98.6, 19.1], [-99.6, 19.1], [-99.6, 18.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Nayarit", 
        "code": "NAY",
        "id": "18"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-105.8, 20.6], [-103.7, 20.6], [-103.7, 23.1], [-105.8, 23.1], [-105.8, 20.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Nuevo León", 
        "code": "NL",
        "id": "19"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-101.5, 24.0], [-99.0, 24.0], [-99.0, 27.8], [-101.5, 27.8], [-101.5, 24.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Oaxaca", 
        "code": "OAX",
        "id": "20"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-98.6, 15.6], [-93.5, 15.6], [-93.5, 18.7], [-98.6, 18.7], [-98.6, 15.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Puebla", 
        "code": "PUE",
        "id": "21"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-99.0, 17.5], [-96.8, 17.5], [-96.8, 20.8], [-99.0, 20.8], [-99.0, 17.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Querétaro", 
        "code": "QRO",
        "id": "22"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-100.8, 20.0], [-99.5, 20.0], [-99.5, 21.7], [-100.8, 21.7], [-100.8, 20.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Quintana Roo", 
        "code": "QROO",
        "id": "23"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-89.2, 17.8], [-86.7, 17.8], [-86.7, 21.6], [-89.2, 21.6], [-89.2, 17.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "San Luis Potosí", 
        "code": "SLP",
        "id": "24"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-102.0, 21.1], [-98.3, 21.1], [-98.3, 24.5], [-102.0, 24.5], [-102.0, 21.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Sinaloa", 
        "code": "SIN",
        "id": "25"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-109.5, 22.5], [-105.5, 22.5], [-105.5, 26.9], [-109.5, 26.9], [-109.5, 22.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Sonora", 
        "code": "SON",
        "id": "26"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-115.0, 26.0], [-108.0, 26.0], [-108.0, 32.5], [-115.0, 32.5], [-115.0, 26.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Tabasco", 
        "code": "TAB",
        "id": "27"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-94.7, 17.3], [-91.4, 17.3], [-91.4, 18.7], [-94.7, 18.7], [-94.7, 17.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Tamaulipas", 
        "code": "TAMS",
        "id": "28"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-100.1, 22.2], [-97.1, 22.2], [-97.1, 27.6], [-100.1, 27.6], [-100.1, 22.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Tlaxcala", 
        "code": "TLAX",
        "id": "29"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-98.8, 19.1], [-97.7, 19.1], [-97.7, 19.9], [-98.8, 19.9], [-98.8, 19.1]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Veracruz", 
        "code": "VER",
        "id": "30"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-98.5, 17.0], [-96.0, 17.0], [-96.0, 22.5], [-98.5, 22.5], [-98.5, 17.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Yucatán", 
        "code": "YUC",
        "id": "31"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-90.4, 19.5], [-87.5, 19.5], [-87.5, 21.6], [-90.4, 21.6], [-90.4, 19.5]]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Zacatecas", 
        "code": "ZAC",
        "id": "32"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-104.4, 21.0], [-101.3, 21.0], [-101.3, 25.1], [-104.4, 25.1], [-104.4, 21.0]]]
      }
    }
  ]
});

// Función para normalizar nombres de estados
export const normalizeStateName = (name: string): string => {
  const normalized = name.toLowerCase().trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remover acentos
  
  const nameMap: { [key: string]: string } = {
    // Variaciones comunes
    'ciudad de mexico': 'ciudad de méxico',
    'cdmx': 'ciudad de méxico',
    'df': 'ciudad de méxico',
    'distrito federal': 'ciudad de méxico',
    
    'estado de mexico': 'méxico',
    'edomex': 'méxico',
    'mx': 'méxico',
    
    'nuevo leon': 'nuevo león',
    'nl': 'nuevo león',
    
    'san luis potosi': 'san luis potosí',
    'slp': 'san luis potosí',
    
    'queretaro': 'querétaro',
    'qro': 'querétaro',
    'qro.': 'querétaro',
    
    'michoacan': 'michoacán',
    'mich': 'michoacán',
    
    'yucatan': 'yucatán',
    'yuc': 'yucatán',
    
    // Códigos de estado
    'ags': 'aguascalientes',
    'bc': 'baja california',
    'bcs': 'baja california sur',
    'cam': 'campeche',
    'chis': 'chiapas',
    'chih': 'chihuahua',
    'coah': 'coahuila',
    'col': 'colima',
    'dgo': 'durango',
    'gto': 'guanajuato',
    'gro': 'guerrero',
    'hgo': 'hidalgo',
    'jal': 'jalisco',
    'mex': 'méxico',
    'mor': 'morelos',
    'nay': 'nayarit',
    'oax': 'oaxaca',
    'pue': 'puebla',
    'qroo': 'quintana roo',
    'sin': 'sinaloa',
    'son': 'sonora',
    'tab': 'tabasco',
    'tams': 'tamaulipas',
    'tlax': 'tlaxcala',
    'ver': 'veracruz',
    'zac': 'zacatecas'
  };
  
  return nameMap[normalized] || normalized;
};

// Hook personalizado para cargar datos geográficos
export const useGeoData = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadMexicoGeoJSON();
        setGeoData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setGeoData(getMexicoSimplifiedGeoJSON());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { geoData, loading, error };
};

// Utilidad para encontrar datos de estado por múltiples criterios
export const findStateData = (
  stateName: string, 
  dataArray: Array<{state: string; volume: number; incidents: number}>
): {state: string; volume: number; incidents: number} => {
  const normalized = normalizeStateName(stateName);
  
  // Buscar coincidencia exacta
  let found = dataArray.find(item => 
    normalizeStateName(item.state) === normalized
  );
  
  // Si no encuentra, buscar coincidencia parcial
  if (!found) {
    found = dataArray.find(item => 
      normalizeStateName(item.state).includes(normalized) ||
      normalized.includes(normalizeStateName(item.state))
    );
  }
  
  return found || { state: stateName, volume: 0, incidents: 0 };
};

// Función para generar colores más sofisticados
export const generateColorScale = (
  values: number[], 
  colorScheme: 'blue' | 'red' | 'green' | 'orange' = 'blue'
) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  
  const colorSchemes = {
    blue: ['#E3F2FD', '#2196F3', '#0D47A1'],
    red: ['#FFEBEE', '#F44336', '#B71C1C'],
    green: ['#E8F5E8', '#4CAF50', '#1B5E20'],
    orange: ['#FFF3E0', '#FF9800', '#E65100']
  };
  
  return chroma.scale(colorSchemes[colorScheme]).domain([min, max]);
};

// Configuración de estilos para diferentes tipos de datos
export const getMapStyles = (mapView: 'volume' | 'incidents') => {
  const baseStyle = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.7
  };

  const hoverStyle = {
    weight: 4,
    color: '#3B82F6',
    dashArray: '',
    fillOpacity: 0.9
  };

  const colorScheme = mapView === 'volume' ? 'blue' : 'orange';

  return { baseStyle, hoverStyle, colorScheme };
};