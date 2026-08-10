import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Clock, CheckCircle2, Phone, Zap } from 'lucide-react';
import { useServices, useCreateBooking } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';
import { AnimatedSection } from '../../components/AnimatedSection';
import { SpotlightCard } from '../../components/SpotlightCard';

export const ServicesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(null);
  
  const [address, setAddress] = useState(user?.address || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const { data: res, isLoading } = useServices();
  const createBookingMutation = useCreateBooking();

  const services = res?.data || [];

  const handleOpenBooking = (service) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActiveService(service);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!preferredDate || !address) {
      setSubmitError('Please complete required service date and address fields');
      return;
    }

    try {
      await createBookingMutation.mutateAsync({
        serviceId: activeService._id,
        address,
        preferredDate,
        notes
      });
      setSubmitSuccess('Service booking created successfully!');
      setTimeout(() => {
        setActiveService(null);
        navigate('/dashboard/bookings');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit service booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Hero Header */}
      <AnimatedSection direction="up">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden space-y-5">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FF6B00]/20 blur-[110px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#0066FF]/20 blur-[110px] rounded-full pointer-events-none"></div>

          <div className="relative">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Doorstep Electrician Services</span>
            </span>
          </div>

          <div className="relative space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
              Home Repair & Installation <span className="text-gradient-orange">Services</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Licensed wiremen in Jamshedpur for fan repair, geyser repair, house wiring, MCB replacement & 24/7 emergency electrical visits. Every job backed by a 6-month warranty.
            </p>
          </div>

          <div className="relative flex flex-wrap items-center gap-4 pt-1">
            <a href="tel:7903789402" className="btn-cta px-6 py-3 text-xs">
              <Phone className="w-4 h-4" />
              <span>Call Now: 7903789402</span>
            </a>
            <div className="flex items-center space-x-3 text-[11px] font-bold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                <span>30-Min Doorstep ETA</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>Rated 4.9/5</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Services Grid */}
      {isLoading ? (
        <LoadingSpinner message="Loading services catalog..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <SpotlightCard className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card transition-shadow hover:shadow-card-hover flex flex-col justify-between group">
              <div className="h-52 overflow-hidden relative">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={service.status} />
                </div>
                <div className="absolute -bottom-5 left-6 p-3 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-amber-500 text-white shadow-lg shadow-[#FF6B00]/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">{service.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover:text-orange-500 transition-colors font-display">{service.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{service.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Duration:</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{service.estimatedDuration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Est. Cost</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(service.estimatedPrice)}</span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(service)}
                      className="btn-cta px-5 py-2.5 text-xs"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Request Modal */}
      <Modal isOpen={!!activeService} onClose={() => setActiveService(null)} title={`Request Service: ${activeService?.title}`}>
        {activeService && (
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-orange-400 uppercase">Selected Service</span>
              <p className="text-sm font-bold text-white">{activeService.title}</p>
              <p className="text-xs text-slate-400">Standard Estimated Fee: {formatCurrency(activeService.estimatedPrice)}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Preferred Service Date *</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Home / Site Address *</label>
              <textarea
                rows={2}
                placeholder="Enter complete address with locality..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Fault Symptoms & Notes</label>
              <textarea
                rows={2}
                placeholder="Fan noise, MCB tripping, no heating..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-xs shadow-md shadow-orange-500/30"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
