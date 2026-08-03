import React from 'react';
import { Zap, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500 text-slate-950">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-lg font-black text-white tracking-wide">
                UDAY <span className="text-amber-400">ELECTRICAL</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading provider of industrial motor rewinding, distribution transformer sales, HT/LT control panel manufacturing & turnkey electrical contracting since 2005.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Products</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/products" className="hover:text-amber-400 transition-colors">3-Phase Motors</a></li>
              <li><a href="/products" className="hover:text-amber-400 transition-colors">Distribution Transformers</a></li>
              <li><a href="/products" className="hover:text-amber-400 transition-colors">Control Panels</a></li>
              <li><a href="/products" className="hover:text-amber-400 transition-colors">XLPE Cables</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/services" className="hover:text-amber-400 transition-colors">Motor Rewinding</a></li>
              <li><a href="/services" className="hover:text-amber-400 transition-colors">Oil BDV Testing & Filtration</a></li>
              <li><a href="/services" className="hover:text-amber-400 transition-colors">Panel Fabrication</a></li>
              <li><a href="/services" className="hover:text-amber-400 transition-colors">Safety & Earth Audits</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Contact Us</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Industrial Area, Balanagar, Hyderabad</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>sales@udayelectrical.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Uday Electrical Works ERP System. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001:2015 Certified Electrical Contractor</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
