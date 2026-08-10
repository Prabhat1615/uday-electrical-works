import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'orange' }) => {
  const colorMap = {
    orange: 'from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/30',
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30'
  };

  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-br border ${colorMap[color] || colorMap.orange} backdrop-blur-xl shadow-lg bg-slate-900/60 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-black text-white mt-1">{value}</h3>
          {trend && (
            <p className="text-xs font-medium text-slate-400 mt-2">
              <span className="text-emerald-400 font-bold">{trend}</span> vs last month
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
