import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Zap,
  AlertTriangle,
  CalendarCheck,
  Receipt,
  UserCheck,
  Inbox,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useErpQueries';
import { useSocket } from '../context/SocketContext';
import { formatDate } from '../utils/formatters';

const NOTIFICATION_ROUTES = {
  Booking: '/dashboard/bookings',
  Invoice: '/dashboard/invoices',
  Lead: '/dashboard/sales',
  Service: null,
  StockAlert: null,
  General: null
};

const bellWatchers = new Set();

const openBell = (id) => {
  bellWatchers.forEach((watcher) => watcher(id));
};

const PANEL_WIDTH = 384;
const PANEL_MARGIN = 8;

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [ring, setRing] = useState(false);
  const [pos, setPos] = useState(null);
  const [instanceId] = useState(() => Math.random().toString(36).slice(2));
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const ringTimerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const socketCtx = useSocket();

  const { data: res, isLoading, isError, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = res?.data?.notifications || [];
  const unreadCount = res?.data?.unreadCount || 0;

  useEffect(() => {
    const watcher = (id) => {
      if (id !== instanceId) setOpen(false);
    };
    bellWatchers.add(watcher);
    return () => bellWatchers.delete(watcher);
  }, [instanceId]);

  useEffect(() => {
    const socket = socketCtx?.current;
    if (!socket) return undefined;

    const onNewNotification = () => {
      setRing(true);
      if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
      ringTimerRef.current = setTimeout(() => setRing(false), 1400);
    };

    socket.on('new_notification', onNewNotification);
    return () => {
      socket.off('new_notification', onNewNotification);
      if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
    };
  }, [socketCtx]);

  const toggle = () => {
    const next = !open;
    if (next) openBell(instanceId);
    setOpen(next);
  };

  useLayoutEffect(() => {
    if (!open) return undefined;

    const rootEl = rootRef.current;
    const rect = rootEl.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - PANEL_MARGIN * 2);
    let left = rect.right - width;
    left = Math.max(PANEL_MARGIN, Math.min(left, window.innerWidth - width - PANEL_MARGIN));
    const top = rect.bottom + PANEL_MARGIN;
    setPos({ left, top, width, maxHeight: Math.max(240, window.innerHeight - top - PANEL_MARGIN) });

    refetch();

    const onPointerDown = (e) => {
      if (rootEl.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onScroll = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleItemClick = (n) => {
    if (!n.isRead) {
      queryClient.setQueryData(['notifications'], (old) => {
        if (!old?.data) return old;
        const list = (old.data.notifications || []).map((x) =>
          x._id === n._id ? { ...x, isRead: true } : x
        );
        return {
          ...old,
          data: {
            ...old.data,
            notifications: list,
            unreadCount: Math.max(0, (old.data.unreadCount || 0) - 1)
          }
        };
      });
      markReadMutation.mutate(n._id);
    }
    const route = NOTIFICATION_ROUTES[n.type];
    if (route) navigate(route);
    setOpen(false);
  };

  const handleMarkAll = () => {
    queryClient.setQueryData(['notifications'], (old) => {
      if (!old?.data) return old;
      const list = (old.data.notifications || []).map((x) => ({ ...x, isRead: true }));
      return { ...old, data: { ...old.data, notifications: list, unreadCount: 0 } };
    });
    markAllReadMutation.mutate();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'StockAlert': return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'Booking': return <CalendarCheck className="w-4 h-4 text-amber-500" />;
      case 'Invoice': return <Receipt className="w-4 h-4 text-sky-500" />;
      case 'Lead': return <UserCheck className="w-4 h-4 text-emerald-500" />;
      default: return <Zap className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative p-2.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 ${
          open
            ? 'bg-slate-100 border-slate-300 text-slate-900'
            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
        }`}
      >
        <motion.div
          animate={ring ? { rotate: [0, -14, 14, -10, 10, 0], scale: [1, 1.18, 1] } : { rotate: 0, scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeInOut' }}
        >
          <Bell className="w-4 h-4" />
        </motion.div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && pos && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: pos.left,
              top: pos.top,
              width: pos.width,
              maxHeight: pos.maxHeight,
              zIndex: 60
            }}
            className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden text-xs"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Notifications
                {unreadCount > 0 && <span className="text-amber-600"> · {unreadCount}</span>}
              </h4>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-500 hover:underline flex items-center space-x-1 rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2 py-0.5">
                        <div className="h-2.5 w-3/4 rounded bg-slate-100 animate-pulse" />
                        <div className="h-2 w-1/2 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="p-6 flex flex-col items-center text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-rose-500/80" />
                  <p className="text-slate-500 font-medium">Unable to load notifications.</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 flex flex-col items-center text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-300" />
                  <p className="text-slate-500 font-medium">You're all caught up</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    type="button"
                    onClick={() => handleItemClick(n)}
                    className={`w-full text-left p-3.5 flex items-start space-x-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:z-10 focus-visible:relative ${
                      n.isRead
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-slate-900 line-clamp-1 ${n.isRead ? 'font-semibold' : 'font-extrabold'}`}>
                        {n.title}
                      </p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{formatDate(n.createdAt)}</span>
                    </div>
                    {!n.isRead && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
