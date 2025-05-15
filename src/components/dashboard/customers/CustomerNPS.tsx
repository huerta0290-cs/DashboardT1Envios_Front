'use client';

import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { 
  SentimentVerySatisfied as SentimentVerySatisfiedIcon,
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon 
} from '@mui/icons-material';
import CardComponent from '@/components/common/CardComponent';

interface CustomerNPSProps {
  npsScore: number;
  npsChange: number;
}

export default function CustomerNPS({ npsScore, npsChange }: CustomerNPSProps) {
  // Determinar el color y el mensaje según la puntuación NPS
  const getNPSColor = (score: number) => {
    if (score >= 75) return 'success.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  const getNPSCategory = (score: number) => {
    if (score >= 75) return 'Excelente';
    if (score >= 50) return 'Bueno';
    if (score >= 30) return 'Necesita mejorar';
    return 'Crítico';
  };
  
  const color = getNPSColor(npsScore);
  const category = getNPSCategory(npsScore);
  
  return (
    <CardComponent title="Net Promoter Score (NPS)" height={380}>
      <Stack 
        direction="column" 
        spacing={3} 
        sx={{ 
          height: '100%',
          justifyContent: 'center',
          p: 2 
        }}
      >
        {/* Puntuación NPS */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              bgcolor: `${color}20`, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2
            }}
          >
            <SentimentVerySatisfiedIcon sx={{ fontSize: 32, color }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {npsScore.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Puntuación NPS
          </Typography>
          
          {/* Indicador de cambio */}
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
            {npsChange > 0 ? (
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                color: npsChange > 0 ? 'success.main' : 'error.main',
                fontWeight: 'medium'
              }}
            >
              {Math.abs(npsChange).toFixed(1)} pts
            </Typography>
          </Stack>
        </Box>
        
        {/* Barra NPS */}
        <Box sx={{ px: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
              {category}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={npsScore} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                }
              }} 
            />
          </Box>
          
          {/* Leyenda */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ height: 8, width: 24, bgcolor: 'error.main', borderRadius: 4, mx: 'auto' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Detractores
              </Typography>
              <Typography variant="caption" color="text.secondary">
                0-6
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ height: 8, width: 24, bgcolor: 'warning.main', borderRadius: 4, mx: 'auto' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Pasivos
              </Typography>
              <Typography variant="caption" color="text.secondary">
                7-8
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ height: 8, width: 24, bgcolor: 'success.main', borderRadius: 4, mx: 'auto' }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Promotores
              </Typography>
              <Typography variant="caption" color="text.secondary">
                9-10
              </Typography>
            </Box>
          </Box>
        </Box>
      </Stack>
    </CardComponent>
  );
}