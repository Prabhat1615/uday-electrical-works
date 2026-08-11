import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, Layers, TrendingUp, UserCheck, Package } from 'lucide-react';
import { getExportReportApi } from '../../api/reportApi';
import { ExportButton } from '../../components/ExportButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReportsPage = () => {
  const [reportType, setReportType] = useState('revenue');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await getExportReportApi(reportType);
        setData(res?.data || []);
      } catch (err) {
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Enterprise Reporting & Data Export</h1>
          <p className="text-xs text-slate-500">Generate compliance ledgers, inventory valuation, technician performance & CSV exports</p>
        </div>

        <ExportButton
          filename={`uday_erp_${reportType}_report.csv`}
          data={data}
          title={`Download ${reportType.toUpperCase()} CSV`}
        />
      </div>

      {/* Report Selection Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'revenue', label: 'Revenue & Invoices' },
          { id: 'inventory', label: 'Inventory Valuation' },
          { id: 'bookings', label: 'Service Bookings' },
          { id: 'technicians', label: 'Technician Performance' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setReportType(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              reportType === item.id
                ? 'bg-amber-500 text-white shadow-card'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Report Content Table */}
      {loading ? (
        <LoadingSpinner message={`Compiling ${reportType} ledger...`} />
      ) : data.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
          <BarChart3 className="w-10 h-10 text-amber-600/50 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">No report data generated</h3>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm capitalize">{reportType} Detailed Ledger</h3>
            <span className="text-xs text-slate-500 font-semibold">{data.length} Total Records</span>
          </div>

          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 sticky top-0">
                <tr>
                  {Object.keys(data[0] || {}).slice(0, 7).map((key) => (
                    <th key={key} className="px-4 py-2.5">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {Object.values(row).slice(0, 7).map((val, i) => (
                      <td key={i} className="px-4 py-2.5 truncate max-w-xs font-semibold">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
