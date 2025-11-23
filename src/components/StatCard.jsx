import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { alpha } from '@mui/material/styles';

// StatCard component
export default function StatCard({ Icon, title, value, color = 'primary.main', trend }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="caption"
            sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mt: 1 }}
          >
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> {trend}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08), // safer transparency
          p: 1.5,
          borderRadius: 2,
        }}
      >
        {Icon && <Icon sx={{ color, fontSize: 28 }} />}
      </Box>
    </Paper>
  );
}

// PropTypes for clarity
StatCard.propTypes = {
  Icon: PropTypes.elementType, // expects a component like DashboardIcon
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  trend: PropTypes.string,
};
