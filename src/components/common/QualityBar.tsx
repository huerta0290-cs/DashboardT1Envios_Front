'use client';

import { Box, Typography, LinearProgress } from '@mui/material';

interface QualityBarProps {
  label: string;
  value: number;
  color: 'success' | 'info' | 'warning' | 'error' | 'primary' | 'secondary';
}

export default function QualityBar({ label, value, color }: QualityBarProps) {
  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium" color={`${color}.main`}>
          {value.toFixed(1)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        color={color}
        sx={{ 
          height: 6, 
          borderRadius: 3,
        }} 
      />
    </Box>
  );
}