import React, { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Phone, Mail, User, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Wrench, Home, MessageSquareText, PartyPopper, Lock
} from 'lucide-react';
import { getServiceByIdApi, getServicesApi } from '../../api/serviceApi';
import { createBookingApi } from '../../api/bookingApi';
import { formatCurrency } from '../../utils/formatters';
import { Seo } from '../../components/Seo';
import { useAuth } from '../../hooks/useAuth';

export const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM'
];

const toLocalDateInput = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const STEPS = [
  { key: 'service', label: 'Choose Service', icon: Wrench },
  { key: 'datetime', label: 'Date & Time', icon: Calendar },
  { key: 'address', label: 'Enter Address', icon: Home },
  { key: 'problem', label: 'Describe Problem', icon: MessageSquareText },
  { key: 'review', label: 'Review', icon: CheckCircle2 }
];

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [selectedServiceId, setSelectedServiceId] = useState(id || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Jamshedpur');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [problem, setProblem] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const { data: servicesRes, isLoading: loadingServices } = useQuery({
    queryKey: ['services', { status: 'Active' }],
    queryFn: () => getServicesApi({ status: 'Active' }),
    enabled: !id
  });

  const { data: serviceRes, isLoading: loadingService } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceByIdApi(id),
    enabled: !!id
  });

  const services = servicesRes?.data || [];
  const preselected = serviceRes?.data;

  const selectedService = useMemo(
    () => services.find((s) => s._id === selectedServiceId) || preselected || null,
    [services, selectedServiceId, preselected]
  );

  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category))],
    [services]
  );
  const [category, setCategory] = useState('');

  const minDate = toLocalDateInput(new Date());
  const maxDate = toLocalDateInput(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

  const goTo = (next) => {
    if (next < 0 || next > STEPS.length - 1) return;
    setDirection(next > step ? 1 : -1);
    setError('');
    setStep(next);
  };

  const canContinue = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!preferredDate && !!preferredTime;
    if (step === 2) return !!name.trim() && !!phone.trim() && !!address.trim();
    if (step === 3) return true;
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!isAuthenticated) {
      setError('Please sign in to book a service.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createBookingApi({
        serviceId: selectedService._id,
        contactName: name,
        contactPhone: phone,
        contactEmail: email,
        address,
        city,
        pincode,
        landmark,
        preferredDate,
        preferredTime,
        notes: problem
      });
      setSuccess(result?.data || result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Could not submit the request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = loadingServices || loadingService;

  const inputCls =
    'w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title="Book an Electrician in Jamshedpur | Uday Electrical Works"
        description="Book a doorstep electrician in Jamshedpur online: fan repair, wiring, lighting, MCB services and more. Or call 7903789402."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#475569] dark:text-slate-400 hover:text-[#F97316] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-extrabold text-[#F97316] uppercase tracking-widest">Book a Service</span>
          <h1 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">Request an Electrician Visit</h1>
          <p className="text-sm text-[#475569] dark:text-slate-400">
            Pick a service, choose your slot, tell us the problem, we handle the rest.
          </p>
        </div>

        {/* Success screen */}
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 rounded-xl bg-gradient-to-br from-[#00C853]/10 to-emerald-500/5 border border-[#00C853]/30 text-center space-y-5"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
              className="w-20 h-20 rounded-full bg-[#00C853] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#00C853]/30"
            >
              <PartyPopper className="w-10 h-10" />
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">Service request received</h2>
              <p className="text-sm text-[#475569] dark:text-slate-300">
                Booking ID: <strong className="font-mono text-[#F97316]">{success.bookingNumber || success._id}</strong>
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-2.5 text-left text-xs">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex justify-between">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-[#0F172A] dark:text-white">{success.service?.title || selectedService?.title}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex justify-between">
                <span className="text-slate-400">Requested date</span>
                <span className="font-bold text-[#0F172A] dark:text-white">{new Date(success.preferredDate).toLocaleDateString()}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 flex justify-between">
                <span className="text-slate-400">Requested time</span>
                <span className="font-bold text-[#0F172A] dark:text-white">{success.preferredTime}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F97316]/5 border border-[#F97316]/25 flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Awaiting Assignment
                </span>
              </div>
            </div>

            <p className="text-xs text-[#475569] dark:text-slate-400">
              We'll notify you as soon as a technician is assigned. Track everything in your dashboard.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/dashboard/bookings" className="px-6 py-3 rounded-2xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md">
                Track My Bookings
              </Link>
              <a href="tel:7903789402" className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center space-x-2 hover:border-[#F97316] transition-all">
                <Phone className="w-4 h-4 text-[#F97316]" />
                <span>Call: 7903789402</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-black transition-all ${
                      i < step
                        ? 'bg-[#00C853] text-white'
                        : i === step
                          ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/30 scale-110'
                          : 'bg-[#F1F5F9] dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-6 sm:w-10 h-0.5 rounded ${i < step ? 'bg-[#00C853]' : 'bg-[#E2E8F0] dark:bg-slate-800'}`} />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                {!isAuthenticated && (
                  <Link to="/login" className="font-black underline shrink-0">Sign In</Link>
                )}
              </motion.div>
            )}

            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* STEP 0 — SERVICE */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                        <Wrench className="w-5 h-5 text-[#F97316]" />
                        <span>Choose Service</span>
                      </h2>

                      {isLoading ? (
                        <div className="space-y-3">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="h-14 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 animate-pulse" />
                          ))}
                        </div>
                      ) : selectedService ? (
                        <div className="p-4 rounded-2xl bg-[#F97316]/5 border border-[#F97316]/25 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">{selectedService.category}</p>
                            <h3 className="font-black text-[#0F172A] dark:text-white">{selectedService.title}</h3>
                            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1">
                              Starting fee {formatCurrency(selectedService.estimatedPrice)} · {selectedService.estimatedDuration}
                            </p>
                          </div>
                          {!id && (
                            <button
                              onClick={() => setSelectedServiceId('')}
                              className="shrink-0 text-xs font-bold text-[#F97316] hover:underline"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Category chips */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setCategory('')}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                !category
                                  ? 'bg-[#F97316] text-white border-[#F97316]'
                                  : 'bg-white dark:bg-slate-950 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300'
                              }`}
                            >
                              All
                            </button>
                            {categories.map((c) => (
                              <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                  category === c
                                    ? 'bg-[#F97316] text-white border-[#F97316]'
                                    : 'bg-white dark:bg-slate-950 border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300'
                                }`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>

                          {/* Service cards */}
                          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                            {services
                              .filter((s) => !category || s.category === category)
                              .map((s) => (
                                <button
                                  key={s._id}
                                  onClick={() => setSelectedServiceId(s._id)}
                                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                    selectedServiceId === s._id
                                      ? 'border-[#F97316] bg-[#F97316]/5 ring-2 ring-[#F97316]/20'
                                      : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-[#F97316]/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-xs text-slate-400 uppercase font-bold">{s.category}</p>
                                      <h3 className="font-bold text-sm text-[#0F172A] dark:text-white">{s.title}</h3>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="block text-sm font-black text-[#F97316]">{formatCurrency(s.estimatedPrice)}</span>
                                      <span className="text-[10px] text-slate-400">{s.estimatedDuration}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* STEP 1 — DATE & TIME */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-[#F97316]" />
                        <span>Choose Date & Time</span>
                      </h2>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            required
                            min={minDate}
                            max={maxDate}
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className={`${inputCls} pl-10`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-2">
                          Preferred Time Slot *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setPreferredTime(slot)}
                              className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border text-xs font-bold transition-all ${
                                preferredTime === slot
                                  ? 'border-[#F97316] bg-[#F97316]/5 text-[#F97316] ring-2 ring-[#F97316]/20'
                                  : 'border-[#E2E8F0] dark:border-slate-800 text-[#475569] dark:text-slate-300 hover:border-[#F97316]/50'
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              {slot}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Our wiremen visit during these slots. Shop hours: Mon-Sat, 8:30 AM - 9:00 PM.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — ADDRESS */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                        <Home className="w-5 h-5 text-[#F97316]" />
                        <span>Your Details & Service Address</span>
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Phone *
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="10-digit mobile number"
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Email (for updates)
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Full Address *
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="House no., street, colony, area"
                              className={`${inputCls} pl-10`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Pincode
                          </label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="e.g. 831015"
                            className={inputCls}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                            Landmark (optional)
                          </label>
                          <input
                            type="text"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            placeholder="Near market / temple / school"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {isAuthenticated && (
                        <p className="text-[11px] text-slate-400">
                          Pre-filled from your account, feel free to edit before submitting.
                        </p>
                      )}
                    </div>
                  )}

                  {/* STEP 3 — PROBLEM */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                        <MessageSquareText className="w-5 h-5 text-[#F97316]" />
                        <span>Describe the Problem</span>
                      </h2>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                          What's happening? *
                        </label>
                        <textarea
                          rows={5}
                          value={problem}
                          onChange={(e) => setProblem(e.target.value)}
                          placeholder="e.g. Ceiling fan is making noise and sometimes stops."
                          className={`${inputCls} resize-none`}
                        />
                        <p className="text-[11px] text-slate-400 mt-2">
                          The more detail you share, the better your wireman can prepare. You can also
                          call <a href="tel:7903789402" className="font-bold text-[#F97316]">7903789402</a> for urgent help.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — REVIEW */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <h2 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
                        <span>Review & Confirm</span>
                      </h2>

                      <div className="space-y-2.5 text-xs">
                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Service</p>
                          <p className="font-black text-[#0F172A] dark:text-white">{selectedService?.title}</p>
                          <p className="text-slate-400">{selectedService?.category} · {formatCurrency(selectedService?.estimatedPrice)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                            <p className="font-bold text-[#0F172A] dark:text-white">{new Date(preferredDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Time slot</p>
                            <p className="font-bold text-[#0F172A] dark:text-white">{preferredTime}</p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Service address</p>
                          <p className="font-semibold text-[#0F172A] dark:text-white">{address}</p>
                          <p className="text-slate-400">{city}{pincode ? ` · ${pincode}` : ''}{landmark ? ` · Near ${landmark}` : ''}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Contact</p>
                          <p className="font-semibold text-[#0F172A] dark:text-white">{name} · {phone}</p>
                          {email && <p className="text-slate-400">{email}</p>}
                        </div>

                        {problem && (
                          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Problem description</p>
                            <p className="text-[#475569] dark:text-slate-300">{problem}</p>
                          </div>
                        )}

                        <div className="p-3.5 rounded-2xl bg-[#F97316]/5 border border-[#F97316]/25 text-[11px] text-[#475569] dark:text-slate-300">
                          <Lock className="w-3.5 h-3.5 inline mr-1 text-[#F97316]" />
                          A technician will be assigned after review. No advance payment needed, fees are confirmed before work begins.
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            <div className="mt-5 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  onClick={() => goTo(step - 1)}
                  className="inline-flex items-center space-x-1.5 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs hover:border-[#F97316] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <span />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => goTo(step + 1)}
                  disabled={!canContinue()}
                  className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl btn-cta text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-[#00C853] hover:bg-[#00B34A] text-white font-black text-xs shadow-card transition-all disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Request Service</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {!isAuthenticated && step === STEPS.length - 1 && (
              <p className="text-center text-xs text-[#475569] dark:text-slate-400 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-[#F97316] hover:underline">Sign in to book faster</Link>
                {' '}or{' '}
                <a href="tel:7903789402" className="font-black text-[#F97316] hover:underline">call 7903789402</a>.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
