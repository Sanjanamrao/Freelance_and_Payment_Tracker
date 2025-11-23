

import React from 'react';
import StatCard from '../components/StatCard.jsx';
import { DollarSign, Briefcase, Users, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const monthlyData = [
  { month: 'Jun', earnings: 3200, projects: 4 },
  { month: 'Jul', earnings: 4500, projects: 5 },
  { month: 'Aug', earnings: 5200, projects: 6 },
  { month: 'Sep', earnings: 6800, projects: 7 },
  { month: 'Oct', earnings: 7500, projects: 8 },
  { month: 'Nov', earnings: 8500, projects: 9 },
];

const statusData = [
  { name: 'Completed', value: 35, color: '#10b981' },
  { name: 'In Progress', value: 45, color: '#3b82f6' },
  { name: 'Pending', value: 20, color: '#f59e0b' },
];

const projects = [
  { id: 1, name: 'E-commerce Website', client: 'TechCorp', status: 'In Progress', budget: 5000, paid: 2500, deadline: '2024-12-15', progress: 60 },
  { id: 2, name: 'Mobile App Design', client: 'StartupXYZ', status: 'Completed', budget: 3500, paid: 3500, deadline: '2024-11-20', progress: 100 },
  { id: 3, name: 'Logo Design', client: 'BrandCo', status: 'In Progress', budget: 1200, paid: 0, deadline: '2024-12-01', progress: 30 },
  { id: 4, name: 'Website Redesign', client: 'RetailHub', status: 'Pending', budget: 4500, paid: 0, deadline: '2024-12-20', progress: 0 },
  { id: 5, name: 'SEO Optimization', client: 'MarketingPro', status: 'In Progress', budget: 2000, paid: 1000, deadline: '2024-11-28', progress: 50 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard Icon={DollarSign} title="Total Earnings" value={`$45,750`} colorClass="bg-green-500" trend="+12.5%" />
        <StatCard Icon={Briefcase} title="Active Projects" value={8} colorClass="bg-blue-500" trend="+3 this month" />
        <StatCard Icon={Users} title="Total Clients" value={12} colorClass="bg-purple-500" />
        <StatCard Icon={AlertCircle} title="Pending Payments" value={`$8,500`} colorClass="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
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

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
        <div className="space-y-3">
          {projects.slice(0, 5).map(project => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${project.budget}</p>
                  <p className="text-xs text-gray-500">${project.paid} paid</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
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

