import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageCircle, ExternalLink, Zap } from 'lucide-react';
import { AnimatedSection } from '../../components/AnimatedSection';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Chhota Govindpur');
  const [serviceNeeded, setServiceNeeded] = useState('Fan Repair');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const jamshedpurAreas = [
    'Chhota Govindpur',
    'Govindpur Housing Colony',
    'Telco',
    'Baridih',
    'Sidhgora',
    'Agrico',
    'Golmuri',
    'Birsanagar',
    'Parsudih',
    'Jugsalai',
    'Sakchi',
    'Mango',
    'Adityapur'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <AnimatedSection direction="up" className="text-center space-y-2 max-w-3xl mx-auto">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-extrabold uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5" />
          <span>Store Contact & Doorstep Visits</span>
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-display">Contact Uday Electrical Works</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Chhota Govindpur, Jamshedpur, Jharkhand • Doorstep electrician service across all 13 Jamshedpur localities.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <AnimatedSection direction="right" className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-card space-y-6 hover:shadow-card-hover transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Request an Electrician Visit in Jamshedpur</h3>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Visit Request Received!</h4>
              <p>Our wireman (Prabhat / Chandan) will call you at {phone} within 15 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ramesh Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="7903789402"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Jamshedpur Locality *</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                  >
                    {jamshedpurAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Service Needed *</label>
                  <select
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="Fan Repair">Ceiling Fan & Exhaust Fan Repair</option>
                    <option value="Geyser Repair">Geyser Repair & Element</option>
                    <option value="House Wiring Repair">House Wiring & MCB Trip Tracing</option>
                    <option value="Mixer Grinder Repair">Mixer Grinder & Iron Repair</option>
                    <option value="Water Pump Repair">Water Pump Motor Repair</option>
                    <option value="Emergency Electrical Service">24/7 Emergency Power Outage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase mb-1">Address / Problem Details</label>
                <textarea
                  rows={3}
                  placeholder="Mention your landmark or problem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="btn-cta w-full py-3.5 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Request Electrician Visit</span>
              </button>
            </form>
          )}
        </AnimatedSection>

        {/* Store Info & Maps */}
        <AnimatedSection direction="left" delay={0.1} className="lg:col-span-5 space-y-6">
          <div className="card-premium p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              Store Contact Lines
            </h3>

            <div className="space-y-3 text-xs">
              <a href="tel:7903789402" className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Primary Contact Line</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">7903789402</span>
                </div>
              </a>

              <a href="tel:9934187847" className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Secondary Helpline</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">9934187847</span>
                </div>
              </a>

              <a href="https://wa.me/917903789402" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-current" />
                <div>
                  <span className="text-[10px] uppercase block text-slate-500">WhatsApp Chat</span>
                  <span>Click to chat on 7903789402</span>
                </div>
              </a>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Chhota Govindpur Shop</span>
                  <span className="text-slate-900 dark:text-white">Chhota Govindpur, Jamshedpur, Jharkhand - 831015</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Uday+Electrical+Shop+Chhota+Govindpur+Jamshedpur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02] hover:shadow-glow-blue"
              >
                <span>Open Google Maps Location</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </AnimatedSection>

      </div>

    </div>
  );
};
