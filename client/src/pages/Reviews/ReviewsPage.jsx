import React, { useState } from 'react';
import { Star, Plus, ThumbsUp, CheckCircle2, MessageSquare } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'P. Venkat Rao',
      location: 'Kukatpally, Hyderabad',
      rating: 5,
      date: 'Yesterday',
      service: 'Geyser Heating Element Replacement',
      comment: 'Excellent service! The electrician arrived within 25 minutes in Kukatpally and replaced the geyser thermostat cleanly. Reasonable pricing with genuine parts.'
    },
    {
      id: 2,
      name: 'Sunitha Reddy',
      location: 'Balanagar, Hyderabad',
      rating: 5,
      date: '3 Days Ago',
      service: 'Full 3BHK Apartment Wiring & Earthing',
      comment: 'Uday Electrical team completed our entire 3BHK flat rewiring using Polycab wires. Very professional wiremen, clean work and 6-month warranty certificate given.'
    },
    {
      id: 3,
      name: 'K. Mahesh',
      location: 'Miyapur, Hyderabad',
      rating: 5,
      date: '1 Week Ago',
      service: 'Ceiling Fan Installation & MCB Trip Repair',
      comment: 'Installed 4 Crompton SilentPro ceiling fans and fixed the main DB box MCB tripping problem. Very polite technicians and quick service.'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Verified Customer Testimonials</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Customer Reviews & Ratings</h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Average Score Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <span className="text-5xl font-black text-slate-900 dark:text-white">4.9</span>
          <div>
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-bold block mt-1">Based on 1,480+ Verified Ratings in Hyderabad</span>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-600 dark:text-slate-400 font-semibold border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <strong className="text-slate-900 dark:text-white text-base block font-extrabold">99.4%</strong>
            <span>On-Time Arrival</span>
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white text-base block font-extrabold">100%</strong>
            <span>Licensed Wiremen</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
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
          </div>
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
                placeholder="e.g. Kukatpally"
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
