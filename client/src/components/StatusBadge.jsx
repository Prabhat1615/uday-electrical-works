import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'Pending':
      case 'Unpaid':
      case 'Low Stock':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Confirmed':
      case 'In Progress':
      case 'Partially Paid':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Completed':
      case 'Paid':
      case 'In Stock':
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
      case 'Out of Stock':
      case 'Inactive':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
