import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  Mail,
  Lock,
  Phone,
  MapPin,
  User,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Send,
  Briefcase
} from 'lucide-react';
import { applyAsTechnicianApi } from '../../api/technicianApi';
import { AnimatedBackground } from '../../components/AnimatedBackground';

const MAX_LENGTHS = {
  name: 100,
  email: 100,
  phone: 20,
  address: 300,
  skills: 500,
  specialization: 200,
  experience: 500,
  additionalInfo: 1000,
  password: 100
};

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const ApplyPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    specialization: '',
    experience: '',
    additionalInfo: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > (MAX_LENGTHS[name] || Infinity)) return;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email address is required';
    if (!EMAIL_REGEX.test(form.email.trim())) return 'Please enter a valid email address';
    if (!form.phone.trim()) return 'Phone number is required';
    if (!form.address.trim()) return 'Address is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await applyAsTechnicianApi({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        skills: form.skills.trim(),
        specialization: form.specialization.trim(),
        experience: form.experience.trim(),
        additionalInfo: form.additionalInfo.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950">
        <AnimatedBackground className="opacity-70" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl text-center space-y-6"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-t-3xl"></div>

          <div className="p-3 w-fit mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Application Submitted</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Application submitted successfully. Your application is awaiting Admin approval.
              <br />
              <span className="text-xs text-slate-400">
                You will be able to access the Technician Portal once your application is approved.
              </span>
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
            <Link
              to="/login"
              className="w-full py-3 rounded-xl btn-cta text-sm flex items-center justify-center space-x-2"
            >
              <span>Back to Sign In</span>
            </Link>
            <button
              onClick={() => navigate('/')}
              className="w-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors"
            >
              ← Back to storefront
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all';
  const labelClass =
    'block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1.5';

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950">
      <AnimatedBackground className="opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl glass-card p-8 rounded-3xl shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-t-3xl"></div>

        {/* Header */}
        <div className="text-center space-y-2 mb-7">
          <div className="p-3 w-fit mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-glow-emerald">
            <Wrench className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">Apply as Technician</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit your application for review. A technician account becomes active only after Admin approval.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.name}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.email}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.phone}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Current address / service area"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.address}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-4 h-4" />
              <span>Professional Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Skills</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Motor rewinding, wiring, panel installation"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.skills}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Electrical Specialization</label>
                <div className="relative">
                  <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Industrial motors, transformers"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.specialization}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Relevant Experience</label>
                <textarea
                  rows={2}
                  placeholder="Years of experience, previous employers, certifications, etc."
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  maxLength={MAX_LENGTHS.experience}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Additional Information</label>
                <textarea
                  rows={2}
                  placeholder="Anything else you would like the Admin to know"
                  name="additionalInfo"
                  value={form.additionalInfo}
                  onChange={handleChange}
                  maxLength={MAX_LENGTHS.additionalInfo}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>Account Security</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.password}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-enter password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    maxLength={MAX_LENGTHS.password}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-cta text-sm"
          >
            <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
            {!loading && <Send className="w-4 h-4" />}
          </button>
        </form>

        <div className="pt-5 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <span className="text-[11px] text-slate-400 font-semibold">
            Applications require Admin approval
          </span>
        </div>
      </motion.div>
    </div>
  );
};
