import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Clock, CheckCircle2 } from 'lucide-react';
import { useServices, useCreateBooking } from '../../hooks/useErpQueries';
import { useAuth } from '../../hooks/useAuth';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../components/Modal';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest">Engineering Services Solutions</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Industrial Electrical Maintenance</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Complete 3-phase motor rewinding, oil dielectric testing, APFC panel fabrication, and electrical safety audits.
        </p>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <LoadingSpinner message="Loading services catalog..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-orange-500/40 transition-colors"
            >
              <div className="h-52 overflow-hidden relative">
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={service.status} />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">{service.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-orange-400 transition-colors">{service.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{service.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>Duration:</span>
                    </span>
                    <span className="font-bold text-slate-200">{service.estimatedDuration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Est. Cost</span>
                      <span className="text-xl font-black text-white">{formatCurrency(service.estimatedPrice)}</span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(service)}
                      className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-orange-500/10"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              </div>
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
              <label className="block text-slate-300 font-bold uppercase mb-1">Site / Factory Address *</label>
              <textarea
                rows={2}
                placeholder="Enter complete industrial plant location..."
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
                placeholder="Motor HP, trip codes, symptoms..."
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
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs shadow-md"
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
