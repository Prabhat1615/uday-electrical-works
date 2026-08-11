import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../shared/src/hooks/useAuth';
import { getSocketTargetUrl } from '../api/axios';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return undefined;

    const stored = JSON.parse(localStorage.getItem('uew_user') || 'null');
    const socket = io(getSocketTargetUrl(), {
      auth: { token: stored?.token || user?.token || null },
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', `user:${user._id}`);
    });

    socket.on('new_notification', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    socket.on('technician_requests_updated', () => {
      queryClient.invalidateQueries({ queryKey: ['technicianRequests'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, queryClient]);

  return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>;
}
