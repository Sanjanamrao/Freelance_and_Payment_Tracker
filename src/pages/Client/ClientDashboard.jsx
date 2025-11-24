// src/pages/Client/ClientDashboard.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard.jsx';
import { DollarSign, FileText, CreditCard, Clock } from 'lucide-react';
import { getProjects } from '../../services/projects';
import { getInvoices } from '../../services/invoices';
import { getPayments } from '../../services/payments';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [projectsData, invoicesData, paymentsData] = await Promise.all([
        getProjects(),
        getInvoices(),
        getPayments(),
      ]);
      setProjects(projectsData || []);
      setInvoices(invoicesData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setProjects([]);
      setInvoices([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  // Totals
  const totalSpent = payments.reduce((sum, p) => sum + (Number(p.AmountPaid) || 0), 0);

  // Pending invoices (unpaid)
  const pendingInvoices = invoices.filter(
    (inv) => (inv.Status ?? '').toLowerCase() !== 'paid'
  ).length;

  // Outstanding amount
  const outstandingAmount = invoices
    .filter((inv) => (inv.Status ?? '').toLowerCase() !== 'paid')
    .reduce((sum, inv) => sum + (Number(inv.Amount) || 0), 0);

  // Active projects
  const activeProjectsCount = projects.filter(
    (p) => (p.status ?? '').toLowerCase() !== 'completed'
  ).length;

  // Recent invoices
  const displayInvoices = invoices.map((inv) => ({
    id: inv.InvoiceID,
    number: inv.InvoiceID,
    amount: Number(inv.Amount ?? 0),
    dueDate: inv.DueDate,
    status: inv.Status ?? 'Pending',
  }));

  const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString()}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'Client'}! 👋
        </h2>
        <p className="text-purple-100">Manage your projects and payments</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          Icon={DollarSign}
          title="Total Spent"
          value={fmtCurrency(totalSpent)}
          color="success.main"
        />
        <StatCard
          Icon={FileText}
          title="Active Projects"
          value={activeProjectsCount}
          color="primary.main"
        />
        <StatCard
          Icon={CreditCard}
          title="Pending Invoices"
          value={pendingInvoices}
          color="warning.main"
        />
        <StatCard
          Icon={Clock}
          title="Outstanding Amount"
          value={fmtCurrency(outstandingAmount)}
          color="error.main"
        />
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
        <div className="space-y-3">
          {displayInvoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Invoice #{invoice.number}</h4>
                <p className="text-sm text-gray-500">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {fmtCurrency(invoice.amount)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : invoice.status === 'Sent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
          {displayInvoices.length === 0 && (
            <p className="text-center text-gray-500 py-8">No invoices yet</p>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h3>
        <div className="space-y-3">
          {projects.slice(0, 5).map((project) => (
            <div
              key={project.ProjectID}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.Title}</h4>
                <p className="text-sm text-gray-500">{project.Description}</p>
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
          ))}
          {projects.length === 0 && (
            <p className="text-center text-gray-500 py-8">No projects yet</p>
          )}
        </div>
      </div>
    </div>
  );
}