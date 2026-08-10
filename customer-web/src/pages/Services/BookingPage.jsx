import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, Phone, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import { getServiceByIdApi } from '../../api/serviceApi';
import { createBookingApi } from '../../api/bookingApi';
import { formatCurrency } from '../../utils/formatters';
import { Seo } from '../../components/Seo';
import { useAuth } from '../../hooks/useAuth';

const TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM'
];

const minDate = new Date();
minDate.setDate(minDate.getDate() + 1);
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 60);

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: res, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceByIdApi(id),
    enabled: !!id
  });

  const service = res?.data;

  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-slate-950 text-sm font-bold text-[#475569]">
        Loading service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-950 px-4 text-center">
        <h1 className="text-xl font-black text-[#0F172A] dark:text-white">Service not found</h1>
        <Link to="/services" className="px-6 py-3 rounded-2xl bg-[#FF6B00] text-white font-black text-xs hover:bg-[#E55A00] transition-all">
          Back to Services
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isAuthenticated) {
      setError('Please sign in to book a service.');
      return;
    }
    if (!preferredDate) {
      setError('Please choose a preferred date.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createBookingApi({
        service: service._id,
        address,
        preferredDate,
        preferredTime,
        notes
      });
      setSuccess(result?.data?.booking || result?.data || result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Could not submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors duration-300">
      <Seo
        title={`Book ${service.title} | Uday Electrical Works, Jamshedpur`}
        description={`Book ${service.title} online — starting from ${formatCurrency(service.estimatedPrice)}. Uday Electrical Works, Chhota Govindpur, Jamshedpur. Call 7903789402.`}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#475569] dark:text-slate-400 hover:text-[#FF6B00] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-widest">Book a Visit</span>
          <h1 className="text-3xl font-black text-[#0F172A] dark:text-white font-display">{service.title}</h1>
          <p className="text-sm text-[#475569] dark:text-slate-400">
            Starting fee {formatCurrency(service.estimatedPrice)} · Duration {service.estimatedDuration}
          </p>
        </div>

        {success ? (
          <div className="p-8 rounded-3xl bg-[#00C853]/10 border border-[#00C853]/30 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#00C853] mx-auto" />
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">Booking Submitted!</h2>
            <p className="text-sm text-[#475569] dark:text-slate-300">
              Booking number: <strong className="text-[#0F172A] dark:text-white">{success.bookingNumber}</strong>
              <br />
              We'll assign a wireman for {success.preferredDate?.split('T')[0]} ({success.preferredTime}).
              Track the status anytime in your dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/dashboard/bookings" className="px-6 py-3 rounded-2xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md">
                Track My Bookings
              </Link>
              <a href="tel:7903789402" className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center space-x-2 hover:border-[#FF6B00] transition-all">
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span>Call: 7903789402</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
                {!isAuthenticated && (
                  <Link to="/login" className="font-black underline">Sign In</Link>
                )}
              </div>
            )}

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-card space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                  Service Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="House no., street, colony, area (e.g. Govindpur Housing Colony)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      min={minDate.toISOString().split('T')[0]}
                      max={maxDate.toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all appearance-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#475569] dark:text-slate-300 mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the problem — e.g. ceiling fan not starting, geyser not heating, switch sparking..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-sm text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 text-[11px] text-[#475569] dark:text-slate-400 space-y-1">
              <p>• Starting fee {formatCurrency(service.estimatedPrice)} — final price confirmed with you before work begins.</p>
              <p>• Shop hours: Mon–Sat, 8:30 AM – 9:00 PM. Service visits follow shop hours.</p>
              <p>• A wireman from our team will be assigned to your slot.</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl btn-cta text-sm"
            >
              <span>{submitting ? 'Submitting...' : 'Confirm Booking'}</span>
            </button>

            {!isAuthenticated && (
              <p className="text-center text-xs text-[#475569] dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-orange-500 hover:underline">Sign in to book faster</Link>{' '}
                — or{' '}
                <a href="tel:7903789402" className="font-black text-orange-500 hover:underline">call 7903789402</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
