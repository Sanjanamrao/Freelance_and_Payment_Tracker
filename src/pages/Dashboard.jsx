// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import FreelancerDashboard from './Freelancer/FreelancerDashboard';
import ClientDashboard from './Client/ClientDashboard';

export default function Dashboard() {
  const { profile } = useAuth();

  // Route to correct dashboard based on role
  if (profile?.role === 'freelancer') {
    return <FreelancerDashboard />;
  }

  if (profile?.role === 'client') {
    return <ClientDashboard />;
  }

  return <div>Loading...</div>;
}