// src/pages/Freelancer/FreelancerDashboard.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard.jsx';
import { DollarSign, Briefcase, Users, AlertCircle } from 'lucide-react';
import { getProjects } from '../../services/projects';
import { getClients } from '../../services/clients';
import { getPayments } from '../../services/payments';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchAll();
  }, []);

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
      setProjects([]);
      setClients([]);
      setPayments([]);
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
  const activeProjectsCount = projects.filter(
    (p) => (p.status ?? '').toLowerCase() !== 'completed'
  ).length;

  // Pending payments
  const pendingPayments = projects.reduce((s, p) => {
    const budget = Number(p.budget ?? 0);
    const paid = Number(p.total_paid ?? 0);
    return s + Math.max(0, budget - paid);
  }, 0);

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
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'Freelancer'}! 👋
        </h2>
        <p className="text-blue-100">Here's an overview of your freelance business</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          Icon={DollarSign}
          title="Total Earnings"
          value={fmtCurrency(totalEarnings)}
          color="success.main"
        />
        <StatCard
          Icon={Briefcase}
          title="Active Projects"
          value={activeProjectsCount}
          color="primary.main"
        />
        <StatCard
          Icon={Users}
          title="Total Clients"
          value={clients.length}
          color="secondary.main"
        />
        <StatCard
          Icon={AlertCircle}
          title="Pending Payments"
          value={fmtCurrency(pendingPayments)}
          color="warning.main"
        />
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {displayProjects.slice(0, 5).map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {fmtCurrency(project.budget)}
                  </p>
                  <p className="text-xs text-gray-500">{fmtCurrency(project.paid)} paid</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : project.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
          {displayProjects.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No projects yet. Start by creating your first project!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}