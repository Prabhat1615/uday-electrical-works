import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, MessageCircle, Phone, MapPin } from 'lucide-react';
import { AnimatedSection } from '../../components/AnimatedSection';
import { Seo } from '../../components/Seo';

const serviceAreas = [
  'Chhota Govindpur', 'Govindpur Housing Colony', 'Telco', 'Baridih', 'Sidhgora',
  'Agrico', 'Golmuri', 'Birsanagar', 'Parsudih', 'Jugsalai', 'Sakchi', 'Mango', 'Adityapur'
];

export const ReviewsPage = () => {
  const whatsappReview = `https://wa.me/917903789402?text=${encodeURIComponent(
    'Hi Uday Electrical Works! I recently used your shop/service and would like to share my feedback.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Seo
        title="Customer Reviews | Uday Electrical Works, Jamshedpur"
        description="Read reviews of Uday Electrical Works, electrical shop & doorstep service in Chhota Govindpur, Jamshedpur. Share your experience on Google."
      />

      {/* Header */}
      <AnimatedSection direction="up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Customer Feedback</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-display">Reviews & Testimonials</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Bought from our shop or used our doorstep service? Your feedback helps other families in
            Jamshedpur find a reliable electrician.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Uday+Electrical+Shop+Chhota+Govindpur+Jamshedpur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 hover:shadow-glow-blue"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Review Us on Google</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={whatsappReview}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-glow-emerald"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share on WhatsApp</span>
          </a>
        </div>
      </AnimatedSection>

      {/* Honest note about reviews */}
      <AnimatedSection direction="up" delay={0.05}>
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#F97316]/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative space-y-2 max-w-2xl">
            <h2 className="text-xl font-black text-white font-display">We're Listening</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our reviews live on our Google Maps listing, where you can see real feedback from real
              customers. We read every review and use it to improve our service. If you've used our
              shop or services, please leave us a review, or send us feedback directly on WhatsApp.
            </p>
          </div>
          <div className="relative flex items-center space-x-6 text-xs text-slate-400 font-semibold border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 shrink-0">
            <div>
              <strong className="text-white text-base block font-extrabold">7</strong>
              <span>Wiremen on Team</span>
            </div>
            <div>
              <strong className="text-white text-base block font-extrabold">13</strong>
              <span>Areas Served</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* How to review steps */}
      <AnimatedSection direction="up" delay={0.1}>
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">How to Share Your Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Visit our Google Listing', desc: 'Open the shop on Google Maps, search "Uday Electrical Shop, Chhota Govindpur".' },
              { step: '2', title: 'Write Your Review', desc: 'Rate us out of 5 stars and tell others about the product or service you used.' },
              { step: '3', title: 'Or WhatsApp Us Directly', desc: 'Prefer a quick message? Send us your feedback on 7903789402 and we\'ll pass it to the team.' }
            ].map(({ step, title, desc }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="card-premium p-6 space-y-3 text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-[#F97316] to-amber-500 text-white font-black flex items-center justify-center shadow-md shadow-[#F97316]/30">
                  {step}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact strip */}
      <AnimatedSection direction="up" delay={0.15}>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Prefer to talk?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Call the shop at 7903789402 / 9934187847, Mon-Sat, 8:30 AM - 9:00 PM.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="tel:7903789402" className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#F97316] hover:bg-[#E55A00] text-white font-black text-xs transition-all shadow-md">
              <Phone className="w-4 h-4" />
              <span>Call the Shop</span>
            </a>
            <a
              href="https://www.google.com/maps/place/Uday+Electrical+Shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md"
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps Listing</span>
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* Areas served */}
      <AnimatedSection direction="up" className="text-center space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">Serving Families Across</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {serviceAreas.map((area) => (
            <span key={area} className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {area}
            </span>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
};
