import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = null, 
  subtitle = null, 
  color = 'orange', 
  className = '' 
}) => {
  const iconBgs = {
    orange: 'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
    amber: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    blue: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]',
    emerald: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
    rose: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <motion.div 
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] p-4 shadow-xs hover:border-[#CBD5E1] transition-all ${className}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] truncate font-display">
            {title}
          </p>
          <div className="flex items-baseline">
            <h3 className="text-xl lg:text-2xl font-black tracking-tight text-[#111827] font-mono">
              {value !== undefined && value !== null ? value : '0'}
            </h3>
          </div>

          {trend && (
            <p className={`text-[11px] font-bold flex items-center gap-1 ${
              trend.isPositive !== false ? 'text-[#16A34A]' : 'text-[#DC2626]'
            }`}>
              <span>{trend.isPositive !== false ? '↑' : '↓'} {typeof trend === 'string' ? trend : trend.text}</span>
            </p>
          )}

          {subtitle && !trend && (
            <p className="text-[11px] font-medium text-[#64748B] truncate">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconBgs[color] || iconBgs.orange} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
