import React, { useState } from 'react';
import { Shield, Clock, Search, Filter, UserCheck, Layers } from 'lucide-react';
import { useActivityLogs } from '../../hooks/useErpQueries';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const SystemAuditLogsPage = () => {
  const [actionFilter, setActionFilter] = useState('');
  const { data: res, isLoading } = useActivityLogs({ action: actionFilter });

  const logs = res?.data || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System Activity Audit Trail</h1>
          <p className="text-xs text-slate-500">Security event monitoring, user action tracking & compliance audit history</p>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          {['All', 'LOGIN', 'CREATE_PRODUCT', 'CREATE_BOOKING', 'CREATE_INVOICE', 'INVENTORY_CHANGE'].map((a) => {
            const isSelected = (actionFilter === '' && a === 'All') || actionFilter === a;
            return (
              <button
                key={a}
                onClick={() => setActionFilter(a === 'All' ? '' : a)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching activity logs..." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Entity</th>
                  <th className="px-4 py-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No activity logs recorded.</td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDateTime(l.timestamp || l.createdAt)}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">
                        {l.user?.name ? `${l.user.name} (${l.user.role})` : 'System Engine'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 font-mono font-bold text-[10px]">
                          {l.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-sky-600">{l.entity}</td>
                      <td className="px-4 py-2.5 text-slate-600">{l.details || l.entityId || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
