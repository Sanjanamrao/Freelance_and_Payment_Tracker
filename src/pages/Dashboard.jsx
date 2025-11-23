import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard.jsx';
import { DollarSign, Briefcase, Users, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { getProjects } from '../services/projects';
import { getClients } from '../services/clients';
import { getPayments } from '../services/payments';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const projectsData = await getProjects();
      const clientsData = await getClients();
      const paymentsData = await getPayments();

      setProjects(projectsData);
      setClients(clientsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Fetch error:', err);
      // Instead of alert, just show empty state
      setProjects([]);
      setClients([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  // helpers
  const clientsMap = clients.reduce((acc, c) => {
    acc[c.id ?? c.ID ?? c.clientid ?? c.ClientID] = c.name ?? c.Name ?? c.full_name ?? '';
    return acc;
  }, {});

  const totalEarnings = payments.reduce(
    (s, p) => s + (Number(p.AmountPaid ?? p.amount_paid ?? p.amount) || 0),
    0
  );

  const activeProjectsCount = projects.filter((p) => {
    const totalPaid = Number(p.total_paid ?? p.totalpaid ?? 0);
    const budget = Number(p.budget ?? p.Budget ?? 0);
    const status = (p.status ?? p.Status ?? '').toString().toLowerCase();
    const progress = Number(p.progress ?? p.Progress ?? 0);

    if (status === 'completed') return false;
    if (progress >= 100) return false;
    if (budget > 0 && totalPaid >= budget) return false;
    return true;
  }).length;

  const pendingPayments = Math.max(
    0,
    projects.reduce((s, p) => {
      const budget = Number(p.budget ?? 0);
      const paid = Number(p.total_paid ?? 0);
      return s + Math.max(0, budget - paid);
    }, 0)
  );

  // monthly earnings
  function getMonthlyData() {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString('default', { month: 'short' }), earnings: 0 });
    }
    payments.forEach(p => {
      const dateStr = p.payment_date ?? p.date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const item = months.find(m => m.key === key);
      if (item) item.earnings += Number(p.amount_paid ?? p.amount) || 0;
    });
    return months;
  }

  function getStatusData() {
    let completed = 0, inProgress = 0, pending = 0;
    projects.forEach(p => {
      const totalPaid = Number(p.total_paid ?? 0);
      const budget = Number(p.budget ?? 0);
      const status = (p.status ?? '').toLowerCase();
      if (status === 'completed' || (budget > 0 && totalPaid >= budget)) completed++;
      else if (totalPaid > 0) inProgress++;
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

  const displayProjects = projects.map(p => ({
    id: p.id,
    name: p.title ?? p.name,
    client: clientsMap[p.client_id] ?? 'Unknown',
    status: p.status ?? (Number(p.total_paid ?? 0) > 0 ? 'In Progress' : 'Pending'),
    budget: Number(p.budget ?? 0),
    paid: Number(p.total_paid ?? 0),
    deadline: p.deadline ?? '',
    progress: Number(p.progress ?? 0),
  }));

  const fmtCurrency = v => `$${Number(v || 0).toLocaleString()}`;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
                  <p className="text-xs text-gray-500">
                    {fmtCurrency(project.paid)} paid
                  </p>
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
        </div>
      </div>
    </div>
  );
}