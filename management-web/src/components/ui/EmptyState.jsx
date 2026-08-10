import React from 'react';
import { Package, Users, FileText, Calendar, Plus } from 'lucide-react';

const iconMap = {
  products: Package,
  users: Users,
  orders: FileText,
  bookings: Calendar,
  default: Package,
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel = 'Add New',
  onAction,
  className = '',
}) => {
  const Icon = icon || iconMap.default;
  
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-md mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const EmptyProducts = ({ onAdd }) => (
  <EmptyState
    icon={Package}
    title="No products yet"
    description="Add your first product to start building your electrical product catalog."
    actionLabel="Add Product"
    onAction={onAdd}
  />
);

export const EmptyOrders = ({ onAdd }) => (
  <EmptyState
    icon={FileText}
    title="No orders yet"
    description="Orders will appear here when customers make purchases."
    actionLabel="Create Order"
    onAction={onAdd}
  />
);

export const EmptyUsers = ({ onAdd }) => (
  <EmptyState
    icon={Users}
    title="No users yet"
    description="Add team members to start collaborating on your business."
    actionLabel="Add User"
    onAction={onAdd}
  />
);
