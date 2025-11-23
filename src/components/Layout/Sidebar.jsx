import React from 'react';
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PeopleIcon from '@mui/icons-material/People';

export const drawerWidth = 240; // export the width so AppLayout can use it

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
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'fixed' // ensure drawer stays fixed on left
        }
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {nav.map(item => (
            <ListItem
              key={item.id}
              button
              selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              sx={{
                borderRadius: 1.5,
                my: 0.5,
                ...(activeTab === item.id && { background: 'linear-gradient(90deg,#4C6FFF,#7C6BFF)', color: '#fff' })
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.id ? '#fff' : undefined }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ opacity: activeTab === item.id ? 1 : 0.7 }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

