import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Zap } from 'lucide-react';

export const MobileConversionBar = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-2.5 flex items-center justify-around gap-2 shadow-2xl transition-colors">
      
      {/* Call Now */}
      <a
        href="tel:7903789402"
        className="flex-1 py-2.5 px-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm"
      >
        <Phone className="w-3.5 h-3.5 text-orange-400" />
        <span>Call Store</span>
      </a>

      {/* WhatsApp Line 1 */}
      <a
        href="https://wa.me/917903789402?text=Hi%20Uday%20Electricals,%20I%20need%20an%20electrician%20visit%20in%20Jamshedpur"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center space-x-1 shadow-sm"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current" />
        <span>WhatsApp</span>
      </a>

      {/* Book Visit */}
      <Link
        to="/services"
        className="flex-1 py-2.5 px-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1 shadow-md shadow-orange-500/20"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Book Visit</span>
      </Link>

    </div>
  );
};
