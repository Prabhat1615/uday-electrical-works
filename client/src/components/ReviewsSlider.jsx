import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Chhota Govindpur',
    service: 'Geyser Repair',
    text: 'Prabhat bhai arrived within 30 minutes and fixed our geyser element on the spot. Original Havells element fitted with proper billing and 6-month warranty. Superb service!'
  },
  {
    name: 'Sunita Devi',
    location: 'Telco',
    service: 'Wiring & DB Upgrade',
    text: 'Complete house rewiring done in 2 days. Clean work, labelled DB box, and the team wore proper safety gear. Best electrician shop in Jamshedpur.'
  },
  {
    name: 'Mohammad Irfan',
    location: 'Baridih',
    service: 'Fan Installation',
    text: 'Bought 2 Havells fans from the store and they installed them free at home. Very honest pricing and genuine products with GST receipt.'
  },
  {
    name: 'Anita Sharma',
    location: 'Golmuri',
    service: 'Emergency Short Circuit',
    text: 'Called at night for a short circuit emergency. A wireman came within 40 minutes and solved the issue. Truly 24/7 doorstep service.'
  },
  {
    name: 'Vikash Singh',
    location: 'Adityapur',
    service: 'AC / Appliance Repair',
    text: 'Fixed my washing machine with original parts. The shop keeps authentic spares for every brand. Highly recommended for appliance repairs.'
  }
];

export const ReviewsSlider = ({ interval = 5000, className = '' }) => {
  const [[index, direction], setIndex] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir) => {
      setIndex(([i]) => [(i + dir + testimonials.length) % testimonials.length, dir]);
    },
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [paused, interval, go]);

  const t = testimonials[index];

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.96 })
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 space-y-4"
        >
          <Quote className="w-8 h-8 text-[#FF8A3D] fill-current" />
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic">"{t.text}"</p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div>
              <p className="font-extrabold text-white text-sm">{t.name}</p>
              <p className="text-[11px] text-slate-400">{t.location} • {t.service}</p>
            </div>
            <div className="flex text-amber-400 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-[#FF6B00]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => go(-1)}
            className="p-2 rounded-xl bg-white/10 hover:bg-[#FF6B00] text-slate-200 hover:text-white transition-all"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => go(1)}
            className="p-2 rounded-xl bg-white/10 hover:bg-[#FF6B00] text-slate-200 hover:text-white transition-all"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
