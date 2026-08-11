import React, { useState } from 'react';
import { Database, Download, Upload, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { exportDataApi, importDataApi } from '../../api/backupApi';

export const BackupRestorePage = () => {
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleExport = async () => {
    setDownloading(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const res = await exportDataApi();
      const backupData = res?.data;

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `uday_erp_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatusMsg('JSON Database backup file generated & downloaded successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Export backup failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('Restoring from backup JSON will overwrite database records. Do you wish to continue?')) {
      return;
    }

    setRestoring(true);
    setStatusMsg('');
    setErrorMsg('');

    try {
      const text = await file.text();
      const backupJSON = JSON.parse(text);

      await importDataApi({ backup: backupJSON });
      setStatusMsg('Database restored successfully from JSON backup file!');
    } catch (err) {
      setErrorMsg(err.message || 'Import restore failed. Invalid JSON structure.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Database Backup & System Restore</h1>
        <p className="text-xs text-slate-500">Export database snapshots as JSON backups or import restore files</p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Export Database Backup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download a complete JSON snapshot containing users, products, services, sales orders, leads, and procurement history.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={downloading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating Snapshot...' : 'Download JSON Backup'}</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Restore Database From File</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a previously downloaded JSON backup snapshot to restore database inventory and master records.
            </p>
          </div>

          <label className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-extrabold text-xs transition-all border border-slate-200 flex items-center justify-center space-x-2 cursor-pointer text-center">
            <Upload className="w-4 h-4 text-sky-600" />
            <span>{restoring ? 'Restoring Database...' : 'Select Backup JSON File'}</span>
            <input type="file" accept=".json" onChange={handleImportFile} disabled={restoring} className="hidden" />
          </label>
        </div>

      </div>

    </div>
  );
};
