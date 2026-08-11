import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case 'Pending':
      case 'Unpaid':
      case 'Low Stock':
      case 'In Review':
        return {
          bg: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
          dot: 'bg-[#D97706]'
        };
      case 'Confirmed':
      case 'In Progress':
      case 'En Route':
      case 'Partially Paid':
      case 'Processing':
      case 'Assigned':
      case 'Accepted':
      case 'On The Way':
        return {
          bg: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]',
          dot: 'bg-[#0284C7]'
        };
      case 'Completed':
      case 'Paid':
      case 'In Stock':
      case 'Approved':
      case 'Active':
        return {
          bg: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
          dot: 'bg-[#16A34A]'
        };
      case 'Cancelled':
      case 'Rejected':
      case 'Out of Stock':
      case 'Inactive':
      case 'Failed':
        return {
          bg: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          dot: 'bg-[#DC2626]'
        };
      default:
        return {
          bg: 'bg-[#F8FAFC] text-[#64748B] border-[#E5E7EB]',
          dot: 'bg-[#94A3B8]'
        };
    }
  };

  const style = getBadgeStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status || 'Unknown'}
    </span>
  );
};
