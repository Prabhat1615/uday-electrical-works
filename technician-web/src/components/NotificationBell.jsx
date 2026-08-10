import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Zap, AlertTriangle, CalendarCheck, Receipt, UserCheck } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useErpQueries';
import { formatDate } from '../utils/formatters';

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { data: res } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = res?.data?.notifications || [];
  const unreadCount = res?.data?.unreadCount || 0;

  const getIcon = (type) => {
    switch (type) {
      case 'StockAlert': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'Booking': return <CalendarCheck className="w-4 h-4 text-amber-400" />;
      case 'Invoice': return <Receipt className="w-4 h-4 text-sky-400" />;
      case 'Lead': return <UserCheck className="w-4 h-4 text-emerald-400" />;
      default: return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
            <h4 className="font-extrabold text-white text-sm">Notifications ({unreadCount})</h4>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-[11px] font-bold text-amber-400 hover:underline flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
            {notifications.length === 0 ? (
              <p className="text-slate-500 text-center py-6">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 flex items-start space-x-3 transition-colors ${
                    n.isRead ? 'bg-slate-900/40 opacity-70' : 'bg-amber-500/5 font-semibold'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white line-clamp-1">{n.title}</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 block mt-1">{formatDate(n.createdAt)}</span>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(n._id)}
                      className="p-1 text-slate-500 hover:text-amber-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
