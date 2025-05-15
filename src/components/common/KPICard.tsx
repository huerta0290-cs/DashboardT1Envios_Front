'use client';

import { ReactNode } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress 
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon 
} from '@mui/icons-material';
import { getChangeColorClass } from '@/utils/formatters';

interface KPICardProps {
  title: string;
  value: string;
  previousValue: string;
  changePercentage?: number;
  changeValue?: number;
  changeType?: 'percent' | 'points';
  icon: ReactNode;
  iconBgColor: string;
  progress?: number;
}

export default function KPICard({
  title,
  value,
  previousValue,
  changePercentage,
  changeValue = 0,
  changeType = 'percent',
  icon,
  iconBgColor,
  progress = 70,
}: KPICardProps) {
  // Determinar si el cambio es positivo
  const isPositiveChange = 
    (changePercentage !== undefined && changePercentage > 0) || 
    (changeValue !== undefined && changeValue > 0);
  
  // Valor absoluto del cambio
  const absChangeValue = changePercentage !== undefined 
    ? Math.abs(changePercentage) 
    : Math.abs(changeValue);
  
  // Clase de color para el indicador de cambio
  const changeColorClass = getChangeColorClass(
    changePercentage !== undefined ? changePercentage : changeValue
  );
  
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Box 
            sx={{ 
              bgcolor: `${iconBgColor}20`, // Use 20% opacity
              p: 1, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h5" fontWeight="bold" mb={0.5}>
          {value}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          {isPositiveChange ? (
            <TrendingUpIcon 
              sx={{ 
                color: 'success.main', 
                fontSize: 16, 
                mr: 0.5 
              }} 
            />
          ) : (
            <TrendingDownIcon 
              sx={{ 
                color: 'error.main', 
                fontSize: 16, 
                mr: 0.5 
              }} 
            />
          )}
          
          <Typography 
            variant="caption" 
            sx={{ color: isPositiveChange ? 'success.main' : 'error.main', fontWeight: 'medium' }}
          >
            {changeType === 'percent' 
              ? `${absChangeValue.toFixed(1)}%` 
              : `${absChangeValue.toFixed(1)} pts`}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            vs {previousValue}
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 4, 
            borderRadius: 2,
            bgcolor: 'grey.100',
            '& .MuiLinearProgress-bar': {
              bgcolor: iconBgColor,
            }
          }} 
        />
      </CardContent>
    </Card>
  );
}