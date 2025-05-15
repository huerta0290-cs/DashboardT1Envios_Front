'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import { Carrier } from '@/redux/features/dashboardSlice';

interface IncidentsResolutionTimeProps {
  resolutionTime: Record<string, number>;
  carrierData: Carrier[];
}

export default function IncidentsResolutionTime({ 
  resolutionTime, 
  carrierData 
}: IncidentsResolutionTimeProps) {
  // Buscar el color del transportista
  const getCarrierColor = (carrierName: string): string => {
    const carrier = carrierData.find(c => c.name === carrierName);
    return carrier?.color || '#ccc';
  };
  
  // Convertir los datos a un formato adecuado para el gráfico
  const chartData = Object.entries(resolutionTime)
    .map(([name, value]) => ({ 
      name, 
      value, 
      color: getCarrierColor(name) 
    }))
    .sort((a, b) => a.value - b.value); // Ordenar por tiempo de resolución (ascendente)
  
  return (
    <CardComponent title="Tiempo de Resolución por Transportista" height={350}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[0, 'dataMax + 0.5']}
            tickFormatter={(value) => `${value} días`}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)} días`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar 
            dataKey="value" 
            name="Días Promedio"
            background={{ fill: '#eee' }}
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value < 1.5 ? '#10B981' : entry.value < 2 ? '#F59E0B' : '#EF4444'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardComponent>
  );
}