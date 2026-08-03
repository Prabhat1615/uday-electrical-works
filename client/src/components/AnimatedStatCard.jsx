import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedStatCard = ({ title, value, icon: Icon, trend, color = 'orange' }) => {
  const colorStyles = {
    orange: 'from-orange-500/20 via-orange-600/5 to-transparent border-orange-500/30 text-orange-400',
    blue: 'from-blue-500/20 via-blue-600/5 to-transparent border-blue-500/30 text-blue-400',
    green: 'from-emerald-500/20 via-emerald-600/5 to-transparent border-emerald-500/30 text-emerald-400',
    purple: 'from-purple-500/20 via-purple-600/5 to-transparent border-purple-500/30 text-purple-400'
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-3xl bg-gradient-to-br ${colorStyles[color] || colorStyles.orange} backdrop-blur-2xl border bg-slate-900/60 shadow-xl relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400">{title}</p>
          <motion.h3
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl lg:text-3xl font-black text-white mt-1"
          >
            {value}
          </motion.h3>
          {trend && (
            <p className="text-xs font-semibold text-slate-400 mt-2 flex items-center space-x-1">
              <span className="text-emerald-400 font-extrabold">{trend}</span>
              <span>vs previous period</span>
            </p>
          )}
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
