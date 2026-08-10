import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Phone, MapPin, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AnimatedBackground } from '../../components/AnimatedBackground';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        phone,
        address
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all';
  const labelClass =
    'block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5';
  const iconClass = 'w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2';

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950">
      {/* 3D Background System */}
      <AnimatedBackground className="opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg space-y-7 glass-card p-8 rounded-3xl shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-t-3xl"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 w-fit mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 shadow-glow-orange">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Create New Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Register as a customer, technician, or staff member</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name / Business *</label>
              <div className="relative">
                <User className={iconClass} />
                <input
                  type="text"
                  required
                  placeholder="Sri Krishna Mills"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-semibold"
              >
                <option value="Customer">Customer / Factory Client</option>
                <option value="Technician">Service Technician</option>
                <option value="Staff">Sales & Operations Staff</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone className={iconClass} />
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Company / Plant Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={2}
                placeholder="Plot no, Industrial zone..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-cta text-sm"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-orange-500 hover:text-orange-600 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-2 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Your data is protected · Password hashed securely</span>
        </div>
      </motion.div>
    </div>
  );
};
