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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (carriers: Carrier[]) => ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  index
}: any) => {
  // Cálculo para posicionar las etiquetas externas
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Línea que conecta el segmento con la etiqueta */}
      <path 
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} 
        stroke={carriers[index].color} 
        fill="none" 
      />
      {/* Texto de la etiqueta */}
      <text 
        x={ex + (cos >= 0 ? 1 : -1) * 12} 
        y={ey} 
        textAnchor={textAnchor} 
        fill={carriers[index].color}
        style={{ fontSize: '14px', fontWeight: 500 }}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

export default function CarrierDistribution({ carriers }: CarrierDistributionProps) {
  return (
    <CardComponent title="Distribución por Transportista" height={380}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={carriers}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel(carriers)}
              innerRadius={60}
              outerRadius={110}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="guides"
              nameKey="name"
            >
              {carriers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatNumber(value)}
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
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value, entry, index) => (
                <span style={{ color: carriers[index].color, fontSize: '0.875rem' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </CardComponent>
  );
}