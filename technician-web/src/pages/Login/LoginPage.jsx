import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, FileText, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { getTechnicianApplicationStatusApi } from '../../api/technicianApi';

export const LoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Application status checker (open to applicants who cannot sign in yet)
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusEmail, setStatusEmail] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res?.data?.role !== 'Technician') {
        logout();
        setError('This portal is for Technicians only. Admin, Staff and Customer users must use their respective portals.');
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      // The backend returns friendly, human-readable status messages for
      // Pending and Rejected technician accounts — never raw server errors.
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setStatusError('');
    setStatusResult(null);

    if (!statusEmail.trim()) {
      setStatusError('Please enter the email you applied with');
      return;
    }

    setStatusLoading(true);
    try {
      const res = await getTechnicianApplicationStatusApi(statusEmail.trim());
      setStatusResult(res?.data);
    } catch (err) {
      setStatusError(err.message || 'No application found for this email');
    } finally {
      setStatusLoading(false);
    }
  };

  const renderStatusResult = () => {
    if (!statusResult) return null;
    if (statusResult.status === 'Approved') {
      return (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Your technician application has been approved. You can now sign in to the Technician Portal.</span>
        </div>
      );
    }
    if (statusResult.status === 'Pending') {
      return (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-start space-x-2">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Your technician application is still under review. You will be able to access the Technician Portal after Admin approval.</span>
        </div>
      );
    }
    return (
      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start space-x-2">
        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Your technician application was not approved.
          {statusResult.rejectionReason ? ` Reason: ${statusResult.rejectionReason}` : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950">
      {/* 3D Background System */}
      <AnimatedBackground className="opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md space-y-7 glass-card p-8 rounded-3xl shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-t-3xl"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 w-fit mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-glow-emerald">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Technician Field App</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Assigned jobs, service updates, field reports & customer details</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="tech@udayelectrical.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-cta text-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Application Status Checker */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:border-emerald-600/40 hover:text-emerald-600 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Check Application Status</span>
          </button>

          {statusOpen && (
            <form onSubmit={handleCheckStatus} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Email used in your application"
                  value={statusEmail}
                  onChange={(e) => setStatusEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                />
              </div>

              {statusError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {statusError}
                </div>
              )}
              {renderStatusResult()}

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600/10 border border-emerald-600/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold hover:bg-emerald-600/20 transition-all"
              >
                {statusLoading ? 'Checking...' : 'Check Status'}
              </button>
            </form>
          )}
        </div>

        {/* Apply as Technician */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Don't have a technician account?{' '}
            <Link
              to="/apply"
              className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Apply as Technician</span>
            </Link>
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secured by JWT Authentication · Role-based Access Control</span>
        </div>
      </motion.div>
    </div>
  );
};
