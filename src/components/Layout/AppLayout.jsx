// src/components/Layout/AppLayout.jsx
import React, { useState } from 'react';
import Sidebar, { drawerWidth } from './Sidebar';
import { Box, Toolbar, Container, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Dashboard from '../../pages/Dashboard.jsx';
import ProjectList from '../../pages/Projects/ProjectList.jsx';
import InvoiceList from '../../pages/Invoices/InvoiceList.jsx';
import PaymentList from '../../pages/Payments/PaymentList.jsx';
import TaskList from '../../pages/Tasks/TaskList.jsx';
import ClientList from '../../pages/Clients/ClientList.jsx';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const { profile, signOut, isFreelancer, isClient } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
          p: 3,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        
        {/* User Info & Sign Out */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>
                {profile?.full_name || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {isFreelancer ? 'Freelancer' : 'Client'}
              </div>
            </Box>
            <Button variant="outlined" size="small" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          
          {/* Freelancer-only tabs */}
          {isFreelancer && (
            <>
              {activeTab === 'projects' && <ProjectList onShowAdd={() => setShowAddModal(true)} />}
              {activeTab === 'tasks' && <TaskList onShowAdd={() => setShowAddModal(true)} />}
              {activeTab === 'clients' && <ClientList onShowAdd={() => setShowAddModal(true)} />}
            </>
          )}
          
          {/* Shared tabs with different views */}
          {activeTab === 'invoices' && <InvoiceList onShowAdd={() => setShowAddModal(true)} />}
          {activeTab === 'payments' && <PaymentList onShowAdd={() => setShowAddModal(true)} />}
        </Container>

        {/* Add Modal Placeholder */}
        {showAddModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
            }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              style={{
                width: 560,
                background: '#fff',
                borderRadius: 12,
                padding: 24,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: 0 }}>Add New</h3>
              <p style={{ color: '#6b7280' }}>
                This is a placeholder modal — wire it to forms later.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '8px 12px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#4C6FFF',
                    color: '#fff',
                    borderRadius: 6,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}