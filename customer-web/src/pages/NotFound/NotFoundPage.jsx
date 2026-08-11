import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Home, ArrowLeft } from 'lucide-react';
import { Seo } from '../../components/Seo';

export const NotFoundPage = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-950">
      <Seo title="Page Not Found | Uday Electrical Works" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md space-y-7 glass-card p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="p-4 w-fit mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 shadow-glow-orange">
          <Zap className="w-10 h-10 fill-current" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 dark:text-white font-display">404</h1>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">Page Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl btn-cta text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white font-black text-xs flex items-center justify-center space-x-2 hover:border-[#F97316] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse the Shop</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
