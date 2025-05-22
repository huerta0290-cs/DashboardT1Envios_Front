// src/components/dashboard/overview/CarrierDistribution.tsx
'use client';
import { Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import { Carrier } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';

interface CarrierDistributionProps {
  carriers: Carrier[];
}

// Definimos colores específicos para los transportistas
const COLORS: Record<string, string> = {
  'DHL': '#FFD166', // amarillo
  'FEDEX': '#4B3F72', // púrpura
  'UPS': '#3A2E39', // marrón oscuro
  'JT EXPRESS': '#7F70BE', // morado claro
  'JTEXPRESS': '#7F70BE', // variante sin espacio
  'EXPRESS': '#5DADE2', // azul claro
  'ESTAFETA': '#A569BD', // púrpura claro
  '99MIN': '#8E44AD', // púrpura oscuro
};

export default function CarrierDistribution({ carriers }: CarrierDistributionProps) {
  // Función para determinar el color basado en el nombre del transportista
  const getCarrierColor = (name: string) => {
    const upperName = name.toUpperCase();
    return COLORS[upperName] || '#8884d8'; // Color por defecto si no se encuentra
  };

  // Calculamos los porcentajes para cada transportista
  const total = carriers.reduce((sum, c) => sum + c.guides, 0);
  const dataWithPercentage = carriers.map(carrier => ({
    ...carrier,
    percentage: Math.round((carrier.guides / total) * 100)
  }));
  
  // Ordenamos por cantidad de guías (de mayor a menor)
  dataWithPercentage.sort((a, b) => b.guides - a.guides);

  return (
    <CardComponent title="Distribución por Transportista" height={380}>
      <Box sx={{ width: '100%', height: 320, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={110}
              fill="#8884d8"
              paddingAngle={1}
              dataKey="guides"
              nameKey="name"
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getCarrierColor(entry.name)}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                formatNumber(value), 
                name
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value, entry) => {
                // Encontrar el elemento correspondiente para obtener el porcentaje
                const item = dataWithPercentage.find(c => c.name === value);
                const percentage = item ? item.percentage : 0;
                
                return (
                  <span style={{ 
                    color: entry.color,
                    fontSize: '0.75rem',
                    margin: '0 4px',
                    display: 'inline-block'
                  }}>
                    {value} {percentage}%
                  </span>
                );
              }}
              wrapperStyle={{
                paddingTop: 20,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0 16px',
                lineHeight: '24px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </CardComponent>
  );
}