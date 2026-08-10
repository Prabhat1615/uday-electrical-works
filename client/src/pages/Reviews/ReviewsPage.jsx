import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { AnimatedSection } from '../../components/AnimatedSection';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Ramesh Singh',
      location: 'Govindpur Housing Colony, Jamshedpur',
      rating: 5,
      date: 'Yesterday',
      service: 'Geyser Heating Element Replacement',
      comment: 'Prabhat arrived within 25 minutes in Govindpur and fixed our storage geyser heating element cleanly. Original spare used with reasonable charges!'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      location: 'Telco Colony, Jamshedpur',
      rating: 5,
      date: '3 Days Ago',
      service: 'Full House Wiring & DB Box MCB Fix',
      comment: 'Chandan & Devnath completed our entire flat wiring using Polycab wires. Excellent work, very polite wiremen and 6-month warranty card issued.'
    },
    {
      id: 3,
      name: 'Amitabh Sen',
      location: 'Baridih, Jamshedpur',
      rating: 5,
      date: '1 Week Ago',
      service: 'Ceiling Fan Balancing & Regulator Fitting',
      comment: 'Bought Havells Stealth Air ceiling fan from their Chhota Govindpur shop and got instant fitting. Very professional service!'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Chhota Govindpur');
  const [rating, setRating] = useState(5);
  const [service, setService] = useState('Geyser Repair');
  const [comment, setComment] = useState('');

  const handleAddReview = (e) => {
    e.preventDefault();
    const newRev = {
      id: Date.now(),
      name,
      location,
      rating: Number(rating),
      date: 'Just Now',
      service,
      comment
    };
    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    setName('');
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <AnimatedSection direction="up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Verified Customer Testimonials</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-display">Customer Reviews & Ratings</h1>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Uday+Electrical+Shop+Chhota+Govindpur+Jamshedpur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 hover:shadow-glow-blue"
          >
            <span>Write Google Review</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-cta px-5 py-2.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Store Review</span>
          </button>
        </div>
      </AnimatedSection>

      {/* Average Score Banner */}
      <AnimatedSection direction="up" delay={0.05}>
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FF6B00]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative flex items-center space-x-4">
            <span className="text-5xl font-black text-white font-display">4.9</span>
            <div>
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-bold block mt-1">Based on 1,000+ Verified Local Ratings in Jamshedpur</span>
            </div>
          </div>

          <div className="relative flex items-center space-x-6 text-xs text-slate-400 font-semibold border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
            <div>
              <strong className="text-white text-base block font-extrabold">99.2%</strong>
              <span>On-Time Arrival</span>
            </div>
            <div>
              <strong className="text-white text-base block font-extrabold">100%</strong>
              <span>Licensed Wiremen</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (idx % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="card-premium p-6 space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{r.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"{r.comment}"</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{r.name}</h4>
                <p className="text-[10px] text-slate-500">{r.location}</p>
              </div>
              <span className="text-[10px] font-bold uppercase text-orange-500 px-2 py-0.5 rounded bg-orange-500/10">
                {r.service}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Review Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Write Customer Review">
        <form onSubmit={handleAddReview} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Locality / Area *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chhota Govindpur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Rating (1-5 Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Service Provided</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Review Experience *</label>
            <textarea
              rows={3}
              required
              placeholder="Tell us about the electrician work..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black shadow-md"
            >
              Post Review
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
