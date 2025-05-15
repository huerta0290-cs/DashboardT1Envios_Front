// src/components/common/QualityBar.tsx
'use client';

import { Box, Typography, LinearProgress, Stack } from '@mui/material';

interface QualityBarProps {
  label: string;
  value: number;
  color: 'success' | 'info' | 'warning' | 'error' | 'primary' | 'secondary';
}

export default function QualityBar({ label, value, color }: QualityBarProps) {
  return (
    <Box sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="medium" color={`${color}.main`}>
          {value.toFixed(1)}%
        </Typography>
      </Stack>
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