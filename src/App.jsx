// src/App.jsx
import React, { useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/Layout/AppLayout.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

export default function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <AppLayout />;
}