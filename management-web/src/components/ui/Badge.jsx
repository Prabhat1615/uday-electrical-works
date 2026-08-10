import React from 'react';

const badgeVariants = {
  default: 'bg-surface-100 text-text-secondary border-surface-200',
  success: 'bg-success-50 text-success-700 border-success-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  danger: 'bg-danger-50 text-danger-700 border-danger-200',
  info: 'bg-info-50 text-info-700 border-info-200',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
};

const statusMap = {
  // General statuses
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  completed: 'success',
  cancelled: 'danger',
  active: 'success',
  inactive: 'default',
  
  // Order/Invoice statuses
  paid: 'success',
  unpaid: 'warning',
  partially_paid: 'info',
  
  // Inventory statuses
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'danger',
  
  // Booking statuses
  confirmed: 'success',
  in_progress: 'info',
};

export const Badge = ({
  children,
  variant = 'default',
  status,
  className = '',
  ...props
}) => {
  const finalVariant = status ? statusMap[status] || 'default' : variant;
  
  return (
    <span
      className={`badge border ${badgeVariants[finalVariant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
