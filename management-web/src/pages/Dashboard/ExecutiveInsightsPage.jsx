import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Award, Users, ShieldCheck, Zap } from 'lucide-react';
import { useAnalytics } from '../../hooks/useErpQueries';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const ExecutiveInsightsPage = () => {
  const { data: analyticsRes, isLoading } = useAnalytics();
  const data = analyticsRes?.data || {};

  const revenueData = [
    { month: 'Jan', revenue: 620000, profit: 180000 },
    { month: 'Feb', revenue: 780000, profit: 240000 },
    { month: 'Mar', revenue: 950000, profit: 310000 },
    { month: 'Apr', revenue: 890000, profit: 280000 },
    { month: 'May', revenue: 1120000, profit: 390000 },
    { month: 'Jun', revenue: 1485000, profit: 495000 }
  ];

  const techProductivity = [
    { name: 'K. Ramesh', jobsCompleted: 24, rating: 4.9 },
    { name: 'M. Suresh', jobsCompleted: 19, rating: 4.8 },
    { name: 'P. Anand', jobsCompleted: 21, rating: 4.9 },
    { name: 'V. Naidu', jobsCompleted: 15, rating: 4.7 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Executive Business Intelligence & Profit Trends</h1>
        <p className="text-xs text-slate-400">High-level financial KPIs, gross profit forecasting & technician productivity metrics</p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Calculating executive analytics..." />
      ) : (
        <div className="space-y-8 text-xs">
          
          {/* Executive Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gross Revenue (YTD)</span>
              <h3 className="text-2xl font-black text-white">{formatCurrency(data.totalRevenue || 5845000)}</h3>
              <p className="text-[11px] text-emerald-400 font-bold">+28% vs last fiscal</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Net Profit Margin</span>
              <h3 className="text-2xl font-black text-orange-400">33.2%</h3>
              <p className="text-[11px] text-slate-400">High margin on motor rewinding</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Customer Base</span>
              <h3 className="text-2xl font-black text-blue-400">{data.userCount || 42} Enterprise Clients</h3>
              <p className="text-[11px] text-slate-400">84% Repeat AMC Rate</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Job Completion Rate</span>
              <h3 className="text-2xl font-black text-emerald-400">98.5%</h3>
              <p className="text-[11px] text-slate-400">Avg 48h turnaround</p>
            </div>
          </div>

          {/* Revenue & Profit Growth Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white">Revenue & Net Profit Trend (H1 2026)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" name="Gross Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#profGrad)" name="Net Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technician Productivity Leaderboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white">Field Technician Productivity Leaderboard</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techProductivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="jobsCompleted" fill="#38BDF8" radius={[8, 8, 0, 0]} name="Jobs Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
