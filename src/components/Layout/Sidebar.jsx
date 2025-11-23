
import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Avatar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PeopleIcon from '@mui/icons-material/People';

export default function Sidebar({ activeTab, setActiveTab }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'projects', label: 'Projects', icon: <WorkOutlineIcon /> },
    { id: 'invoices', label: 'Invoices', icon: <ReceiptLongIcon /> },
    { id: 'payments', label: 'Payments', icon: <PaymentsIcon /> },
    { id: 'tasks', label: 'Tasks', icon: <ChecklistIcon /> },
    { id: 'clients', label: 'Clients', icon: <PeopleIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': { width: 260, borderRight: '1px solid #eee', boxShadow: 'rgba(2,6,23,0.06) 0px 6px 18px' }
      }}
    >
      <Toolbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(90deg,#4C6FFF,#8B5CF6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          FreelanceHub
        </Typography>
        <Typography variant="body2" color="text.secondary">Freelance & Payment Tracker</Typography>
      </Box>

      <List>
        {nav.map(item => (
          <ListItemButton
            key={item.id}
            selected={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            sx={{
              mx: 2, my: 0.5, borderRadius: 1.5,
              ...(activeTab === item.id && { background: 'linear-gradient(90deg,#4C6FFF,#7C6BFF)', color: '#fff' })
            }}
          >
            <ListItemIcon sx={{ color: activeTab === item.id ? '#fff' : undefined }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, backgroundColor: '#f8fafc' }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>JD</Avatar>
          <Box>
            <Typography variant="subtitle2">John Doe</Typography>
            <Typography variant="caption" color="text.secondary">Freelancer</Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

