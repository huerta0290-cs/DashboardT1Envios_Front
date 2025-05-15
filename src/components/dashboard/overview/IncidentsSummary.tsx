// src/components/dashboard/overview/IncidentsSummary.tsx
'use client';

import { useState } from 'react';
import { Stack, Grid, Typography, Box } from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import CardComponent from '@/components/common/CardComponent';
import DropdownFilter from '@/components/common/DropdownFilter';
import { Incident } from '@/redux/features/dashboardSlice';
import { formatNumber } from '@/utils/formatters';

interface IncidentsSummaryProps {
  incidents: Incident;
}

export default function IncidentsSummary({ incidents }: IncidentsSummaryProps) {
  const [filter, setFilter] = useState('Todos');
  const { total, resolved, byType } = incidents;
  const pending = total - resolved;

  // Filtrar tipos de incidencias según selección
  let filteredTypes = [...byType];
  if (filter === 'Abiertos') {
    // Simular datos filtrados (en producción esto vendría del backend)
    const openPercent = pending / total;
    filteredTypes = byType.map(type => ({
      ...type,
      value: Math.round(type.value * openPercent)
    }));
  } else if (filter === 'Cerrados') {
    // Simular datos filtrados (en producción esto vendría del backend)
    const resolvedPercent = resolved / total;
    filteredTypes = byType.map(type => ({
      ...type,
      value: Math.round(type.value * resolvedPercent)
    }));
  }

  return (
    <CardComponent 
      title="Incidencias" 
      actions={
        <DropdownFilter 
          options={['Todos', 'Abiertos', 'Cerrados']} 
          defaultValue="Todos"
          onChange={setFilter}
        />
      }
      height={350}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ height: '100%' }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' }, height: { xs: 200, sm: '100%' } }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredTypes}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
              >
                {filteredTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatNumber(value)}
                labelFormatter={(_, payload) => payload[0]?.name || ''}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
              <Legend 
                verticalAlign="middle" 
                align="right"
                layout="vertical"
                iconType="circle"
                formatter={(value, entry, index) => (
                  <span style={{ color: '#1F2937', fontSize: '0.75rem' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        
        <Stack 
          direction="column" 
          justifyContent="center" 
          spacing={3}
          sx={{ width: { xs: '100%', sm: '50%' }, pl: { xs: 0, sm: 3 }, pt: { xs: 2, sm: 0 } }}
        >
          <Box>
            <Typography variant="h6" fontWeight="medium">
              {formatNumber(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de incidencias
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" color="success.main">
              {formatNumber(resolved)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Incidencias resueltas
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" color="error.main">
              {formatNumber(pending)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Incidencias pendientes
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </CardComponent>
  );
}
