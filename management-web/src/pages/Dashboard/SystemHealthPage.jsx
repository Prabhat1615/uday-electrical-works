import React from 'react';
import { Activity, ShieldCheck, Cpu, HardDrive, Wifi, Lock } from 'lucide-react';
import { useSystemHealthMetrics } from '../../hooks/useErpQueries';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SystemHealthPage = () => {
  const { data: res, isLoading } = useSystemHealthMetrics();
  const metrics = res?.data || {};

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">System Infrastructure & Health Monitoring</h1>
        <p className="text-xs text-slate-500">Server uptime, Node.js heap memory, rate limit protection & database connection pool status</p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Inspecting server health metrics..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Engine Status</span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                {metrics.status}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{metrics.uptime} Uptime</h3>
            <p className="text-slate-500">Server API Version: {metrics.apiVersion}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Memory Allocation</span>
              <Cpu className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{metrics.memoryUsageMB} MB Heap Used</h3>
            <p className="text-slate-500">Optimized V8 Garbage Collection</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-card">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Protection</span>
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Rate-Limit & Helmet Active</h3>
            <p className="text-slate-500">{metrics.securityStatus}</p>
          </div>

        </div>
      )}

    </div>
  );
};
