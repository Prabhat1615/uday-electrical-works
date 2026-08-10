import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'brand', className = '' }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600 border-brand-200',
    accent: 'bg-accent-50 text-accent-600 border-accent-200',
    success: 'bg-success-50 text-success-600 border-success-200',
    warning: 'bg-warning-50 text-warning-600 border-warning-200',
    danger: 'bg-danger-50 text-danger-600 border-danger-200',
    info: 'bg-info-50 text-info-600 border-info-200',
  };

  return (
    <div className={`card p-5 ${colorMap[color] || colorMap.brand} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
          {trend && (
            <p className="text-xs font-medium text-text-secondary mt-2">
              {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-white/50 border border-white/30">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
