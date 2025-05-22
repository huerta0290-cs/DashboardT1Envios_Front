// // src/components/dashboard/overview/IncidentsSummary.tsx
// 'use client';

// import { useState } from 'react';
// import { Stack, Grid, Typography, Box } from '@mui/material';
// import { 
//   PieChart, 
//   Pie, 
//   Cell, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer 
// } from 'recharts';
// import CardComponent from '@/components/common/CardComponent';
// import DropdownFilter from '@/components/common/DropdownFilter';
// import { Incident } from '@/redux/features/dashboardSlice';
// import { formatNumber } from '@/utils/formatters';

// interface IncidentsSummaryProps {
//   incidents: Incident;
// }

// export default function IncidentsSummary({ incidents }: IncidentsSummaryProps) {
//   const [filter, setFilter] = useState('Todos');
//   const { total, resolved, byType } = incidents;
//   const pending = total - resolved;

//   // Filtrar tipos de incidencias según selección
//   let filteredTypes = [...byType];
//   if (filter === 'Abiertos') {
//     // Simular datos filtrados (en producción esto vendría del backend)
//     const openPercent = pending / total;
//     filteredTypes = byType.map(type => ({
//       ...type,
//       value: Math.round(type.value * openPercent)
//     }));
//   } else if (filter === 'Cerrados') {
//     // Simular datos filtrados (en producción esto vendría del backend)
//     const resolvedPercent = resolved / total;
//     filteredTypes = byType.map(type => ({
//       ...type,
//       value: Math.round(type.value * resolvedPercent)
//     }));
//   }

//   return (
//     <CardComponent 
//       title="Incidencias" 
//       actions={
//         <DropdownFilter 
//           options={['Todos', 'Abiertos', 'Cerrados']} 
//           defaultValue="Todos"
//           onChange={setFilter}
//         />
//       }
//       height={420} // Aumentamos la altura para dar más espacio
//     >
//       <Stack direction="column" sx={{ height: '100%' }}>
//         {/* Resumen de incidencias en la parte superior */}
//         <Stack 
//           direction="row" 
//           justifyContent="space-between"
//           spacing={2}
//           sx={{ mb: 2 }}
//         >
//           <Box>
//             <Typography variant="h6" fontWeight="medium">
//               {formatNumber(total)}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Total de incidencias
//             </Typography>
//           </Box>
          
//           <Box>
//             <Typography variant="h6" fontWeight="medium" color="success.main">
//               {formatNumber(resolved)}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Incidencias resueltas
//             </Typography>
//           </Box>
          
//           <Box>
//             <Typography variant="h6" fontWeight="medium" color="error.main">
//               {formatNumber(pending)}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Incidencias pendientes
//             </Typography>
//           </Box>
//         </Stack>
        
//         {/* Contenedor del gráfico */}
//         <Box sx={{ flexGrow: 1, width: '100%', height: '100%', minHeight: 250, position: 'relative' }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={filteredTypes}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={40}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 paddingAngle={1}
//                 dataKey="value"
//               >
//                 {filteredTypes.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 formatter={(value: number) => formatNumber(value)}
//                 labelFormatter={(_, payload) => payload[0]?.name || ''}
//                 contentStyle={{
//                   backgroundColor: '#fff',
//                   border: '1px solid #f0f0f0',
//                   borderRadius: 8,
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                 }}
//               />
//               <Legend 
//                 verticalAlign="bottom"
//                 align="center"
//                 layout="horizontal"
//                 iconType="circle"
//                 wrapperStyle={{
//                   fontSize: '0.75rem',
//                   overflowY: 'auto',
//                   maxHeight: 100, // Altura máxima con scroll si es necesario
//                   paddingTop: 10,
//                   paddingBottom: 5
//                 }}
//                 formatter={(value, entry, index) => (
//                   <span style={{ color: '#1F2937', fontSize: '0.75rem' }}>{value}</span>
//                 )}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </Box>
//       </Stack>
//     </CardComponent>
//   );
// }

// src/components/dashboard/overview/IncidentsSummary.tsx
'use client';

