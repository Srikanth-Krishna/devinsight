import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';

export const CardStat = ({ title, value }) => (
  <Card sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
    <CardContent>
      <Typography variant='subtitle1' color='textSecondary' gutterBottom>
        {title}
      </Typography>
      <Typography variant='h5' style={{ textAlign: 'center' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);
