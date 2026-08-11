import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { createBookingApi } from '../api/bookingApi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const availableServices = [
  { id: 'house-wiring', name: 'House Wiring & Load Distribution', price: '₹499 base inspection', time: '1-3 Hours' },
  { id: 'electrical-repair', name: 'Short Circuit & Fault Repair', price: '₹249 inspection', time: '30-60 Mins' },
  { id: 'fan-service', name: 'Ceiling / Exhaust Fan Fitting & Repair', price: '₹199 / fan', time: '30 Mins' },
  { id: 'switch-socket', name: 'Modular Switch & Socket Replacement', price: '₹149 / fitting', time: '20 Mins' },
  { id: 'geyser-fitting', name: 'Geyser & Stabilizer Installation', price: '₹399 / unit', time: '45 Mins' },
  { id: 'lighting-setup', name: 'LED Panel & Profile Light Fitting', price: '₹299 base', time: '45 Mins' }
];

const timeSlots = [
  'Morning (09:00 AM - 12:00 PM)',
  'Afternoon (12:00 PM - 04:00 PM)',
  'Evening (04:00 PM - 08:00 PM)'
];

export const InteractiveBookingFlowModal = ({ isOpen, onClose, initialService = null }) => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(initialService || availableServices[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('Chhota Govindpur');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNextStep = () => {
    setError('');
    if (step === 1 && !service) {
      setError('Please select a service to proceed.');
      return;
    }
    if (step === 3 && !address.trim()) {
      setError('Please enter your street address.');
      return;
    }
    if (step === 4) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setError('Please enter your full name and mobile number.');
        return;
      }
      submitBooking();
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(Math.max(1, step - 1));
  };

  const submitBooking = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isAuthenticated) {
        setError('Please sign in to place a service booking, or call 7903789402.');
        setLoading(false);
        return;
      }

      const payload = {
        serviceType: service.name,
        preferredDate: selectedDate,
        timeSlot: selectedTimeSlot,
        address: `${address}, ${locality}, Jamshedpur`,
        customerName,
        phone: customerPhone,
        notes
      };

      const res = await createBookingApi(payload);
      setBookingRef(res.data?.bookingNumber || res.data?._id || 'UEW-BOOKED');
      setStep(5);
    } catch (err) {
      setError(err.message || 'Failed to submit booking. Please call 7903789402 directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden z-10 my-6"
        >
          {/* Top Bar with Stepper Indicator */}
          <div className="bg-[#111318] text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#D6A84F] text-[#111318]">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display">Book Doorstep Electrician Visit</h3>
                <p className="text-[11px] text-slate-400">Step {step} of 5 — Uday Electrical Works Wiremen</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Hairline */}
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-[#D6A84F]"
              initial={{ width: '20%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#D95C5C] text-xs font-bold flex items-center space-x-2">
                <Zap className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Select Service */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#111318] font-display">1. Select Electrical Service Needed</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableServices.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => setService(svc)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        service?.id === svc.id
                          ? 'bg-[#FAF6EC] border-[#D6A84F] shadow-xs'
                          : 'bg-white border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-[#111318] font-display">{svc.name}</span>
                        {service?.id === svc.id && <CheckCircle2 className="w-4 h-4 text-[#D6A84F] shrink-0" />}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#C99532]">{svc.price}</span>
                        <span>{svc.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Preferred Date & Time */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#111318] font-display">2. Select Preferred Visit Time</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1.5 font-display">Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111318] focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111318] mb-1.5 font-display">Preferred Time Window</label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            selectedTimeSlot === slot
                              ? 'bg-[#FAF6EC] border-[#D6A84F] text-[#C99532]'
                              : 'bg-white border-[#E5E7EB] text-[#111318] hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D6A84F]" />
                            {slot}
                          </span>
                          {selectedTimeSlot === slot && <CheckCircle2 className="w-4 h-4 text-[#D6A84F]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Address & Locality */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#111827] font-display">3. Enter Service Address in Jamshedpur</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#111827] mb-1 font-display">Locality / Area</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] focus:outline-none focus:border-[#F97316]"
                    >
                      <option value="Chhota Govindpur">Chhota Govindpur</option>
                      <option value="Govindpur Housing Colony">Govindpur Housing Colony</option>
                      <option value="Telco Colony">Telco Colony</option>
                      <option value="Baridih">Baridih</option>
                      <option value="Sidhgora">Sidhgora</option>
                      <option value="Golmuri">Golmuri</option>
                      <option value="Sakchi">Sakchi</option>
                      <option value="Mango">Mango</option>
                      <option value="Adityapur">Adityapur</option>
                      <option value="Other Jamshedpur Location">Other Jamshedpur Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#111827] mb-1 font-display">Street Address &amp; House/Plot No.</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Qr No. B/14, Near Main Market, Chhota Govindpur"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#111827] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Contact Details & Review */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#111827] font-display">4. Customer Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#111827] mb-1 font-display">Your Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#111827] mb-1 font-display">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] focus:outline-none focus:border-[#F97316]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1 font-display">Specific Issue / Special Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Main MCB tripping repeatedly or Fan humming noise"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#111827] focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Success Confirmation */}
            {step === 5 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#111827] font-display">Doorstep Service Booked!</h4>
                  <p className="text-xs text-[#64748B] mt-1">Booking Ref: <strong className="text-[#111827] font-mono">{bookingRef}</strong></p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] text-left text-xs space-y-1.5 text-slate-700 max-w-md mx-auto">
                  <p><strong className="text-[#111827]">Service:</strong> {service?.name}</p>
                  <p><strong className="text-[#111827]">Scheduled:</strong> {selectedDate} ({selectedTimeSlot})</p>
                  <p><strong className="text-[#111827]">Address:</strong> {address}, {locality}</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs shadow-xs font-display transition-all"
                >
                  View My Bookings Dashboard
                </button>
              </div>
            )}

            {/* Stepper Footer Controls */}
            {step < 5 && (
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#111827] hover:bg-slate-100 transition-colors flex items-center space-x-1 font-display"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs shadow-xs transition-all flex items-center space-x-2 font-display"
                >
                  <span>{step === 4 ? (loading ? 'Submitting...' : 'Confirm & Book Visit') : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
