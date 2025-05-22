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
import { formatNumber } from '@/utils/formatters';

interface IncidentsByTypeProps {
  incidentTypes: {
    name: string;
    value: number;
    color: string;
  }[];
}

export default function IncidentsByType({ incidentTypes }: IncidentsByTypeProps) {
  // Ordenamos los tipos de incidencias por valor (de mayor a menor)
  const sortedIncidents = [...incidentTypes].sort((a, b) => b.value - a.value);
  
  return (
    <CardComponent title="Incidencias por Tipo" height={400}>
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          width: '60%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sortedIncidents}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
                nameKey="name"
              >
                {sortedIncidents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        {/* Leyenda a la derecha con scroll si es necesario */}
        <Box sx={{ 
          width: '40%', 
          height: '100%',
          overflowY: 'auto',
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
          }
        }}>
          {sortedIncidents.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                fontSize: '0.8rem'
              }}
            >
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: item.color,
                  mr: 1.5
                }} 
              />
              <Box 
                sx={{ 
                  color: '#333',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}
              >
                {item.name}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </CardComponent>
  );
}