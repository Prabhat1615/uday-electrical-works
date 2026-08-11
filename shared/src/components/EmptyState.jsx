import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, FileText, Users, Calendar, Wrench, BarChart3, Bell, ShieldAlert } from 'lucide-react';

export const EmptyState = ({
  icon: CustomIcon,
  type = 'default',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const defaults = {
    orders: {
      icon: PackageOpen,
      title: 'No Orders Yet',
      description: 'Your store orders will appear here once customers start purchasing products.'
    },
    invoices: {
      icon: FileText,
      title: 'No Invoices Generated',
      description: 'Invoices will be recorded here automatically following customer transactions.'
    },
    customers: {
      icon: Users,
      title: 'No Registered Customers',
      description: 'Customer profiles and account registrations will be listed here.'
    },
    bookings: {
      icon: Calendar,
      title: 'No Service Bookings',
      description: 'Customer requests for electrical repairs and installation work will appear here.'
    },
    technicians: {
      icon: Wrench,
      title: 'No Technician Applications',
      description: 'New technician job applications will arrive here for administrator review.'
    },
    inventory: {
      icon: PackageOpen,
      title: 'No Products In Catalog',
      description: 'Add your electrical products, switches, lighting, and fans to build your inventory.'
    },
    reports: {
      icon: BarChart3,
      title: 'No Sales Data Available',
      description: 'Analytics and financial reporting charts will render as sales transactions are recorded.'
    },
    notifications: {
      icon: Bell,
      title: 'All Caught Up',
      description: 'You have no unread notifications or system alerts at this moment.'
    },
    default: {
      icon: ShieldAlert,
      title: 'No Items Found',
      description: 'There are currently no entries to display for this section.'
    }
  };

  const current = defaults[type] || defaults.default;
  const Icon = CustomIcon || current.icon;
  const displayTitle = title || current.title;
  const displayDescription = description || current.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl bg-white border border-slate-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">
        {displayTitle}
      </h3>
      <p className="text-[13px] text-slate-500 max-w-sm leading-relaxed mb-5">
        {displayDescription}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