import { useState } from 'react';
import { 
  Stack, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Divider,
  Chip
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
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
  const [originTab, setOriginTab] = useState('all');
  const [view, setView] = useState('pie');
  
  const { total, resolved, byType, byOrigin } = incidents;
  const pending = total - resolved;
  
  // Calcular porcentajes de automáticas y manuales
  const automaticTotal = byOrigin?.automatic?.total || 0;
  const manualTotal = byOrigin?.manual?.total || 0;
  const automaticPercent = total > 0 ? (automaticTotal / total * 100).toFixed(1) : '0';
  const manualPercent = total > 0 ? (manualTotal / total * 100).toFixed(1) : '0';

  // Seleccionar los datos según la pestaña activa
  const getDataByTab = () => {
    switch (originTab) {
      case 'automatic':
        return byOrigin?.automatic?.types || [];
      case 'manual':
        return byOrigin?.manual?.types || [];
      default:
        return byType || [];
    }
  };

  // Filtrar tipos de incidencias según selección
  let filteredTypes = getDataByTab();
  
  if (filter === 'Abiertos') {
    // Simular datos filtrados (en producción esto vendría del backend)
    const openPercent = pending / total;
    filteredTypes = filteredTypes.map(type => ({
      ...type,
      value: Math.round(type.value * openPercent)
    }));
  } else if (filter === 'Cerrados') {
    // Simular datos filtrados (en producción esto vendría del backend)
    const resolvedPercent = resolved / total;
    filteredTypes = filteredTypes.map(type => ({
      ...type,
      value: Math.round(type.value * resolvedPercent)
    }));
  }

  // Preparar datos para gráfico de barras
  const barData = [...filteredTypes]
    .sort((a, b) => b.value - a.value) // Ordenar de mayor a menor
    .slice(0, 5); // Mostrar solo los 5 principales

  // Componente de acciones para el card
  const cardActions = (
    <Stack direction="row" spacing={1}>
      {/* <DropdownFilter 
        options={['Todos', 'Abiertos', 'Cerrados']} 
        defaultValue="Todos"
        onChange={setFilter}
      /> */}
      <DropdownFilter 
        options={['Gráfico circular', 'Gráfico de barras']} 
        defaultValue="Gráfico circular"
        onChange={(value) => setView(value === 'Gráfico circular' ? 'pie' : 'bar')}
      />
    </Stack>
  );

  return (
    <CardComponent 
      title="Incidencias" 
      actions={cardActions}
      height={420}
    >
      <Stack direction="column" sx={{ height: '100%' }}>
        {/* Resumen de incidencias */}
        <Stack 
          direction="row" 
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight="medium">
              {formatNumber(total)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" color="success.main">
              {formatNumber(resolved)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resueltas
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" fontWeight="medium" color="error.main">
              {formatNumber(pending)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pendientes
            </Typography>
          </Box>
        </Stack>
        
        {/* Tabs para filtrar por origen */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={originTab}
            onChange={(_, newValue) => setOriginTab(newValue)}
            aria-label="incident origin tabs"
            sx={{ minHeight: '36px' }}
          >
            <Tab 
              label="Todas" 
              value="all"
              sx={{ 
                minHeight: '36px', 
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 1
              }}
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Automáticas</span>
                  <Chip 
                    label={`${automaticPercent}%`} 
                    size="small" 
                    color="primary"
                    sx={{ height: 20, fontSize: '0.625rem' }}
                  />
                </Stack>
              }
              value="automatic"
              sx={{ 
                minHeight: '36px', 
                textTransform: 'none',
                fontSize: '0.875rem',
                py: 1
              }}
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Manuales</span>
                  <Chip 
                    label={`${manualPercent}%`} 
                    size="small" 
                    color="secondary"
                    sx={{ height: 20, fontSize: '0.625rem' }}
                  />
                </Stack>
              }
              value="manual"
              sx={{ 
                minHeight: '36px', 
                textTransform: 'none',
                fontSize: '0.875rem', 
                py: 1
              }}
            />
          </Tabs>
        </Box>
        
        {/* Contenedor del gráfico */}
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%', minHeight: 250 }}>
          {view === 'pie' ? (
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
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '0.75rem',
                    overflowY: 'auto',
                    maxHeight: 100,
                    paddingTop: 10,
                    paddingBottom: 5
                  }}
                  formatter={(value, entry, index) => (
                    <span style={{ color: '#1F2937', fontSize: '0.75rem' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                />
                <Bar dataKey="value" name="Cantidad">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Stack>
    </CardComponent>
  );
}