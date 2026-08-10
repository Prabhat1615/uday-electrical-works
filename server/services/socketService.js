import { Server } from 'socket.io';
import { getAllowedOrigins } from '../config/cors.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('send_chat_message', (data) => {
      io.emit('receive_chat_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    // Return dummy emitter fallback if socket server isn't bound yet
    return {
      emit: () => {},
      to: () => ({ emit: () => {} })
    };
  }
  return io;
};
