'use client';

import { ReactNode } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Divider } from '@mui/material';

interface CardComponentProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  height?: string | number;
}

export default function CardComponent({ title, children, actions, height }: CardComponentProps) {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: height || 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight="medium">
            {title}
          </Typography>
        }
        action={actions && <Box>{actions}</Box>}
        sx={{ 
          py: 2, 
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      />
      <CardContent 
        sx={{ 
          p: 3, 
          flexGrow: 1,
          overflow: 'auto'
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}