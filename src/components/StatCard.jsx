
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function StatCard({ icon: Icon, title, value, color = 'primary.main', trend }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>{value}</Typography>
        {trend && (
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mt: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> {trend}
          </Typography>
        )}
      </Box>
      <Box sx={{ bgcolor: (theme) => `${theme.palette.primary.main}11`, p: 1.5, borderRadius: 2 }}>
        {Icon && <Icon sx={{ color, fontSize: 28 }} />}
      </Box>
    </Paper>
  );
}
