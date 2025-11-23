
import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import Dashboard from '../../pages/Dashboard.jsx';
import ProjectList from '../../pages/Projects/ProjectList.jsx';
import ProjectForm from '../../pages/Projects/ProjectForm.jsx';
import ProjectDetail from '../../pages/Projects/ProjectDetail.jsx';
import InvoiceList from '../../pages/Invoices/InvoiceList.jsx';
import InvoiceForm from '../../pages/Invoices/InvoiceForm.jsx';
import PaymentList from '../../pages/Payments/PaymentList.jsx';
import PaymentForm from '../../pages/Payments/PaymentForm.jsx';
import TaskList from '../../pages/Tasks/TaskList.jsx';
import TaskForm from '../../pages/Tasks/TaskForm.jsx';
import { Container } from '@mui/material';
import ClientList from '../../pages/Clients/ClientList.jsx';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, projects, invoices, payments, tasks, clients
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} onAdd={() => setShowAddModal(true)} />
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'projects' && <ProjectList onShowAdd={() => setShowAddModal(true)} />}
          {activeTab === 'invoices' && <InvoiceList onShowAdd={() => setShowAddModal(true)} />}
          {activeTab === 'payments' && <PaymentList onShowAdd={() => setShowAddModal(true)} />}
          {activeTab === 'tasks' && <TaskList onShowAdd={() => setShowAddModal(true)} />}
          {activeTab === 'clients' && <ClientList onShowAdd={() => setShowAddModal(true)} />}
        </Container>

        {/* Add Modal Placeholder */}
        {showAddModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400
          }} onClick={() => setShowAddModal(false)}>
            <div style={{ width: 560, background: '#fff', borderRadius: 12, padding: 24 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: 0 }}>Add New</h3>
              <p style={{ color: '#6b7280' }}>This is a placeholder modal — wire it to forms later.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '8px 12px' }}>Cancel</button>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '8px 12px', background: '#4C6FFF', color: '#fff', borderRadius: 6 }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}
