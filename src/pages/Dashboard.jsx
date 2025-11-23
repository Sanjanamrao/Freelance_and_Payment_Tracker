// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import { DollarSign, Briefcase, Users, AlertCircle } from 'lucide-react';
import supabase from '../services/supabase';
import { getProjects } from '../services/projects';
import { getClients } from '../services/clients';
import { getPayments } from '../services/payments';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [projectsData, clientsData, paymentsData] = await Promise.all([
        getProjects(),
        getClients(),
        getPayments(),
      ]);
      setProjects(projectsData || []);
      setClients(clientsData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setProjects([]); setClients([]); setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  // Map client id -> name
  const clientsMap = clients.reduce((acc, c) => {
    if (c.id) acc[c.id] = c.name || '';
    return acc;
  }, {});

  // Totals
  const totalEarnings = payments.reduce((sum, p) => sum + (Number(p.AmountPaid) || 0), 0);

  // Active projects
  const activeProjectsCount = projects.filter((p) => (p.status ?? '').toLowerCase() !== 'completed').length;

  // Pending payments
  const pendingPayments = projects.reduce((s, p) => {
    const budget = Number(p.budget ?? 0);
    const paid = Number(p.total_paid ?? 0);
    return s + Math.max(0, budget - paid);
  }, 0);

  // Monthly earnings
  function getMonthlyData() {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString('default', { month: 'short' }), earnings: 0 });
    }
    payments.forEach((p) => {
      const dateStr = p.PaymentDate;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const item = months.find((m) => m.key === key);
      if (item) item.earnings += Number(p.AmountPaid) || 0;
    });
    return months;
  }

  // Status distribution
  function getStatusData() {
    let completed = 0, inProgress = 0, pending = 0;
    projects.forEach((p) => {
      const status = (p.status ?? '').toLowerCase();
      if (status === 'completed') completed++;
      else if (status === 'in progress') inProgress++;
      else pending++;
    });
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#3b82f6' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
    ];
  }

  const monthlyData = getMonthlyData();
  const statusData = getStatusData();

  // Recent projects
  const displayProjects = projects.map((p) => ({
    id: p.ProjectID,
    name: p.Title,
    client: clientsMap[p.ClientID] ?? 'Unknown',
    status: p.status ?? 'Pending',
    budget: Number(p.budget ?? 0),
    paid: Number(p.total_paid ?? 0),
    deadline: p.EndDate ?? '',
  }));

  const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString()}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard Icon={DollarSign} title="Total Earnings" value={fmtCurrency(totalEarnings)} color="success.main" />
        <StatCard Icon={Briefcase} title="Active Projects" value={activeProjectsCount} color="primary.main" />
        <StatCard Icon={Users} title="Total Clients" value={clients.length} color="secondary.main" />
        <StatCard Icon={AlertCircle} title="Pending Payments" value={fmtCurrency(pendingPayments)} color="warning.main" />
      </div>

      {/* Charts */}
      {/* ... same as before ... */}

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {displayProjects.slice(0, 5).map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{fmtCurrency(project.budget)}</p>
                  <p className="text-xs text-gray-500">{fmtCurrency(project.paid)} paid</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}