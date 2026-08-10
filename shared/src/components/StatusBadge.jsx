import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'Pending':
      case 'Unpaid':
      case 'Low Stock':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'Confirmed':
      case 'In Progress':
      case 'Partially Paid':
        return 'bg-info-50 text-info-700 border-info-200';
      case 'Completed':
      case 'Paid':
      case 'In Stock':
      case 'Active':
        return 'bg-success-50 text-success-700 border-success-200';
      case 'Cancelled':
      case 'Out of Stock':
      case 'Inactive':
        return 'bg-danger-50 text-danger-700 border-danger-200';
      default:
        return 'bg-surface-100 text-text-secondary border-surface-200';
    }
  };

  return (
    <span
      className={`badge border ${getBadgeStyle(status)} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {status}
    </span>
  );
};
