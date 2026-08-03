import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'amber' }) => {
  const colorMap = {
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20',
    blue: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20'
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br border ${colorMap[color] || colorMap.amber} backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">{value}</h3>
          {trend && (
            <p className="text-xs font-medium text-slate-400 mt-2">
              <span className="text-emerald-400 font-bold">{trend}</span> vs last month
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl bg-slate-900/80 border border-white/5`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
