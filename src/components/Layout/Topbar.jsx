
import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Topbar({ activeTab, setActiveTab, onAdd }) {
  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Freelance & Payment Tracker
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onAdd} color="primary" size="large">
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

