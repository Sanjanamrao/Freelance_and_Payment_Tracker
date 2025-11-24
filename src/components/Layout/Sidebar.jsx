// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export const drawerWidth = 240;

export default function Sidebar({ activeTab, setActiveTab }) {
  const { isFreelancer, isClient } = useAuth();

  // Menu items for freelancers
  const freelancerMenuItems = [
    { label: 'Dashboard', value: 'dashboard', Icon: DashboardIcon },
    { label: 'Projects', value: 'projects', Icon: WorkIcon },
    { label: 'Invoices', value: 'invoices', Icon: ReceiptIcon },
    { label: 'Payments', value: 'payments', Icon: PaymentIcon },
    { label: 'Tasks', value: 'tasks', Icon: CheckCircleIcon },
    { label: 'Clients', value: 'clients', Icon: PeopleIcon },
  ];

  // Menu items for clients
  const clientMenuItems = [
    { label: 'Dashboard', value: 'dashboard', Icon: DashboardIcon },
    { label: 'Projects', value: 'projects', Icon: WorkIcon },
    { label: 'Invoices', value: 'invoices', Icon: ReceiptIcon },
    { label: 'Payments', value: 'payments', Icon: PaymentIcon },
  ];

  const menuItems = isFreelancer ? freelancerMenuItems : clientMenuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {isFreelancer ? 'F' : 'C'}
          </Box>
          <Box>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {isFreelancer ? 'Freelancer' : 'Client'}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Portal</div>
          </Box>
        </Box>
      </Toolbar>

      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map(({ label, value, Icon }) => (
          <ListItem
            button
            key={value}
            selected={activeTab === value}
            onClick={() => setActiveTab(value)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}