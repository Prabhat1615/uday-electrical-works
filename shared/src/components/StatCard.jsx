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
    gold: 'bg-[#FAF6EC] text-[#C99532] border-[#E7C878]',
    orange: 'bg-[#FAF6EC] text-[#C99532] border-[#E7C878]',
    amber: 'bg-[#FFFBEB] text-[#D6A84F] border-[#FDE68A]',
    blue: 'bg-[#F0F9FF] text-[#5D8FD9] border-[#BAE6FD]',
    emerald: 'bg-[#F0FDF4] text-[#3FAE72] border-[#BBF7D0]',
    rose: 'bg-[#FEF2F2] text-[#D95C5C] border-[#FECACA]',
    purple: 'bg-[#2B3038] text-[#E7C878] border-slate-700'
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
